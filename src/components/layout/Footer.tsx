export const Footer = ({ t }: { t: any }) => {
  return (
    <footer className="mt-2 md:mt-2 pb-10 flex flex-col items-center text-center font-mono">

      {/* Nombre y Cargo con el icono </> */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-orange-500 font-bold text-[18px]">{"</>"}</span>
        <h3 className="text-xl md:text-2xl text-gray-100 font-bold tracking-tight">
          Facundo Thibaut <span className="text-gray-500 font-light mx-2">|</span> {t.footer_role}
        </h3>
      </div>

      {/* Texto de tecnologías */}
      <p className="text-gray-400 text-sm md:text-base mb-2">
        {t.footer_built_1}<span className="text-gray-200">{"<3"}</span>{t.footer_built_2}
      </p>

      {/* Copyright */}
      <p className="text-gray-600 text-xs uppercase tracking-[0.2em]">
        {t.footer_copy}
      </p>
    </footer>
  );
};
