"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    WeizParticles?: { init: (c: HTMLCanvasElement) => (() => void) | undefined; boot: () => void };
  }
  interface HTMLCanvasElement {
    __wpStop?: (() => void) | null;
  }
}

/**
 * Starfield — the weiz.co.il particle field, VERBATIM. The whole engine is
 * the reference site's own standalone `/particles.js` (fetched from
 * weiz.co.il/particles.js?v=1.3.3 and served from our /public unchanged):
 * density 120 per 1440x665 (~125/Mpx, MAX 2400), size 0-3, flat 0.5 alpha
 * (no twinkle), speed 2 drifting top-left, out-mode re-entry, and the
 * 200px cursor REPULSE — the "cursor effect". Reduced motion: static field,
 * no listeners.
 *
 * The script boots any `canvas[data-particles]` at DOMContentLoaded (loaded
 * beforeInteractive, exactly as the reference does, so the field paints
 * before hydration); this component just renders the canvas and re-boots on
 * mount as the reference's own React wrapper does — init() is idempotent.
 * `data-fpd="1"` selects the full-page density path, the mode the live site
 * uses for its document-height canvas.
 */
export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    window.WeizParticles?.boot();
    const canvas = ref.current;
    return () => {
      canvas?.__wpStop?.();
    };
  }, []);

  return (
    <div aria-hidden="true" className="starfield-layer">
      <canvas ref={ref} data-particles data-fpd="1" />
    </div>
  );
}
