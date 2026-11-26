'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Logo } from './Logo';
import { href, locales, localeMeta, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n';

type Props = { locale: Locale; dict: Dictionary };

function useCurrentSlug(locale: Locale) {
  const pathname = usePathname() || `/${locale}/`;
  const parts = pathname.split('/').filter(Boolean);
  return parts.slice(1).join('/');
}

export function LanguageSwitcher({ locale, label, className = '' }: { locale: Locale; label: string; className?: string }) {
  const slug = useCurrentSlug(locale);
  return (
    <nav aria-label={label} className={`flex items-center gap-1 text-[13px] ${className}`}>
      {locales.map((l) => (
        <Link
          key={l}
          href={href(l, slug)}
          hrefLang={l}
          lang={l}
          aria-current={l === locale ? 'true' : undefined}
          title={localeMeta[l].label}
          className={`rounded px-2 py-1 font-medium transition ${
            l === locale ? 'bg-navy text-white' : 'text-slate hover:bg-mist hover:text-navy'
          }`}
        >
          {localeMeta[l].short}
        </Link>
      ))}
    </nav>
  );
}

export function Header({ locale, dict }: Props) {
  const [open, setOpen] = useState(false);
  const slug = useCurrentSlug(locale);
  const n = dict.common.nav;

  useEffect(() => setOpen(false), [slug]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  const productLinks = [
    { slug: 'products', label: n.products },
    { slug: 'yarns', label: n.yarns },
    { slug: 'fabrics', label: n.fabrics },
  ];
  const mainLinks = [
    { slug: 'about', label: n.about },
    { slug: 'trading-sourcing', label: n.sourcing },
    { slug: 'global-markets', label: n.markets },
    { slug: 'suppliers-partners', label: n.partners },
    { slug: 'contact', label: n.contact },
  ];
  const isActive = (s: string) => slug === s;
  const productsActive = productLinks.some((l) => isActive(l.slug));
  const linkCls = (active: boolean) =>
    `relative whitespace-nowrap py-2 text-[14px] transition hover:text-navy ${active ? 'text-navy after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-copper' : 'text-charcoal/80'}`;

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-3 focus:z-50 focus:rounded focus:bg-navy focus:px-3 focus:py-2 focus:text-white">
        {dict.common.skip}
      </a>
      <div className="container flex h-[72px] items-center justify-between gap-6">
        <Link href={href(locale)} aria-label="SNTURCO" className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-5 xl:flex">
          <Link href={href(locale, 'about')} className={linkCls(isActive('about'))}>
            {n.about}
          </Link>
          <div className="group relative">
            <Link href={href(locale, 'products')} className={`${linkCls(productsActive)} inline-flex items-center gap-1`} aria-haspopup="true">
              {n.products}
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" className="opacity-60">
                <path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </Link>
            <div className="invisible absolute start-[-16px] top-full z-50 w-56 pt-3 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
              <div className="rounded-md border border-line bg-white p-2 shadow-lg shadow-navy/5">
                {productLinks.map((l) => (
                  <Link key={l.slug} href={href(locale, l.slug)} className={`block rounded px-3 py-2 text-[14px] hover:bg-mist ${isActive(l.slug) ? 'text-navy font-medium' : 'text-charcoal'}`}>
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          {mainLinks.slice(1).map((l) => (
            <Link key={l.slug} href={href(locale, l.slug)} className={linkCls(isActive(l.slug))}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher locale={locale} label={dict.common.language} className="hidden sm:flex" />
          <Link href={href(locale, 'request-a-quote')} className="btn-primary hidden whitespace-nowrap md:inline-flex">
            {dict.common.cta.quote}
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded border border-line text-navy xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? dict.common.close : dict.common.menu}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              {open ? (
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.6" />
              ) : (
                <path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" strokeWidth="1.6" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="max-h-[calc(100vh-72px)] overflow-y-auto border-t border-line bg-white xl:hidden">
          <nav aria-label="Mobile" className="container flex flex-col py-4">
            {[{ slug: '', label: n.home }, { slug: 'about', label: n.about }, ...productLinks, ...mainLinks.slice(1), { slug: 'company-profile', label: n.profile }].map((l) => (
              <Link
                key={l.slug || 'home'}
                href={href(locale, l.slug)}
                className={`border-b border-line/70 py-3 text-[16px] ${isActive(l.slug) ? 'font-medium text-navy' : 'text-charcoal'}`}
              >
                {l.label}
              </Link>
            ))}
            <Link href={href(locale, 'request-a-quote')} className="btn-primary mt-5 justify-center">
              {dict.common.cta.quote}
            </Link>
            <LanguageSwitcher locale={locale} label={dict.common.language} className="mt-5 sm:hidden" />
          </nav>
        </div>
      )}
    </header>
  );
}
