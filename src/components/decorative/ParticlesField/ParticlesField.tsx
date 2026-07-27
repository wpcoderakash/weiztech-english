"use client";

import { useEffect, useRef } from "react";

import styles from "./ParticlesField.module.css";

/**
 * ParticlesField — replaces the NextBricks `next_particles` element.
 *
 * All 15 instances in the source share identical settings, so this takes no
 * props. Transcribed from those settings:
 *   styleColor #ffffff · circleType true · sizeRandom true · moveEnable true
 *   moveDirection top-left · moveSpeed 2 · moveRandom true
 *   lineLinkedColor #ffffff · numberEnableDensity true
 *   interactivityEnableHover true
 *
 * Implemented as a small canvas rather than pulling in particles.js (~15 KB
 * plus a jQuery-era API). Respects prefers-reduced-motion: the field renders
 * static rather than animating.
 */
export function ParticlesField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let raf = 0;
    const pointer = { x: -9999, y: -9999 };

    interface Particle {
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
    }
    let particles: Particle[] = [];

    /* numberEnableDensity: particle count scales with area, matching
       particles.js's density model (its default is 800 per 1920x1080). */
    const seed = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round((width * height) / 9000);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.5 + Math.random() * 1.8, // sizeRandom
        // moveDirection: top-left, moveRandom adds jitter
        vx: -(0.12 + Math.random() * 0.2),
        vy: -(0.12 + Math.random() * 0.2),
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        if (!reduced) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < -5) p.x = width + 5;
          if (p.y < -5) p.y = height + 5;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.55)";
        ctx.fill();
      }

      /* interactivityEnableHover — link nearby particles to the cursor,
         which is what particles.js's "grab" mode does. */
      if (!reduced) {
        for (const p of particles) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.strokeStyle = `rgba(255,255,255,${0.25 * (1 - dist / 140)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
        raf = requestAnimationFrame(draw);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };
    const onPointerLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    seed();
    draw();

    const observer = new ResizeObserver(() => {
      seed();
      if (reduced) draw();
    });
    observer.observe(canvas);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
