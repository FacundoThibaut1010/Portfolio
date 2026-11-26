import { useLayoutEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Settings, Coffee } from 'lucide-react';
import { StableText } from '../../data/lang';

gsap.registerPlugin(ScrollTrigger);

const Card = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div
    className={`about-card absolute inset-0 rounded-2xl border border-gray-800 bg-[#1a1b26] p-5 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.9)] flex flex-col justify-center overflow-hidden will-change-transform ${className}`}
  >
    {children}
    {/* darkens the card as it sinks into the stack (instead of making it see-through) */}
    <div className="about-dim absolute inset-0 rounded-2xl bg-[#08080b] opacity-0 pointer-events-none" />
  </div>
);

/**
 * Phones/tablets: "Sobre mí" as a pinned deck (GSAP ScrollTrigger). The section stays on screen and,
 * as you scroll, each card slides up over the previous one, which sinks back like a stack — the
 * story is told in one screen instead of a long column of cards.
 */
export const AboutDeck = ({ t, rows }: { t: any; rows: { k: string; v: ReactNode }[] }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add('(max-width: 1023px)', () => {
      const cards = gsap.utils.toArray<HTMLElement>('.about-card', root);
      const n = cards.length;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(cards, { clearProps: 'all' });
        return;
      }
      gsap.set(cards, { yPercent: (i) => (i === 0 ? 0 : 118), scale: 1, zIndex: (i) => i + 1, transformOrigin: '50% 0%' });

      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut', duration: 1 },
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: () => `+=${(n - 1) * window.innerHeight * 0.75}`,
          pin: true,
          scrub: 0.6,
          snap: { snapTo: 1 / (n - 1), duration: { min: 0.2, max: 0.5 }, ease: 'power1.inOut' },
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
            if (countRef.current) countRef.current.textContent = `0${Math.min(n, Math.round(self.progress * (n - 1)) + 1)} / 0${n}`;
          },
        },
      });
      for (let i = 1; i < n; i++) {
        // previous card sinks back into the stack while the next one rises over it
        tl.to(cards[i - 1], { scale: 0.92, yPercent: -4 }, i - 1)
          .to(cards[i - 1].querySelector('.about-dim'), { opacity: 0.55 }, i - 1)
          .to(cards[i], { yPercent: 0, ease: 'power3.out' }, i - 1);
      }
      return () => tl.scrollTrigger?.kill();
    });
    // Re-measure once fonts/images settle
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    const id = window.setTimeout(refresh, 600);
    return () => {
      window.removeEventListener('load', refresh);
      window.clearTimeout(id);
      mm.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="lg:hidden pt-20 pb-6 min-h-[100svh] flex flex-col">
      <h2 className="text-3xl sm:text-4xl font-mono text-gray-200 font-bold flex items-center gap-3 mb-5">
        <span className="text-orange-500 font-bold">&gt;_</span>
        {t.about_title}
      </h2>

      {/* Deck */}
      <div className="relative flex-1 min-h-[340px] max-h-[460px]">
        <Card>
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-orange-500/10 pointer-events-none" style={{ filter: 'blur(60px)' }} />
          <div className="relative flex flex-col items-center gap-5">
            <div className="relative w-28 h-28 shrink-0">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100" aria-hidden>
                <circle cx="50" cy="50" r="48" fill="transparent" stroke="#2a2a30" strokeWidth="0.6" />
                <circle cx="50" cy="50" r="48" fill="transparent" stroke="#f97316" strokeWidth="1.6" strokeDasharray="50 300" />
                <circle cx="50" cy="50" r="48" fill="transparent" stroke="#10b981" strokeWidth="1.6" strokeDasharray="30 300" strokeDashoffset="-120" />
                <circle cx="50" cy="50" r="48" fill="transparent" stroke="#3b82f6" strokeWidth="1.2" strokeDasharray="80 300" strokeDashoffset="-180" />
              </svg>
              <div className="absolute inset-[11%] rounded-full border border-gray-700 overflow-hidden">
                <img src="/projets/fotoFacu.jpeg" alt="Facundo Thibaut" className="w-full h-full object-cover object-top scale-105" />
              </div>
              <span className="absolute bottom-[12%] right-[12%] w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#1a1b26]" />
            </div>
            <dl className="w-full font-mono text-[12px] divide-y divide-gray-800/80">
              {rows.map((r) => (
                <div key={r.k} className="flex justify-between items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                  <dt className="text-gray-500 uppercase tracking-widest text-[10px] shrink-0">{r.k}</dt>
                  <dd className="text-right min-w-0 break-words">{r.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Card>

        {[
          { cmd: t.about_cmd_whoami, k: 'about_whoami_desc' },
          { cmd: t.about_cmd_mission_file, k: 'about_mission_desc_1' },
        ].map((b) => (
          <Card key={b.k}>
            <p className="text-gray-600 font-mono text-[11px] border-b border-gray-800 pb-3 mb-4">&gt;_ {t.about_cmd_header}</p>
            <div className="flex items-center gap-3 mb-3 font-mono">
              <span className="text-blue-500 font-bold">-&gt;</span>
              <span className="text-[#c678dd] font-semibold">{b.cmd}</span>
            </div>
            <p className="border-l-[3px] border-gray-700/40 pl-4 text-gray-400 font-mono text-[13px] leading-relaxed">
              <StableText k={b.k} />
            </p>
          </Card>
        ))}

        <Card>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: t.metric_exp, v: '4+', sub: t.metric_exp_sub, Icon: Settings },
              { title: t.metric_caf, v: '∞', sub: t.metric_caf_sub, Icon: Coffee },
            ].map((m) => (
              <div key={m.title} className="rounded-xl border border-gray-800 bg-black/20 p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-gray-500 text-[10px] font-mono tracking-[0.2em]">
                  <m.Icon size={13} className="text-orange-500" /> {m.title}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-white">{m.v}</span>
                  <span className="text-xs text-gray-600 font-mono tracking-widest">{m.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Progress */}
      <div className="mt-5 flex items-center gap-3 font-mono text-[10px] tracking-[0.25em] text-gray-500">
        <span ref={countRef} className="tabular-nums text-orange-500/80">01 / 04</span>
        <div className="flex-1 h-px bg-gray-800 overflow-hidden">
          <div ref={barRef} className="h-full bg-orange-500 origin-left" style={{ transform: 'scaleX(0)' }} />
        </div>
      </div>
    </div>
  );
};
