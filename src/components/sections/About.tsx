import { motion } from 'framer-motion';
import { Settings, Coffee } from 'lucide-react';
import { containerVariants, itemVariants } from '../../utils/animations';
import { StableText } from '../../data/lang';

export const About = ({ t }: { t: any; scrollTo?: (id: string) => void }) => {
  const rows = [
    { k: t.about_operator, v: <span className="text-orange-500 font-bold tracking-widest">FACUNDO THIBAUT</span> },
    { k: t.about_role, v: <span className="text-[#61afef] font-medium tracking-wide">{t.about_dev_role}</span> },
    { k: t.about_location, v: <span className="text-gray-300">{t.about_location_val}</span> },
    {
      k: t.about_status,
      v: (
        <span className="inline-flex items-center gap-1.5 text-emerald-400 bg-emerald-950/50 border border-emerald-500/20 px-2.5 py-0.5 rounded tracking-widest font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {t.about_status_val}
        </span>
      ),
    },
  ];

  return (
    <section id="about" className="w-full relative py-16 lg:py-20 px-5 sm:px-8 lg:px-10">
      <div className="max-w-[85rem] mx-auto w-full">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={containerVariants}
          className="space-y-6 lg:space-y-8"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-mono text-gray-200 font-bold flex items-center gap-3 sm:gap-4">
            <span className="text-orange-500 font-bold">&gt;_</span>
            {t.about_title}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">
            {/* Profile card */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-4 bg-[#1a1b26]/95 border border-gray-800 rounded-2xl p-6 lg:p-7 relative overflow-hidden flex flex-col items-center justify-center"
            >
              <div className="absolute -top-16 -right-16 w-56 h-56 bg-orange-500/10 blur-[80px] pointer-events-none rounded-full" />
              <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-blue-500/10 blur-[80px] pointer-events-none rounded-full" />

              {/* Avatar */}
              <div className="relative w-36 h-36 sm:w-40 sm:h-40 xl:w-44 xl:h-44 mb-6 shrink-0">
                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100" aria-hidden>
                  <circle cx="50" cy="50" r="48" fill="transparent" stroke="#2a2a30" strokeWidth="0.6" />
                  <circle cx="50" cy="50" r="48" fill="transparent" stroke="#f97316" strokeWidth="1.6" strokeDasharray="50 300" />
                  <circle cx="50" cy="50" r="48" fill="transparent" stroke="#10b981" strokeWidth="1.6" strokeDasharray="30 300" strokeDashoffset="-120" />
                  <circle cx="50" cy="50" r="48" fill="transparent" stroke="#3b82f6" strokeWidth="1.2" strokeDasharray="80 300" strokeDashoffset="-180" />
                </svg>
                <div className="absolute inset-[11%] rounded-full border border-gray-700 bg-[#16161a] overflow-hidden">
                  <img src="/projets/fotoFacu.jpeg" className="w-full h-full object-cover object-top scale-105" alt="Facundo Thibaut" />
                </div>
                <span className="absolute bottom-[12%] right-[12%] w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#1a1b26] shadow-[0_0_12px_#10b981]" />
              </div>

              {/* Data table */}
              <dl className="w-full font-mono text-xs sm:text-[13px] divide-y divide-gray-800/80">
                {rows.map((r) => (
                  <div key={r.k} className="flex justify-between items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <dt className="text-gray-500 uppercase tracking-widest text-[10px] sm:text-[11px] shrink-0">{r.k}</dt>
                    <dd className="text-right min-w-0 break-words">{r.v}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>

            {/* Terminal log + metrics */}
            <div className="lg:col-span-8 flex flex-col gap-5 lg:gap-6">
              <motion.div
                variants={itemVariants}
                className="bg-[#1a1b26] border border-gray-800 rounded-2xl p-6 lg:p-8 flex-grow"
              >
                <h3 className="text-gray-500 font-mono text-xs sm:text-sm border-b border-gray-800 pb-3 mb-5 flex items-center gap-3">
                  <span className="text-gray-600">&gt;_</span> {t.about_cmd_header}
                </h3>

                <div className="space-y-6 font-mono text-[13px] sm:text-sm leading-relaxed">
                  {[
                    { cmd: t.about_cmd_whoami, k: 'about_whoami_desc' },
                    { cmd: t.about_cmd_mission_file, k: 'about_mission_desc_1' },
                  ].map((b) => (
                    <div key={b.k}>
                      <div className="flex items-center gap-3 mb-2.5">
                        <span className="text-blue-500 font-bold">-&gt;</span>
                        <span className="text-[#c678dd] font-semibold text-base">{b.cmd}</span>
                      </div>
                      <p className="border-l-[3px] border-gray-700/40 pl-4 text-gray-400"><StableText k={b.k} /></p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <div className="grid grid-cols-2 gap-5 lg:gap-6">
                {[
                  { title: t.metric_exp, v: '4+', sub: t.metric_exp_sub, Icon: Settings },
                  { title: t.metric_caf, v: '∞', sub: t.metric_caf_sub, Icon: Coffee },
                ].map((m, i) => (
                  <motion.div
                    variants={itemVariants}
                    key={i}
                    className="bg-[#1a1b26] border border-gray-800 rounded-2xl px-4 py-4 sm:px-6 flex flex-col gap-2 group hover:border-gray-600 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-gray-500 text-[10px] sm:text-xs font-mono tracking-[0.2em]">
                      <m.Icon size={14} className="text-orange-500 shrink-0" />
                      {m.title}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-white group-hover:text-orange-400 transition-colors">{m.v}</span>
                      <span className="text-xs text-gray-600 font-mono tracking-widest">{m.sub}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
