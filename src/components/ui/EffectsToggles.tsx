import { Sparkles, Volume2, VolumeX } from 'lucide-react';
import { useEffects } from '../../data/effects';
import { useLang } from '../../data/lang';

const L = {
  es: { pulsesOn: 'Apagar destellos', pulsesOff: 'Encender destellos', soundOn: 'Silenciar sonidos', soundOff: 'Activar sonidos' },
  en: { pulsesOn: 'Turn off glints', pulsesOff: 'Turn on glints', soundOn: 'Mute sounds', soundOff: 'Turn on sounds' },
};

/** Two round switches: background glints and UI sounds. */
export const EffectsToggles = ({ size = 'sm' }: { size?: 'sm' | 'lg' }) => {
  const { pulses, setPulses, sound, setSound } = useEffects();
  const t = L[useLang()];
  const box = size === 'lg' ? 'w-11 h-11' : 'w-8 h-8';
  const icon = size === 'lg' ? 18 : 14;
  const base = `${box} rounded-full flex items-center justify-center border transition-[color,background-color,border-color,transform] duration-200 active:scale-90`;
  const on = 'border-orange-500/40 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20';
  const off = 'border-gray-800 bg-[#16161a] text-gray-500 hover:text-gray-300';
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => setPulses(!pulses)}
        aria-pressed={pulses}
        aria-label={pulses ? t.pulsesOn : t.pulsesOff}
        title={pulses ? t.pulsesOn : t.pulsesOff}
        className={`${base} ${pulses ? on : off} relative`}
      >
        <Sparkles size={icon} />
        {!pulses && <span className="absolute w-[60%] h-[1.5px] bg-current rotate-45 rounded-full" />}
      </button>
      <button
        type="button"
        data-no-sfx
        onClick={() => setSound(!sound)}
        aria-pressed={sound}
        aria-label={sound ? t.soundOn : t.soundOff}
        title={sound ? t.soundOn : t.soundOff}
        className={`${base} ${sound ? on : off}`}
      >
        {sound ? <Volume2 size={icon} /> : <VolumeX size={icon} />}
      </button>
    </div>
  );
};
