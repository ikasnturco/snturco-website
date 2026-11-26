import Link from 'next/link';
import type { ReactNode } from 'react';
import { IconArrow } from './Icons';
import { WhatsAppButton } from './ContactLinks';
import { asset } from '@/config/site';
import { href, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/locales';

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export type Crumb = { label: string; href: string };

export function Breadcrumbs({ crumbs, tone = 'light' }: { crumbs: Crumb[]; tone?: 'light' | 'dark' }) {
  return (
    <nav aria-label="Breadcrumb" className={`text-[13px] ${tone === 'light' ? 'text-white/50' : 'text-slate'}`}>
      <ol className="flex flex-wrap items-center gap-2">
        {crumbs.map((c, i) => (
          <li key={c.href} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {i < crumbs.length - 1 ? (
              <Link href={c.href} className={tone === 'light' ? 'hover:text-white' : 'hover:text-navy'}>
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className={tone === 'light' ? 'text-white/80' : 'text-navy'}>
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Dark page header used by every inner page, so all pages share the same frame as the home page. */
export function PageHero({ eyebrow, title, lead, children, crumbs, image, compact = false }: { eyebrow: string; title: string; lead?: string; children?: ReactNode; crumbs?: Crumb[]; image?: string; compact?: boolean }) {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-white">
      {image && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset(image)} alt="" aria-hidden="true" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-55" fetchPriority="high" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/80 to-ink/20 rtl:bg-gradient-to-l" />
        </>
      )}
      <div className={`container relative ${compact ? 'pb-14 pt-36 md:pb-16 md:pt-40' : 'pb-20 pt-40 md:pb-28 md:pt-48'}`}>
        {crumbs && <Breadcrumbs crumbs={crumbs} />}
        <p className="eyebrow mt-8 animate-rise text-copper-300">{eyebrow}</p>
        <h1 className="display mt-5 max-w-4xl animate-rise text-[clamp(2.5rem,6vw,5rem)] [animation-delay:80ms]">{title}</h1>
        {lead && <p className="mt-7 max-w-2xl animate-rise text-[clamp(1.05rem,1.5vw,1.25rem)] leading-relaxed text-white/70 [animation-delay:160ms]">{lead}</p>}
        {children && <div className="mt-10 animate-rise [animation-delay:240ms]">{children}</div>}
      </div>
    </section>
  );
}

export function Section({ children, className = '', tone = 'light', id }: { children: ReactNode; className?: string; tone?: 'light' | 'white' | 'sand' | 'dark'; id?: string }) {
  const bg = { light: 'bg-sand-50', white: 'bg-white', sand: 'bg-sand', dark: 'bg-ink text-white' }[tone];
  return (
    <section id={id} className={`${bg} py-20 md:py-28 ${className}`}>
      <div className="container">{children}</div>
    </section>
  );
}

export function SectionTitle({ eyebrow, title, text, tone = 'light', className = '' }: { eyebrow?: string; title: string; text?: string; tone?: 'light' | 'dark'; className?: string }) {
  return (
    <div className={`max-w-3xl ${className}`}>
      {eyebrow && <p className={`eyebrow ${tone === 'dark' ? 'text-copper-300' : 'text-copper-700'}`}>{eyebrow}</p>}
      <h2 className={`display mt-4 text-[clamp(2rem,4.2vw,3.5rem)] ${tone === 'dark' ? 'text-white' : 'text-navy'}`}>{title}</h2>
      {text && <p className={`mt-5 max-w-2xl text-[17px] leading-relaxed ${tone === 'dark' ? 'text-white/65' : 'text-slate'}`}>{text}</p>}
    </div>
  );
}

export function ArrowLink({ href: to, children, className = '', tone = 'light' }: { href: string; children: ReactNode; className?: string; tone?: 'light' | 'dark' }) {
  return (
    <Link href={to} className={`group inline-flex items-center gap-2.5 text-[15px] font-medium ${tone === 'dark' ? 'text-white' : 'text-navy'} ${className}`}>
      <span className="border-b border-copper/50 pb-0.5 transition group-hover:border-copper">{children}</span>
      <IconArrow className="transition group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
    </Link>
  );
}

export function CtaBand({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="bg-sand-50 print:hidden">
      <div className="container py-16 md:py-24">
        <div className="relative isolate overflow-hidden rounded-[28px] bg-anthracite px-8 py-14 text-white md:px-16 md:py-20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset('/images/story/cta-cord.webp')} alt="" aria-hidden="true" loading="lazy" className="absolute inset-y-0 end-0 -z-10 hidden h-full w-1/2 object-cover opacity-60 [mask-image:linear-gradient(to_right,transparent,black_40%)] md:block rtl:-scale-x-100" />
          <div className="max-w-xl">
            <h2 className="display text-[clamp(2rem,3.6vw,3rem)]">{dict.home.cta.title}</h2>
            <p className="mt-5 text-[17px] leading-relaxed text-white/70">{dict.home.cta.text}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href={href(locale, 'request-a-quote')} className="btn-copper">
                {dict.cta.quote}
              </Link>
              <WhatsAppButton dict={dict} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FallbackNote({ show, text }: { show: boolean; text: string }) {
  if (!show) return null;
  return (
    <p className="mb-8 inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-[13px] text-slate">
      <span aria-hidden="true">EN</span>
      {text}
    </p>
  );
}

export function LevelDots({ level, label }: { level: number; label: string }) {
  return (
    <span className="inline-flex items-center gap-2" title={label}>
      <span className="flex gap-1" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={`h-1.5 w-4 rounded-full ${i <= level ? 'bg-copper' : 'bg-navy/10'}`} />
        ))}
      </span>
      <span className="text-[13px] text-slate">{label}</span>
    </span>
  );
}
