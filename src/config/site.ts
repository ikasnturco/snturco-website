/**
 * Company and contact details shown on the website.
 * Edit this file to change what visitors see. Empty values are hidden on the site.
 */
export const site = {
  name: 'SNTURCO',
  legalName: 'SNTURCO, LDA.',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://snturco.com').replace(/\/$/, ''),
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  email: 'ikasourcing@snturco.com',
  /** Only the city is shown on the site (İbrahim, 26 Nov 2026). */
  address: {
    city: 'Porto',
    country: 'Portugal',
    countryCode: 'PT',
  },
  /** Phone numbers shown on the contact page and footer (international format). */
  phones: ['+49 162 564 1453', '+90 535 701 4603'],
  /** WhatsApp number, digits only with country code. */
  whatsapp: '491625641453',
  /** Social media links (full URLs). Empty = hidden in the footer. */
  linkedin: '',
  instagram: '',
  /**
   * Direct email sending through Web3Forms (https://web3forms.com, free plan).
   * The access key is public by design: it can only deliver messages to the inbox it was created for
   * (ikasourcing@snturco.com). A repository variable FORM_ACCESS_KEY overrides it.
   */
  formEndpoint: process.env.NEXT_PUBLIC_FORM_ENDPOINT || 'https://api.web3forms.com/submit',
  formAccessKey: process.env.NEXT_PUBLIC_FORM_ACCESS_KEY || 'da75930d-5c6a-48b5-97ad-9687ad0fb53f',
} as const;

export function asset(path: string) {
  return `${site.basePath}${path}`;
}

/** tel: link for a displayed phone number. */
export function telHref(phone: string) {
  return `tel:${phone.replace(/[^+\d]/g, '')}`;
}

/** WhatsApp click-to-chat link with a pre-filled message (works on desktop and mobile). */
export function whatsappHref(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
