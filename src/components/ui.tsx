import Link from 'next/link';
import type { ReactNode } from 'react';
import { IconArrow } from './Icons';
import { ThreadArt } from './ThreadArt';
import { href, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n';

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function PageHero({
  eyebrow,
  title,
  lead,
  children,
  crumbs,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  children?: ReactNode;
  crumbs?: { label: string; href: string }[];
}) {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <ThreadArt className="pointer-events-none absolute inset-y-0 end-0 h-full w-[70%] opacity-60 rtl:-scale-x-100" />
      <div className="container relative py-20 md:py-24">
        {crumbs && (
          <nav aria-label="Breadcrumb" className="mb-8 text-[13px] text-white/55">
            <ol className="flex flex-wrap items-center gap-2">
              {crumbs.map((c, i) => (
                <li key={c.href} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden="true">/</span>}
                  {i < crumbs.length - 1 ? (
                    <Link href={c.href} className="hover:text-white">
                      {c.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-white/80">
                      {c.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <p className="eyebrow animate-rise text-copper-300">{eyebrow}</p>
        <h1 className="display mt-4 max-w-3xl animate-rise text-[clamp(2.1rem,4.6vw,3.6rem)] [animation-delay:80ms]">{title}</h1>
        <p className="mt-6 max-w-2xl animate-rise text-[clamp(1.05rem,1.6vw,1.25rem)] leading-relaxed text-white/80 [animation-delay:160ms]">{lead}</p>
        {children && <div className="mt-10 animate-rise [animation-delay:240ms]">{children}</div>}
      </div>
    </section>
  );
}

export function Section({ children, className = '', tone = 'white', id }: { children: ReactNode; className?: string; tone?: 'white' | 'sand' | 'mist'; id?: string }) {
  const bg = tone === 'sand' ? 'bg-sand' : tone === 'mist' ? 'bg-mist' : 'bg-white';
  return (
    <section id={id} className={`${bg} py-20 md:py-24 ${className}`}>
      <div className="container">{children}</div>
    </section>
  );
}

export function SectionTitle({ eyebrow, title, text }: { eyebrow?: string; title: string; text?: string }) {
  return (
    <div className="max-w-2xl">
      {eyebrow && <p className="eyebrow text-copper">{eyebrow}</p>}
      <h2 className="display mt-3 text-[clamp(1.7rem,3vw,2.4rem)] text-navy">{title}</h2>
      {text && <p className="mt-4 text-[17px] leading-relaxed text-slate">{text}</p>}
    </div>
  );
}

export function ArrowLink({ href: to, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={to} className={`group inline-flex items-center gap-2 text-[15px] font-medium text-navy ${className}`}>
      <span className="border-b border-copper/50 pb-0.5 transition group-hover:border-copper">{children}</span>
      <IconArrow className="transition group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
    </Link>
  );
}

export function CtaBand({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="bg-sand print:hidden">
      <div className="container py-16 md:py-20">
        <div className="relative overflow-hidden rounded-lg bg-navy-700 px-8 py-12 text-white md:px-14 md:py-14">
          <ThreadArt className="pointer-events-none absolute inset-y-0 end-0 h-full w-1/2 opacity-40 rtl:-scale-x-100" />
          <div className="relative grid items-center gap-8 md:grid-cols-[1.6fr_1fr]">
            <div>
              <h2 className="display text-[clamp(1.6rem,2.8vw,2.2rem)]">{dict.common.ctaBand.title}</h2>
              <p className="mt-4 max-w-xl text-white/75">{dict.common.ctaBand.text}</p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link href={href(locale, 'request-a-quote')} className="btn-copper">
                {dict.common.cta.request}
              </Link>
              <Link href={href(locale, 'contact')} className="btn-ghost-light">
                {dict.common.cta.contact}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-lg border border-line bg-white p-7 transition hover:border-navy/25 hover:shadow-[0_8px_30px_-12px_rgba(20,36,59,0.18)] ${className}`}>{children}</div>;
}

export function IconBadge({ children }: { children: ReactNode }) {
  return <span className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-mist text-navy">{children}</span>;
}
