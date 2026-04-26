import { useState, useEffect } from 'react';
import { translations, TranslationKey } from './data/translations';
import { Navigation } from './components/layout/Navigation';
import { LanguageSelector } from './components/layout/LanguageSelector';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Skills } from './components/sections/Skills';
import { Work } from './components/sections/Work';
import { Contact } from './components/sections/Contact';

const sections = ['hero', 'about', 'skills', 'work', 'contact'];

const PortfolioUI = () => {
  const [lang, setLang] = useState<'en' | 'es'>('en');
  const t = translations[lang] as any;
  const [activeSection, setActiveSection] = useState('hero');

  // ScrollSpy Optimizado para Móvil y PC
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // Bajamos la exigencia: con que un 20% de la sección sea visible, ya la activa
        if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
          setActiveSection(entry.target.id);
        }
      });
    }, {
      // Umbrales múltiples para que el sensor sea más "fino"
      threshold: [0.1, 0.2, 0.3],
      // Bajamos el margen del fondo de -60% a -40% 
      // para que detecte la sección de abajo mucho antes
      rootMargin: "-15% 0px -40% 0px"
    });

    sections.forEach((sec) => {
      const el = document.getElementById(sec);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative bg-[#111115] text-gray-300 font-sans selection:bg-orange-500/30 selection:text-orange-500 min-h-screen selection:backdrop-blur-sm overflow-x-hidden w-full">
      {/* Background Grid Pattern */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.2]"
        style={{
          backgroundImage: `linear-gradient(to right, #f9741686 1px, transparent 1px), linear-gradient(to bottom, #f9741686 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <Navigation t={t} activeSection={activeSection} scrollTo={scrollTo} sections={sections} lang={lang} setLang={setLang} />
      <div className="hidden lg:block">
        <LanguageSelector lang={lang} setLang={setLang} />
      </div>

      <div className="relative z-10 w-full flex flex-col">
        <Hero t={t} scrollTo={scrollTo} />
        <About t={t} scrollTo={scrollTo} />
        <Skills t={t} />
        <Work t={t} />
        <Contact t={t} />
      </div>

      <Footer t={t} />
    </div>
  );
};

export default PortfolioUI;
