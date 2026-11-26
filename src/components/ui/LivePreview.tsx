import { useEffect, useRef, useState } from 'react';
import { Loader2, Play, Radio } from 'lucide-react';
import { MacWindow, useWindowMaximized } from './MacWindow';

type Labels = { tour: string; live: string; hintTour: string; hintLive: string };

type Props = {
  /** Full-page capture for the self-scrolling tour (optional). */
  src?: string;
  /** Deployed site, embedded for real in "live" mode (optional). */
  live?: string;
  alt: string;
  labels: Labels;
};

const SPEED = 70;          // px/s while the tour scrolls down
const PAUSE_END = 1600;
const PAUSE_TOP = 1400;
const RESUME_AFTER = 3500; // ms without interaction before the tour resumes
const DESKTOP_W = 1280;    // width the real site is rendered at (then scaled to fit)

/** Self-scrolling capture: moves on its own, hover pauses, wheel/touch scroll it manually. */
const Tour = ({ src, alt, tall }: { src: string; alt: string; tall: boolean }) => {
  const viewRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const hovering = useRef(false);
  const lastInteraction = useRef(0);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = viewRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = viewRef.current;
    if (!el || !inView) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let prev = performance.now();
    let phase: 'down' | 'restBottom' | 'up' | 'restTop' = 'restTop';
    let phaseStart = prev;
    let pos = el.scrollTop;
    let upFrom = 0;

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      const max = el.scrollHeight - el.clientHeight;
      const userActive = hovering.current || now - lastInteraction.current < RESUME_AFTER;
      if (userActive || reduced || max <= 0) {
        pos = el.scrollTop;
        phase = 'restTop';
        phaseStart = now;
      } else if (phase === 'restTop') {
        if (now - phaseStart > PAUSE_TOP) { phase = 'down'; phaseStart = now; }
      } else if (phase === 'down') {
        pos = Math.min(max, pos + SPEED * dt);
        el.scrollTop = pos;
        if (pos >= max) { phase = 'restBottom'; phaseStart = now; }
      } else if (phase === 'restBottom') {
        if (now - phaseStart > PAUSE_END) { phase = 'up'; phaseStart = now; upFrom = pos; }
      } else {
        const t = Math.min(1, (now - phaseStart) / 1400);
        pos = upFrom * (1 - (1 - Math.pow(1 - t, 3)));
        el.scrollTop = pos;
        if (t >= 1) { phase = 'restTop'; phaseStart = now; }
      }
      if (barRef.current) barRef.current.style.transform = `scaleY(${max > 0 ? el.scrollTop / max : 0})`;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const touch = () => { lastInteraction.current = performance.now(); };
    el.addEventListener('wheel', touch, { passive: true });
    el.addEventListener('touchstart', touch, { passive: true });
    el.addEventListener('pointerdown', touch);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('wheel', touch);
      el.removeEventListener('touchstart', touch);
      el.removeEventListener('pointerdown', touch);
    };
  }, [inView]);

  return (
    <div className={`relative ${tall ? 'flex-1 min-h-0' : ''}`}>
      <div
        ref={viewRef}
        data-lenis-prevent
        onPointerEnter={(e) => { if (e.pointerType === 'mouse') hovering.current = true; }}
        onPointerLeave={() => { hovering.current = false; }}
        className={`${tall ? 'h-full' : 'h-[min(48svh,420px)] sm:h-[min(62vh,560px)]'} overflow-y-auto sm:overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
      >
        <img src={src} alt={alt} loading="lazy" draggable={false} className="w-full h-auto block" />
      </div>
      <div className="absolute right-1.5 top-2 bottom-2 w-[3px] rounded-full bg-white/10 overflow-hidden pointer-events-none">
        <div ref={barRef} className="w-full h-full bg-orange-500 origin-top" style={{ transform: 'scaleY(0)' }} />
      </div>
    </div>
  );
};

/** The real site in an iframe: desktop layout scaled to fit on wide screens, its own mobile layout on phones. */
const Live = ({ url, alt, tall }: { url: string; alt: string; tall: boolean }) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setBox({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const desktop = box.w >= 640;
  const scale = desktop ? Math.min(1, box.w / DESKTOP_W) : 1;
  const frameW = desktop ? DESKTOP_W : box.w;
  const frameH = scale > 0 ? box.h / scale : box.h;

  return (
    <div ref={boxRef} className={`relative overflow-hidden bg-white ${tall ? 'flex-1 min-h-0' : 'h-[min(48svh,420px)] sm:h-[min(62vh,560px)]'}`} data-lenis-prevent>
      {box.w > 0 && (
        <iframe
          src={url}
          title={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className="absolute top-0 left-0 border-0 origin-top-left"
          style={{ width: frameW, height: frameH, transform: `scale(${scale})` }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
        />
      )}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#16161a]">
          <Loader2 className="animate-spin text-orange-500" size={22} />
        </div>
      )}
    </div>
  );
};

type Mode = 'tour' | 'live';

const Body = ({ src, live, alt, labels, lights, mode, setMode }: Props & { lights: React.ReactNode; mode: Mode; setMode: (m: Mode) => void }) => {
  const tall = useWindowMaximized();
  const url = live ?? '';
  const both = Boolean(src && live);

  return (
    <>
      {/* Browser chrome */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-[#1e1e24] border-b border-gray-800 shrink-0">
        {lights}
        <div className="flex-1 min-w-0 flex justify-center">
          <span className="max-w-full truncate font-mono text-[10px] sm:text-xs text-gray-400 bg-black/40 border border-gray-800 rounded-md px-3 py-1">
            {url.replace(/^https?:\/\//, '').replace(/\/$/, '') || alt}
          </span>
        </div>
        {both ? (
          <div className="flex shrink-0 items-center rounded-lg border border-gray-800 bg-black/40 p-0.5 font-mono text-[10px] uppercase tracking-[0.15em]">
            {(['tour', 'live'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                aria-pressed={mode === m}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 transition-colors ${mode === m ? 'bg-orange-500 text-black font-bold' : 'text-gray-400 hover:text-gray-200'}`}
              >
                {m === 'tour' ? <Play size={10} fill="currentColor" /> : <Radio size={11} />}
                <span className="hidden sm:inline">{m === 'tour' ? labels.tour : labels.live}</span>
              </button>
            ))}
          </div>
        ) : (
          <span className="hidden sm:flex items-center gap-1.5 shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-orange-400/80">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" /> {labels.live}
          </span>
        )}
      </div>

      {mode === 'tour' && src ? <Tour src={src} alt={alt} tall={tall} /> : <Live url={url} alt={alt} tall={tall} />}

      {!tall && (
        <p className="px-4 py-2.5 text-center font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-gray-600 border-t border-gray-800/80 bg-[#16161a]">
          {mode === 'tour' && src ? labels.hintTour : labels.hintLive}
        </p>
      )}
    </>
  );
};

export const LivePreview = (props: Props) => {
  const [mode, setMode] = useState<Mode>(props.src ? 'tour' : 'live');
  return (
    <div className="w-[86%] sm:w-full max-w-5xl mx-auto">
      <MacWindow
        title={props.alt}
        className="w-full rounded-2xl border border-gray-800 bg-[#16161a] overflow-hidden shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] flex flex-col"
      >
        {(lights) => <Body {...props} lights={lights} mode={mode} setMode={setMode} />}
      </MacWindow>
    </div>
  );
};
