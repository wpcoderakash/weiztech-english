"use client";

import { useEffect, useRef } from "react";

/**
 * Cloudflare Turnstile — the visible bot-verification widget.
 *
 * Rendered inside a <form>, Turnstile injects its own hidden
 * `cf-turnstile-response` input, which the server actions already pass to
 * `verifyTurnstile`. With no NEXT_PUBLIC_TURNSTILE_SITE_KEY configured the
 * component renders nothing and the server skips the check, so every
 * environment keeps working without a Cloudflare account.
 *
 * The api.js script loads once (explicit mode) no matter how many forms are
 * on the page; each widget renders into its own container and is removed on
 * unmount, which keeps the careers modal safe to open repeatedly.
 */

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string | undefined;
      remove: (widgetId: string) => void;
    };
    __turnstileOnLoad?: () => void;
  }
}

const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=__turnstileOnLoad&render=explicit";

let scriptRequested = false;
const pendingRenders: (() => void)[] = [];

function whenTurnstileReady(callback: () => void) {
  if (window.turnstile) {
    callback();
    return;
  }
  pendingRenders.push(callback);
  if (!scriptRequested) {
    scriptRequested = true;
    window.__turnstileOnLoad = () => {
      for (const run of pendingRenders.splice(0)) run();
    };
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }
}

export function TurnstileWidget({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey) return;
    const el = containerRef.current;
    if (!el) return;

    let widgetId: string | undefined;
    let cancelled = false;
    whenTurnstileReady(() => {
      if (cancelled || !el.isConnected || el.hasChildNodes()) return;
      widgetId = window.turnstile?.render(el, { sitekey: siteKey, theme: "dark" });
    });

    return () => {
      cancelled = true;
      if (widgetId) window.turnstile?.remove(widgetId);
    };
  }, [siteKey]);

  if (!siteKey) return null;
  return <div ref={containerRef} className={className} />;
}
