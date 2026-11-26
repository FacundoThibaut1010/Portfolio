import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';
import { SkillSphere, SkillCategory, SKILL_COUNTS, SKILL_TOTAL } from '../SkillSphere';
import { containerVariants, itemVariants } from '../../utils/animations';
import { StableText } from '../../data/lang';

const CATS: (SkillCategory | null)[] = [null, 'frontend', 'backend', 'data', 'devops'];

export const Skills = ({ t }: { t: any }) => {
  const [activeCat, setActiveCat] = useState<SkillCategory | null>(null);

  // The sphere is drawn at the real pixel size of its stage (no CSS scaling, so text and icons stay sharp).
  // On desktop it sits beside the title, so it can use almost the full screen height.
  const stageRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(420);
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      setSize(Math.max(260, Math.floor(Math.min(width, height))));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const label = (c: SkillCategory | null) => (c === null ? t.skills_cat_all : t[`skills_cat_${c}`]);
  const count = (c: SkillCategory | null) => (c === null ? SKILL_TOTAL : SKILL_COUNTS[c]);

  return (
    <section
      id="skills"
      className="w-full min-h-[100svh] flex flex-col justify-center pt-24 pb-10 lg:py-6 px-5 sm:px-8 lg:px-10 relative z-10"
    >
      <div className="max-w-[85rem] mx-auto w-full">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center"
        >
          {/* Left (desktop) / top (mobile): title, intro, filters */}
          <div className="lg:col-span-4 flex flex-col gap-5 lg:gap-7 order-1">
            <motion.h2
              variants={itemVariants}
              className="text-3xl sm:text-4xl lg:text-5xl font-mono text-gray-200 font-bold flex items-center gap-3 sm:gap-4"
            >
              <Cpu size={30} className="text-orange-500 shrink-0 drop-shadow-[0_0_15px_rgba(249,115,22,0.3)] sm:w-10 sm:h-10" />
              <span className="text-orange-500 font-bold">#</span>
              {t.skills_title}
            </motion.h2>

            <motion.p variants={itemVariants} className="hidden lg:block text-gray-400 font-mono text-sm leading-relaxed max-w-sm">
              <StableText k="skills_intro" />
            </motion.p>

            {/* Filters — vertical list on desktop */}
            <motion.div variants={itemVariants} className="hidden lg:flex flex-col gap-2 max-w-xs" role="group" aria-label={t.skills_title}>
              {CATS.map((c) => {
                const active = activeCat === c;
                return (
                  <button
                    key={c ?? 'all'}
                    onClick={() => setActiveCat(c)}
                    aria-pressed={active}
                    className={`group flex items-center justify-between gap-4 px-4 py-2.5 rounded-xl border font-mono text-xs uppercase tracking-[0.18em] text-left transition-[color,background-color,border-color,transform] duration-200 active:scale-[0.98] ${
                      active
                        ? 'border-orange-500/50 bg-orange-500/10 text-orange-400'
                        : 'border-gray-800/80 bg-black/30 text-gray-400 hover:text-gray-200 hover:border-gray-600'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`w-1.5 h-1.5 rounded-full transition-colors ${active ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]' : 'bg-gray-700 group-hover:bg-gray-500'}`} />
                      {label(c)}
                    </span>
                    <span className={`tabular-nums text-[11px] ${active ? 'text-orange-400/80' : 'text-gray-600'}`}>
                      {String(count(c)).padStart(2, '0')}
                    </span>
                  </button>
                );
              })}
            </motion.div>

            <motion.p variants={itemVariants} className="hidden lg:block text-[10px] font-mono uppercase tracking-[0.25em] text-gray-600">
              {t.skills_hint}
            </motion.p>
          </div>

          {/* Sphere */}
          <motion.div
            data-grid-shield
            variants={itemVariants}
            ref={stageRef}
            className="lg:col-span-8 order-2 w-full mx-auto aspect-square max-w-[640px] max-h-[clamp(300px,calc(100svh-15rem),640px)] lg:max-h-[min(calc(100svh-3rem),640px)] flex justify-center items-center overflow-hidden"
          >
            <SkillSphere activeCat={activeCat} size={size} compact={size < 460} />
          </motion.div>

          {/* Filters — chips under the sphere on mobile/tablet */}
          <motion.div variants={itemVariants} className="lg:hidden order-3 flex flex-col items-center gap-3">
            <div role="group" aria-label={t.skills_title} className="flex flex-wrap justify-center gap-2">
              {CATS.map((c) => {
                const active = activeCat === c;
                return (
                  <button
                    key={c ?? 'all'}
                    onClick={() => setActiveCat(c)}
                    aria-pressed={active}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border font-mono text-[11px] sm:text-xs uppercase tracking-[0.15em] transition-[color,background-color,border-color,transform] duration-200 active:scale-[0.96] ${
                      active ? 'border-orange-500/60 bg-orange-500/15 text-orange-400' : 'border-gray-800 bg-black/40 text-gray-400'
                    }`}
                  >
                    {label(c)}
                    <span className={`tabular-nums text-[10px] ${active ? 'text-orange-400/70' : 'text-gray-600'}`}>{count(c)}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.25em] text-gray-600">{t.skills_hint}</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
