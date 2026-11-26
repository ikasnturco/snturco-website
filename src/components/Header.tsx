'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Logo } from './Logo';
import { href, locales, localeMeta, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/locales';

type Props = { locale: Locale; dict: Dictionary };

function useCurrentPath(locale: Locale) {
  const pathname = usePathname() || `/${locale}/`;
  return pathname.split('/').filter(Boolean).slice(1).join('/');
}

export function LanguageSwitcher({ locale, label, tone, className = '' }: { locale: Locale; label: string; tone: 'light' | 'dark'; className?: string }) {
  const path = useCurrentPath(locale);
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) ref.current.open = false;
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);
  return (
    <details ref={ref} className={`group relative ${className}`}>
      <summary
        aria-label={`${label}: ${localeMeta[locale].label}`}
        className={`flex cursor-pointer list-none items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-medium tracking-wide transition [&::-webkit-details-marker]:hidden ${
          tone === 'light' ? 'border-white/20 text-white hover:border-champagne' : 'border-navy/15 text-navy hover:border-navy/40'
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="16" cy="16" r="12" />
          <path d="M4 16h24M16 4c3.5 3.4 5 7.4 5 12s-1.5 8.6-5 12c-3.5-3.4-5-7.4-5-12s1.5-8.6 5-12Z" />
        </svg>
        {localeMeta[locale].short}
      </summary>
      <nav aria-label={label} className="absolute end-0 top-full z-50 mt-3 w-48 overflow-hidden rounded-xl border border-white/10 bg-navy-900 p-1.5">
        {locales.map((l) => (
          <Link
            key={l}
            href={href(l, path)}
            hrefLang={l}
            lang={l}
            aria-current={l === locale ? 'true' : undefined}
            onClick={() => ref.current && (ref.current.open = false)}
            className={`flex items-center justify-between rounded-lg px-3 py-2 text-[14px] transition hover:bg-white/5 ${l === locale ? 'text-champagne' : 'text-white/80'}`}
          >
            <span>{localeMeta[l].label}</span>
            <span className="text-[11px] text-grey">{localeMeta[l].short}</span>
          </Link>
        ))}
      </nav>
    </details>
  );
}

export function Header({ locale, dict }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const path = useCurrentPath(locale);
  const n = dict.nav;

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      // hide while scrolling down through long pages, show again when scrolling up
      setHidden(y > 600 && y > last + 4);
      if (y < last - 4 || y < 600) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const productLinks = [
    { slug: 'products', label: n.allYarns },
    { slug: 'cotton', label: n.cotton },
    { slug: 'knowledge', label: n.knowledge },
  ];
  const isActive = (s: string) => (s === '' ? path === '' : path === s || path.startsWith(`${s}/`));
  const productsActive = productLinks.some((l) => isActive(l.slug));
  const solid = scrolled || open;
  const tone: 'light' | 'dark' = 'light'; // header is always on anthracite
  const linkCls = (active: boolean) =>
    `relative whitespace-nowrap py-2 text-[14px] tracking-wide transition ${
      tone === 'light' ? (active ? 'text-white' : 'text-white/70 hover:text-champagne') : active ? 'text-navy' : 'text-charcoal/75 hover:text-navy'
    } ${active ? 'after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-champagne' : ''}`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,transform,box-shadow,backdrop-filter] duration-500 ease-cine ${
        solid ? 'bg-ink/90 shadow-[0_1px_0_rgba(241,238,233,0.08)] backdrop-blur-xl' : 'bg-transparent'
      } ${hidden && !open ? '-translate-y-full' : ''}`}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-3 focus:z-50 focus:rounded focus:bg-navy focus:px-3 focus:py-2 focus:text-white">
        {n.skip}
      </a>
      <div className={`container flex items-center justify-between gap-6 transition-[height] duration-500 ease-cine ${scrolled ? 'h-[68px]' : 'h-[84px]'}`}>
        <Link href={href(locale)} aria-label="SNTURCO" className="shrink-0">
          <Logo inverted={tone === 'light'} />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          <Link href={href(locale)} className={linkCls(isActive(''))}>
            {n.home}
          </Link>
          <Link href={href(locale, 'about')} className={linkCls(isActive('about'))}>
            {n.about}
          </Link>
          <div className="group relative">
            <Link href={href(locale, 'products')} className={`${linkCls(productsActive)} inline-flex items-center gap-1.5`} aria-haspopup="true">
              {n.products}
              <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden="true" className="opacity-60 transition group-hover:rotate-180">
                <path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </Link>
            <div className="invisible absolute start-1/2 top-full z-50 w-60 -translate-x-1/2 pt-4 opacity-0 transition duration-300 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100 rtl:translate-x-1/2">
              <div className="rounded-xl border border-white/10 bg-navy-900 p-2">
                {productLinks.map((l) => (
                  <Link key={l.slug} href={href(locale, l.slug)} className={`block rounded-lg px-4 py-2.5 text-[14px] transition hover:bg-white/5 hover:text-champagne ${isActive(l.slug) ? 'text-champagne' : 'text-white/80'}`}>
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link href={href(locale, 'partners')} className={linkCls(isActive('partners'))}>
            {n.partners}
          </Link>
          <Link href={href(locale, 'contact')} className={linkCls(isActive('contact'))}>
            {n.contact}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher locale={locale} label={n.language} tone={tone} className="hidden sm:block" />
          <Link href={href(locale, 'request-a-quote')} className={`hidden whitespace-nowrap md:inline-flex ${'btn-copper !py-2.5'}`}>
            {n.quote}
          </Link>
          <button
            type="button"
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full border lg:hidden ${tone === 'light' ? 'border-white/25 text-white' : 'border-navy/15 text-navy'}`}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? n.close : n.menu}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              {open ? <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.6" /> : <path d="M3 7h14M3 13h14" stroke="currentColor" strokeWidth="1.6" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="h-[calc(100dvh-68px)] overflow-y-auto border-t border-white/10 bg-ink lg:hidden">
          <nav aria-label="Mobile" className="container flex flex-col py-6">
            {[{ slug: '', label: n.home }, { slug: 'about', label: n.about }].map((l) => (
              <Link key={l.slug || 'home'} href={href(locale, l.slug)} className={`border-b border-white/10 py-4 font-display text-[26px] ${isActive(l.slug) ? 'text-champagne' : 'text-white'}`}>
                {l.label}
              </Link>
            ))}
            <p className="pt-5 text-[12px] font-semibold uppercase tracking-[0.2em] text-grey">{n.products}</p>
            {productLinks.map((l) => (
              <Link key={l.slug} href={href(locale, l.slug)} className={`border-b border-white/10 py-3 ps-4 text-[18px] ${isActive(l.slug) ? 'text-champagne' : 'text-white/80'}`}>
                {l.label}
              </Link>
            ))}
            {[{ slug: 'partners', label: n.partners }, { slug: 'contact', label: n.contact }].map((l) => (
              <Link key={l.slug} href={href(locale, l.slug)} className={`border-b border-white/10 py-4 font-display text-[26px] ${isActive(l.slug) ? 'text-champagne' : 'text-white'}`}>
                {l.label}
              </Link>
            ))}
            <Link href={href(locale, 'request-a-quote')} className="btn-copper mt-8">
              {n.quote}
            </Link>
            <LanguageSwitcher locale={locale} label={n.language} tone="light" className="mt-6 self-start [&>nav]:bottom-full [&>nav]:end-auto [&>nav]:start-0 [&>nav]:top-auto [&>nav]:mb-2" />
          </nav>
        </div>
      )}
    </header>
  );
}
