import { useEffect, useMemo, useRef, useState } from 'react';

export type CodeToken = { text: string; className: string };
export type CodeLine = { indent: number; tokens: CodeToken[] };

type Props = {
  lines: CodeLine[];
  /** null = idle (nothing typed yet). Any change of value restarts the typing from zero. */
  runKey: string | null;
  /** performance.now() when this run started — lets a re-mounted editor (e.g. full screen) continue where it was. */
  startedAt?: number;
  hint: string;
  onDone: () => void;
  onCaretMove?: (line: number, col: number) => void;
};

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Human-ish rhythm: quick on letters, a breath after punctuation, a pause at line ends
// Deterministic jitter so every instance of the editor computes the exact same rhythm
const jitter = (i: number) => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const delayFor = (ch: string | undefined, i: number) => {
  if (ch === '\n') return 170;
  const base = 16 + jitter(i) * 22;
  if (ch && /[,;=(){}<>/'"]/.test(ch)) return base + 35;
  if (ch === ' ') return base + 12;
  return base;
};

export const CodeTyper = ({ lines, runKey, startedAt, hint, onDone, onCaretMove }: Props) => {
  // Full text as one sequence; '\n' between lines counts as a typing step (gives the line-end pause)
  const { seq, starts } = useMemo(() => {
    const texts = lines.map((l) => l.tokens.map((t) => t.text).join(''));
    const starts: number[] = [];
    let acc = 0;
    texts.forEach((txt) => {
      starts.push(acc);
      acc += txt.length + 1;
    });
    return { seq: texts.join('\n'), starts };
  }, [lines]);

  const total = seq.length;

  // Progress is tied to the runKey it belongs to, so a new runKey (e.g. language switch) starts at 0 instantly
  const [progress, setProgress] = useState<{ key: string | null; n: number }>({ key: runKey, n: 0 });
  const n = runKey === null ? 0 : progress.key === runKey ? progress.n : 0;

  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  // Time-based schedule: char i appears at schedule[i] ms after start. Driven by rAF + real elapsed
  // time, so the speed stays the same even when the page is busy and timers/frames get throttled.
  useEffect(() => {
    if (runKey === null) return;
    if (prefersReducedMotion()) {
      setProgress({ key: runKey, n: total });
      onDoneRef.current();
      return;
    }
    const schedule: number[] = [];
    let acc = 120; // small beat before the first keystroke
    for (let i = 0; i < total; i++) {
      acc += delayFor(seq[i], i);
      schedule.push(acc);
    }
    const start = startedAt ?? performance.now();
    let shown = 0;
    let raf = 0;
    const frame = (now: number) => {
      const elapsed = now - start;
      let next = shown;
      while (next < total && schedule[next] <= elapsed) next++;
      if (next !== shown) {
        shown = next;
        setProgress({ key: runKey, n: shown });
      }
      if (shown >= total) {
        onDoneRef.current();
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [runKey, total, seq, startedAt]);

  const typing = runKey !== null && n < total;

  // Where the caret sits
  let caretLine = 0;
  for (let i = 0; i < starts.length; i++) if (n >= starts[i]) caretLine = i;
  const caretCol = n - starts[caretLine];

  useEffect(() => {
    onCaretMove?.(caretLine, caretCol);
  }, [caretLine, caretCol, onCaretMove]);

  const caret = (
    <span
      aria-hidden
      className={`inline-block w-[2px] h-[1.15em] -mb-[0.2em] ml-px bg-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.8)] ${typing ? '' : 'caret-blink'}`}
    />
  );

  return (
    <div className="flex flex-col w-full [--indent:1.5ch] sm:[--indent:2ch]">
      {lines.map((line, i) => {
        const visible = Math.max(0, Math.min(n - starts[i], line.tokens.reduce((a, t) => a + t.text.length, 0)));
        const reached = runKey !== null && n >= starts[i];
        const isCaretLine = i === caretLine;

        let budget = visible;
        const parts = line.tokens.map((tok, j) => {
          if (budget <= 0) return null;
          const shown = tok.text.slice(0, budget);
          budget -= shown.length;
          return (
            <span key={j} className={tok.className}>
              {shown}
            </span>
          );
        });

        return (
          <div
            key={i}
            className={`flex transition-colors duration-300 ${isCaretLine && runKey !== null ? 'bg-white/[0.035]' : ''}`}
          >
            <span
              className={`w-5 sm:w-9 shrink-0 text-right pr-2 sm:pr-4 mr-2.5 sm:mr-5 border-r border-gray-800 select-none transition-colors duration-300 ${
                isCaretLine && runKey !== null ? 'text-gray-300' : reached ? 'text-gray-500' : 'text-gray-700'
              }`}
            >
              {i + 1}
            </span>
            <span className={`pr-2 sm:pr-4 ${runKey === null && i === 0 ? 'whitespace-normal' : 'whitespace-pre'}`} style={{ paddingLeft: `calc(${line.indent} * var(--indent, 2ch))` }}>
              {runKey === null && i === 0 ? (
                <>
                  {caret}
                  <span className="text-gray-600 italic ml-1">// {hint}</span>
                </>
              ) : (
                <>
                  {parts}
                  {isCaretLine && runKey !== null && caret}
                  {'​'}
                </>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
};
