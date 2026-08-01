"use client";

import { useEffect } from "react";

/**
 * GlowTracker — mounted once in the root layout. Delegates pointer movement
 * so ANY element carrying .cta-cursor-glow gets the cursor-follow border
 * glow (sets --mx/--my) without each card needing its own listener. Ported
 * from weiz.co.il's GlowTracker.
 *
 * Deliberately NOT gated on prefers-reduced-motion (the reference gates it):
 * the glow is a positional highlight, not motion, and the gate made it read
 * as broken on machines with macOS Reduce Motion enabled.
 */
export function GlowTracker() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest?.(".cta-cursor-glow");
      if (!(target instanceof HTMLElement)) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      target.style.setProperty("--my", `${e.clientY - rect.top}px`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);
  return null;
}
