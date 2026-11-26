import { useEffect, useRef, useState } from 'react';
import {
  siSpringboot, siAngular, siPython, siNodedotjs, siReact, siTypescript, siTailwindcss,
  siSupabase, siJavascript, siHtml5, siCss3, siGithub, siMysql, siPostgresql, siMongodb,
  siRedis, siDocker, siGit, siNextdotjs, siNestjs, siDotnet, siPrisma, siVite, siGraphql, siVercel,
} from 'simple-icons';

// ── Skill definitions ────────────────────────────────────────────

export type SkillCategory = 'frontend' | 'backend' | 'data' | 'devops';

interface Skill {
  name: string;
  cat: SkillCategory;
  color: string;   // tuned for a dark background
  path?: string;   // simple-icons SVG path (24x24)
  img?: string;    // fallback image from /public
}

const icon = (si: { path: string }) => si.path;

// Ordered so categories spread around the sphere instead of clumping
const SKILLS: Skill[] = [
  { name: 'React',         cat: 'frontend', color: '#61DAFB', path: icon(siReact) },
  { name: 'Java',          cat: 'backend',  color: '#f89820', img: '/projets/java-icon.png' },
  { name: 'PostgreSQL',    cat: 'data',     color: '#6b9bdf', path: icon(siPostgresql) },
  { name: 'Docker',        cat: 'devops',   color: '#2496ED', path: icon(siDocker) },
  { name: 'TypeScript',    cat: 'frontend', color: '#4d94e0', path: icon(siTypescript) },
  { name: 'Spring Boot',   cat: 'backend',  color: '#6DB33F', path: icon(siSpringboot) },
  { name: 'MongoDB',       cat: 'data',     color: '#47A248', path: icon(siMongodb) },
  { name: 'Next.js',       cat: 'frontend', color: '#f3f4f6', path: icon(siNextdotjs) },
  { name: 'Node.js',       cat: 'backend',  color: '#5FA04E', path: icon(siNodedotjs) },
  { name: 'Git',           cat: 'devops',   color: '#F05032', path: icon(siGit) },
  { name: 'MySQL',         cat: 'data',     color: '#5d9bd1', path: icon(siMysql) },
  { name: 'Angular',       cat: 'frontend', color: '#e2334f', path: icon(siAngular) },
  { name: 'NestJS',        cat: 'backend',  color: '#E0234E', path: icon(siNestjs) },
  { name: 'Tailwind',      cat: 'frontend', color: '#06B6D4', path: icon(siTailwindcss) },
  { name: 'Redis',         cat: 'data',     color: '#FF4438', path: icon(siRedis) },
  { name: 'Python',        cat: 'backend',  color: '#5a9fd4', path: icon(siPython) },
  { name: 'GitHub',        cat: 'devops',   color: '#e6edf3', path: icon(siGithub) },
  { name: 'JavaScript',    cat: 'frontend', color: '#F7DF1E', path: icon(siJavascript) },
  { name: '.NET',          cat: 'backend',  color: '#9b7bea', path: icon(siDotnet) },
  { name: 'Prisma',        cat: 'data',     color: '#a5b4fc', path: icon(siPrisma) },
  { name: 'HTML5',         cat: 'frontend', color: '#E34F26', path: icon(siHtml5) },
  { name: 'GraphQL',       cat: 'backend',  color: '#E10098', path: icon(siGraphql) },
  { name: 'Vercel',        cat: 'devops',   color: '#f3f4f6', path: icon(siVercel) },
  { name: 'CSS3',          cat: 'frontend', color: '#3d8fd6', path: icon(siCss3) },
  { name: 'Supabase',      cat: 'data',     color: '#3FCF8E', path: icon(siSupabase) },
  { name: 'Vite',          cat: 'frontend', color: '#a78bfa', path: icon(siVite) },
];

export const SKILL_COUNTS: Record<SkillCategory, number> = SKILLS.reduce(
  (acc, s) => ({ ...acc, [s.cat]: acc[s.cat] + 1 }),
  { frontend: 0, backend: 0, data: 0, devops: 0 } as Record<SkillCategory, number>,
);
export const SKILL_TOTAL = SKILLS.length;

// ── Sphere math ──────────────────────────────────────────────────

// Radius as a fraction of the stage; the stage size comes from the parent (real pixels, no CSS scaling = crisp)
const RADIUS_RATIO = 0.385;
const N = SKILLS.length;
const AUTO_SPEED = 0.32; // rad/s

// Fibonacci sphere — even distribution
const POSITIONS = Array.from({ length: N }, (_, i) => {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const y = 1 - (i / (N - 1)) * 2;
  const r = Math.sqrt(Math.max(0, 1 - y * y));
  const theta = golden * i;
  return { x: Math.cos(theta) * r, y, z: Math.sin(theta) * r };
});

type V3 = { x: number; y: number; z: number };

function project(p: V3, rx: number, ry: number) {
  const cy = Math.cos(ry), sy = Math.sin(ry), cx = Math.cos(rx), sx = Math.sin(rx);
  const x1 = p.x * cy + p.z * sy;
  const z1 = -p.x * sy + p.z * cy;
  const y2 = p.y * cx - z1 * sx;
  const z2 = p.y * sx + z1 * cx;
  return { sx: x1, sy: y2, depth: z2 };
}

// Wireframe geometry (computed once)
const SAMPLES = 48;
const ring = (fn: (t: number) => V3) =>
  Array.from({ length: SAMPLES + 1 }, (_, i) => fn((i / SAMPLES) * Math.PI * 2));
const WIRE: V3[][] = [
  ...[-0.66, -0.33, 0, 0.33, 0.66].map((y0) => {
    const r = Math.sqrt(1 - y0 * y0);
    return ring((t) => ({ x: Math.cos(t) * r, y: y0, z: Math.sin(t) * r }));
  }),
  ...[0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4].map((phi) =>
    ring((t) => ({ x: Math.sin(t) * Math.cos(phi), y: Math.cos(t), z: Math.sin(t) * Math.sin(phi) })),
  ),
];
const EQUATOR = 2;

// ── Component ────────────────────────────────────────────────────

export function SkillSphere({ activeCat = null, size }: { activeCat?: SkillCategory | null; size: number }) {
  const [hovered, setHovered] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const wireRefs = useRef<(SVGPolylineElement | null)[]>([]);

  // Animation state lives in refs: the loop writes straight to the DOM, no React re-render per frame
  const rot = useRef({ x: 0.38, y: 0 });
  const vel = useRef({ x: 0, y: 0 });
  const drag = useRef<{ id: number; x: number; y: number; t: number } | null>(null);
  const hoveredRef = useRef<string | null>(null);
  const catRef = useRef<SkillCategory | null>(activeCat);
  const speed = useRef(AUTO_SPEED);
  const sizeRef = useRef(size);
  hoveredRef.current = hovered;
  catRef.current = activeCat;
  sizeRef.current = size;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let raf = 0;
    let running = false;
    let prev = 0;

    const render = () => {
      const { x: rx, y: ry } = rot.current;
      const R = sizeRef.current * RADIUS_RATIO;
      const C = sizeRef.current / 2;
      const cat = catRef.current;
      const hov = hoveredRef.current;
      for (let i = 0; i < N; i++) {
        const node = itemRefs.current[i];
        if (!node) continue;
        const pr = project(POSITIONS[i], rx, ry);
        const sx = pr.sx * R, sy = pr.sy * R, depth = pr.depth;
        const t = (depth + 1) / 2; // 0 back · 1 front
        const skill = SKILLS[i];
        const isHov = hov === skill.name;
        const dimmed = cat !== null && skill.cat !== cat;
        const scale = isHov ? 1 : 0.8 + t * 0.17;
        const opacity = isHov ? 1 : dimmed ? 0.07 + t * 0.12 : 0.22 + t * 0.78;
        node.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;
        node.style.opacity = opacity.toFixed(3);
        node.style.zIndex = String(isHov ? 200 : Math.round(t * 100));
      }
      for (let w = 0; w < WIRE.length; w++) {
        const line = wireRefs.current[w];
        if (!line) continue;
        let pts = '';
        for (const p of WIRE[w]) {
          const q = project(p, rx, ry);
          pts += `${(C + q.sx * R).toFixed(1)},${(C + q.sy * R).toFixed(1)} `;
        }
        line.setAttribute('points', pts);
      }
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      if (!drag.current) {
        // Auto-rotation eases down while hovering a tag, back up afterwards
        const target = reduced ? 0 : hoveredRef.current ? 0.04 : AUTO_SPEED;
        speed.current += (target - speed.current) * Math.min(1, dt * 4);
        // Inertia from a drag decays smoothly
        const decay = Math.exp(-dt * 2.6);
        vel.current.x *= decay;
        vel.current.y *= decay;
        rot.current.y += (speed.current + vel.current.y) * dt;
        rot.current.x += vel.current.x * dt;
        // Gently return the tilt toward the resting angle
        rot.current.x += (0.38 - rot.current.x) * Math.min(1, dt * 0.8);
      }
      render();
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running) return;
      running = true;
      prev = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // Only animate while on screen and the tab is visible
    let inView = false;
    const sync = () => (inView && !document.hidden ? start() : stop());
    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; sync(); }, { rootMargin: '100px' });
    io.observe(el);
    document.addEventListener('visibilitychange', sync);
    const checkOnScreen = () => {
      const r = el.getBoundingClientRect();
      inView = r.bottom > -100 && r.top < window.innerHeight + 100 && r.width > 0;
      sync();
    };
    const watchdog = window.setInterval(checkOnScreen, 400);
    window.addEventListener('scroll', checkOnScreen, { passive: true });
    requestAnimationFrame(checkOnScreen);
    render();

    // Pointer drag (mouse + touch). touch-action: pan-y keeps vertical page scroll working on phones.
    const onDown = (e: PointerEvent) => {
      drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, t: performance.now() };
      vel.current = { x: 0, y: 0 };
      el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      const d = drag.current;
      if (!d || d.id !== e.pointerId) return;
      const now = performance.now();
      const dx = e.clientX - d.x;
      const dy = e.clientY - d.y;
      const dts = Math.max(0.008, (now - d.t) / 1000);
      rot.current.y += dx * 0.006;
      rot.current.x = Math.max(-1.2, Math.min(1.2, rot.current.x - dy * 0.006));
      vel.current = { x: (-dy * 0.006) / dts * 0.6, y: (dx * 0.006) / dts * 0.6 };
      drag.current = { id: d.id, x: e.clientX, y: e.clientY, t: now };
      if (!running) render();
    };
    const onUp = (e: PointerEvent) => {
      if (drag.current?.id !== e.pointerId) return;
      drag.current = null;
      // Clamp the fling so it never spins wildly
      vel.current.x = Math.max(-4, Math.min(4, vel.current.x));
      vel.current.y = Math.max(-6, Math.min(6, vel.current.y));
    };
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    el.addEventListener('lostpointercapture', onUp);

    return () => {
      stop();
      io.disconnect();
      window.clearInterval(watchdog);
      window.removeEventListener('scroll', checkOnScreen);
      document.removeEventListener('visibilitychange', sync);
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      el.removeEventListener('lostpointercapture', onUp);
    };
  }, []);

  // Font/icon size follow the stage so the tags keep proportion on every screen
  const fontPx = Math.round(Math.max(11, Math.min(14, size / 38)));
  const iconPx = Math.round(fontPx * 1.3);
  const R = size * RADIUS_RATIO;

  return (
    <div
      ref={containerRef}
      className="relative select-none cursor-grab active:cursor-grabbing"
      style={{ width: size, height: size, touchAction: 'pan-y' }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none rounded-full"
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(249,115,22,0.08) 0%, rgba(6,182,212,0.035) 38%, transparent 66%)' }}
      />

      {/* Wireframe */}
      <svg className="absolute inset-0 pointer-events-none" width={size} height={size} aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={R} fill="none" stroke="rgba(249,115,22,0.22)" strokeWidth="1" />
        {WIRE.map((_, i) => (
          <polyline
            key={i}
            ref={(n) => { wireRefs.current[i] = n; }}
            fill="none"
            stroke={i === EQUATOR ? 'rgba(249,115,22,0.32)' : 'rgba(249,115,22,0.14)'}
            strokeWidth={i === EQUATOR ? 1 : 0.7}
          />
        ))}
      </svg>

      {/* Tags — position/scale/opacity are written by the animation loop */}
      <ul className="absolute inset-0" aria-label="Skills">
        {SKILLS.map((skill, i) => {
          const isHov = hovered === skill.name;
          return (
            <li key={skill.name} className="contents">
              <div
                ref={(n) => { itemRefs.current[i] = n; }}
                className="absolute left-1/2 top-1/2 will-change-transform"
                onPointerEnter={(e) => { if (e.pointerType === 'mouse') setHovered(skill.name); }}
                onPointerLeave={() => setHovered((h) => (h === skill.name ? null : h))}
              >
                <span
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full font-mono whitespace-nowrap border transition-[color,background-color,border-color,box-shadow] duration-200"
                  style={{
                    fontSize: fontPx,
                    borderColor: isHov ? `${skill.color}99` : `${skill.color}38`,
                    background: isHov ? `${skill.color}1f` : 'rgba(17,17,21,0.75)',
                    color: isHov ? skill.color : '#c4c7ce',
                    boxShadow: isHov ? `0 0 18px ${skill.color}55, 0 0 42px ${skill.color}22` : 'none',
                  }}
                >
                  <span className="shrink-0 flex items-center justify-center" style={{ width: iconPx, height: iconPx }}>
                    {skill.path ? (
                      <svg viewBox="0 0 24 24" width={iconPx} height={iconPx} fill={skill.color} aria-hidden shapeRendering="geometricPrecision">
                        <path d={skill.path} />
                      </svg>
                    ) : (
                      <img src={skill.img} alt="" draggable={false} className="w-full h-full object-contain" />
                    )}
                  </span>
                  {skill.name}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
