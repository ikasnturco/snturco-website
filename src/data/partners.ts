/**
 * Partners. Each entry becomes its own card on the Partners page, in this order.
 * Add a partner by adding an object; leave a field empty ('' or undefined) to hide it.
 * Do not invent logos: set `logo` only to an image file the partner has provided
 * (put it in public/images/partners/). Without a logo the name is shown in type.
 */
import type { L } from '@/i18n/config';

export type Partner = {
  id: string;
  name: string;
  country: L;
  /** Short address line. Leave empty when not confirmed. */
  address?: string;
  description: L;
  logo?: string;
  website?: string;
};

export const partners: Partner[] = [
  {
    id: 'jr-gomes',
    name: 'J. R. GOMES',
    country: { en: 'Portugal', tr: 'Portekiz', de: 'Portugal', pt: 'Portugal', it: 'Portogallo', ru: 'Португалия', ar: 'البرتغال' },
    description: {
      en: 'Our agency partner in Portugal.',
      tr: 'Portekiz’deki acente partnerimiz.',
    },
  },
  {
    id: 'filhos-lda',
    name: 'FILHOS, LDA',
    country: { en: 'Portugal', tr: 'Portekiz', de: 'Portugal', pt: 'Portugal', it: 'Portogallo', ru: 'Португалия', ar: 'البرتغال' },
    address: 'Porto, Portugal',
    description: {
      en: 'Our partner company in Porto, Portugal.',
      tr: 'Porto, Portekiz’deki partner firmamız.',
    },
  },
];
