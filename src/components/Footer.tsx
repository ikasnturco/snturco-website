import Link from 'next/link';
import { Logo } from './Logo';
import { site } from '@/config/site';
import { href, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n';

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const n = dict.common.nav;
  const f = dict.common.footer;
  const year = new Date().getFullYear();
  const col = 'text-[14px] text-white/70 hover:text-white transition';
  return (
    <footer className="bg-navy-900 text-white print:hidden">
      <div className="container grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo inverted />
          <p className="mt-5 max-w-xs text-[14px] leading-relaxed text-white/70">{f.tagline}</p>
        </div>
        <div className="md:col-span-2">
          <h2 className="eyebrow text-copper-300">{f.company}</h2>
          <ul className="mt-4 space-y-2.5">
            {(
              [
                ['about', n.about],
                ['trading-sourcing', n.sourcing],
                ['global-markets', n.markets],
                ['suppliers-partners', n.partners],
                ['company-profile', n.profile],
              ] as const
            ).map(([s, l]) => (
              <li key={s}>
                <Link href={href(locale, s)} className={col}>
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-2">
          <h2 className="eyebrow text-copper-300">{f.offer}</h2>
          <ul className="mt-4 space-y-2.5">
            {(
              [
                ['products', n.products],
                ['yarns', n.yarns],
                ['fabrics', n.fabrics],
                ['request-a-quote', n.quote],
              ] as const
            ).map(([s, l]) => (
              <li key={s}>
                <Link href={href(locale, s)} className={col}>
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-4">
          <h2 className="eyebrow text-copper-300">{f.contact}</h2>
          <address className="mt-4 text-[14px] not-italic leading-relaxed text-white/70" dir="ltr">
            {site.legalName}
            <br />
            {site.address.street}
            <br />
            {site.address.postalCode} {site.address.city}, {site.address.country}
          </address>
          <p className="mt-3">
            <a href={`mailto:${site.email}`} className="text-[14px] text-white underline decoration-copper/60 underline-offset-4 hover:decoration-copper" dir="ltr">
              {site.email}
            </a>
          </p>
          {site.phone && (
            <p className="mt-1">
              <a href={`tel:${site.phone}`} className={col} dir="ltr">
                {site.phone}
              </a>
            </p>
          )}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container flex flex-col gap-3 py-6 text-[13px] text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.legalName} {f.rights}
          </p>
          <Link href={href(locale, 'privacy')} className="hover:text-white">
            {n.privacy}
          </Link>
        </div>
      </div>
    </footer>
  );
}
