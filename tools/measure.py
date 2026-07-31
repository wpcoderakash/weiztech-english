"""Dependency-free CDP client: measure a page's DOM and diff live vs local.

Usage:  python3 measure.py <live-url> <local-url> [viewport-width]

Drives headless Chrome over the DevTools Protocol, collects
getBoundingClientRect + computed font-size/line-height/weight/color for every
visible element carrying text, keys them by tag+normalised-text, and prints the
per-element deltas.
"""

import base64
import hashlib
import json
import os
import socket
import struct
import subprocess
import sys
import time
import urllib.request

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PORT = 9222

# Bricksforge hides scroll-revealed content until its trigger fires. Un-hide
# exactly the FOUC guard — broadening this to [class*="brf-"] also un-hides
# popup templates and corrupts the measurement.
FOUC_CSS = (
    ".brf-prevent-fouc{opacity:1!important;visibility:visible!important;transform:none!important}"
)

MEASURE_JS = r"""
(() => {
  const out = [];
  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
  let el = document.body;
  do {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    // Only elements whose own text (excluding descendants' elements) is real.
    let own = '';
    for (const n of el.childNodes) {
      if (n.nodeType === 3) own += n.nodeValue;
    }
    own = own.replace(/\s+/g, ' ').trim();
    if (!own) continue;
    const r = el.getBoundingClientRect();
    out.push({
      tag: el.tagName.toLowerCase(),
      text: own.slice(0, 80),
      x: Math.round(r.x), y: Math.round(r.y + window.scrollY),
      w: Math.round(r.width), h: Math.round(r.height),
      fs: cs.fontSize, lh: cs.lineHeight, fw: cs.fontWeight, color: cs.color,
    });
  } while ((el = walk.nextNode()));
  return out;
})()
"""


class WS:
    """Minimal RFC6455 client — enough for CDP's request/response traffic."""

    def __init__(self, url):
        _, rest = url.split("://", 1)
        hostport, path = rest.split("/", 1)
        host, port = hostport.split(":")
        self.sock = socket.create_connection((host, int(port)))
        key = base64.b64encode(os.urandom(16)).decode()
        self.sock.sendall(
            f"GET /{path} HTTP/1.1\r\nHost: {hostport}\r\nUpgrade: websocket\r\n"
            f"Connection: Upgrade\r\nSec-WebSocket-Key: {key}\r\n"
            f"Sec-WebSocket-Version: 13\r\n\r\n".encode()
        )
        buf = b""
        while b"\r\n\r\n" not in buf:
            buf += self.sock.recv(4096)
        self.buf = buf.split(b"\r\n\r\n", 1)[1]
        self.msg_id = 0

    def _recv(self, n):
        while len(self.buf) < n:
            self.buf += self.sock.recv(65536)
        out, self.buf = self.buf[:n], self.buf[n:]
        return out

    def send(self, method, params=None, session=None):
        self.msg_id += 1
        msg = {"id": self.msg_id, "method": method, "params": params or {}}
        if session:
            msg["sessionId"] = session
        data = json.dumps(msg).encode()
        header = b"\x81"
        mask = os.urandom(4)
        n = len(data)
        if n < 126:
            header += bytes([0x80 | n])
        elif n < 65536:
            header += bytes([0x80 | 126]) + struct.pack(">H", n)
        else:
            header += bytes([0x80 | 127]) + struct.pack(">Q", n)
        masked = bytes(b ^ mask[i % 4] for i, b in enumerate(data))
        self.sock.sendall(header + mask + masked)
        return self.msg_id

    def recv(self):
        b0, b1 = self._recv(2)
        n = b1 & 0x7F
        if n == 126:
            n = struct.unpack(">H", self._recv(2))[0]
        elif n == 127:
            n = struct.unpack(">Q", self._recv(8))[0]
        return json.loads(self._recv(n).decode())

    def call(self, method, params=None, session=None):
        want = self.send(method, params, session)
        while True:
            m = self.recv()
            if m.get("id") == want:
                if "error" in m:
                    raise RuntimeError(f"{method}: {m['error']}")
                return m.get("result", {})


def launch_chrome():
    proc = subprocess.Popen(
        [
            CHROME,
            f"--remote-debugging-port={PORT}",
            "--headless=new",
            "--no-first-run",
            "--no-default-browser-check",
            f"--user-data-dir=/tmp/cdp-profile-{os.getpid()}",
            "--hide-scrollbars",
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    for _ in range(80):
        try:
            urllib.request.urlopen(f"http://127.0.0.1:{PORT}/json/version", timeout=1)
            return proc
        except Exception:
            time.sleep(0.25)
    raise RuntimeError("Chrome did not come up")


def measure(ws, url, width):
    target = ws.call("Target.createTarget", {"url": "about:blank"})["targetId"]
    sid = ws.call("Target.attachToTarget", {"targetId": target, "flatten": True})["sessionId"]
    ws.call("Page.enable", session=sid)
    ws.call("Runtime.enable", session=sid)
    ws.call(
        "Emulation.setDeviceMetricsOverride",
        {"width": width, "height": 1000, "deviceScaleFactor": 1, "mobile": False},
        session=sid,
    )
    ws.call("Page.addScriptToEvaluateOnNewDocument", {"source": ""}, session=sid)
    ws.call("Page.navigate", {"url": url}, session=sid)

    # Wait for the network to settle rather than for a fixed delay.
    deadline = time.time() + 45
    while time.time() < deadline:
        m = ws.recv()
        if m.get("method") == "Page.loadEventFired" and m.get("sessionId") == sid:
            break
    # The rebuild's Reveal snaps anything still hidden to its end state four
    # seconds after mount, so anything shorter than that can catch a card
    # mid-tween and report a phantom offset. That produced a fake 14px delta
    # on every /products/ card until it was traced.
    time.sleep(7)

    ws.call(
        "Runtime.evaluate",
        {
            "expression": (
                "(() => { const s = document.createElement('style');"
                f"s.textContent = {json.dumps(FOUC_CSS)};"
                "document.head.appendChild(s); })()"
            )
        },
        session=sid,
    )
    # Scroll the page end to end so lazy content and scroll triggers resolve.
    ws.call(
        "Runtime.evaluate",
        {
            "expression": (
                "(async () => { const h = document.body.scrollHeight;"
                "for (let y = 0; y < h; y += 400) { window.scrollTo(0, y);"
                "await new Promise(r => setTimeout(r, 40)); }"
                # Stay at the BOTTOM. Scrolling back to 0 rewinds every
                # scrubbed timeline to its from-state (opacity 0, y+25), on
                # the live site and the rebuild alike - sampling there
                # reported split-text words 2-25px out that were pure
                # animation state. At the bottom every scrub is complete.
                "await new Promise(r => setTimeout(r, 2000)); })()"
            ),
            "awaitPromise": True,
        },
        session=sid,
    )

    res = ws.call(
        "Runtime.evaluate", {"expression": MEASURE_JS, "returnByValue": True}, session=sid
    )
    ws.call("Target.closeTarget", {"targetId": target})
    if "exceptionDetails" in res:
        raise RuntimeError(json.dumps(res["exceptionDetails"])[:500])
    return res["result"]["value"]


def key(e):
    return (e["tag"], hashlib.md5(e["text"].encode()).hexdigest()[:10])


def main():
    live, local = sys.argv[1], sys.argv[2]
    width = int(sys.argv[3]) if len(sys.argv) > 3 else 1440

    proc = launch_chrome()
    try:
        wsurl = json.load(urllib.request.urlopen(f"http://127.0.0.1:{PORT}/json/version"))[
            "webSocketDebuggerUrl"
        ]
        ws = WS(wsurl)
        a = measure(ws, live, width)
        b = measure(ws, local, width)
    finally:
        proc.terminate()

    ai = {}
    for e in a:
        ai.setdefault(key(e), []).append(e)
    bi = {}
    for e in b:
        bi.setdefault(key(e), []).append(e)

    print(f"live elements: {len(a)}   local elements: {len(b)}")
    only_live = [k for k in ai if k not in bi]
    only_local = [k for k in bi if k not in ai]

    diffs = []
    for k in ai:
        if k not in bi:
            continue
        for ea, eb in zip(ai[k], bi[k]):
            d = {}
            for f in ("x", "y", "w", "h"):
                if abs(ea[f] - eb[f]) > 1:
                    d[f] = (ea[f], eb[f])
            for f in ("fs", "lh", "fw", "color"):
                if ea[f] != eb[f]:
                    d[f] = (ea[f], eb[f])
            if d:
                diffs.append((ea["tag"], ea["text"][:50], d))

    print(f"\n=== {len(diffs)} elements differ ===")
    for tag, text, d in diffs[:60]:
        print(f"  <{tag}> {text!r}")
        for f, (x, y) in d.items():
            print(f"       {f}: live={x}  local={y}")

    if only_live:
        print(f"\n=== {len(only_live)} present on LIVE only ===")
        for k in only_live[:40]:
            print(f"  <{ai[k][0]['tag']}> {ai[k][0]['text'][:70]!r}")
    if only_local:
        print(f"\n=== {len(only_local)} present on LOCAL only ===")
        for k in only_local[:40]:
            print(f"  <{bi[k][0]['tag']}> {bi[k][0]['text'][:70]!r}")


if __name__ == "__main__":
    main()
