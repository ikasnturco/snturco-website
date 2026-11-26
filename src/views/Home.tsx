import Link from 'next/link';
import { Hero } from '@/components/home/Hero';
import { StorySequence } from '@/components/home/StorySequence';
import { ContainerYard } from '@/components/shipments/ContainerYard';
import { ProductCard } from '@/components/products/ProductCard';
import { ContactList, WhatsAppButton } from '@/components/ContactLinks';
import { IconArrow } from '@/components/Icons';
import { ArrowLink, SectionTitle } from '@/components/ui';
import { asset } from '@/config/site';
import { href, tx, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/locales';
import { products, productImages } from '@/data/products';
import { cottons, cottonImages } from '@/data/cotton';
import { publicShipmentData } from '@/data/shipments';

const featured = ['cotton', 'polyester', 'viscose', 'wool'];

const categoryTiles = [
  { key: 'natural', image: () => productImages('linen').mainSmall, count: () => products.filter((p) => p.category === 'natural').length },
  { key: 'synthetic', image: () => productImages('polyester').mainSmall, count: () => products.filter((p) => p.category === 'synthetic').length },
  { key: 'regenerated', image: () => productImages('viscose').mainSmall, count: () => products.filter((p) => p.category === 'regenerated').length },
  { key: 'cotton', image: () => cottonImages(cottons[0].slug).mainSmall, count: () => cottons.length },
] as const;

export function HomeView({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const h = dict.home;
  const shipments = publicShipmentData();
  return (
    <>
      <Hero locale={locale} dict={dict} />

      {/* Categories: one click to any group of yarns */}
      <section id="yarns" className="bg-ink pb-20 pt-20 text-offwhite md:pb-28 md:pt-24">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionTitle eyebrow={h.categories.eyebrow} title={h.categories.title} text={h.categories.text} tone="dark" className="reveal" />
            <Link href={href(locale, 'products')} className="btn-ghost-light reveal">
              {dict.cta.viewAll} ({products.length})
            </Link>
          </div>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categoryTiles.map((c, i) => (
              <li key={c.key} className="reveal" style={{ ['--d' as string]: `${i * 70}ms` }}>
                <Link
                  href={c.key === 'cotton' ? href(locale, 'cotton') : href(locale, 'products', `filter=${c.key}`)}
                  className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-navy-900 p-6 lg:aspect-[3/4]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset(c.image())} alt="" aria-hidden="true" loading="lazy" decoding="async" className="absolute inset-0 -z-0 h-full w-full object-cover opacity-70 transition duration-[1200ms] ease-cine group-hover:scale-105 group-hover:opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
                  <div className="relative">
                    <p className="text-[11px] tabular-nums tracking-[0.25em] text-champagne">{String(c.count()).padStart(2, '0')}</p>
                    <h3 className="display mt-2 flex items-center justify-between gap-3 text-[26px]">
                      {dict.common.categories[c.key]}
                      <IconArrow className="text-champagne transition group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                    </h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-offwhite/65">{h.categories.items[c.key]}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((slug, i) => {
              const p = products.find((x) => x.slug === slug)!;
              return (
                <div key={slug} className="reveal" style={{ ['--d' as string]: `${i * 70}ms` }}>
                  <ProductCard to={href(locale, `products/${slug}`)} image={productImages(slug).mainSmall} name={tx(p.name, locale)} subtitle={tx(p.tagline, locale)} tag={dict.common.categories[p.category]} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <StorySequence dict={dict} nextId="about" />

      {/* About in one screen */}
      <section id="about" className="bg-sand-50 py-20 text-anthracite md:py-28">
        <div className="container grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionTitle eyebrow={h.about.eyebrow} title={h.about.title} className="reveal" />
          </div>
          <div className="lg:col-span-7 lg:pt-10">
            <p className="reveal text-[17.5px] leading-relaxed text-slate">{h.about.text}</p>
            <ArrowLink href={href(locale, 'about')} className="reveal mt-7">
              {dict.cta.discover}
            </ArrowLink>
          </div>
        </div>
        <div className="container mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
          {h.about.pillars.map((p, i) => (
            <div key={p.title} className="reveal bg-sand-50 p-7 md:p-8" style={{ ['--d' as string]: `${i * 80}ms` }}>
              <p className="text-[11px] tabular-nums tracking-[0.25em] text-copper-700">0{i + 1}</p>
              <p className="display mt-3 text-[24px]">{p.title}</p>
              <p className="mt-2 text-[15px] leading-relaxed text-slate">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <ContainerYard dict={dict} data={shipments} />

      {/* Knowledge + partners, then direct contact */}
      <section className="bg-sand-50 py-20 md:py-28">
        <div className="container grid gap-4 md:grid-cols-2">
          {(
            [
              ['knowledge', h.more.knowledge, dict.cta.viewKnowledge],
              ['partners', h.more.partners, dict.cta.viewPartners],
            ] as const
          ).map(([slug, m, cta], i) => (
            <Link key={slug} href={href(locale, slug)} className="reveal group flex flex-col justify-between gap-8 rounded-2xl border border-line bg-white p-8 transition hover:border-anthracite/30 md:p-10" style={{ ['--d' as string]: `${i * 80}ms` }}>
              <div>
                <h2 className="display text-[clamp(1.6rem,2.6vw,2.2rem)] text-anthracite">{m.title}</h2>
                <p className="mt-3 max-w-md text-[15.5px] leading-relaxed text-slate">{m.text}</p>
              </div>
              <span className="inline-flex items-center gap-2.5 text-[15px] font-medium text-anthracite">
                <span className="border-b border-copper-700/40 pb-0.5 transition group-hover:border-copper-700">{cta}</span>
                <IconArrow className="transition group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </span>
            </Link>
          ))}
        </div>

        <div className="container mt-4">
          <div className="reveal grid gap-10 overflow-hidden rounded-[24px] bg-anthracite px-7 py-12 text-offwhite md:px-14 md:py-16 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <h2 className="display text-[clamp(2rem,3.6vw,3rem)]">{h.cta.title}</h2>
              <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-offwhite/70">{h.cta.text}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={href(locale, 'request-a-quote')} className="btn-copper">
                  {dict.cta.quote}
                </Link>
                <WhatsAppButton dict={dict} />
              </div>
            </div>
            <div className="lg:col-span-4 lg:col-start-8 lg:self-center">
              <ContactList dict={dict} />
              <p className="mt-6 text-[13.5px] text-offwhite/50">{dict.contact.hours}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
