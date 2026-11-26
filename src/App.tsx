import { useState, useEffect } from 'react';

import { translations } from './data/translations';

import { initSmoothScroll, scrollToId } from './utils/smoothScroll';

import { LangContext } from './data/lang';

import { LiveGrid } from './components/ui/LiveGrid';

import { useEffects } from './data/effects';

import { Navigation } from './components/layout/Navigation';

import { LoadingScreen } from './components/LoadingScreen';

import { LanguageSelector } from './components/layout/LanguageSelector';

import { Footer } from './components/layout/Footer';

import { Hero } from './components/sections/Hero';

import { About } from './components/sections/About';

import { Skills } from './components/sections/Skills';

import { Work } from './components/sections/Work';

import { Contact } from './components/sections/Contact';



const sections = ['hero', 'about', 'skills', 'work', 'contact'];



const PortfolioUI = () => {

  const [lang, setLang] = useState<'en' | 'es'>('es');

  const t = translations[lang] as any;

  const [isProjectOpen, setIsProjectOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const { pulses } = useEffects();


  const [activeSection, setActiveSection] = useState('hero');

  // Inertial smooth scrolling (wheel / trackpad)
  useEffect(() => initSmoothScroll(), []);

  // Keep <html lang> in sync so the browser never thinks the page needs translating
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // No locking scroll — contact/footer se ocultan cuando hay proyecto abierto

  // ScrollSpy — deterministic: the active section is the one crossing a line at 40% of the screen.
  // (The old observer only compared sections whose visibility had *just changed*, so it could get stuck.)
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.4;
      let current = sections[0];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= line) current = id;
      }
      // At the very bottom the last section wins even if it's short
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) {
        const last = [...sections].reverse().find((id) => document.getElementById(id));
        if (last) current = last;
      }
      setActiveSection((prev) => (prev === current ? prev : current));
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const interval = window.setInterval(schedule, 600); // safety net (e.g. layout changes without scrolling)
    schedule();
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.clearInterval(interval);
      cancelAnimationFrame(raf);
    };
  }, [isProjectOpen]);



  const scrollTo = (id: string) => scrollToId(id);



  return (
    <LangContext.Provider value={lang}>
    <div className={`relative bg-[#111115] text-gray-300 font-sans selection:bg-orange-500/30 selection:text-orange-500 min-h-screen overflow-x-hidden w-full ${isProjectOpen ? 'md:overflow-auto overflow-hidden' : ''}`}>
      {isLoading && <LoadingScreen onComplete={(selectedLang) => { setIsLoading(false); setLang(selectedLang); }} />}

      {/* Background Grid Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.2]" style={{ backgroundImage: `linear-gradient(to right, #f9741686 1px, transparent 1px), linear-gradient(to bottom, #f9741686 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      {/* Living layer on top of the grid: pulses, cursor spotlight, click bursts */}
      <LiveGrid enabled={pulses && !isProjectOpen} />

      {/* MODIFICACIÓN: El Nav desaparece si isProjectOpen es true */}
      {!isProjectOpen && (
        <Navigation t={t} activeSection={activeSection} scrollTo={scrollTo} sections={sections} lang={lang} setLang={setLang} />
      )}

      {!isProjectOpen && (
        <div className="hidden lg:block">
          <LanguageSelector lang={lang} setLang={setLang} />
        </div>
      )}

      <div className="relative z-10 w-full flex flex-col lg:pr-[4.5rem]">
        {!isProjectOpen && <Hero t={t} lang={lang} scrollTo={scrollTo} />}
        {!isProjectOpen && <About t={t} scrollTo={scrollTo} />}
        {!isProjectOpen && <Skills t={t} />}

        {/* MODIFICACIÓN: Pasamos el setter al componente Work */}
        <Work t={t} setIsProjectOpen={setIsProjectOpen} lang={lang} setLang={setLang} />

        {!isProjectOpen && <Contact t={t} />}
      </div>

      {!isProjectOpen && <div className="lg:pr-[4.5rem]"><Footer t={t} /></div>}
    </div>
    </LangContext.Provider>
  );

};



export default PortfolioUI;