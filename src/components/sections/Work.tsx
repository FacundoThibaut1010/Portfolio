import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Folder, ExternalLink, X, ArrowUpRight } from 'lucide-react';
import { containerVariants, itemVariants } from '../../utils/animations';
import { getProjects, Project } from '../../data/projects';
import { LaptopMockup } from '../ui/LaptopMockup';
import { LivePreview } from '../ui/LivePreview';
import { EffectsToggles } from '../ui/EffectsToggles';
import { translations } from '../../data/translations';
import { StableText } from '../../data/lang';
import { scrollToId, jumpToTop } from '../../utils/smoothScroll';

// Icons that need extra scale inside their container
const TECH_ICON_SCALE: Record<string, string> = {
  'Vite': 'scale-[1.3]',
};

const TECH_ICONS: Record<string, string> = {
  'Java': '/projets/java-logo-Photoroom.png',
  'HTML': '/projets/html5_23403-Photoroom.png',
  'CSS': '/projets/css-icon5555.logowik.com-Photoroom.png',
  'Javascript': '/projets/kisspng-javascript-clip-art-openclipart-logo-number-1713949408965-Photoroom.png',
  'JavaScript': '/projets/kisspng-javascript-clip-art-openclipart-logo-number-1713949408965-Photoroom.png',
  'Spring mvc': '/projets/spring-Photoroom.png',
  'MySql': '/projets/mysql-6-logo-png-transparent-Photoroom.png',
  'React': '/projets/react-logo-png_seeklogo-507247-Photoroom.png',
  'React.js': '/projets/react-logo-png_seeklogo-507247-Photoroom.png',
  'TypeScript': '/projets/png-transparent-angularjs-typescript-javascript-vue-js-others-blue-angle-text-thumbnail-Photoroom.png',
  'Node.js': '/projets/87-879058_formation-node-js-node-js-logo-vector-Photoroom.png',
  'Angular': '/projets/java-logo-angular-angularjs-software-testing-template-computer-icons-computer-font-ppt-png-clipart-thumbnail-Photoroom.png',
  'Python': '/projets/hd-python-logo-symbol-transparent-png-735811696257415dbkifcuokn-Photoroom.png',
  'MySQL': '/projets/mysql-6-logo-png-transparent-Photoroom.png',
  'SQLite': '/projets/sqlite.png',
  'Framer Motion': '/projets/frameMotion.png',
  'Vite': '/projets/vite.png',
  'Next.js': '/projets/next.js.png',
  'Tailwind CSS': '/projets/tailwin css.png',
  'Supabase': '/projets/superbase.png',
  'Gemini API': '/projets/gimini api.png',
};

// Studio-style laptop mockup when the project has one, otherwise its original image
const ProjectVisual = ({ project, className = '' }: { project: Project; className?: string }) =>
  project.mockup ? (
    <LaptopMockup
      screen={project.mockup.screen}
      phoneScreen={project.mockup.phoneScreen}
      layout={project.mockup.layout}
      alt={project.name}
      scene={project.mockup.scene}
      angle={project.mockup.angle}
      glow={project.mockup.glow}
      className={className}
    />
  ) : (
    <img src={project.image} alt={project.name} decoding="async" draggable={false} className={`w-full h-full object-cover pointer-events-none ${className}`} />
  );

/**
 * Phones: big swipeable cards. The centered card is selected automatically while swiping;
 * tap a card to select it (shows its details below), tap the selected one again to open it.
 */
const MobileCarousel = ({
  projects,
  selected,
  onSelect,
  onOpen,
  tapLabel,
}: {
  projects: Project[];
  selected: number;
  onSelect: (i: number) => void;
  onOpen: (i: number) => void;
  tapLabel: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio >= 0.6) onSelectRef.current(Number((e.target as HTMLElement).dataset.idx));
        });
      },
      { root, threshold: [0.6] },
    );
    root.querySelectorAll('[data-idx]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [projects.length]);

  return (
    <div className="w-[calc(100%+2.5rem)] sm:w-[calc(100%+4rem)] -mx-5 sm:-mx-8">
      <div
        ref={ref}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory px-[11vw] py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {projects.map((p, i) => {
          const active = i === selected;
          return (
            <button
              key={i}
              data-idx={i}
              type="button"
              aria-label={p.name}
              onClick={(e) => {
                if (active) onOpen(i);
                else {
                  onSelect(i);
                  e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                }
              }}
              className={`relative snap-center shrink-0 w-[78vw] max-w-[380px] aspect-[4/3] rounded-2xl overflow-hidden transition-[transform,opacity,box-shadow] duration-300 ease-out ${
                active
                  ? 'scale-100 opacity-100 shadow-[0_0_0_1px_rgba(255,255,255,0.18),0_20px_40px_-18px_rgba(0,0,0,0.9)]'
                  : 'scale-[0.92] opacity-55 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]'
              }`}
            >
              <ProjectVisual project={p} />
              <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <span className="absolute left-3 bottom-3 font-mono text-[11px] font-bold text-orange-400 tracking-widest bg-black/70 border border-orange-500/30 rounded-md px-2 py-1">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                className={`absolute right-3 bottom-3 flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-black bg-orange-500 rounded-full pl-3 pr-2 py-1 transition-[opacity,transform] duration-300 ${
                  active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                {tapLabel} <ArrowUpRight size={14} />
              </span>
            </button>
          );
        })}
      </div>
      {/* Position dots */}
      <div className="flex justify-center gap-1.5 mt-1">
        {projects.map((_, i) => (
          <span key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === selected ? 'w-5 bg-orange-500' : 'w-1.5 bg-gray-700'}`} />
        ))}
      </div>
    </div>
  );
};

export const Work = ({ t, setIsProjectOpen, lang, setLang }: { t: any, setIsProjectOpen: (val: boolean) => void, lang: 'en' | 'es', setLang: (l: 'en' | 'es') => void }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mobileSel, setMobileSel] = useState(0);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [windowWidth, setWindowWidth] = useState(375);
  const [windowHeight, setWindowHeight] = useState(800);
  const detailRef = useRef<HTMLDivElement>(null);
  const touchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressed = useRef(false);
  const touchHandled = useRef(false);

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      setIsMobile(w < 640);
      setWindowWidth(w);
      setWindowHeight(window.innerHeight);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // While a project is open the page shows only that project, so page progress = reading progress
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const projects = getProjects(t);
  // Both languages, so long descriptions can reserve the height of the longest one
  const projectsEn = getProjects(translations.en);
  const projectsEs = getProjects(translations.es);

  const BIG = 'clamp(2.2rem, min(10vw, 15vh), 12rem)';
  const fitName = (name: string) => `min(${BIG}, calc(100cqw / ${(Math.max(name.length, 4) * 0.62).toFixed(2)}))`;

  // Desktop thumbnail sizes (smaller on tablets so the expanded card never overflows)
  const dNorm = windowWidth < 1024 ? 110 : 145;
  const dExpW = Math.min(windowWidth < 1024 ? 300 : 380, Math.floor((windowHeight * 0.42) / 0.737));
  const dExpH = Math.round(dExpW * 0.737);

  // Responsive thumbnail sizes — dynamic for any number of projects
  const thumbPad = 48;               // px-6 * 2
  const thumbGap = 16;               // gap-4
  const numProjects = projects.length;
  const totalGaps = thumbGap * (numProjects - 1);
  const thumbsArea = windowWidth - thumbPad - totalGaps;
  const mThumbExp = Math.max(140, Math.floor(thumbsArea * 0.60));
  const mThumbNorm = Math.max(36, Math.floor((thumbsArea - mThumbExp) / (numProjects - 1)));
  const selectedProject = selectedProjectIndex !== null ? projects[selectedProjectIndex] : null;
  const activeIdx: number | null = isMobile ? mobileSel : hoveredIndex;

  useEffect(() => { setIsProjectOpen(false); }, []);

  const handleSelect = (i: number) => {
    setSelectedProjectIndex(i);
    setIsProjectOpen(true);
    // The other sections disappear: start the project at the top so the progress line begins at 0
    jumpToTop();
  };

  const handleClose = () => {
    setSelectedProjectIndex(null);
    setHoveredIndex(null);
    setIsProjectOpen(false);
    // Sections above re-mount on close: jump straight back to this section once they're laid out
    scrollToId('work', { immediate: true });
  };

  return (
    <section id="work" className="w-full flex flex-col justify-start pt-16 pb-16 md:pb-28 md:pt-16 px-5 sm:px-8 lg:px-10 relative z-10">
      <div className="max-w-[85rem] mx-auto w-full">
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" className="space-y-8 lg:space-y-10">

          {/* Section header */}
          <motion.h2 data-scroll-anchor variants={itemVariants} className={`text-3xl sm:text-4xl lg:text-5xl font-mono text-gray-200 font-bold items-center gap-3 sm:gap-4 ${selectedProject ? 'hidden' : 'flex'}`}>
            <Folder size={36} className="text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.3)]" />
            <span className="text-orange-500 font-bold">$</span>
            <StableText k="work_title" />
          </motion.h2>

          <AnimatePresence mode="wait">

            {/* ── THUMBNAIL VIEW ── */}
            {selectedProject === null && (
              <motion.div
                key="thumbnails"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-0"
              >
                {isMobile ? (
                  <MobileCarousel
                    projects={projects}
                    selected={mobileSel}
                    onSelect={setMobileSel}
                    onOpen={handleSelect}
                    tapLabel={t.work_tap_open}
                  />
                ) : (
                <>
                {/* Row keeps the expanded height reserved, so hovering never pushes the page */}
                <div
                  className="flex items-center justify-center gap-3 sm:gap-4 z-10 relative w-full"
                  style={{ height: isMobile ? Math.floor(mThumbExp * 0.75) : dExpH }}
                >
                  {projects.map((project, i) => {
                    const isHov = hoveredIndex === i;
                    const isDim = hoveredIndex !== null && !isHov;
                    return (
                      <motion.div
                        key={i}
                        className="relative cursor-pointer overflow-hidden rounded-2xl shrink-0 select-none"
                        style={{
                          WebkitTouchCallout: 'none' as any,
                          boxShadow: isHov
                            ? '0 0 0 2px rgba(249,115,22,0.7), 0 20px 50px -15px rgba(249,115,22,0.35)'
                            : '0 0 0 1px rgba(255,255,255,0.08)',
                          transition: 'box-shadow 0.35s ease',
                        }}
                        animate={{
                          width: isHov ? (isMobile ? mThumbExp : dExpW) : (isMobile ? mThumbNorm : dNorm),
                          height: isHov ? (isMobile ? Math.floor(mThumbExp * 0.75) : dExpH) : (isMobile ? mThumbNorm : dNorm),
                        }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        onContextMenu={(e) => e.preventDefault()}
                        onTouchStart={() => {
                          longPressed.current = false;
                          if (touchTimer.current) clearTimeout(touchTimer.current);
                          touchTimer.current = setTimeout(() => {
                            longPressed.current = true;
                            setHoveredIndex(i);
                          }, 450);
                        }}
                        onTouchMove={() => {
                          if (touchTimer.current) { clearTimeout(touchTimer.current); touchTimer.current = null; }
                        }}
                        onTouchEnd={() => {
                          if (touchTimer.current) { clearTimeout(touchTimer.current); touchTimer.current = null; }
                          touchHandled.current = true;
                          if (!longPressed.current) handleSelect(i);
                          longPressed.current = false;
                          setTimeout(() => { touchHandled.current = false; }, 600);
                        }}
                        onClick={() => {
                          if (touchHandled.current) return;
                          handleSelect(i);
                        }}
                      >
                        <ProjectVisual
                          project={project}
                          className={`pointer-events-none transition-transform duration-700 ease-out will-change-transform ${isHov ? 'scale-[1.04]' : 'scale-100'}`}
                        />
                        {/* Dim the others while one is focused */}
                        <div
                          className="absolute inset-0 bg-[#0b0b0e] pointer-events-none transition-opacity duration-300"
                          style={{ opacity: isDim ? 0.55 : 0 }}
                        />
                        <AnimatePresence>
                          {isHov && (
                            <motion.div
                              initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.12, duration: 0.25 } }} exit={{ opacity: 0, transition: { duration: 0.12 } }}
                              className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent flex items-end justify-between p-3 sm:p-4"
                            >
                              <span className="font-mono text-[11px] font-bold text-orange-400 tracking-widest bg-black/70 border border-orange-500/30 rounded-md px-2 py-1">
                                {String(i + 1).padStart(2, '0')}
                              </span>
                              {!isMobile && (
                                <span className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-black bg-orange-500 rounded-full pl-3 pr-2 py-1">
                                  {t.work_open} <ArrowUpRight size={14} />
                                </span>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
                </>
                )}

                {/* Giant label — single line, auto-fits long names, fixed height */}
                <div
                  data-grid-shield
                  className="w-full relative overflow-hidden pointer-events-none mt-4 sm:mt-3"
                  style={{ containerType: 'inline-size', height: `calc(${BIG} * 0.95)` } as React.CSSProperties}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                      key={activeIdx ?? 'default'}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 0.18 }}
                      className="absolute inset-0 flex items-center justify-center font-mono font-black tracking-tighter leading-none whitespace-nowrap select-none"
                      style={{
                        fontSize: fitName(activeIdx !== null ? projects[activeIdx].name : t.work_big_label),
                        color: activeIdx !== null ? '#f97316' : (isMobile ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'),
                      }}
                    >
                      {activeIdx !== null ? projects[activeIdx].name.toUpperCase() : t.work_big_label}
                    </motion.p>
                  </AnimatePresence>
                </div>

                {/* Info strip — fixed height: shows the hovered project's details or a hint */}
                <div data-grid-shield className="w-full max-w-3xl h-[8.5rem] sm:h-[6.5rem] mt-3 relative">
                  <AnimatePresence mode="wait" initial={false}>
                    {activeIdx !== null ? (
                      <motion.div
                        key={`info-${activeIdx}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18 }}
                        className="absolute inset-0 flex flex-col items-center text-center gap-2.5"
                      >
                        {/* Numbers on their own line, technologies below */}
                        <div className="flex flex-col items-center gap-2 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em]">
                          <span className="text-orange-500 font-bold">
                            {String(activeIdx + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
                          </span>
                          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                            {projects[activeIdx].tech.slice(0, 4).map((tech: string) => (
                              <span key={tech} className="text-gray-400 border border-gray-800 bg-gray-900/60 rounded-full px-2.5 py-0.5 tracking-[0.12em]">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-400 text-xs sm:text-sm font-mono leading-relaxed line-clamp-2 max-w-2xl">
                          {projects[activeIdx].desc}
                        </p>
                      </motion.div>
                    ) : (
                      <motion.p
                        key="hint"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="absolute inset-x-0 top-1 text-center font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-gray-600"
                      >
                        {isMobile ? t.work_hint_touch : t.work_hint}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* ── DETAIL VIEW ── */}
            {selectedProject !== null && (
              <motion.div
                key={`detail-${selectedProjectIndex}`}
                ref={detailRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="relative"
              >
                {/* Scroll progress bar — vertical, fixed left */}
                <div className="fixed left-0 top-0 h-screen z-50 w-[3px] bg-gray-900/40">
                  <motion.div className="w-full bg-orange-500 absolute top-0 left-0" style={{ height: progressWidth }} />
                </div>

                {/* Project top nav bar — same style as main mobile nav */}
                <div className="fixed top-0 left-0 right-0 z-[200] bg-[#0f0f12]/95 border-b border-gray-800/60 py-3 px-5 flex items-center justify-between">
                  {/* Close button — left */}
                  <button
                    onClick={handleClose}
                    className="flex items-center gap-2 text-gray-300 hover:text-orange-500 transition-colors text-xs font-mono tracking-widest uppercase active:scale-95"
                  >
                    <X size={16} /> {t.work_modal_close}
                  </button>

                  {/* Project name — center */}
                  <span className="text-orange-500 font-mono text-[10px] font-bold uppercase tracking-widest truncate max-w-[130px] text-center">
                    {selectedProject.name}
                  </span>

                  {/* Effects + EN/ES toggle — right */}
                  <div className="flex items-center gap-2">
                  <div className="hidden sm:block"><EffectsToggles /></div>
                  <div className="flex items-center bg-gray-900/80 border border-gray-700/60 rounded-full p-1">
                    <button
                      onClick={() => setLang('en')}
                      className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold transition-all duration-300 ${lang === 'en' ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.4)]' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => setLang('es')}
                      className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold transition-all duration-300 ${lang === 'es' ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.4)]' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      ES
                    </button>
                  </div>
                  </div>
                </div>

                {/* Panel 1 — Thumbnail congelado + texto gigante (igual al hover) */}
                <div className="flex flex-col items-center gap-0 mt-20">
                  {/* Thumbnail fijo al tamaño hover — responsive on mobile */}
                  <div
                    className="relative overflow-hidden rounded-2xl w-full"
                    style={{ maxWidth: 380, height: isMobile ? 200 : 280, boxShadow: '0 0 0 2px rgba(249,115,22,0.5), 0 0 30px rgba(249,115,22,0.15)' }}
                  >
                    <ProjectVisual project={selectedProject} />
                  </div>

                  {/* Texto gigante naranja — igual al hover state */}
                  <div
                    className="w-full text-center overflow-hidden pointer-events-none mt-4"
                    style={{ containerType: 'inline-size' } as React.CSSProperties}
                  >
                    <p
                      className="font-mono font-black tracking-tighter leading-none whitespace-nowrap select-none"
                      style={{ fontSize: fitName(selectedProject.name), color: '#f97316' }}
                    >
                      {selectedProject.name.toUpperCase()}
                    </p>
                  </div>

                  <motion.p
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                    className="text-orange-500/70 font-mono text-sm tracking-widest mt-2"
                  >
                    scroll ↓
                  </motion.p>
                </div>

                {/* Panel 2 — Descripción */}
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="py-24 space-y-10"
                >
                  <div className="flex items-center">
                    <div className="shrink-0 w-9 h-9 bg-orange-500 flex items-center justify-center font-mono font-black text-black text-sm">1</div>
                    <div className="flex-1 h-px bg-orange-500/50" />
                  </div>
                  <div className="max-w-3xl space-y-6">
                    <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter">{t.work_about_project}</h3>
                    <p className="text-gray-400 text-lg md:text-xl leading-relaxed font-mono">
                      <StableText values={{ en: projectsEn[selectedProjectIndex!].longDesc, es: projectsEs[selectedProjectIndex!].longDesc }} />
                    </p>
                  </div>
                </motion.div>

                {/* Panel — Live preview (projects with a full-page capture) */}
                {(selectedProject.preview || selectedProject.live) && (
                  <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="pb-24 space-y-10"
                  >
                    <div className="flex items-center">
                      <div className="shrink-0 w-9 h-9 bg-orange-500 flex items-center justify-center font-mono font-black text-black text-sm">2</div>
                      <div className="flex-1 h-px bg-orange-500/50" />
                      <div className="shrink-0 px-4 h-9 bg-orange-500/10 border border-orange-500/40 flex items-center font-mono font-bold text-orange-500 text-xs tracking-[0.25em] uppercase">
                        {t.work_preview_title}
                      </div>
                    </div>
                    <LivePreview
                      src={selectedProject.preview}
                      live={selectedProject.live}
                      alt={selectedProject.name}
                      labels={{
                        tour: t.work_mode_tour,
                        live: t.work_mode_live,
                        hintTour: isMobile ? t.work_preview_hint_touch : t.work_preview_hint,
                        hintLive: t.work_preview_hint_live,
                      }}
                    />
                  </motion.div>
                )}

                {/* Panel 3 — Stack */}
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="pb-24 space-y-10"
                >
                  <div className="flex items-center">
                    <div className="shrink-0 w-9 h-9 bg-orange-500 flex items-center justify-center font-mono font-black text-black text-sm">{selectedProject.preview || selectedProject.live ? 3 : 2}</div>
                    <div className="flex-1 h-px bg-orange-500/50" />
                    <div className="shrink-0 px-4 h-9 bg-orange-500/10 border border-orange-500/40 flex items-center font-mono font-bold text-orange-500 text-xs tracking-[0.25em] uppercase">
                      Stack
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-6">
                    {selectedProject.tech.map((tech: string) => {
                      const src = TECH_ICONS[tech];
                      // tech not in map at all → skip
                      if (src === undefined) return null;
                      // text-only badge (empty string in map)
                      if (src === '') {
                        return (
                          <div key={tech} className="flex flex-col items-center gap-2">
                            <div className="size-20 flex items-center justify-center p-3 rounded-2xl border border-gray-800 bg-gray-900/50 hover:border-orange-500/40 transition-colors">
                              <span className="text-orange-500 font-mono font-bold text-[10px] tracking-widest text-center leading-tight uppercase">{tech}</span>
                            </div>
                            <span className="text-gray-500 font-mono text-[10px] tracking-widest uppercase">{tech}</span>
                          </div>
                        );
                      }
                      return (
                        <div key={tech} className="flex flex-col items-center gap-2">
                          <div className="size-20 flex items-center justify-center p-3 rounded-2xl border border-gray-800 bg-gray-900/50 hover:border-orange-500/40 transition-colors">
                            <img src={src} alt={tech} className={`w-full h-full object-contain ${TECH_ICON_SCALE[tech] || ''}`} />
                          </div>
                          <span className="text-gray-500 font-mono text-[10px] tracking-widest uppercase">{tech}</span>
                        </div>
                      );
                    })}
                  </div>

                  <a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-black font-bold py-4 px-8 rounded-2xl transition-colors text-base"
                  >
                    {t.work_modal_view} <ExternalLink size={20} />
                  </a>
                </motion.div>

              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
