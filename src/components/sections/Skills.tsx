import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';
import { OrbitingSkillsGlobe } from '../orbiting-skills';
import { containerVariants } from '../../utils/animations';

export const Skills = ({ t }: { t: any }) => {
  return (
    <section id="skills" className="w-full flex flex-col justify-start pt-2 pb-10 px-6 relative z-10 scroll-mt-4">
      <div className="max-w-[85rem] mx-auto w-full">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="flex flex-col"
        >
          {/* --- TÍTULO --- */}
          <h2 className="text-4xl lg:text-5xl font-mono text-gray-200 font-bold flex items-center gap-4 mb-12">
            <Cpu
              size={40}
              className="text-orange-500 shrink-0 drop-shadow-[0_0_15px_rgba(249,115,22,0.3)]"
            />
            <span className="text-orange-500 font-bold">#</span>
            Skills.json
          </h2>

          {/* --- CONTENIDO CENTRADO: POSICIÓN ELEVADA Y ESCALA MÁXIMA --- */}
          <div className="flex flex-col items-center justify-center w-full overflow-hidden">

            {/* Contenedor principal sin el resplandor naranja de fondo */}
            <div className="relative flex items-center justify-center w-full min-h-[400px] sm:min-h-[600px] md:min-h-[700px] -mt-5 sm:-mt-10 md:-mt-20">

              {/* CONTENEDOR DE LA ÓRBITA */}
              <div className="w-full max-w-[800px] z-10 transform scale-[0.8] sm:scale-110 md:scale-[1.40] transition-all duration-700 ease-out">
                <OrbitingSkillsGlobe />
              </div>

              {/* ETIQUETA: Interactive Tech Stack */}
              <div className="absolute bottom-10 md:bottom-0 left-1/2 -translate-x-1/2 z-20">
                <div className="flex items-center gap-3 px-6 py-2 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                  <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.3em] text-gray-300 font-bold">
                    {t.skills_interactive}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
};
