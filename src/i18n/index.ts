import en, { type Dictionary } from './dictionaries/en';
import de from './dictionaries/de';
import tr from './dictionaries/tr';
import pt from './dictionaries/pt';
import it from './dictionaries/it';
import ru from './dictionaries/ru';
import ar from './dictionaries/ar';
import type { Locale } from './config';

const dictionaries: Record<Locale, Dictionary> = { en, de, tr, pt, it, ru, ar };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
export * from './config';
