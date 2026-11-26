/**
 * Company and contact details shown on the website.
 * Edit this file to change what visitors see. Empty values are hidden on the site.
 */
export const site = {
  name: 'SNTURCO',
  legalName: 'SNTURCO, LDA.',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.snturco.com').replace(/\/$/, ''),
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  email: 'ikasourcing@snturco.com',
  address: {
    street: 'Largo Eng. António de Almeida, 70 – 1º Sala 355',
    postalCode: '4100-065',
    city: 'Porto',
    country: 'Portugal',
    countryCode: 'PT',
  },
  /** Phone number in international format, e.g. '+351900000000'. Empty = not shown. */
  phone: '',
  /** WhatsApp number, digits only with country code, e.g. '351900000000'. Empty = WhatsApp button hidden. */
  whatsapp: '',
  /** LinkedIn company page URL. Empty = hidden. */
  linkedin: '',
  /** Public form endpoint (see .env.example). Empty = email fallback. */
  formEndpoint: process.env.NEXT_PUBLIC_FORM_ENDPOINT || '',
  formAccessKey: process.env.NEXT_PUBLIC_FORM_ACCESS_KEY || '',
} as const;

export function asset(path: string) {
  return `${site.basePath}${path}`;
}
