"use client";

import { useEffect, useRef } from "react";

/**
 * Starfield — the weiz.co.il site-wide particle field, ported verbatim from
 * the reference source (`components/ui/ParticleCanvas.tsx`): 55 white dots
 * (r 0.5–1.9, 50% alpha) drifting top-left at 0.35, linked by white lines
 * under 120px (alpha up to 0.16), wrap-around edges. The reference renders it
 * as ONE canvas spanning the whole document (probed 1440x4189 on its home),
 * not per-hero — so it mounts once in the root layout.
 *
 * Stacking follows the site's existing glow model: the wrapper sits at z-1
 * (above section backgrounds, below the z-10 content containers), absolute
 * over the full body height, pointer-events none.
 *
 * Reduced motion: the reference draws one static frame and stops — same here.
 */
export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    const P: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    const COUNT = 55;
    const DIST = 120;
    const SPEED = reduce ? 0 : 0.35;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < COUNT; i++) {
      const a = Math.PI * 1.25 + (Math.random() - 0.5) * Math.PI;
      P.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: Math.cos(a) * SPEED * (0.5 + Math.random()),
        vy: Math.sin(a) * SPEED * (0.5 + Math.random()),
        r: Math.random() * 1.4 + 0.5,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of P) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      }
      for (let i = 0; i < P.length; i++) {
        for (let j = i + 1; j < P.length; j++) {
          const a = P[i];
          const b = P[j];
          if (!a || !b) continue;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < DIST) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255,255,255,${(1 - d / DIST) * 0.16})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const p of P) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.fill();
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div aria-hidden="true" className="starfield-layer">
      <canvas ref={ref} />
    </div>
  );
}
