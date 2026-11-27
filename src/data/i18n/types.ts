/**
 * Translations of the product, cotton and knowledge texts for DE, PT, IT, RU and AR.
 * English and Turkish live next to the data in src/data/*.ts; these files add the other languages.
 * Every slug must be present (TypeScript checks the keys; scripts/i18n-check.mts checks every field).
 */
export type ProductTexts = {
  name: string;
  tagline: string;
  intro: string;
  source: string;
  structure: string;
  classification: string;
  note?: string;
  properties: string[];
  texture: string;
  advantages: string[];
  uses: string[];
  products: string[];
  care: string[];
  compare: { texture: string; source: string };
};
export type CottonTexts = { name: string; staple: string; origin: string; fibre: string; character: string; quality: string[]; uses: string[]; difference: string; note?: string };
export type TopicTexts = { title: string; text: string; example: string };

export type ProductSlug = 'cotton' | 'polyester' | 'viscose' | 'acrylic' | 'nylon' | 'wool' | 'silk' | 'linen' | 'bamboo' | 'elastane' | 'lycra' | 'polyamide' | 'polypropylene' | 'hemp';
export type CottonSlug = 'american-cotton' | 'egyptian-cotton' | 'turkish-cotton' | 'pima-cotton' | 'supima-cotton' | 'giza-cotton' | 'organic-cotton' | 'anatolian-cotton' | 'sea-island-cotton';
export type TopicSlug = 'natural-and-synthetic-fibres' | 'regenerated-fibres' | 'how-yarn-is-made' | 'ring-spun-yarn' | 'open-end-yarn' | 'filament-and-staple' | 'twist' | 'yarn-count' | 'ne-and-nm' | 'yarn-quality' | 'choosing-yarn' | 'uses-of-yarn';

export type ContentTranslation = {
  products: Record<ProductSlug, ProductTexts>;
  cotton: Record<CottonSlug, CottonTexts>;
  knowledge: Record<TopicSlug, TopicTexts>;
};
