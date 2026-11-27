import en, { type Dictionary } from './en';
import tr from './tr';
import de from './de';
import pt from './pt';
import it from './it';
import ru from './ru';
import ar from './ar';
import type { Locale } from '@/i18n/config';

/** Every language file is a complete, type-checked Dictionary. */
const dictionaries: Record<Locale, Dictionary> = { en, tr, de, pt, it, ru, ar };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? en;
}

export type { Dictionary };
