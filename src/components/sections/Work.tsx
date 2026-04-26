import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Folder, ExternalLink } from 'lucide-react';
import { containerVariants, itemVariants } from '../../utils/animations';
import { getProjects } from '../../data/projects';

export const Work = ({ t, setIsProjectOpen }: { t: any, setIsProjectOpen: (val: boolean) => void }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);

  const projects = getProjects(t);
  const selectedProject = selectedProjectIndex !== null ? projects[selectedProjectIndex] : null;

  useEffect(() => {
    // Detectamos si es móvil
    const isMobile = window.innerWidth < 768;

    if (selectedProjectIndex !== null && isMobile) {
      setIsProjectOpen(true);
    } else {
      setIsProjectOpen(false);
    }
  }, [selectedProjectIndex, setIsProjectOpen]);

  // Asegurate que cuando cierres el modal del proyecto, 
  // setees setSelectedProjectIndex(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <section
      id="work"
      className="min-h-screen w-full flex flex-col justify-start pt-16 pb-40 md:pt-16 px-6 relative z-10"
      onMouseMove={handleMouseMove}
    >
      <div className="max-w-[85rem] mx-auto w-full">
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" className="space-y-20">

          <h2 className="text-4xl lg:text-5xl font-mono text-gray-200 font-bold mb-8 flex items-center gap-4">
            <Folder size={40} className="text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.3)]" />
            <span className="text-orange-500 font-bold">$</span>
            {t.work_title}
          </h2>

          <ul className="flex flex-col w-full border-t-[1px] border-gray-800/80 relative">
            {projects.map((p, i) => (
              <motion.li
                variants={itemVariants}
                key={i}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                // ESTA LÍNEA ES LA QUE ACTIVA EL CLIC
                onClick={() => setSelectedProjectIndex(i)}
                className="cursor-pointer"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between py-12 md:py-16 border-b-[1px] border-gray-800/80 group transition-all duration-500 ease-out hover:px-8 hover:bg-[#1a1b26]/30">
                  <div className="flex items-center gap-12 md:gap-32 z-10">
                    <span className="text-base md:text-lg font-mono text-gray-600 tracking-widest">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-200 group-hover:text-orange-400 transition-colors uppercase tracking-tight">{p.name}</h3>
                  </div>
                  <div className="flex items-center gap-8 mt-8 md:mt-0 z-10">
                    <span className="text-xs md:text-sm uppercase tracking-[0.2em] text-[#61afef] font-mono group-hover:text-gray-300 transition-colors">{p.type}</span>
                    <ExternalLink size={24} className="hidden md:block text-gray-700 group-hover:text-orange-500 transition-colors" />
                  </div>
                </div>
              </motion.li>
            ))}

            {/* --- PREVIEW QUE SIGUE AL MOUSE (Compacto y Minimalista) --- */}
            <motion.div
              className="fixed pointer-events-none z-50 overflow-hidden rounded-2xl border border-white/10 bg-[#16161a]/98 backdrop-blur-xl shadow-2xl flex flex-col"
              style={{
                width: '280px', // Reducido de 340px a 280px
                left: mousePosition.x + 20,
                top: mousePosition.y - 130,
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: hoveredIndex !== null ? 1 : 0.8,
                opacity: hoveredIndex !== null ? 1 : 0,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {hoveredIndex !== null && (
                <>
                  {/* Foto compacta */}
                  <div className="w-full h-36 overflow-hidden">
                    <img
                      src={projects[hoveredIndex].image}
                      alt="Preview"
                      className="w-full h-full object-cover opacity-80"
                    />
                  </div>

                  <div className="p-4 space-y-3">
                    {/* Header mini */}
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-[9px] font-mono text-orange-500/80 font-bold uppercase tracking-[0.2em]">
                        {t.work_preview_source} _0{hoveredIndex + 1}
                      </span>
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500/50"></div>
                    </div>

                    {/* Descripción compacta */}
                    <p className="text-[12px] text-gray-400 font-mono leading-relaxed">
                      {projects[hoveredIndex].desc}
                    </p>

                    {/* --- ICONOS DE TECNOLOGÍA MÁS GRANDES --- */}
                    <div className="pt-3">
                      <div className="flex flex-wrap gap-4"> {/* Aumenté el espacio entre ellos (gap-4) */}

                        {/* 1. JAVA */}
                        <div className="size-10 flex items-center justify-center p-1.5 rounded-xl border border-gray-800 bg-gray-950/50 shadow-lg">
                          <img src="public/projets/png-clipart-computer-icons-java-咖啡海报图片素材-miscellaneous-text-thumbnail-Photoroom.png" alt="Java" className="w-full h-full object-contain" />
                        </div>

                        {/* 2. HTML */}
                        <div className="size-10 flex items-center justify-center p-1.5 rounded-xl border border-gray-800 bg-gray-950/50 shadow-lg">
                          <img src="public/projets/html5_23403-Photoroom.png" alt="HTML" className="w-full h-full object-contain" />
                        </div>

                        {/* 3. CSS */}
                        <div className="size-10 flex items-center justify-center p-1.5 rounded-xl border border-gray-800 bg-gray-950/50 shadow-lg">
                          <img src="public/projets/css-icon5555.logowik.com-Photoroom.png" alt="CSS" className="w-full h-full object-contain" />
                        </div>

                        {/* 4. JAVASCRIPT */}
                        <div className="size-10 flex items-center justify-center p-1.5 rounded-xl border border-gray-800 bg-gray-950/50 shadow-lg">
                          <img src="public/projets/kisspng-javascript-clip-art-openclipart-logo-number-1713949408965-Photoroom.png" alt="JS" className="w-full h-full object-contain" />
                        </div>

                        {/* 5. SPRING MVC */}
                        <div className="size-10 flex items-center justify-center p-1.5 rounded-xl border border-gray-800 bg-gray-950/50 shadow-lg">
                          <img src="public/projets/spring-Photoroom.png" alt="Spring" className="w-full h-full object-contain" />
                        </div>

                        {/* 6. MYSQL */}
                        <div className="size-10 flex items-center justify-center p-1.5 rounded-xl border border-gray-800 bg-gray-950/50 shadow-lg">
                          <img src="public/projets/mysql-6-logo-png-transparent-Photoroom.png" alt="MySQL" className="w-full h-full object-contain" />
                        </div>

                      </div>
                    </div>

                    <div className="text-[8px] text-gray-600 font-mono pt-1 text-right italic">
                      {t.work_preview_esc}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </ul>
        </motion.div>
      </div>

      {/* --- 2. EL MODAL FIJO (AQUÍ ESTÁ EL PROBLEMA) --- */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/90 backdrop-blur-md">
          {/* Fondo clicable para cerrar */}
          <div className="absolute inset-0" onClick={() => setSelectedProjectIndex(null)} />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-[#0f0f12] border border-gray-800 w-full max-w-4xl rounded-[2rem] overflow-hidden shadow-2xl relative z-10 flex flex-col md:flex-row"
          >
            {/* Imagen del Modal */}
            <div className="w-full md:w-1/2 h-64 md:h-auto overflow-hidden border-b md:border-b-0 md:border-r border-gray-800">
              <img src={selectedProject.image} className="w-full h-full object-cover" alt="Detail" />
            </div>

            {/* Info del Modal */}
            <div className="w-full md:w-1/2 p-8 md:p-12 space-y-6">
              <div className="space-y-2">
                <span className="text-orange-500 font-mono text-xs tracking-widest uppercase">{selectedProject.type}</span>
                <h3 className="text-4xl font-bold text-white tracking-tighter">{selectedProject.name}</h3>
              </div>

              <p className="text-gray-400 text-lg leading-relaxed font-mono">
                {selectedProject.longDesc}
              </p>

              <div className="flex flex-wrap gap-2">
                {selectedProject.tech.map((techItem: string) => (
                  <span key={techItem} className="px-3 py-1 bg-gray-900 border border-gray-800 rounded-md text-[10px] text-orange-400 font-mono uppercase">{techItem}</span>
                ))}
              </div>

              <div className="pt-4 flex gap-4">
                <a
                  href={selectedProject.github}
                  target="_blank"
                  className="bg-orange-500 hover:bg-orange-600 text-black font-bold py-3 px-6 rounded-xl transition-all flex items-center gap-2 text-sm"
                >
                  {t.work_modal_view} <ExternalLink size={18} />
                </a>
                <button
                  onClick={() => setSelectedProjectIndex(null)}
                  className="border border-gray-700 text-gray-400 hover:text-white px-6 py-3 rounded-xl text-sm transition-colors"
                >
                  {t.work_modal_close}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};
