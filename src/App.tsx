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

  const [isProjectOpen, setIsProjectOpen] = useState(false);


  const [activeSection, setActiveSection] = useState('hero');



  // ScrollSpy

  useEffect(() => {

    const observer = new IntersectionObserver((entries) => {

      // Find the most prominent intersecting entry to avoid stuck states

      entries.forEach((entry) => {

        if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
          setActiveSection(entry.target.id);
        }
      });

    }, {
      // rootMargin es la clave: 
      // "-20% 0px -40% 0px" crea una "faja" invisible en el centro 
      // de la pantalla. Cuando una sección entra ahí, el Nav se activa.
      threshold: [0.1, 0.3, 0.5],
      rootMargin: "-25% 0px -25% 0px"
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
    <div className={`relative bg-[#111115] text-gray-300 font-sans selection:bg-orange-500/30 selection:text-orange-500 min-h-screen selection:backdrop-blur-sm overflow-x-hidden w-full ${isProjectOpen ? 'md:overflow-auto overflow-hidden' : ''}`}>

      {/* Background Grid Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.2]" style={{ backgroundImage: `linear-gradient(to right, #f9741686 1px, transparent 1px), linear-gradient(to bottom, #f9741686 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      {/* MODIFICACIÓN: El Nav desaparece si isProjectOpen es true */}
      {!isProjectOpen && (
        <Navigation t={t} activeSection={activeSection} scrollTo={scrollTo} sections={sections} lang={lang} setLang={setLang} />
      )}

      <div className="hidden lg:block">
        <LanguageSelector lang={lang} setLang={setLang} />
      </div>

      <div className="relative z-10 w-full flex flex-col">
        <Hero t={t} scrollTo={scrollTo} />
        <About t={t} scrollTo={scrollTo} />
        <Skills t={t} />

        {/* MODIFICACIÓN: Pasamos el setter al componente Work */}
        <Work t={t} setIsProjectOpen={setIsProjectOpen} />

        <Contact t={t} />
      </div>

      <Footer t={t} />
    </div>
  );

};



export default PortfolioUI;