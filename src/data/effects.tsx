import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { playClick, playKey, setSoundEnabled } from '../utils/sfx';

type Effects = {
  pulses: boolean;
  setPulses: (v: boolean) => void;
  sound: boolean;
  setSound: (v: boolean) => void;
};

const EffectsContext = createContext<Effects>({ pulses: true, setPulses: () => {}, sound: true, setSound: () => {} });
export const useEffects = () => useContext(EffectsContext);

const read = (key: string, fallback: boolean) => {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : v === '1';
  } catch {
    return fallback;
  }
};
const write = (key: string, v: boolean) => {
  try { localStorage.setItem(key, v ? '1' : '0'); } catch { /* storage unavailable: keep in memory only */ }
};

/** Background pulses + UI sounds, both switchable and remembered per visitor. */
export const EffectsProvider = ({ children }: { children: ReactNode }) => {
  const [pulses, setPulsesState] = useState(() => read('fx-pulses', true));
  const [sound, setSoundState] = useState(() => read('fx-sound', true));

  const setPulses = (v: boolean) => { setPulsesState(v); write('fx-pulses', v); };
  const setSound = (v: boolean) => { setSoundState(v); write('fx-sound', v); };

  useEffect(() => { setSoundEnabled(sound); }, [sound]);

  // Global sound hooks: a blip on clicks of interactive elements, a soft tick while typing in fields
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const el = e.target as HTMLElement | null;
      if (el?.closest('button, a, [role="button"], input[type="submit"], [data-sfx]')) playClick();
    };
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el || !el.matches('input, textarea')) return;
      if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Enter') playKey();
    };
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  return <EffectsContext.Provider value={{ pulses, setPulses, sound, setSound }}>{children}</EffectsContext.Provider>;
};
