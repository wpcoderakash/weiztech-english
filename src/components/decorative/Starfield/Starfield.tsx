"use client";

import { useEffect, useRef } from "react";

/**
 * Starfield — the weiz.co.il site-wide particle field, ported verbatim from
 * the reference source (`components/ui/ParticleCanvas.tsx`) and calibrated
 * against its LIVE canvas: white dots (r 0.5–1.9, 50% alpha) drifting
 * top-left at 0.35 with wrap-around edges, at the measured density of ~90
 * dots per megapixel (544 counted on its 1440x4189 home canvas). One canvas
 * spans the whole document, mounted once in the root layout.
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
    const SPEED = reduce ? 0 : 0.35;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    /* Density measured off the live reference canvas by counting its drawn
       dots: 544 stars on 1440x4189 = ~90 dots per megapixel. The clone's
       COUNT = 55 was a hero-sized constant; the full-page field scales with
       area, so every page height gets the same star density. The spawn
       constant is 112 because the dot-counting probe merges overlapping
       stars: at 112 spawned/Mpx the probe reads ~90 detected/Mpx on our
       canvas — the same figure it reads on the reference's. */
    const COUNT = Math.round(((canvas.width * canvas.height) / 1e6) * 112);

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
      /* No link lines: at ~500 dots the reference page shows isolated stars,
         never a web — the hero component's 120px links don't exist on the
         full-page field (and O(n^2) at this count would cost real frames). */
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
