import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { stopSmoothScroll } from '../../utils/smoothScroll';
import { useLang } from '../../data/lang';

type WinState = 'open' | 'minimized' | 'closed' | 'maximized';

const LABELS = {
  es: { close: 'Cerrar', min: 'Minimizar', max: 'Pantalla completa', exit: 'Salir de pantalla completa', reopen: 'Reabrir', restore: 'Restaurar', full: 'Abierto en pantalla completa' },
  en: { close: 'Close', min: 'Minimize', max: 'Full screen', exit: 'Exit full screen', reopen: 'Reopen', restore: 'Restore', full: 'Open in full screen' },
};

// Apple-like curves: quick start, long soft landing
const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;
const MORPH_MS = 420;

const MaximizedCtx = createContext(false);
/** True when the surrounding MacWindow is in full screen (lets content grow to fill it). */
export const useWindowMaximized = () => useContext(MaximizedCtx);

export type WindowControls = {
  maximized: boolean;
  /** Leave full screen (animated). Resolves when the window is back in place. */
  restore: () => Promise<void>;
};

/** macOS traffic lights: symbols appear when hovering the group, like the real ones. */
export const TrafficLights = ({
  onClose,
  onMinimize,
  onMaximize,
  maximized = false,
}: {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  maximized?: boolean;
}) => {
  const L = LABELS[useLang()];
  const btn =
    'w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full flex items-center justify-center transition-[filter,transform] duration-150 active:brightness-75 active:scale-90 shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60';
  const sym = 'w-[70%] h-[70%] opacity-0 group-hover/tl:opacity-100 group-focus-within/tl:opacity-100 transition-opacity duration-100';
  return (
    <div className="group/tl flex gap-2 sm:gap-2.5 shrink-0">
      <button type="button" aria-label={L.close} title={L.close} onClick={onClose} className={`${btn} bg-[#ff5f56]`}>
        <svg viewBox="0 0 10 10" className={sym} aria-hidden><path d="M2.5 2.5l5 5M7.5 2.5l-5 5" stroke="#4d0000" strokeWidth="1.4" strokeLinecap="round" /></svg>
      </button>
      <button type="button" aria-label={L.min} title={L.min} onClick={onMinimize} className={`${btn} bg-[#ffbd2e]`}>
        <svg viewBox="0 0 10 10" className={sym} aria-hidden><path d="M2 5h6" stroke="#5a3a00" strokeWidth="1.5" strokeLinecap="round" /></svg>
      </button>
      <button type="button" aria-label={maximized ? L.exit : L.max} title={maximized ? L.exit : L.max} onClick={onMaximize} className={`${btn} bg-[#27c93f]`}>
        <svg viewBox="0 0 10 10" className={sym} aria-hidden>
          {maximized ? (
            <path d="M5.6 1.8v2.6h2.6M4.4 8.2V5.6H1.8" fill="none" stroke="#003d00" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <path d="M2.2 5.8V7.8h2M7.8 4.2V2.2h-2" fill="none" stroke="#003d00" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          )}
        </svg>
      </button>
    </div>
  );
};

type Rect = { top: number; left: number; width: number; height: number };

/**
 * A window whose traffic lights really work:
 *  red = close (a "reopen" button stays in its place), yellow = minimize into a dock tile,
 *  green = full screen — the window grows from where it is to fill the screen and shrinks back
 *  (Esc, green again or clicking outside). Its space is kept, so the page never jumps.
 */
export const MacWindow = ({
  title,
  className,
  children,
  fill = false,
}: {
  title: string;
  className: string;
  /** Stretch to the parent's height (e.g. to match a neighbour in a grid row). */
  fill?: boolean;
  children: (lights: ReactNode, controls: WindowControls) => ReactNode;
}) => {
  const L = LABELS[useLang()];
  const [state, setState] = useState<WinState>('open');
  const [from, setFrom] = useState<Rect | null>(null); // where the full-screen morph starts/ends
  const [to, setTo] = useState<Rect | null>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const winRef = useRef<HTMLDivElement>(null);
  const [reserved, setReserved] = useState<number | null>(null);
  const prevState = useRef<WinState>('open');
  const restoreResolvers = useRef<(() => void)[]>([]);

  // Remember the open height so placeholders take exactly the same room
  useLayoutEffect(() => {
    if (state !== 'open' || !winRef.current) return;
    const ro = new ResizeObserver(([e]) => setReserved(e.contentRect.height));
    ro.observe(winRef.current);
    return () => ro.disconnect();
  }, [state]);

  const go = useCallback((next: WinState) => {
    setState((cur) => {
      prevState.current = cur;
      return next;
    });
  }, []);

  const maximize = () => {
    const r = (winRef.current ?? slotRef.current)?.getBoundingClientRect();
    if (!r) return;
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    const width = Math.min(vw - 16, vw * 0.97, 1500);
    const height = Math.min(vh - 16, vh * 0.96);
    setFrom({ top: r.top, left: r.left, width: r.width, height: r.height });
    setTo({ top: (vh - height) / 2, left: (vw - width) / 2, width, height });
    go('maximized');
  };

  const restore = useCallback(
    () =>
      new Promise<void>((resolve) => {
        if (state !== 'maximized') return resolve();
        restoreResolvers.current.push(resolve);
        go('open');
      }),
    [state, go],
  );

  // Full screen: lock page scroll, Esc to exit
  useEffect(() => {
    if (state !== 'maximized') return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    stopSmoothScroll(true);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') go('open'); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      stopSmoothScroll(false);
      window.removeEventListener('keydown', onKey);
    };
  }, [state, go]);

  const lights = (max: boolean) => (
    <TrafficLights
      maximized={max}
      onClose={() => go('closed')}
      onMinimize={() => go('minimized')}
      onMaximize={() => (max ? go('open') : maximize())}
    />
  );

  const inlineControls: WindowControls = { maximized: false, restore };
  const fullControls: WindowControls = { maximized: true, restore };
  const comingBackFromFull = prevState.current === 'maximized';

  return (
    <div ref={slotRef} className={`relative w-full flex justify-center ${fill ? 'h-full' : ''}`} style={state !== 'open' && reserved ? { height: reserved } : undefined}>
      {/* `custom` hands the NEW state to the exiting window, so it knows whether to shrink into the dock or fade */}
      <AnimatePresence initial={false} custom={state}>
        {(state === 'open' || state === 'maximized') && (
          <motion.div
            key="win"
            ref={winRef}
            className={`w-full flex justify-center origin-bottom ${fill ? 'h-full' : ''}`}
            // Back from full screen: appear instantly under the shrinking overlay
            initial={comingBackFromFull ? false : { opacity: 0, scale: 0.94, y: 14 }}
            animate={{ opacity: state === 'maximized' ? 0 : 1, scale: 1, y: 0 }}
            custom={state}
            variants={{
              leave: (next: WinState) =>
                next === 'minimized'
                  ? { opacity: 0, scale: 0.12, y: '45%', transition: { duration: 0.42, ease: EASE_IN_OUT } }
                  : { opacity: 0, scale: 0.94, transition: { duration: 0.2, ease: 'easeIn' } },
            }}
            exit="leave"
            transition={{ duration: state === 'maximized' ? 0.01 : 0.36, ease: EASE_OUT }}
            style={{ willChange: 'transform, opacity', pointerEvents: state === 'maximized' ? 'none' : undefined }}
          >
            <div className={className}>{children(lights(false), inlineControls)}</div>
          </motion.div>
        )}

        {state === 'minimized' && (
          <motion.div key="dock" className="absolute inset-0 flex items-end justify-center pb-2 pointer-events-none">
            <motion.button
              type="button"
              onClick={() => go('open')}
              initial={{ opacity: 0, scale: 0.6, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0, transition: { delay: 0.22, duration: 0.38, ease: EASE_OUT } }}
              exit={{ opacity: 0, scale: 0.7, y: 16, transition: { duration: 0.18 } }}
              whileHover={{ y: -4, scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="pointer-events-auto relative flex items-center gap-3 rounded-2xl border border-gray-700/60 bg-[#1e1e24] px-4 py-3 shadow-2xl hover:border-orange-500/50 transition-colors"
              title={L.restore}
            >
              <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center font-mono text-[11px] font-bold text-black shadow-inner">&lt;/&gt;</span>
              <span className="flex flex-col items-start">
                <span className="font-mono text-xs text-gray-200">{title}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">{L.restore}</span>
              </span>
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gray-300" />
            </motion.button>
          </motion.div>
        )}

        {state === 'closed' && (
          <motion.div
            key="closed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.12, duration: 0.3 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="absolute inset-0 flex items-center justify-center rounded-[1.5rem] border border-dashed border-gray-800"
          >
            <motion.button
              type="button"
              onClick={() => go('open')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 rounded-full border border-gray-700 bg-black/40 px-4 py-2 font-mono text-xs text-gray-300 hover:text-orange-400 hover:border-orange-500/50 transition-colors"
            >
              <RotateCcw size={13} /> {L.reopen} {title}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence
            onExitComplete={() => {
              restoreResolvers.current.forEach((r) => r());
              restoreResolvers.current = [];
            }}
          >
            {state === 'maximized' && from && to && (
              <motion.div key="full" className="fixed inset-0 z-[400]" aria-modal role="dialog" aria-label={title}>
                {/* Backdrop */}
                <motion.div
                  className="absolute inset-0 bg-black/80"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: MORPH_MS / 1000, ease: EASE_OUT }}
                  onClick={() => go('open')}
                />
                {/* The window grows from its real position (content reflows, nothing gets stretched) */}
                <motion.div
                  className="absolute flex"
                  initial={from}
                  animate={to}
                  exit={from}
                  transition={{ duration: MORPH_MS / 1000, ease: EASE_OUT }}
                  style={{ willChange: 'top, left, width, height' }}
                >
                  <MaximizedCtx.Provider value={true}>
                    <div className={`${className} !max-w-none w-full h-full flex flex-col`}>{children(lights(true), fullControls)}</div>
                  </MaximizedCtx.Provider>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
};
