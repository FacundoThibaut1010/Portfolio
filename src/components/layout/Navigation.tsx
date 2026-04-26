import { useState, useEffect } from 'react';

import { Cpu, Folder, Phone, Menu, X } from 'lucide-react';



export const Navigation = ({ t, activeSection, scrollTo, sections, lang, setLang }: { t: any, activeSection: string, scrollTo: (id: string) => void, sections: string[], lang?: 'en' | 'es', setLang?: (lang: 'en' | 'es') => void }) => {

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);



  useEffect(() => {

    const handleScroll = () => setScrolled(window.scrollY > 20);

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);

  }, []);



  return (

    <>

      {/* --- 1. DESKTOP NAVIGATION (Lado derecho, fijo) --- */}

      <div className="fixed right-8 top-1/2 -translate-y-1/2 flex-col items-center z-50 mix-blend-screen hidden lg:flex">

        <div className="absolute w-px bg-gray-800 top-4 bottom-24 -z-10"></div>

        {sections.map((sec) => {

          const isActive = activeSection === sec;

          const iconMap: { [key: string]: React.ReactNode } = {

            hero: <span className="text-orange-500 font-mono text-sm font-bold tracking-tighter">&lt;/&gt;</span>,

            about: <span className="text-orange-500 font-mono text-xs font-bold pl-1">&gt;_</span>,

            skills: <Cpu className="w-5 h-5 text-orange-500" />,

            work: <Folder className="w-5 h-5 text-orange-500" />,

            contact: <Phone className="w-5 h-5 text-orange-500" />,

          };



          return (

            <div key={sec} className="relative group w-16 h-16 flex items-center justify-center">

              <div className="absolute right-14 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center justify-center bg-[#1e1e24] border border-gray-700/50 rounded-md px-4 py-2 shadow-xl whitespace-nowrap">

                <span className="text-orange-500 font-mono text-sm mr-2 font-bold">&gt;</span>

                <span className="text-gray-300 text-sm font-semibold capitalize font-mono tracking-widest">{t[`nav_${sec}`]}</span>

              </div>

              {isActive ? (

                <div className="relative flex items-center justify-center w-full h-full">

                  <div className="absolute inset-1 rounded-full border border-orange-500/50 border-dashed animate-[spin_10s_linear_infinite]"></div>

                  <div className="w-10 h-10 rounded-full bg-[#1e1e24] border-[3px] border-orange-500 flex items-center justify-center z-10 shadow-[0_0_20px_rgba(249,115,22,0.4)]">

                    {iconMap[sec] || iconMap.hero}

                  </div>

                </div>

              ) : (

                <button

                  onClick={() => scrollTo(sec)}

                  className="w-4 h-4 rounded-full bg-[#2a2a30] hover:bg-orange-500/50 border border-gray-800 transition-colors z-10"

                ></button>

              )}

            </div>

          );

        })}

        {/* Avatar al final del Nav de Desktop */}

        <div className="mt-12 relative w-16 h-16 flex items-center justify-center group cursor-pointer" onClick={() => scrollTo('contact')}>

          <div className="absolute inset-0 rounded-full border border-orange-500/30 border-dotted animate-[spin_15s_linear_infinite]"></div>

          <div className="w-14 h-14 rounded-full bg-[#111115] border border-gray-700 overflow-hidden z-10 p-0.5 group-hover:border-orange-500 transition-colors">

            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4" className="w-full h-full rounded-full object-cover grayscale brightness-90 contrast-125" alt="Profile" />

          </div>

        </div>

      </div>



      {/* --- 1. DESKTOP NAVIGATION (Dejalo como estaba) --- */}

      {/* ... acá va tu código de desktop ... */}



      {/* --- HEADER MOBILE REFINADO --- */}

      {/* --- HEADER MOBILE REFINADO --- */}

      <nav className={`fixed top-0 left-0 right-0 z-[100] lg:hidden transition-all duration-500 ${scrolled

        ? 'bg-[#0f0f12]/90 backdrop-blur-xl border-b border-gray-800/50 py-3'

        : 'bg-transparent py-5' // Más transparente y alto cuando está arriba

        }`}>

        <div className="flex items-center justify-between px-6">

          {/* Lado Izquierdo: Solo el Logo P cuando no hay scroll para no saturar */}

          <div className="flex items-center gap-3">

            <div className={`w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-transform ${!scrolled && 'scale-90 opacity-80'}`}>

              <span className="text-[#0f0f12] font-mono font-black text-lg">P</span>

            </div>



            {/* El texto solo aparece cuando el usuario baja, para dejar limpio el inicio */}

            {scrolled && (

              <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-300">

                <span className="text-white font-mono text-[10px] font-bold tracking-[0.2em] uppercase">Señor Pivaudo</span>

                <span className="text-orange-500 font-mono text-[9px] font-medium uppercase tracking-widest opacity-80">

                  {t[`nav_${activeSection}`] || activeSection}

                </span>

              </div>

            )}

          </div>



          {/* Botón de Menú más sutil */}

          <button

            onClick={() => setIsMobileOpen(!isMobileOpen)}

            className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all ${scrolled

              ? 'bg-gray-800/40 border border-gray-700/50 text-orange-500'

              : 'bg-white/5 border border-white/10 text-white/70'

              } active:scale-90`}

          >

            {isMobileOpen ? <X size={22} /> : <Menu size={22} />}

          </button>

        </div>

      </nav>







      {/* --- 3. MOBILE OVERLAY --- */}

      {isMobileOpen && (

        <div className="fixed inset-0 z-[150] bg-[#0f0f12] lg:hidden flex flex-col items-center justify-center">

          <button onClick={() => setIsMobileOpen(false)} className="absolute top-6 right-6 text-orange-500">

            <X size={32} />

          </button>

          <div className="flex flex-col items-center space-y-8">

            {sections.map((sec, idx) => (

              <button

                key={sec}

                onClick={() => { scrollTo(sec); setIsMobileOpen(false); }}

                className={`text-3xl font-mono tracking-widest uppercase ${activeSection === sec ? 'text-orange-500 font-black' : 'text-gray-500'}`}

              >

                <span className="text-orange-500/30 mr-4">0{idx + 1}</span>

                {t[`nav_${sec}`]}

              </button>

            ))}

            {lang && setLang && (

              <div className="mt-8 flex items-center bg-gray-900 border border-gray-800 rounded-full p-1">

                <button onClick={() => setLang('en')} className={`px-6 py-2 rounded-full text-xs font-mono ${lang === 'en' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}>EN</button>

                <button onClick={() => setLang('es')} className={`px-6 py-2 rounded-full text-xs font-mono ${lang === 'es' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}>ES</button>

              </div>

            )}

          </div>

        </div>

      )}

    </>

  );

}