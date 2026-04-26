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
          {/* Mantenemos items-start en móvil para el título, pero forzamos items-center en PC (md:) */}
          <div className="flex flex-col items-start md:items-center justify-center w-full px-4 md:px-0">

            {/* Título y CPU: pl-2 para que en móvil respire un poco del borde */}
            <div className="flex items-center gap-4 mb-8 pl-2 md:pl-0">
              {/* Aquí va tu ícono de CPU y el texto # Skills.json */}
            </div>

            {/* 1. Contenedor de la Órbita */}
            {/* Aumentamos el md:-mt-40 a md:-mt-52 para succionar todo hacia arriba en PC */}
            <div className="relative flex items-center justify-center w-full min-h-[350px] md:min-h-[700px] -mt-20 md:-mt-52 overflow-visible self-center">
              <div className="w-full max-w-[800px] z-10 transform scale-[0.8] md:scale-[1.40] transition-all duration-700 ease-out">
                <OrbitingSkillsGlobe />
              </div>
            </div>

            {/* 2. Etiqueta: Interactive Tech Stack */}
            {/* Bajamos de md:-mt-44 a md:-mt-32 para que descienda un poco en PC.
    El celular se queda clavado en -mt-36 para no romperse. */}
            <div className="relative z-30 -mt-36 md:-mt-32 self-center pointer-events-none">
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
