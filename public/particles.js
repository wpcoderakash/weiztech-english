/* Weiz particle background — standalone core (no framework).
   Loaded `beforeInteractive` so it boots the canvases as the HTML parses,
   BEFORE React hydration, so particles appear near-instantly on first load.
   The React <ParticleCanvas> just renders the <canvas data-particles ...> and
   adopts this instance (single source of truth → identical field, no jump).

   Settings match the original site's particles.js exactly: density 80 per
   1440x665, size 0..3 random, opacity a flat 0.5 (no twinkle), move speed 2
   top-left random, out-mode "out", hover repulse 200. Lines disabled. */
(function () {
  "use strict";
  var NUMBER = 80, DENSITY_AREA = 800, SIZE = 3, OPACITY = 0.5,
      MOVE_SPEED = 2, MS = MOVE_SPEED / 2, REPULSE_DIST = 200;
  /* Global particle density (particles per px²), used by EVERY canvas on the site
     via fullPageDensity — the single source of truth. 1.5x the original's
     density (which put 80 particles in its 1440×665 hero), applied uniformly so
     every page, the body and the footer all share one consistent field. */
  var HOME_DENSITY = 120 / (1440 * 665); // ≈ 1.25e-4 particles per px²
  /* Upper bound purely as a performance guard. It must stay well above what the
     tallest page needs (web-development ≈ 7600px → ~1370), otherwise long pages
     would be clipped to fewer particles and end up sparser than short ones — the
     old 900 cap was already clipping that page. */
  var MAX_PARTICLES = 2400;

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function prefersReduced() {
    /* WeizTech deviation from the reference engine (the ONLY one): never
       take the reduced-motion path. The original swaps to a static field
       and skips the mousemove listeners when the OS has "Reduce Motion"
       on, which silently kills the cursor repulse for those users — the
       drift + repulse ARE the design here, so always animate. */
    return false;
  }

  function init(canvas) {
    if (!canvas || canvas.__wpStop) return canvas ? canvas.__wpStop : undefined; // already running
    var ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    var windowEvents = canvas.dataset.we !== "0";      // default on
    var fullPageDensity = canvas.dataset.fpd === "1";
    var hasSeed = canvas.dataset.seed !== undefined && canvas.dataset.seed !== "";
    var seed = hasSeed ? parseInt(canvas.dataset.seed, 10) : undefined;
    var reduce = prefersReduced();

    var raf = 0, P = [], mouse = { x: -9999, y: -9999, active: false };
    var prng = hasSeed ? mulberry32(seed) : null;
    function rnd() { return prng ? prng() : Math.random(); }

    function targetCount() {
      if (reduce) return NUMBER;
      var area = canvas.width * canvas.height;
      if (fullPageDensity) return Math.max(30, Math.min(MAX_PARTICLES, Math.round(HOME_DENSITY * area)));
      return Math.max(30, Math.min(240, Math.round((NUMBER * area) / (DENSITY_AREA * 1000))));
    }
    function makeParticle(x, y) {
      var mag = reduce ? 0 : MS;
      /* size: random 0..3 and opacity: a flat 0.5 with no animation — the
         original has opacity.random and opacity.anim both disabled, so the
         particles do not twinkle. */
      return { x: x == null ? rnd() * canvas.width : x, y: y == null ? rnd() * canvas.height : y,
        vx: -rnd() * mag, vy: -rnd() * mag, r: rnd() * SIZE,
        o: OPACITY };
    }
    function reseed() {
      P.length = 0;
      if (hasSeed) prng = mulberry32(seed);
      var n = targetCount();
      for (var i = 0; i < n; i++) P.push(makeParticle());
    }

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    reseed();
    var lastW = canvas.width;

    function onMove(e) { var r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.active = true; }
    function onLeave() { mouse.active = false; mouse.x = mouse.y = -9999; }
    var evt = windowEvents ? window : canvas;
    if (!reduce) { evt.addEventListener("mousemove", onMove); evt.addEventListener("mouseleave", onLeave); }

    function step() {
      for (var k = 0; k < P.length; k++) {
        var p = P[k];
        p.x += p.vx; p.y += p.vy;
        /* out_mode "out" (the original's setting): a particle that leaves the
           canvas re-enters from the opposite edge at a NEW random position on
           the other axis, rather than wrapping to the same spot. */
        if (p.x + p.r < 0) { p.x = canvas.width + p.r; p.y = rnd() * canvas.height; }
        else if (p.x - p.r > canvas.width) { p.x = -p.r; p.y = rnd() * canvas.height; }
        if (p.y + p.r < 0) { p.y = canvas.height + p.r; p.x = rnd() * canvas.width; }
        else if (p.y - p.r > canvas.height) { p.y = -p.r; p.x = rnd() * canvas.width; }
        if (mouse.active) {
          var dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d > 0 && d < REPULSE_DIST) { var f = (REPULSE_DIST - d) / REPULSE_DIST; p.x += (dx / d) * f * 6; p.y += (dy / d) * f * 6; }
        }
      }
    }
    function paint() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var k = 0; k < P.length; k++) {
        var p = P[k];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255," + p.o + ")";
        ctx.fill();
      }
    }
    function frame() { step(); paint(); if (!reduce) raf = requestAnimationFrame(frame); }
    frame();

    function sync() {
      var w = canvas.offsetWidth, h = canvas.offsetHeight;
      if (w === canvas.width && h === canvas.height) return;
      var oldH = canvas.height;
      canvas.width = w; canvas.height = h;
      if (w !== lastW) { reseed(); lastW = w; }
      else {
        var target = targetCount();
        if (P.length < target) {
          // Height grew (late-loading content): add particles ONLY in the newly
          // covered band [oldH, h], so already-visible areas keep their exact
          // density (no gradual "filling in") while the new area is populated
          // evenly at the same density.
          var band = Math.max(1, h - oldH);
          while (P.length < target) P.push(makeParticle(undefined, oldH + rnd() * band));
        } else if (P.length > target) {
          /* Height SHRANK — a client-side navigation to a shorter page. This
             canvas lives in the layout, so it is never remounted and keeps the
             particle array of whatever page was tallest so far. Removing the
             surplus is what keeps every page at the same density: without it a
             short page inherits a tall page's count (measured: 1374 particles
             on a 1855px page = 4x the intended density), and out-mode makes it
             visible rather than harmless — a particle left below the new bottom
             is immediately re-entered at the top.
             Drop the orphaned ones (below the new height) first, then trim the
             rest at random so the remaining field stays evenly spread. */
          for (var i = P.length - 1; i >= 0 && P.length > target; i--) {
            if (P[i].y > h) P.splice(i, 1);
          }
          while (P.length > target) P.splice((rnd() * P.length) | 0, 1);
        }
      }
      paint(); // resizing cleared the canvas — repaint immediately (anti-flicker)
    }
    var ro = new ResizeObserver(sync);
    ro.observe(canvas);

    function stop() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (!reduce) { evt.removeEventListener("mousemove", onMove); evt.removeEventListener("mouseleave", onLeave); }
      canvas.__wpStop = null;
    }
    canvas.__wpStop = stop;
    return stop;
  }

  function boot() {
    var list = document.querySelectorAll("canvas[data-particles]");
    for (var i = 0; i < list.length; i++) init(list[i]);
  }

  window.WeizParticles = { init: init, boot: boot };

  /* Boot once the FULL document is parsed (DOMContentLoaded), so every canvas is
     sized to its FINAL height and seeded evenly in a single pass — particles are
     spread across the whole page immediately, not "filled in" gradually as the
     page grows during parsing. With CSS inlined into the HTML, the page paints as
     soon as the HTML arrives, so DOMContentLoaded is effectively the first paint.
     `load` re-runs boot as a safety net for anything that appeared late; init()
     is idempotent so re-runs are no-ops. */
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  window.addEventListener("load", boot);
})();
