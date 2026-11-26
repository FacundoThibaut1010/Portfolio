import { useEffect, useRef } from 'react';

const CELL = 40;             // must match the CSS grid size in App
const ORANGE = '249,115,22';

type Pt = { x: number; y: number };
type Comet = {
  x: number; y: number;      // head
  dx: number; dy: number;    // unit direction along the grid
  speed: number;             // px/s
  length: number;            // tail length in px
  trail: Pt[];               // recent head positions (newest last)
  nextNode: number;          // distance to the next intersection
  age: number;
  life: number;
  fade: number;              // 1 → 0 when dying
  dying: boolean;
};

const DIRS: Pt[] = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];
const rand = (a: number, b: number) => a + Math.random() * (b - a);

/**
 * Living background: orange pulses run along the grid like current through a circuit,
 * turning at intersections; the grid lights up around the cursor; clicking empty space
 * fires pulses from that point. Canvas-based and paused when the tab is hidden.
 */
export const LiveGrid = ({ enabled = true }: { enabled?: boolean }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const touchOnly = window.matchMedia('(hover: none)').matches;

    let w = 0, h = 0, dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // See-through zones. Solid boxes and plain text don't matter (the canvas sits under them, or the
    // pulse is harmless behind letters); only elements you can see the pulses THROUGH get avoided:
    //  - automatically: any element whose background is semi-transparent or uses a backdrop blur
    //  - manually: [data-grid-shield] (the sphere, the giant see-through project label)
    const PAD = 10;
    type Box = { x: number; y: number; w: number; h: number };
    type Cached = Box & { fixed: boolean };
    let cached: Cached[] = [];
    let shields: Box[] = [];
    const alphaOf = (c: string) => {
      if (!c || c === 'transparent') return 0;
      const m = c.match(/rgba?\(([^)]+)\)/);
      if (!m) return 1;
      const parts = m[1].split(/[\s,/]+/).filter(Boolean);
      return parts.length >= 4 ? parseFloat(parts[3]) : 1;
    };
    const collect = () => {
      const found = new Set<Element>(document.querySelectorAll('[data-grid-shield]'));
      document.querySelectorAll('#root [class*="bg-"], #root [class*="backdrop"], #root [style*="background"]').forEach((el) => {
        if (el === canvas || el.closest('[data-grid-shield]')) return;
        const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || cs.display === 'none') return;
        const a = alphaOf(cs.backgroundColor);
        const blur = cs.backdropFilter && cs.backdropFilter !== 'none';
        if ((a > 0.02 && a < 0.97) || blur) {
          const r = el.getBoundingClientRect();
          if (r.width > 24 && r.height > 14) found.add(el);
        }
      });
      const sy = window.scrollY;
      const next: Cached[] = [];
      found.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        const fixed = !!el.closest('.fixed, .sticky');
        next.push({ x: r.left - PAD, y: (fixed ? r.top : r.top + sy) - PAD, w: r.width + PAD * 2, h: r.height + PAD * 2, fixed });
      });
      cached = next;
    };
    const idle = (fn: () => void) =>
      ('requestIdleCallback' in window ? (window as any).requestIdleCallback(fn, { timeout: 500 }) : setTimeout(fn, 0));
    collect();
    const collector = window.setInterval(() => idle(collect), 1500);
    // Re-measure soon after the page layout changes (sections mounting, a project opening…)
    let pending = 0;
    const ro = new ResizeObserver(() => { window.clearTimeout(pending); pending = window.setTimeout(() => idle(collect), 120); });
    ro.observe(document.body);
    const measure = () => {
      const sy = window.scrollY;
      shields = [];
      for (const c of cached) {
        const y = c.fixed ? c.y : c.y - sy;
        if (y + c.h < 0 || y > h) continue;
        shields.push({ x: c.x, y, w: c.w, h: c.h });
      }
    };
    const blocked = (x: number, y: number) => {
      for (const b of shields) if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) return true;
      return false;
    };

    const comets: Comet[] = [];
    const maxComets = () => (w < 768 ? 5 : 11);

    const spawn = (x?: number, y?: number, dir?: Pt) => {
      const cols = Math.floor(w / CELL), rows = Math.floor(h / CELL);
      let sx = x ?? Math.round(rand(1, cols - 1)) * CELL;
      let sy = y ?? Math.round(rand(1, rows - 1)) * CELL;
      if (x === undefined) {
        // try a few spots until one is outside every reading zone
        for (let tries = 0; tries < 12 && blocked(sx, sy); tries++) {
          sx = Math.round(rand(1, cols - 1)) * CELL;
          sy = Math.round(rand(1, rows - 1)) * CELL;
        }
        if (blocked(sx, sy)) return;
      } else if (blocked(sx, sy)) return;
      const d = dir ?? DIRS[Math.floor(Math.random() * 4)];
      comets.push({
        x: sx, y: sy, dx: d.x, dy: d.y,
        speed: rand(110, 240),
        length: rand(90, 220),
        trail: [{ x: sx, y: sy }],
        nextNode: CELL,
        age: 0, life: rand(5, 9), fade: 1, dying: false,
      });
    };

    // Cursor spotlight (eased)
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999, a: 0, ta: 0 };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      mouse.tx = e.clientX; mouse.ty = e.clientY; mouse.ta = 1;
      if (mouse.x < -999) { mouse.x = mouse.tx; mouse.y = mouse.ty; }
    };
    const onLeave = () => { mouse.ta = 0; };
    // Click on empty background → burst of pulses from the nearest intersection
    const onDown = (e: PointerEvent) => {
      if (reduced || !enabledRef.current) return;
      const el = e.target as HTMLElement | null;
      if (el?.closest('a,button,input,textarea,select,label,[role="dialog"],iframe,[data-no-burst]')) return;
      const nx = Math.round(e.clientX / CELL) * CELL;
      const ny = Math.round(e.clientY / CELL) * CELL;
      DIRS.forEach((d) => spawn(nx, ny, d));
      ripples.push({ x: nx, y: ny, t: 0 });
    };
    const ripples: { x: number; y: number; t: number }[] = [];
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    window.addEventListener('pointerdown', onDown, { passive: true });

    let raf = 0;
    let prev = performance.now();
    let spawnTimer = 0;

    const drawSpotlight = () => {
      if (touchOnly) return;
      mouse.x += (mouse.tx - mouse.x) * 0.18;
      mouse.y += (mouse.ty - mouse.y) * 0.18;
      mouse.a += (mouse.ta - mouse.a) * 0.08;
      if (mouse.a < 0.01) return;
      const R = 220;
      const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, R);
      g.addColorStop(0, `rgba(${ORANGE},${0.42 * mouse.a})`);
      g.addColorStop(1, `rgba(${ORANGE},0)`);
      ctx.strokeStyle = g;
      ctx.lineWidth = 1;
      ctx.beginPath();
      const x0 = Math.floor((mouse.x - R) / CELL) * CELL, x1 = mouse.x + R;
      const y0 = Math.floor((mouse.y - R) / CELL) * CELL, y1 = mouse.y + R;
      for (let x = x0; x <= x1; x += CELL) { ctx.moveTo(x + 0.5, y0); ctx.lineTo(x + 0.5, y1); }
      for (let y = y0; y <= y1; y += CELL) { ctx.moveTo(x0, y + 0.5); ctx.lineTo(x1, y + 0.5); }
      ctx.stroke();
      // intersections near the cursor glow softly
      ctx.fillStyle = g;
      for (let x = x0; x <= x1; x += CELL) for (let y = y0; y <= y1; y += CELL) ctx.fillRect(x - 1, y - 1, 3, 3);
    };

    const step = (c: Comet, dt: number) => {
      let move = c.speed * dt;
      while (move > 0) {
        const s = Math.min(move, c.nextNode);
        c.x += c.dx * s; c.y += c.dy * s;
        c.nextNode -= s; move -= s;
        if (c.nextNode <= 0) {
          c.trail.push({ x: c.x, y: c.y }); // corner point
          c.nextNode = CELL;
          const ahead = (dx: number, dy: number) => blocked(c.x + dx * CELL, c.y + dy * CELL) || blocked(c.x + dx * CELL * 0.5, c.y + dy * CELL * 0.5);
          const turn = Math.random() < 0.5 ? 1 : -1;
          const options = [
            { dx: -c.dy * turn, dy: c.dx * turn },
            { dx: c.dy * turn, dy: -c.dx * turn },
          ];
          if (ahead(c.dx, c.dy)) {
            // about to hit a reading zone: take a free side, otherwise fade away
            const free = options.find((o) => !ahead(o.dx, o.dy));
            if (free) { c.dx = free.dx; c.dy = free.dy; } else c.dying = true;
          } else if (Math.random() < 0.28) { // wander like a circuit trace
            const o = options.find((o) => !ahead(o.dx, o.dy));
            if (o) { c.dx = o.dx; c.dy = o.dy; }
          }
        }
      }
      // trim corners that are already beyond the tail length (keep one to end the last segment)
      let total = Math.abs(c.x - c.trail[c.trail.length - 1].x) + Math.abs(c.y - c.trail[c.trail.length - 1].y);
      for (let i = c.trail.length - 1; i > 0; i--) {
        if (total > c.length) { c.trail.splice(0, i); break; }
        total += Math.abs(c.trail[i].x - c.trail[i - 1].x) + Math.abs(c.trail[i].y - c.trail[i - 1].y);
      }
      c.age += dt;
      const out = c.x < -CELL || c.y < -CELL || c.x > w + CELL || c.y > h + CELL;
      if (!c.dying && (c.age > c.life || out)) c.dying = true;
      if (blocked(c.x, c.y)) { c.dying = true; c.fade -= dt * 3; }
      if (c.dying) c.fade -= dt * 1.4;
    };

    const alpha = (t: number, fade: number) => 0.85 * t * t * fade;
    const drawComet = (c: Comet) => {
      // walk from the head back through the corners, one gradient stroke per straight segment
      let ax = c.x, ay = c.y, dist = 0;
      ctx.lineCap = 'round';
      ctx.lineWidth = 1.6;
      for (let i = c.trail.length - 1; i >= 0; i--) {
        let bx = c.trail[i].x, by = c.trail[i].y;
        const seg = Math.abs(ax - bx) + Math.abs(ay - by);
        if (seg === 0) continue;
        const t0 = 1 - dist / c.length;
        let t1 = 1 - (dist + seg) / c.length;
        if (t0 <= 0) break;
        if (t1 < 0) { // cut the segment where the tail ends
          const k = t0 / (t0 - t1);
          bx = ax + (bx - ax) * k; by = ay + (by - ay) * k; t1 = 0;
        }
        const g = ctx.createLinearGradient(ax, ay, bx, by);
        g.addColorStop(0, `rgba(${ORANGE},${alpha(t0, c.fade).toFixed(3)})`);
        g.addColorStop(1, `rgba(${ORANGE},${alpha(t1, c.fade).toFixed(3)})`);
        ctx.strokeStyle = g;
        ctx.beginPath();
        ctx.moveTo(ax + 0.5, ay + 0.5);
        ctx.lineTo(bx + 0.5, by + 0.5);
        ctx.stroke();
        dist += seg;
        ax = bx; ay = by;
      }
      // glowing head
      const hg = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, 10);
      hg.addColorStop(0, `rgba(255,190,120,${0.95 * c.fade})`);
      hg.addColorStop(0.35, `rgba(${ORANGE},${0.55 * c.fade})`);
      hg.addColorStop(1, `rgba(${ORANGE},0)`);
      ctx.fillStyle = hg;
      ctx.fillRect(c.x - 10, c.y - 10, 20, 20);
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      ctx.clearRect(0, 0, w, h);
      if (!enabledRef.current || document.querySelector('[role="dialog"][aria-modal]')) {
        comets.length = 0; ripples.length = 0; // start fresh when turned back on
        raf = requestAnimationFrame(frame);
        return;
      }
      measure();
      ctx.globalCompositeOperation = 'lighter';

      drawSpotlight();

      if (!reduced) {
        spawnTimer -= dt;
        if (spawnTimer <= 0 && comets.length < maxComets()) {
          spawn();
          spawnTimer = rand(0.35, 0.9);
        }
        for (let i = comets.length - 1; i >= 0; i--) {
          const c = comets[i];
          step(c, dt);
          if (c.fade <= 0) comets.splice(i, 1);
          else drawComet(c);
        }
        for (let i = ripples.length - 1; i >= 0; i--) {
          const r = ripples[i];
          r.t += dt;
          const k = r.t / 0.7;
          if (k >= 1) { ripples.splice(i, 1); continue; }
          ctx.strokeStyle = `rgba(${ORANGE},${(0.5 * (1 - k)).toFixed(3)})`;
          ctx.lineWidth = 1.2;
          const size = 6 + k * 46;
          ctx.strokeRect(r.x - size / 2 + 0.5, r.y - size / 2 + 0.5, size, size);
        }
      }
      ctx.globalCompositeOperation = 'source-over';
      // Guarantee: reading zones stay clean (spotlight, trails and ripples included)
      for (const b of shields) ctx.clearRect(b.x, b.y, b.w, b.h);
      raf = requestAnimationFrame(frame);
    };

    const start = () => { cancelAnimationFrame(raf); prev = performance.now(); raf = requestAnimationFrame(frame); };
    const onVis = () => (document.hidden ? cancelAnimationFrame(raf) : start());
    document.addEventListener('visibilitychange', onVis);
    start();

    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(collector);
      window.clearTimeout(pending);
      ro.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('pointerdown', onDown);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="fixed inset-0 z-0 pointer-events-none" />;
};
