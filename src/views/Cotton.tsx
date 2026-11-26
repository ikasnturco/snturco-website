import Link from 'next/link';
import { PageHero, CtaBand, FallbackNote, type Crumb } from '@/components/ui';
import { Gallery } from '@/components/products/Gallery';
import { asset } from '@/config/site';
import { href, tx, isFallback, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/locales';
import { cottons, cottonImages, type Cotton } from '@/data/cotton';
import { productImages } from '@/data/products';

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-t border-line py-4 sm:grid-cols-[150px_1fr] sm:gap-6">
      <dt className="text-[12px] font-semibold uppercase tracking-[0.14em] text-slate">{label}</dt>
      <dd className="text-[15.5px] leading-relaxed text-charcoal">{children}</dd>
    </div>
  );
}

export function CottonView({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const cp = dict.cottonPage;
  const l = cp.labels;
  return (
    <>
      <PageHero eyebrow={cp.hero.eyebrow} title={cp.hero.title} lead={cp.hero.lead} image={productImages('cotton').main} crumbs={[{ label: dict.common.breadcrumbHome, href: href(locale) }, { label: dict.nav.cotton, href: href(locale, 'cotton') }]} />
      <section className="bg-sand-50 py-16 md:py-24">
        <div className="container">
          <FallbackNote show={isFallback(cottons[0].origin, locale)} text={dict.common.fallbackNote} />
          <nav aria-label={cp.hero.eyebrow} className="mb-14 flex flex-wrap gap-2">
            {cottons.map((c) => (
              <a key={c.slug} href={`#${c.slug}`} className="rounded-full border border-navy/15 bg-white px-4 py-2 text-[14px] text-navy transition hover:border-copper">
                {tx(c.name, locale)}
              </a>
            ))}
          </nav>
          <div className="space-y-8">
            {cottons.map((c, i) => (
              <article key={c.slug} id={c.slug} className="reveal grid scroll-mt-28 overflow-hidden rounded-[22px] bg-white ring-1 ring-line lg:grid-cols-12">
                <Link href={href(locale, `cotton/${c.slug}`)} className={`group relative block min-h-[280px] overflow-hidden bg-ink lg:col-span-5 ${i % 2 ? 'lg:order-2' : ''}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset(cottonImages(c.slug).main)} alt={`${tx(c.name, locale)} – ${dict.common.renderNote}`} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-1000 ease-cine group-hover:scale-105" />
                  <span className="absolute start-6 top-6 text-[12px] tabular-nums tracking-[0.25em] text-white/70">{String(i + 1).padStart(2, '0')}</span>
                </Link>
                <div className="p-7 md:p-10 lg:col-span-7">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-copper">{tx(c.staple, locale)}</p>
                  <h2 className="display mt-3 text-[clamp(1.8rem,3vw,2.6rem)] text-navy">
                    <Link href={href(locale, `cotton/${c.slug}`)} className="hover:text-copper">
                      {tx(c.name, locale)}
                    </Link>
                  </h2>
                  <p className="mt-3 text-[16px] leading-relaxed text-slate">{tx(c.character, locale)}</p>
                  <dl className="mt-6">
                    <Row label={l.origin}>{tx(c.origin, locale)}</Row>
                    <Row label={l.fibre}>{tx(c.fibre, locale)}</Row>
                    <Row label={l.uses}>{tx(c.uses, locale).join(' · ')}</Row>
                    <Row label={l.difference}>{tx(c.difference, locale)}</Row>
                  </dl>
                  <Link href={href(locale, `cotton/${c.slug}`)} className="btn-outline mt-6 !py-2.5">
                    {dict.cta.details}
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-12 max-w-3xl text-[13.5px] text-slate">{cp.note}</p>
        </div>
      </section>
      <CtaBand locale={locale} dict={dict} />
    </>
  );
}

export function CottonDetailView({ locale, dict, cotton: c }: { locale: Locale; dict: Dictionary; cotton: Cotton }) {
  const l = dict.cottonPage.labels;
  const name = tx(c.name, locale);
  const img = cottonImages(c.slug);
  const crumbs: Crumb[] = [
    { label: dict.common.breadcrumbHome, href: href(locale) },
    { label: dict.nav.cotton, href: href(locale, 'cotton') },
    { label: name, href: href(locale, `cotton/${c.slug}`) },
  ];
  const quoteHref = href(locale, 'request-a-quote', `yarn=${c.slug}`);
  const idx = cottons.findIndex((x) => x.slug === c.slug);
  const next = cottons[(idx + 1) % cottons.length];
  return (
    <>
      <PageHero eyebrow={`${dict.nav.cotton} · ${tx(c.staple, locale)}`} title={name} lead={tx(c.character, locale)} crumbs={crumbs} image={img.main}>
        <Link href={quoteHref} className="btn-copper">
          {dict.cta.quoteThis}
        </Link>
      </PageHero>
      <section className="bg-sand-50 py-16 md:py-24">
        <div className="container grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <FallbackNote show={isFallback(c.origin, locale)} text={dict.common.fallbackNote} />
            <dl>
              <Row label={l.origin}>{tx(c.origin, locale)}</Row>
              <Row label={l.fibre}>{tx(c.fibre, locale)}</Row>
              <Row label={l.character}>{tx(c.character, locale)}</Row>
              <Row label={l.quality}>
                <ul className="list-disc space-y-1 ps-5 marker:text-copper">
                  {tx(c.quality, locale).map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ul>
              </Row>
              <Row label={l.uses}>{tx(c.uses, locale).join(' · ')}</Row>
              <Row label={l.difference}>{tx(c.difference, locale)}</Row>
            </dl>
            {c.note && (
              <div className="mt-8 rounded-2xl border border-copper/30 bg-copper/5 p-6">
                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-copper-700">{dict.product.labels.note}</p>
                <p className="mt-2 text-[15.5px] leading-relaxed text-charcoal">{tx(c.note, locale)}</p>
              </div>
            )}
          </div>
          <div className="lg:col-span-5">
            <h2 className="display text-[26px] text-navy">{dict.product.labels.gallery}</h2>
            <Gallery images={img.gallery} small={img.gallerySmall} alt={`${name} – ${dict.common.renderNote}`} note={dict.common.renderNote} />
            <div className="mt-10 rounded-2xl bg-navy p-8 text-white">
              <h2 className="display text-[28px]">{dict.product.quoteTitle}</h2>
              <p className="mt-3 text-white/70">{dict.product.quoteText}</p>
              <Link href={quoteHref} className="btn-copper mt-6">
                {dict.cta.quoteThis}
              </Link>
            </div>
            <Link href={href(locale, `cotton/${next.slug}`)} className="group mt-6 flex items-center justify-between rounded-2xl bg-white p-6 ring-1 ring-line transition hover:ring-copper">
              <span>
                <span className="block text-[12px] uppercase tracking-[0.16em] text-slate">→</span>
                <span className="display text-[22px] text-navy">{tx(next.name, locale)}</span>
              </span>
              <span aria-hidden="true" className="text-copper transition group-hover:translate-x-1 rtl:-scale-x-100">→</span>
            </Link>
          </div>
        </div>
      </section>
      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
