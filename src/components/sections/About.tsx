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

/** "Sobre mí": editorial, typography-led (no boxes), animated with GSAP ScrollTrigger. */
export const About = ({ t }: { t: any; scrollTo?: (id: string) => void }) => {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set('.reveal-word', { opacity: 1 });
        return;
      }
      // Statement: words light up with the scroll (scrubbed)
      gsap.to('.reveal-word', {
        opacity: 1,
        ease: 'none',
        stagger: 0.08,
        scrollTrigger: { trigger: '.about-statement', start: 'top 82%', end: 'bottom 45%', scrub: 0.5 },
      });
      // Blocks: rise in, in order, when they enter the screen
      gsap.set('.about-fade', { opacity: 0, y: 32 });
      ScrollTrigger.batch('.about-fade', {
        start: 'top 90%',
        once: true,
        onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12, overwrite: true }),
      });
      // Stats count up when they appear
      gsap.utils.toArray<HTMLElement>('.about-count').forEach((el) => {
        const end = Number(el.dataset.to);
        const obj = { v: 0 };
        el.textContent = '0';
        gsap.to(obj, {
          v: end,
          duration: 1.4,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
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

  return (
    <section id="about" className="w-full relative py-20 lg:py-28 px-5 sm:px-8 lg:px-10">
      <div ref={rootRef} className="max-w-[85rem] mx-auto w-full">
        {/* Eyebrow */}
        <h2 className="about-fade font-mono text-sm sm:text-base text-gray-400 flex items-center gap-3 mb-8 lg:mb-12">
          <span className="text-orange-500 font-bold">&gt;_</span>
          <span className="uppercase tracking-[0.3em]">{t.about_title}</span>
          <span className="h-px flex-1 max-w-[160px] bg-gradient-to-r from-gray-700 to-transparent" />
        </h2>

        {/* Statement */}
        <p className="about-statement max-w-5xl text-[1.65rem] leading-[1.25] sm:text-4xl lg:text-[3.1rem] lg:leading-[1.15] font-semibold tracking-tight text-white">
          <RevealStatement k="about_statement" />
        </p>

        <div className="mt-14 lg:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Identity */}
          <div className="about-fade lg:col-span-4">
            <div className="flex items-center gap-5 lg:flex-col lg:items-start">
              <div className="relative shrink-0 w-24 h-24 sm:w-28 sm:h-28 lg:w-40 lg:h-40">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-orange-500/60 via-transparent to-blue-500/40" />
                <img
                  src="/projets/fotoFacu.jpeg"
                  alt="Facundo Thibaut"
                  className="relative w-full h-full rounded-full object-cover object-top border-2 border-[#111115]"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">Facundo Thibaut</p>
                <p className="mt-1 font-mono text-xs sm:text-sm text-orange-400/90">
                  <StableText k="hero_title" />
                </p>
              </div>
            </div>

            <dl className="mt-8 font-mono text-[13px] border-t border-gray-800">
              {meta.map((m) => (
                <div key={m.k} className="flex items-center justify-between gap-4 py-3.5 border-b border-gray-800">
                  <dt className="text-[10px] uppercase tracking-[0.25em] text-gray-500">{m.k}</dt>
                  <dd className="text-right">{m.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Story */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12 content-start">
            <div className="about-fade space-y-4">
              <Label n="01">{t.about_label_who}</Label>
              <p className="text-gray-300 text-[15px] sm:text-base leading-relaxed">
                <StableText k="about_whoami_desc" />
              </p>
            </div>
            <div className="about-fade space-y-4">
              <Label n="02">{t.about_label_philo}</Label>
              <p className="text-gray-300 text-[15px] sm:text-base leading-relaxed">
                <StableText k="about_mission_desc_1" />
              </p>
            </div>

            {/* Stats */}
            <div className="about-fade md:col-span-2 grid grid-cols-3 border-t border-gray-800 pt-8">
              {stats.map((s, i) => (
                <div key={i} className={`flex flex-col gap-2 ${i > 0 ? 'pl-4 sm:pl-8 border-l border-gray-800' : ''}`}>
                  <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight tabular-nums">
                    {s.to === null ? (
                      s.text
                    ) : (
                      <>
                        <span className="about-count" data-to={s.to}>{s.to}</span>
                        <span className="text-orange-500">{s.suffix}</span>
                      </>
                    )}
                  </span>
                  <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-gray-500 leading-snug">
                    <StableText k={s.labelKey} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
