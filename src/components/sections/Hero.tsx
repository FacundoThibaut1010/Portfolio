import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Play, Folder, RotateCcw, Loader2 } from 'lucide-react';
import { CodeTyper, CodeLine } from '../ui/CodeTyper';
import { StableText } from '../../data/lang';
import { MacWindow } from '../ui/MacWindow';
import { translations } from '../../data/translations';

// Syntax colors (One Dark)
const C = {
  comment: 'text-gray-500 italic',
  keyword: 'text-[#c678dd]',
  type: 'text-[#e5c07b]',
  string: 'text-[#98c379]',
  op: 'text-[#56b6c2]',
  attr: 'text-[#e06c75]',
  punct: 'text-gray-400',
  plain: 'text-gray-300',
};

type Status = 'idle' | 'typing' | 'done';

const fmt = () => new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

/** Live clock isolated in its own component so the ticking doesn't re-render the hero and its editor. */
const LiveClock = () => {
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">{time}</span>;
};

export const Hero = ({ t, lang, scrollTo }: { t: any, lang: string, scrollTo: (id: string) => void }) => {
  const [waHovered, setWaHovered] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [runId, setRunId] = useState(0);
  // Caret position is written straight into the status bar (no hero re-render per typed character)
  const caretRefs = useRef(new Set<HTMLSpanElement>());
  const caretText = useRef('Ln 1, Col 1');

  const runKey = status === 'idle' ? null : `${lang}-${runId}`;
  // Start time of the current run, shared by every editor instance (inline and full screen)
  const startedAt = useMemo(() => (runKey ? performance.now() : 0), [runKey]);

  // Changing language clears the editor: press Run again to type it in the new language
  useEffect(() => {
    setStatus('idle');
  }, [lang]);

  const codeLines: CodeLine[] = useMemo(() => [
    { indent: 0, tokens: [{ text: `// ${t.ide_welcome}`, className: C.comment }] },
    { indent: 0, tokens: [
      { text: 'import', className: C.keyword }, { text: ' ', className: '' },
      { text: '{ Developer }', className: C.type }, { text: ' ', className: '' },
      { text: 'from', className: C.keyword }, { text: ' ', className: '' },
      { text: "'./universe'", className: C.string }, { text: ';', className: C.punct },
    ] },
    { indent: 0, tokens: [] },
    { indent: 0, tokens: [
      { text: 'const', className: C.keyword }, { text: ' ', className: '' },
      { text: 'Portfolio', className: C.type }, { text: ' = ', className: C.op },
      { text: '() =>', className: C.op }, { text: ' {', className: C.plain },
    ] },
    { indent: 1, tokens: [{ text: 'return', className: C.keyword }, { text: ' (', className: C.plain }] },
    { indent: 2, tokens: [{ text: '<', className: C.punct }, { text: 'Developer', className: C.type }] },
    { indent: 3, tokens: [{ text: t.ide_prop_name, className: C.attr }, { text: '=', className: C.op }, { text: `"${t.ide_val_name}"`, className: C.string }] },
    { indent: 3, tokens: [{ text: t.ide_prop_role, className: C.attr }, { text: '=', className: C.op }, { text: `"${t.ide_val_role}"`, className: C.string }] },
    { indent: 3, tokens: [{ text: t.ide_prop_passion, className: C.attr }, { text: '=', className: C.op }, { text: `"${t.ide_val_passion}"`, className: C.string }] },
    { indent: 2, tokens: [{ text: '/>', className: C.punct }] },
    { indent: 1, tokens: [{ text: ');', className: C.plain }] },
    { indent: 0, tokens: [{ text: '};', className: C.plain }] },
  ], [t]);

  const handleDone = useCallback(() => setStatus('done'), []);
  const handleCaret = useCallback((line: number, col: number) => {
    caretText.current = `Ln ${line + 1}, Col ${col + 1}`;
    caretRefs.current.forEach((el) => { el.textContent = caretText.current; });
  }, []);
  const caretRef = useCallback((el: HTMLSpanElement | null) => {
    if (el) { caretRefs.current.add(el); el.textContent = caretText.current; }
  }, []);

  const handleRunProfile = () => {
    setRunId((r) => r + 1);
    setStatus('typing');
  };

  return (
    <section id="hero" className="min-h-[100svh] w-full flex flex-col items-center justify-center px-5 sm:px-8 lg:px-10 pt-24 pb-14 lg:py-[clamp(1.5rem,5vh,4rem)] relative">
      <div className="max-w-[85rem] w-full mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-12 lg:gap-10 xl:gap-16 2xl:gap-24 items-center">

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col justify-center min-w-0 space-y-7 sm:space-y-8 lg:space-y-[clamp(1rem,3.4vh,2.5rem)]"
        >
          {/* Status Tag — schedule label + live clock */}
          <div className="inline-flex items-center gap-3 border border-orange-500/30 bg-orange-500/10 px-4 py-2 rounded-md text-xs sm:text-sm font-mono tracking-widest text-orange-500 w-fit">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-[pulse_2s_ease-in-out_infinite]"></span>
            {t.hero_schedule} · <LiveClock />
          </div>

          {/* Titles */}
          <div className="space-y-1">
            <h1 className="text-[2.6rem] min-[400px]:text-5xl sm:text-6xl lg:text-[clamp(2.6rem,min(4.6vw,9.5vh),5.4rem)] font-bold text-white leading-[1.08] tracking-tight">
              {t.hero_hello}
            </h1>
            <h1 className="text-[2.6rem] min-[400px]:text-5xl sm:text-6xl lg:text-[clamp(2.6rem,min(4.6vw,9.5vh),5.4rem)] font-bold leading-[1.08] tracking-tight bg-gradient-to-r from-orange-400 via-pink-400 to-blue-500 text-transparent bg-clip-text pb-2">
              Facundo Thibaut
            </h1>
          </div>

          {/* Description */}
          <div className="space-y-4 text-base sm:text-xl text-gray-400 max-w-2xl">
            <p className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-orange-500 font-mono text-sm sm:text-base whitespace-nowrap"><StableText values={{ en: `<${translations.en.hero_title} />`, es: `<${translations.es.hero_title} />` }} /></span>
              <span className="text-gray-200 font-medium text-sm sm:text-base"><StableText k="hero_desc1" /></span>
            </p>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed font-mono">
              <StableText k="hero_desc2" />
            </p>
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-col sm:flex-row gap-4 lg:gap-5 pt-1 lg:pt-2 max-w-[640px]">
            {/* WhatsApp button */}
            <a
              href="https://wa.me/541171247355"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setWaHovered(true)}
              onMouseLeave={() => setWaHovered(false)}
              onTouchStart={() => setWaHovered(true)}
              onTouchEnd={() => setWaHovered(false)}
              onTouchCancel={() => setWaHovered(false)}
              onContextMenu={(e) => e.preventDefault()}
              className="group relative flex items-center justify-between gap-5 border border-gray-700 bg-[#16161a]/80 hover:bg-[#1e2a1e] hover:border-[#25D366]/40 rounded-2xl p-4 xl:p-5 w-full sm:flex-[1.4] min-w-0 shadow-lg overflow-hidden transition-colors"
            >
              <div className="flex gap-5 items-center w-full">
                <div className="bg-[#1e2a1e] border border-[#25D366]/30 rounded-lg p-3.5 flex items-center justify-center shrink-0">
                  {/* WhatsApp SVG */}
                  <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7" fill="#25D366">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div className="flex flex-col flex-grow text-left">
                  <div className="flex justify-between items-center w-full">
                    <span className="text-white font-bold text-[15px]">{t.hero_btn_init}</span>
                    <ExternalLink size={16} className="text-gray-500 group-hover:text-[#25D366]/70" />
                  </div>
                  <div className="flex justify-between items-center mt-2 w-full text-[12px] font-mono">
                    <span className="text-gray-500"></span>
                    <span className="text-[#25D366]/70">Online</span>
                  </div>
                </div>
              </div>
            </a>

            <a
              href="https://github.com/FacundoThibaut1010"
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex items-center gap-5 border border-gray-700 bg-black/40 hover:bg-gray-800 rounded-2xl px-6 xl:px-8 py-4 xl:py-5 shadow-xl overflow-hidden transition-all group w-full sm:flex-1 min-w-0"
            >
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
              </div>
              <div className="flex flex-col items-start z-10">
                <span className="text-xs text-gray-500 font-mono tracking-[0.2em] mb-1">
                  {t.hero_btn_check}
                </span>
                <span className="text-white font-bold tracking-widest flex items-center gap-3 text-lg">
                  GitHub
                  <svg className="text-gray-400 group-hover:text-white transition-colors" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                </span>
              </div>
            </a>
          </div>
        </motion.div>

        {/* IDE Visualizer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="flex items-center justify-center relative min-w-0"
        >
          <MacWindow
            title="portfolio.tsx"
            className={`w-full max-w-2xl bg-[#16161a] border rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl overflow-hidden relative flex flex-col transition-[border-color,box-shadow] duration-500 ${status === 'typing' ? 'border-orange-500/40 shadow-[0_0_50px_-10px_rgba(249,115,22,0.35)]' : status === 'done' ? 'border-emerald-500/25' : 'border-gray-700/50'}`}
          >
          {(lights, win) => (<>

            {/* HEADER */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 lg:py-[clamp(0.6rem,1.8vh,1rem)] bg-[#1e1e24] border-b border-gray-800 shrink-0">
              {lights}
              <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-400 font-mono cursor-default">
                <span className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-colors ${status === 'done' ? 'bg-emerald-400' : 'bg-orange-500'}`}></span>
                portfolio.tsx
              </div>
              <div className="hidden sm:flex w-8 h-8 border border-gray-700 rounded items-center justify-center">
                <span className="text-xs font-mono text-gray-400">&lt;/&gt;</span>
              </div>
            </div>

            {/* CUERPO DEL CÓDIGO */}
            <div className={`${win.maximized ? 'flex-1 min-h-0 overflow-auto font-mono text-base sm:text-lg leading-[2.2rem] px-6 py-6 sm:px-10' : 'px-3 py-4 sm:px-5 sm:py-5 lg:py-[clamp(0.75rem,2.2vh,1.5rem)] text-[11px] min-[400px]:text-xs sm:text-sm xl:text-[15px] font-mono leading-[1.5rem] sm:leading-[1.8rem] lg:leading-[clamp(1.3rem,3.3vh,2rem)] overflow-x-auto w-full'}`}>
              <CodeTyper lines={codeLines} runKey={runKey} startedAt={startedAt} hint={t.ide_hint} onDone={handleDone} onCaretMove={handleCaret} />
            </div>

            {/* STATUS BAR */}
            <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-1.5 border-t border-gray-800 bg-[#1a1a20] text-[10px] sm:text-[11px] font-mono text-gray-500 shrink-0">
              <span className="flex items-center gap-2 min-w-0">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${status === 'typing' ? 'bg-orange-500 animate-pulse' : status === 'done' ? 'bg-emerald-400' : 'bg-gray-600'}`} />
                <span className={`truncate transition-colors ${status === 'done' ? 'text-emerald-400/90' : status === 'typing' ? 'text-orange-400/90' : ''}`}>
                  {status === 'done' ? `✓ ${t.ide_status_done}` : status === 'typing' ? t.ide_status_typing : t.ide_status_idle}
                </span>
              </span>
              <span className="shrink-0 tabular-nums">
                <span ref={caretRef}>{caretText.current}</span><span className="hidden sm:inline"> · UTF-8</span> · TSX
              </span>
            </div>

            {/* FOOTER: Botones */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 px-4 py-4 sm:px-6 lg:py-[clamp(0.75rem,2.2vh,1.5rem)] border-t border-gray-800 bg-[#16161a] mt-auto shrink-0 w-full">
              <button
                onClick={handleRunProfile}
                disabled={status === 'typing'}
                className="flex justify-center items-center gap-3 border border-orange-500/30 text-orange-500 hover:bg-orange-500/10 active:scale-[0.97] disabled:bg-orange-500/5 disabled:cursor-wait rounded-xl px-4 sm:px-6 xl:px-8 py-3 text-xs uppercase tracking-[0.2em] font-mono transition-[background-color,transform] whitespace-nowrap w-full sm:w-auto"
              >
                {status === 'typing' ? (
                  <><Loader2 size={14} className="animate-spin" /> {t.btn_running}</>
                ) : status === 'done' ? (
                  <><RotateCcw size={14} /> {t.btn_rerun}</>
                ) : (
                  <><Play size={14} fill="currentColor" /> {t.btn_run_profile}</>
                )}
              </button>
              <button
                onClick={async () => {
                  // From full screen: shrink back into place first, then glide to the projects
                  if (win.maximized) await win.restore();
                  scrollTo('work');
                }}
                className="flex justify-center items-center gap-3 border border-gray-700 text-gray-300 hover:bg-gray-800 rounded-xl px-4 sm:px-6 xl:px-8 py-3 text-xs uppercase tracking-[0.2em] font-mono transition-[background-color,transform] active:scale-[0.97] whitespace-nowrap w-full sm:w-auto"
              >
                <Folder size={14} /> {t.btn_view_projects}
              </button>
            </div>
          </>)}
          </MacWindow>
        </motion.div>
      </div>
    </section>
  );
};
