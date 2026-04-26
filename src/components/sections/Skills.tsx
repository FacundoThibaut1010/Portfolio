import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';
import { OrbitingSkillsGlobe } from '../orbiting-skills';
import { containerVariants } from '../../utils/animations';

export const Skills = ({ t }: { t: any }) => {
  return (
    // CAMBIO 1: justify-center y quitamos el md:min-h-0. Agregamos overflow-hidden.
    <section
      id="skills"
      className="w-full min-h-screen flex flex-col justify-center items-center py-20 px-6 relative z-10 scroll-mt-0 overflow-hidden"
    >
      <div className="max-w-[85rem] mx-auto w-full flex-1 flex flex-col justify-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="flex flex-col w-full"
        >
          {/* --- TÍTULO --- */}
          {/* Bajamos un poco el margen del título para que no se pegue al techo */}
          <h2 className="text-4xl lg:text-5xl font-mono text-gray-200 font-bold flex items-center gap-4 mb-16 md:mb-24">
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
            {/* Reducimos un poco el margen negativo para que no pise a la sección de arriba */}
            <div className="relative flex items-center justify-center w-full min-h-[400px] md:min-h-[600px] -mt-10 md:-mt-32 overflow-visible">
              <div className="w-full max-w-[800px] z-10 transform scale-[0.9] md:scale-[1.20] transition-all duration-700 ease-out">
                <OrbitingSkillsGlobe />
              </div>
            </div>

            {/* 2. Etiqueta: Interactive Tech Stack */}
            {/* Ajuste "quirúrgico": -mt-40 para que esté un pelín más cerca de la órbita que antes */}
            <div className="relative z-30 -mt-20 md:-mt-40 self-center pointer-events-none">
              <div className="flex items-center gap-3 px-6 py-2 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.5)] whitespace-nowrap pointer-events-auto cursor-pointer">
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