import en, { type Dictionary } from './dictionaries/en';
import tr from './dictionaries/tr';
import ru from './dictionaries/ru';
import ar from './dictionaries/ar';
import type { Locale } from './config';

const dictionaries: Record<Locale, Dictionary> = { en, tr, ru, ar };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
export * from './config';
