import Link from 'next/link';
import { Hero } from '@/components/home/Hero';
import { StorySequence } from '@/components/home/StorySequence';
import { ContainerYard } from '@/components/shipments/ContainerYard';
import { ProductCard } from '@/components/products/ProductCard';
import { ArrowLink, CtaBand, SectionTitle } from '@/components/ui';
import { asset } from '@/config/site';
import { href, tx, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/locales';
import { products, productImages } from '@/data/products';
import { cottons, cottonImages } from '@/data/cotton';
import { partners } from '@/data/partners';
import { topics } from '@/data/knowledge';
import { publicShipmentData } from '@/data/shipments';

const featured = ['cotton', 'polyester', 'viscose', 'wool', 'linen', 'silk', 'bamboo', 'polyamide'];

export function HomeView({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const h = dict.home;
  const shipments = publicShipmentData();
  return (
    <>
      <Hero locale={locale} dict={dict} />

      {/* Intro statement */}
      <section className="relative bg-ink pb-10 pt-24 text-white md:pt-32">
        <div className="container grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow reveal text-copper-300">{h.intro.eyebrow}</p>
            <h2 className="display reveal mt-5 text-[clamp(2.2rem,5vw,4.4rem)]" style={{ ['--d' as string]: '80ms' }}>
              {h.intro.title}
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pt-12">
            <p className="reveal text-[18px] leading-relaxed text-white/70" style={{ ['--d' as string]: '160ms' }}>
              {h.intro.text}
            </p>
            <ArrowLink href={href(locale, 'about')} tone="dark" className="reveal mt-8">
              {dict.cta.discover}
            </ArrowLink>
          </div>
        </div>
        <div className="container mt-20 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">
          {h.intro.pillars.map((p, i) => (
            <div key={p.title} className="reveal bg-ink p-8" style={{ ['--d' as string]: `${i * 90}ms` }}>
              <p className="text-[12px] tabular-nums tracking-[0.25em] text-copper-300">0{i + 1}</p>
              <p className="display mt-4 text-[26px]">{p.title}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-white/60">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <StorySequence dict={dict} nextId="yarns" />

      {/* Products */}
      <section id="yarns" className="bg-sand-50 py-24 md:py-32">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <SectionTitle eyebrow={h.products.eyebrow} title={h.products.title} text={h.products.text} className="reveal" />
            <Link href={href(locale, 'products')} className="btn-outline reveal">
              {dict.cta.viewAll} ({products.length})
            </Link>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((slug, i) => {
              const p = products.find((x) => x.slug === slug)!;
              return (
                <div key={slug} className="reveal" style={{ ['--d' as string]: `${(i % 4) * 80}ms` }}>
                  <ProductCard to={href(locale, `products/${slug}`)} image={productImages(slug).mainSmall} name={tx(p.name, locale)} subtitle={tx(p.tagline, locale)} tag={dict.common.categories[p.category]} index={i} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cotton index */}
      <section className="relative overflow-hidden bg-navy-900 py-24 text-white md:py-32">
        <div className="container grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionTitle eyebrow={h.cotton.eyebrow} title={h.cotton.title} text={h.cotton.text} tone="dark" className="reveal lg:sticky lg:top-32" />
            <ArrowLink href={href(locale, 'cotton')} tone="dark" className="reveal mt-8">
              {dict.cta.viewCotton}
            </ArrowLink>
          </div>
          <ol className="lg:col-span-8">
            {cottons.map((c, i) => (
              <li key={c.slug} className="reveal group relative border-t border-white/10 last:border-b" style={{ ['--d' as string]: `${i * 40}ms` }}>
                <Link href={href(locale, `cotton/${c.slug}`)} className="flex items-center gap-6 py-6 transition-colors md:py-7">
                  <span className="w-8 text-[12px] tabular-nums tracking-[0.2em] text-white/40">{String(i + 1).padStart(2, '0')}</span>
                  <span className="display flex-1 text-[clamp(1.6rem,3vw,2.6rem)] transition-all duration-500 ease-cine group-hover:translate-x-2 group-hover:text-copper-200 rtl:group-hover:-translate-x-2">{tx(c.name, locale)}</span>
                  <span className="hidden text-[13px] text-white/50 sm:block">{tx(c.staple, locale)}</span>
                  <span aria-hidden="true" className="text-white/40 transition group-hover:text-copper-300 rtl:-scale-x-100">→</span>
                </Link>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset(cottonImages(c.slug).mainSmall)}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="pointer-events-none absolute end-24 top-1/2 z-10 hidden h-44 w-60 -translate-y-1/2 rotate-2 rounded-xl object-cover opacity-0 shadow-2xl transition-all duration-500 ease-cine group-hover:-rotate-1 group-hover:opacity-100 lg:block"
                />
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ContainerYard dict={dict} data={shipments} />

      {/* Quality & sustainability */}
      <section className="bg-sand-50 py-24 md:py-32">
        <div className="container">
          <SectionTitle eyebrow={h.quality.eyebrow} title={h.quality.title} className="reveal" />
          <div className="mt-16 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {h.quality.items.map((q, i) => (
              <div key={q.title} className="reveal border-t border-navy/15 pt-6" style={{ ['--d' as string]: `${(i % 3) * 90}ms` }}>
                <p className="text-[12px] tabular-nums tracking-[0.25em] text-copper">0{i + 1}</p>
                <h3 className="display mt-4 text-[26px] text-navy">{q.title}</h3>
                <p className="mt-3 text-[15.5px] leading-relaxed text-slate">{q.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners + knowledge */}
      <section className="bg-white py-24 md:py-32">
        <div className="container grid gap-8 lg:grid-cols-2">
          <div className="reveal card-surface flex flex-col p-8 md:p-12">
            <p className="eyebrow text-copper">{h.partners.eyebrow}</p>
            <h2 className="display mt-4 text-[clamp(1.8rem,3vw,2.6rem)] text-navy">{h.partners.title}</h2>
            <p className="mt-3 text-slate">{h.partners.text}</p>
            <ul className="mt-10 grid flex-1 gap-4 sm:grid-cols-2">
              {partners.map((p) => (
                <li key={p.id} className="rounded-xl border border-line bg-sand-50 p-6">
                  <p className="font-sans text-[18px] font-semibold tracking-[0.12em] text-navy">{p.name}</p>
                  <p className="mt-2 text-[14px] text-slate">{tx(p.country, locale)}</p>
                </li>
              ))}
            </ul>
            <ArrowLink href={href(locale, 'partners')} className="mt-8">
              {dict.cta.viewPartners}
            </ArrowLink>
          </div>
          <div className="reveal relative isolate flex flex-col overflow-hidden rounded-2xl bg-navy p-8 text-white md:p-12" style={{ ['--d' as string]: '100ms' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset('/images/yarns/cotton/fibres-800.webp')} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30" />
            <p className="eyebrow text-copper-300">{h.knowledge.eyebrow}</p>
            <h2 className="display mt-4 text-[clamp(1.8rem,3vw,2.6rem)]">{h.knowledge.title}</h2>
            <p className="mt-3 text-white/70">{h.knowledge.text}</p>
            <ul className="mt-8 flex flex-1 flex-wrap content-start gap-2">
              {topics.slice(0, 8).map((t) => (
                <li key={t.slug}>
                  <Link href={href(locale, 'knowledge', '') + `#${t.slug}`} className="inline-block rounded-full border border-white/20 px-4 py-2 text-[13.5px] text-white/85 transition hover:border-copper-300 hover:text-white">
                    {tx(t.title, locale)}
                  </Link>
                </li>
              ))}
            </ul>
            <ArrowLink href={href(locale, 'knowledge')} tone="dark" className="mt-8">
              {dict.cta.viewKnowledge}
            </ArrowLink>
          </div>
        </div>
      </section>

      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
