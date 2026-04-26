import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';
import { OrbitingSkillsGlobe } from '../orbiting-skills';
import { containerVariants } from '../../utils/animations';

export const Skills = ({ t }: { t: any }) => {
  return (
    <section id="skills" className="w-full min-h-[85vh] md:min-h-0 flex flex-col justify-start pt-10 pb-10 px-6 relative z-10 scroll-mt-20">
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

          {/* --- CONTENIDO CENTRADO --- */}
          <div className="flex flex-col items-center justify-center w-full">

            {/* 1. Contenedor de la Órbita */}
            {/* Subimos TODA la órbita hacia el título en PC aumentando el md:-mt */}
            <div className="relative flex items-center justify-center w-full min-h-[350px] md:min-h-[700px] -mt-20 md:-mt-40 overflow-visible">
              <div className="w-full max-w-[800px] z-10 transform scale-[0.8] md:scale-[1.40] transition-all duration-700 ease-out">
                <OrbitingSkillsGlobe />
              </div>
            </div>

            {/* 2. Etiqueta: Interactive Tech Stack */}
            {/* Subimos de -mt-20 a -mt-32 en PC. El celular sigue intacto en -mt-36 */}
            <div className="relative z-30 -mt-36 md:-mt-32">
              <div className="flex items-center gap-3 px-6 py-2 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.3em] text-gray-300 font-bold">
                  {t.skills_interactive}
                </span>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
};
