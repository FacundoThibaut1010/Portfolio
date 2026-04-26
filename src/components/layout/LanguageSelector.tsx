export const LanguageSelector = ({ lang, setLang }: { lang: 'en' | 'es', setLang: (lang: 'en' | 'es') => void }) => {
  return (
    <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[100] flex items-center bg-[#16161a]/80 backdrop-blur-md border border-gray-800 rounded-full p-1 shadow-2xl">
      <button
        onClick={() => setLang('en')}
        className={`px-4 py-1.5 rounded-full text-[10px] font-mono font-bold transition-all duration-300 ${lang === 'en' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'text-gray-500 hover:text-gray-300'
          }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang('es')}
        className={`px-4 py-1.5 rounded-full text-[10px] font-mono font-bold transition-all duration-300 ${lang === 'es' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'text-gray-500 hover:text-gray-300'
          }`}
      >
        ES
      </button>
    </div>
  );
};
