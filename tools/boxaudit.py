"""Box-style audit: computed border/radius/shadow/bg of styled boxes, paired by anchor text."""
import json, time, urllib.request, sys
import measure as M

JS = r"""((anchors) => {
  function styledBox(el) {
    var n = el;
    while (n && n !== document.body) {
      var cs = getComputedStyle(n);
      var hasBorder = ['Top','Right','Bottom','Left'].some(function(s){return parseFloat(cs['border'+s+'Width'])>0;});
      var hasBg = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || cs.backgroundImage !== 'none';
      var hasShadow = cs.boxShadow !== 'none';
      if (hasBorder || hasBg || hasShadow) return n;
      n = n.parentElement;
    }
    return null;
  }
  var out = {};
  anchors.forEach(function(text) {
    var leaf = null;
    var walk = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
    var el = document.body;
    do {
      if (el.closest('header,footer')) continue;
      var own = '';
      for (var i=0;i<el.childNodes.length;i++) if (el.childNodes[i].nodeType===3) own += el.childNodes[i].nodeValue;
      if (own.replace(/\s+/g,' ').trim() === text) { leaf = el; break; }
    } while ((el = walk.nextNode()));
    if (!leaf) { out[text] = null; return; }
    var box = styledBox(leaf);
    if (!box) { out[text] = {none:true}; return; }
    var cs = getComputedStyle(box);
    out[text] = {
      border: cs.borderTopWidth+' '+cs.borderTopStyle+' '+cs.borderTopColor,
      radius: cs.borderRadius,
      shadow: cs.boxShadow === 'none' ? 'none' : cs.boxShadow.slice(0,60),
      bg: cs.backgroundColor,
      bgImg: cs.backgroundImage === 'none' ? 'none' : cs.backgroundImage.split('(')[0],
      pad: cs.padding,
    };
  });
  // form controls by placeholder
  document.querySelectorAll('input[placeholder],textarea[placeholder],select').forEach(function(inp){
    if (inp.closest('header,footer')) return;
    var cs = getComputedStyle(inp);
    var key = 'field:' + (inp.getAttribute('placeholder') || 'select');
    out[key] = { border: cs.borderTopWidth+' '+cs.borderTopStyle+' '+cs.borderTopColor,
      radius: cs.borderRadius, bg: cs.backgroundColor, pad: cs.padding,
      fs: cs.fontSize, color: cs.color, shadow: cs.boxShadow==='none'?'none':cs.boxShadow.slice(0,50) };
  });
  return out;
})"""

PAGES = {
  "/": ["Hardware", "Tailored Solutions", "How can I determine the best IT solutions for my business?", "Get in Touch", "Explore", "Send Message"],
  "/products/": ["Laptops"],
  "/webapps/": ["UI/UX Design", "01", "Law Firm", "Starter", "Get Started", "Schedule a Consultation", "Monthly", "Annually"],
  "/cybersec/": ["Website Security Test", "View"],
  "/careers/": ["Backend Developer", "Apply Now", "Personal Development"],
  "/contact-us/": ["Sales Department"],
  "/blog/": ["Make Your Business Smarter with Technology"],
  "/quote/": [],
}

def audit(ws, url, anchors):
    t = ws.call("Target.createTarget", {"url": url})["targetId"]
    s = ws.call("Target.attachToTarget", {"targetId": t, "flatten": True})["sessionId"]
    ws.call("Runtime.enable", session=s)
    ws.call("Emulation.setDeviceMetricsOverride", {"width":1440,"height":900,"deviceScaleFactor":1,"mobile":False}, session=s)
    time.sleep(8)
    expr = JS + "(" + json.dumps(anchors) + ")"
    r = ws.call("Runtime.evaluate", {"expression": expr, "returnByValue": True}, session=s)["result"]["value"]
    ws.call("Target.closeTarget", {"targetId": t})
    return r

def run():
    p = M.launch_chrome()
    try:
        ws = M.WS(json.load(urllib.request.urlopen("http://127.0.0.1:9222/json/version"))["webSocketDebuggerUrl"])
        for route, anchors in PAGES.items():
            live = audit(ws, "https://weiztech.com" + route, anchors)
            loc = audit(ws, "http://localhost:3000" + route, anchors)
            diffs = []
            for k in sorted(set(live) | set(loc)):
                a, b = live.get(k), loc.get(k)
                if a is None or b is None:
                    diffs.append((k, "missing on " + ("local" if a else "live"))); continue
                for prop in set(list(a.keys())+list(b.keys())):
                    va, vb = a.get(prop), b.get(prop)
                    if va != vb:
                        diffs.append((k, f"{prop}: live={va} | loc={vb}"))
            print(f"== {route}  ({len(diffs)} prop diffs)")
            for k, d in diffs: print(f"   {k[:44]:44} {d[:110]}")
    finally:
        p.terminate()

if __name__ == "__main__":
    run()
