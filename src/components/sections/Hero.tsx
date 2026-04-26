import { motion } from 'framer-motion';
import { ExternalLink, Play, Folder } from 'lucide-react';
import { Typewriter } from '../ui/Typewriter';

export const Hero = ({ t, scrollTo }: { t: any, scrollTo: (id: string) => void }) => {
  return (
    <section id="hero" className="min-h-screen w-full flex flex-col items-center justify-center p-6 md:p-12 relative">
      <div className="max-w-[85rem] w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col justify-center space-y-10"
        >
          {/* Status Tag */}
          <div className="inline-flex items-center gap-3 border border-orange-500/30 bg-orange-500/10 px-4 py-2 rounded-md text-xs sm:text-sm font-mono tracking-widest text-orange-500 w-fit">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-[pulse_2s_ease-in-out_infinite]"></span>
            {t.hero_status}
          </div>

          {/* Titles */}
          <div className="space-y-2">
            <h1 className="text-7xl sm:text-8xl lg:text-[90px] font-bold text-white leading-tight tracking-tight">
              {t.hero_hello}
            </h1>
            <h1 className="text-[3.5rem] sm:text-8xl lg:text-[90px] font-bold leading-tight tracking-tight bg-gradient-to-r from-orange-400 via-pink-400 to-blue-500 text-transparent bg-clip-text pb-2">
              Facundo Thibaut
            </h1>
          </div>

          {/* Description */}
          <div className="space-y-4 text-xl text-gray-400 max-w-2xl">
            <p className="flex items-center gap-3">
              <span className="text-orange-500 font-mono text-base">&lt;{t.hero_title} /&gt;</span>
              <span className="text-gray-200 font-medium">{t.hero_desc1}</span>
            </p>
            <p className="text-[17px] text-gray-400 leading-relaxed font-mono">
              {t.hero_desc2}
            </p>
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-col sm:flex-row gap-6 pt-6">
            <button onClick={() => scrollTo('about')} className="group relative flex items-center justify-between gap-5 border border-gray-700 bg-[#16161a]/80 hover:bg-[#1a1b26] rounded-2xl p-5 w-full sm:w-[380px] shadow-lg overflow-hidden transition-colors">
              <div className="flex gap-5 items-center w-full">
                <div className="bg-[#1e1e24] border border-orange-500/30 rounded-lg p-3.5 text-orange-500 flex items-center justify-center shrink-0">
                  <span className="font-mono font-bold text-base">&gt;_</span>
                </div>
                <div className="flex flex-col flex-grow text-left">
                  <div className="flex justify-between items-center w-full">
                    <span className="text-white font-bold text-[15px]">{t.hero_btn_init}</span>
                    <ExternalLink size={16} className="text-gray-500 group-hover:text-gray-300" />
                  </div>
                  <div className="flex justify-between items-center mt-2 w-full text-[12px] font-mono">
                    <span className="text-gray-500">&gt; sudo boot_gui</span>
                    <span className="text-orange-500/80">Loading...</span>
                  </div>
                  <div className="w-full h-1 bg-gray-800 rounded-full mt-3 overflow-hidden">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "65%" }}
                      transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-orange-600 to-orange-400"
                    />
                  </div>
                </div>
              </div>
            </button>

            <a
              href="https://github.com/FacundoThibaut1010"
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex items-center gap-5 border border-gray-700 bg-black/40 hover:bg-gray-800 rounded-2xl px-8 py-5 shadow-xl overflow-hidden transition-all group min-w-[240px]"
            >
              {/* Logo de fondo (SVG directo) */}
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
              </div>

              <div className="flex flex-col items-start z-10">
                <span className="text-xs text-gray-500 font-mono tracking-[0.2em] mb-1">
                  {t.hero_btn_check}
                </span>
                <span className="text-white font-bold tracking-widest flex items-center gap-3 text-lg">
                  GitHub
                  {/* Logo pequeño al lado del texto (SVG directo) */}
                  <svg className="text-gray-400 group-hover:text-white transition-colors" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                </span>
              </div>
            </a>
          </div>
        </motion.div>

        {/* IDE Visualizer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="flex items-center justify-center relative"
        >
          <div className="w-full max-w-2xl bg-[#16161a] border border-gray-700/50 rounded-[2rem] shadow-2xl overflow-hidden relative flex flex-col">

            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#1e1e24] border-b border-gray-800 shrink-0">
              <div className="flex gap-2.5">
                <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56]"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f]"></div>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400 font-mono cursor-default">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                portfolio.tsx
              </div>
              <div className="w-8 h-8 border border-gray-700 rounded flex items-center justify-center">
                <span className="text-xs font-mono text-gray-400">&lt;/&gt;</span>
              </div>
            </div>

            {/* CUERPO DEL CÓDIGO */}
            <div className="flex p-6 text-[15px] font-mono leading-[2rem] overflow-x-auto relative min-h-[420px]">
              {/* Números de línea */}
              <div className="flex flex-col text-gray-600 select-none pr-6 border-r border-gray-800 mr-6 text-right shrink-0">
                {[...Array(12)].map((_, i) => (
                  <span key={i}>{i + 1}</span>
                ))}
              </div>

              {/* Contenedor de texto animado */}
              <div className="flex flex-col whitespace-pre">
                {/* Línea 1: Comentario */}
                <div>
                  <span className="text-gray-500">// </span>
                  <span className="text-gray-500 italic">
                    <Typewriter text={t.ide_welcome} delay={500} showCursor={true} />
                  </span>
                </div>

                {/* Línea 2: Import */}
                <div>
                  <span className="text-[#c678dd]">import</span>{' '}
                  <span className="text-[#e5c07b]">&#123; Developer &#125;</span>{' '}
                  <span className="text-[#c678dd]">from</span>{' '}
                  <span className="text-[#98c379]">
                    '<Typewriter text="./universe" delay={2000} showCursor={true} />'
                  </span>
                  <span className="text-gray-400">;</span>
                </div>

                <div className="h-4"></div>

                {/* Estructura fija */}
                <div>
                  <span className="text-[#c678dd]">const</span>{' '}
                  <span className="text-[#e5c07b]">Portfolio</span>{' '}
                  <span className="text-[#56b6c2]">=</span>{' '}
                  <span className="text-[#56b6c2]">() =&gt;</span>{' '}
                  <span className="text-gray-300">&#123;</span>
                </div>

                <div className="ml-4">
                  <span className="text-[#c678dd]">return</span> <span className="text-gray-300">(</span>
                </div>

                <div className="ml-8">
                  <span className="text-gray-400">&lt;</span><span className="text-[#e5c07b]">Developer</span>
                </div>

                {/* PROPS: Nota que las comillas están VACÍAS, el Typewriter las llena */}
                <div className="ml-12">
                  <span className="text-[#e06c75]">{t.ide_prop_name}</span><span className="text-[#56b6c2]">=</span>
                  <span className="text-[#98c379]">"</span>
                  <span className="text-[#98c379]"><Typewriter text={t.ide_val_name} delay={3500} showCursor={true} /></span>
                  <span className="text-[#98c379]">"</span>
                </div>

                <div className="ml-12">
                  <span className="text-[#e06c75]">{t.ide_prop_role}</span><span className="text-[#56b6c2]">=</span>
                  <span className="text-[#98c379]">"</span>
                  <span className="text-[#98c379]"><Typewriter text={t.ide_val_role} delay={5200} showCursor={true} /></span>
                  <span className="text-[#98c379]">"</span>
                </div>

                <div className="ml-12">
                  <span className="text-[#e06c75]">{t.ide_prop_passion}</span><span className="text-[#56b6c2]">=</span>
                  <span className="text-[#98c379]">"</span>
                  <span className="text-[#98c379]"><Typewriter text={t.ide_val_passion} delay={7000} showCursor={true} /></span>
                  <span className="text-[#98c379]">"</span>
                </div>

                {/* Cierres */}
                <div className="ml-8 text-gray-400">/&gt;</div>
                <div className="ml-4 text-gray-300">);</div>
                <div>
                  <span className="text-gray-300">&#125;;</span>

                  {/* CURSOR FINAL: Aparece y titila para siempre después de 9.5s */}
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [1, 0] }}
                    transition={{
                      opacity: {
                        duration: 0.8,
                        repeat: Infinity,
                        ease: "steps(2)" as any,
                        delay: 9.5 // Tiempo suficiente para que termine la última letra
                      }
                    }}
                    className="inline-block w-2 h-5 bg-orange-500 ml-1 translate-y-1"
                  />
                </div>
              </div>
            </div>

            {/* FOOTER: Botones fijos abajo */}
            <div className="flex items-center gap-5 p-6 border-t border-gray-800 bg-[#16161a] mt-auto shrink-0">
              <button
                onClick={() => scrollTo('about')}
                className="flex items-center gap-3 border border-orange-500/30 text-orange-500 hover:bg-orange-500/10 rounded-xl px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-mono transition-colors"
              >
                <Play size={14} fill="currentColor" /> {t.btn_run_profile}
              </button>
              <button
                onClick={() => scrollTo('work')}
                className="flex items-center gap-3 border border-gray-700 text-gray-300 hover:bg-gray-800 rounded-xl px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-mono transition-colors"
              >
                <Folder size={14} /> {t.btn_view_projects}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
