import { useLayoutEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { translations } from '../../data/translations';
import { useLang, StableText, type Lang } from '../../data/lang';
import { SKILL_TOTAL } from '../SkillSphere';

gsap.registerPlugin(ScrollTrigger);

const LANGS: Lang[] = ['en', 'es'];

/**
 * Statement split into words; every language is stacked in the same cell (height never changes
 * when switching language) and the words light up one by one as you scroll.
 */
const RevealStatement = ({ k }: { k: string }) => {
  const lang = useLang();
  return (
    <span className="grid">
      {LANGS.map((l) => (
        <span key={l} className={l === lang ? '' : 'invisible'} style={{ gridArea: '1 / 1' }} aria-hidden={l !== lang}>
          {((translations[l] as Record<string, string>)[k] ?? '').split(' ').map((w, i) => (
            <span key={i} className="reveal-word inline-block mr-[0.28em] opacity-[0.14]">
              {w}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
};

const Label = ({ n, children }: { n: string; children: ReactNode }) => (
  <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-gray-500">
    <span className="text-orange-500">{n}</span>
    <span className="h-px w-8 bg-gray-700" />
    {children}
  </p>
);

/**
 * "Sobre mí": title + statement scroll normally; from the photo on, the screen pins and the
 * panels travel sideways while you scroll down (GSAP ScrollTrigger horizontal scroll).
 */
export const About = ({ t }: { t: any; scrollTo?: (id: string) => void }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!root || !pin || !track) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set('.reveal-word', { opacity: 1 });
        return;
      }
      // Statement: words light up with the scroll
      gsap.to('.reveal-word', {
        opacity: 1,
        ease: 'none',
        stagger: 0.08,
        scrollTrigger: { trigger: '.about-statement', start: 'top 82%', end: 'bottom 45%', scrub: 0.5 },
      });

      // Horizontal scroll: pin the stage, move the track sideways as you scroll down
      const distance = () => Math.max(0, track.scrollWidth - pin.clientWidth);
      const move = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: pin,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => { if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`; },
        },
      });

      // Each panel's content drifts in as it travels into view (inside the horizontal movement)
      gsap.utils.toArray<HTMLElement>('.about-panel-inner').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0.15, x: 80 },
          {
            opacity: 1,
            x: 0,
            ease: 'none',
            scrollTrigger: { trigger: el, containerAnimation: move, start: 'left 95%', end: 'left 45%', scrub: true },
          },
        );
      });

      // Stats count up when their panel arrives
      gsap.utils.toArray<HTMLElement>('.about-count').forEach((el) => {
        const end = Number(el.dataset.to);
        const obj = { v: 0 };
        el.textContent = '0';
        gsap.to(obj, {
          v: end,
          duration: 1.4,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, containerAnimation: move, start: 'left 85%', once: true },
          onUpdate: () => { el.textContent = String(Math.round(obj.v)); },
        });
      });
    }, root);

    const id = window.setTimeout(() => ScrollTrigger.refresh(), 500);
    return () => { window.clearTimeout(id); ctx.revert(); };
  }, []);

  const meta = [
    { k: t.about_role, v: <span className="text-[#61afef]">{t.about_dev_role}</span> },
    { k: t.about_location, v: <span className="text-gray-200">{t.about_location_val}</span> },
    {
      k: t.about_status,
      v: (
        <span className="inline-flex items-center gap-2 text-emerald-400">
          <span className="relative flex w-2 h-2">
            <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
            <span className="relative w-2 h-2 rounded-full bg-emerald-400" />
          </span>
          {t.about_status_val}
        </span>
      ),
    },
  ];

  const stats = [
    { to: 4 as number | null, suffix: '+', text: '', labelKey: 'metric_exp_long' },
    { to: SKILL_TOTAL as number | null, suffix: '', text: '', labelKey: 'metric_tech_long' },
    { to: null as number | null, suffix: '', text: '∞', labelKey: 'metric_caf_long' },
  ];

  // Panel shell: wide, no box — just a thin divider on the left and a big index number
  const panel = 'about-panel relative shrink-0 w-[86vw] sm:w-[72vw] lg:w-[58vw] max-w-[860px] h-full flex items-center pl-6 sm:pl-10 lg:pl-14 border-l border-gray-800';
  const bigIndex = 'absolute top-[8%] right-4 sm:right-8 font-mono font-black text-[22vw] sm:text-[12rem] leading-none text-white/[0.03] select-none pointer-events-none';

  return (
    <section id="about" className="w-full relative pt-20 lg:pt-28 overflow-x-clip">
      <div ref={rootRef}>
        <div className="max-w-[85rem] mx-auto w-full px-5 sm:px-8 lg:px-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-mono text-gray-200 font-bold flex items-center gap-3 sm:gap-4 mb-8 lg:mb-12">
            <span className="text-orange-500 font-bold">&gt;_</span>
            {t.about_title}
          </h2>
          <p data-grid-shield className="about-statement max-w-5xl text-[1.65rem] leading-[1.25] sm:text-4xl lg:text-[3.1rem] lg:leading-[1.15] font-semibold tracking-tight text-white">
            <RevealStatement k="about_statement" />
          </p>
        </div>

        {/* Pinned stage: the track moves sideways while you scroll */}
        <div ref={pinRef} className="relative h-[100svh] w-full overflow-hidden">
          <div className="absolute inset-x-0 top-[12%] bottom-[14%] flex items-center">
            <div ref={trackRef} className="flex h-full items-stretch gap-0 pl-5 sm:pl-8 lg:pl-[max(2.5rem,calc((100vw-85rem)/2+2.5rem))] pr-[14vw] will-change-transform">
              {/* 1 — Identity */}
              <div className={panel} style={{ borderLeft: 'none', paddingLeft: 0 }}>
                <div data-grid-shield className="about-panel-inner w-full max-w-md">
                  <div className="relative w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44 mb-6">
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-orange-500/60 via-transparent to-blue-500/40" />
                    <img src="/projets/fotoFacu.jpeg" alt="Facundo Thibaut" className="relative w-full h-full rounded-full object-cover object-top border-2 border-[#111115]" />
                  </div>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">Facundo Thibaut</p>
                  <p className="mt-1 font-mono text-xs sm:text-sm text-orange-400/90"><StableText k="hero_title" /></p>
                  <dl className="mt-6 font-mono text-[13px] border-t border-gray-800">
                    {meta.map((m) => (
                      <div key={m.k} className="flex items-center justify-between gap-4 py-3 border-b border-gray-800">
                        <dt className="text-[10px] uppercase tracking-[0.25em] text-gray-500">{m.k}</dt>
                        <dd className="text-right">{m.v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>

              {/* 2 — Who I am */}
              <div className={panel}>
                <span className={bigIndex} aria-hidden>01</span>
                <div data-grid-shield className="about-panel-inner relative space-y-5 max-w-xl">
                  <Label n="01">{t.about_label_who}</Label>
                  <p className="text-gray-200 text-lg sm:text-xl lg:text-2xl leading-relaxed font-medium">
                    <StableText k="about_whoami_desc" />
                  </p>
                </div>
              </div>

              {/* 3 — Philosophy */}
              <div className={panel}>
                <span className={bigIndex} aria-hidden>02</span>
                <div data-grid-shield className="about-panel-inner relative space-y-5 max-w-xl">
                  <Label n="02">{t.about_label_philo}</Label>
                  <p className="text-gray-200 text-lg sm:text-xl lg:text-2xl leading-relaxed font-medium">
                    <StableText k="about_mission_desc_1" />
                  </p>
                </div>
              </div>

              {/* 4 — Numbers */}
              <div className={panel}>
                <span className={bigIndex} aria-hidden>03</span>
                <div data-grid-shield className="about-panel-inner relative w-full max-w-xl flex flex-col gap-8">
                  {stats.map((s, i) => (
                    <div key={i} className="flex items-baseline gap-5 border-b border-gray-800 pb-6 last:border-b-0">
                      <span className="w-28 sm:w-36 shrink-0 text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight tabular-nums">
                        {s.to === null ? s.text : (<><span className="about-count" data-to={s.to}>{s.to}</span><span className="text-orange-500">{s.suffix}</span></>)}
                      </span>
                      <span className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-gray-500 leading-snug">
                        <StableText k={s.labelKey} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="absolute left-5 sm:left-8 lg:left-10 right-5 sm:right-8 lg:right-24 bottom-[6%] flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.3em] text-gray-600">
            <span>scroll</span>
            <div className="flex-1 h-px bg-gray-800 overflow-hidden">
              <div ref={barRef} className="h-full bg-orange-500 origin-left" style={{ transform: 'scaleX(0)' }} />
            </div>
            <span className="text-orange-500/70">→</span>
          </div>
        </div>
      </div>
    </section>
  );
};
