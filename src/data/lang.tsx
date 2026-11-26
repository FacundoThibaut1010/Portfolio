import { createContext, useContext } from 'react';
import { translations } from './translations';

export type Lang = 'en' | 'es';
const LANGS: Lang[] = ['en', 'es'];

export const LangContext = createContext<Lang>('es');
export const useLang = () => useContext(LangContext);

/**
 * Renders every translation stacked in the same grid cell and shows only the active one.
 * The box always takes the size of the longest translation, so switching language
 * never makes the page grow or shrink.
 */
export function StableText({ k, values }: { k?: string; values?: Record<Lang, string> }) {
  const lang = useLang();
  const text = (l: Lang) => (values ? values[l] : (translations[l] as Record<string, string>)[k as string]);
  return (
    <span className="grid">
      {LANGS.map((l) => (
        <span
          key={l}
          className={l === lang ? '' : 'invisible select-none'}
          style={{ gridArea: '1 / 1' }}
          aria-hidden={l !== lang}
        >
          {text(l)}
        </span>
      ))}
    </span>
  );
}
