import Link from 'next/link';
import { Logo } from './Logo';
import { site, asset } from '@/config/site';
import { href, tx, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/locales';
import { products } from '@/data/products';
import { cottons } from '@/data/cotton';

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const n = dict.nav;
  const f = dict.footer;
  const year = new Date().getFullYear();
  const link = 'text-[14px] text-white/60 transition hover:text-white';
  const head = 'text-[11px] font-semibold uppercase tracking-[0.22em] text-copper-300';
  const social = [{ label: 'LinkedIn', url: site.linkedin }, { label: 'Instagram', url: site.instagram }].filter((s) => s.url);
  const profileLang = ['en', 'de', 'tr', 'pt', 'it', 'ru', 'ar'].includes(locale) ? locale : 'en';

  return (
    <footer className="relative overflow-hidden bg-ink text-white print:hidden">
      <div className="pointer-events-none absolute -top-40 end-[-10%] h-[480px] w-[480px] rounded-full bg-copper/10 blur-[120px]" aria-hidden="true" />
      <div className="container relative grid gap-12 pb-14 pt-20 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo inverted />
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-white/60">{f.tagline}</p>
          <p className="mt-6 font-display text-[22px] italic text-white/85">{dict.meta.tagline}</p>
          {social.length > 0 && (
            <div className="mt-6">
              <p className={head}>{f.social}</p>
              <ul className="mt-3 flex gap-4">
                {social.map((s) => (
                  <li key={s.label}>
                    <a href={s.url} className={link} rel="noopener" target="_blank">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="lg:col-span-2">
          <p className={head}>{f.explore}</p>
          <ul className="mt-5 space-y-3">
            {(
              [
                ['', n.home],
                ['about', n.about],
                ['partners', n.partners],
                ['knowledge', n.knowledge],
                ['request-a-quote', n.quote],
                ['contact', n.contact],
              ] as const
            ).map(([s, l]) => (
              <li key={s || 'home'}>
                <Link href={href(locale, s)} className={link}>
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-2">
          <p className={head}>{f.products}</p>
          <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 lg:grid-cols-1">
            {products.slice(0, 8).map((p) => (
              <li key={p.slug}>
                <Link href={href(locale, `products/${p.slug}`)} className={link}>
                  {tx(p.name, locale)}
                </Link>
              </li>
            ))}
            <li>
              <Link href={href(locale, 'products')} className={`${link} text-copper-300`}>
                {n.allYarns} →
              </Link>
            </li>
          </ul>
        </div>
        <div className="lg:col-span-2">
          <p className={head}>{f.cotton}</p>
          <ul className="mt-5 space-y-3">
            {cottons.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link href={href(locale, `cotton/${c.slug}`)} className={link}>
                  {tx(c.name, locale)}
                </Link>
              </li>
            ))}
            <li>
              <Link href={href(locale, 'cotton')} className={`${link} text-copper-300`}>
                {n.cotton} →
              </Link>
            </li>
          </ul>
        </div>
        <div className="lg:col-span-2">
          <p className={head}>{f.contact}</p>
          <address className="mt-5 text-[14px] not-italic leading-relaxed text-white/60" dir="ltr">
            {site.legalName}
            <br />
            {site.address.street}
            <br />
            {site.address.postalCode} {site.address.city}, {site.address.country}
          </address>
          <p className="mt-4">
            <a href={`mailto:${site.email}`} className="text-[14px] text-white link-underline" dir="ltr">
              {site.email}
            </a>
          </p>
          <p className="mt-4">
            <a href={asset(`/downloads/snturco-company-profile-${profileLang}.pdf`)} className={link} download>
              {f.profile}
            </a>
          </p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container flex flex-col gap-3 py-6 text-[13px] text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.legalName} {f.rights}
          </p>
          <div className="flex gap-6">
            <Link href={href(locale, 'privacy')} className="hover:text-white">
              {n.privacy}
            </Link>
            <Link href={href(locale, 'cookies')} className="hover:text-white">
              {n.cookies}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
