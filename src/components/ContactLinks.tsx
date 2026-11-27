import { IconMail, IconPhone, IconPin, IconWhatsApp } from './Icons';
import { site, telHref, whatsappHref } from '@/config/site';
import type { Dictionary } from '@/locales';

/** Big WhatsApp button with a pre-filled professional message. Opens WhatsApp on mobile and WhatsApp Web / Desktop on computers. */
export function WhatsAppButton({ dict, message, className = '' }: { dict: Dictionary; message?: string; className?: string }) {
  return (
    <a href={whatsappHref(message ?? dict.contact.whatsappMessage)} target="_blank" rel="noopener" className={`btn-whatsapp ${className}`} data-whatsapp>
      <IconWhatsApp width={20} height={20} />
      <span className="whitespace-nowrap uppercase tracking-[0.06em]">{dict.contact.whatsapp}</span>
    </a>
  );
}

/** Phones (tel:), email and location. Used in the footer, the contact page and the quote page. */
export function ContactList({ dict, tone = 'dark', showLocation = true }: { dict: Dictionary; tone?: 'dark' | 'light'; showLocation?: boolean }) {
  const label = tone === 'dark' ? 'text-white/45' : 'text-slate';
  const value = tone === 'dark' ? 'text-offwhite hover:text-champagne' : 'text-anthracite hover:text-copper-700';
  const icon = tone === 'dark' ? 'text-champagne' : 'text-copper-700';
  const row = 'flex items-start gap-4';
  return (
    <ul className="space-y-5">
      <li className={row}>
        <IconPhone width={20} height={20} className={`mt-0.5 shrink-0 ${icon}`} />
        <div>
          <p className={`text-[12px] uppercase tracking-[0.18em] ${label}`}>{dict.contact.phone}</p>
          {site.phones.map((p) => (
            <a key={p} href={telHref(p)} className={`mt-1 block text-[15.5px] tabular-nums transition ${value}`} dir="ltr" data-tel>
              {p}
            </a>
          ))}
        </div>
      </li>
      <li className={row}>
        <IconMail width={20} height={20} className={`mt-0.5 shrink-0 ${icon}`} />
        <div>
          <p className={`text-[12px] uppercase tracking-[0.18em] ${label}`}>{dict.contact.email}</p>
          <a href={`mailto:${site.email}`} className={`mt-1 block break-all text-[15.5px] transition ${value}`} dir="ltr">
            {site.email}
          </a>
        </div>
      </li>
      {showLocation && (
        <li className={row}>
          <IconPin width={20} height={20} className={`mt-0.5 shrink-0 ${icon}`} />
          <div>
            <p className={`text-[12px] uppercase tracking-[0.18em] ${label}`}>{dict.contact.location}</p>
            <p className={`mt-1 text-[15.5px] ${tone === 'dark' ? 'text-offwhite' : 'text-anthracite'}`}>
              {site.address.city}, {site.address.country}
            </p>
          </div>
        </li>
      )}
    </ul>
  );
}
