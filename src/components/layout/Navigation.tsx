import { Cpu, Folder, Phone } from 'lucide-react';

export const Navigation = ({ t, activeSection, scrollTo, sections }: { t: any, activeSection: string, scrollTo: (id: string) => void, sections: string[] }) => {
  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col items-center z-50 mix-blend-screen hidden lg:flex">
      {/* Continuous straight tracking line behind dots */}
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
            {/* Tooltip on left */}
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

      {/* Profile Avatar locked to the bottom of the track - UPSCALED */}
      <div className="mt-12 relative w-16 h-16 flex items-center justify-center group cursor-pointer" onClick={() => scrollTo('contact')}>
        <div className="absolute inset-0 rounded-full border border-orange-500/30 border-dotted animate-[spin_15s_linear_infinite]"></div>
        <div className="w-14 h-14 rounded-full bg-[#111115] border border-gray-700 overflow-hidden z-10 p-0.5 group-hover:border-orange-500 transition-colors">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4" className="w-full h-full rounded-full object-cover grayscale brightness-90 contrast-125" alt="Profile" />
        </div>
        <span className="absolute top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-[3px] border-[#111115] z-20"></span>
      </div>
    </div>
  );
};
