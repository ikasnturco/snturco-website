import Link from 'next/link';
import { PageHero, CtaBand, FallbackNote, LevelDots, ArrowLink, type Crumb } from '@/components/ui';
import { ProductExplorer, type ExplorerItem } from '@/components/products/ProductExplorer';
import { ProductCard } from '@/components/products/ProductCard';
import { Gallery } from '@/components/products/Gallery';
import { YarnViewer } from '@/components/products/YarnViewer';
import { ContactList, WhatsAppButton } from '@/components/ContactLinks';
import { href, tx, isFallback, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/locales';
import { products, productBySlug, productImages, type Product } from '@/data/products';
import { cottons, cottonImages } from '@/data/cotton';

export function ProductsView({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pp = dict.productsPage;
  const items: ExplorerItem[] = [
    ...products.map<ExplorerItem>((p) => ({
      slug: p.slug,
      kind: 'yarn',
      to: href(locale, `products/${p.slug}`),
      image: productImages(p.slug).mainSmall,
      name: tx(p.name, locale),
      nameEn: p.nameEn,
      tagline: tx(p.tagline, locale),
      category: p.category,
      specialty: !!p.specialty,
      search: [tx(p.name, locale), p.nameEn, p.name.tr, tx(p.tagline, locale), ...tx(p.uses, locale), ...tx(p.products, locale)].join(' ').toLocaleLowerCase(),
      compare: {
        source: tx(p.compare.source, locale),
        moisture: p.compare.moisture,
        elasticity: p.compare.elasticity,
        durability: p.compare.durability,
        texture: tx(p.compare.texture, locale),
        uses: tx(p.uses, locale).slice(0, 3).join(', '),
      },
    })),
    ...cottons.map<ExplorerItem>((c) => ({
      slug: c.slug,
      kind: 'cotton',
      to: href(locale, `cotton/${c.slug}`),
      image: cottonImages(c.slug).mainSmall,
      name: tx(c.name, locale),
      nameEn: c.nameEn,
      tagline: tx(c.staple, locale),
      category: 'cotton',
      specialty: false,
      search: [tx(c.name, locale), c.nameEn, c.name.tr, tx(c.origin, locale)].join(' ').toLocaleLowerCase(),
    })),
  ];
  return (
    <>
      <PageHero eyebrow={pp.hero.eyebrow} title={pp.hero.title} lead={pp.hero.lead} crumbs={[{ label: dict.common.breadcrumbHome, href: href(locale) }, { label: dict.nav.allYarns, href: href(locale, 'products') }]} />
      <section className="bg-sand-50 pb-32 pt-14 md:pt-20">
        <div className="container">
          <ProductExplorer
            items={items}
            labels={{
              search: pp.search,
              searchPlaceholder: pp.searchPlaceholder,
              filterLabel: pp.filterLabel,
              noResults: pp.noResults,
              results: Array.from({ length: items.length + 1 }, (_, n) => (n === 1 ? pp.resultsOne : pp.results).replace('{n}', String(n))),
              categories: dict.common.categories,
              levels: dict.common.levels,
              compare: pp.compare,
            }}
          />
          <p className="mt-16 text-[13px] text-slate">{pp.note}</p>
        </div>
      </section>
      <CtaBand locale={locale} dict={dict} />
    </>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((x) => (
        <li key={x} className="flex gap-3 text-[15.5px] leading-relaxed text-charcoal">
          <span className="mt-[11px] h-px w-4 shrink-0 bg-copper" aria-hidden="true" />
          {x}
        </li>
      ))}
    </ul>
  );
}

export function ProductDetailView({ locale, dict, product: p }: { locale: Locale; dict: Dictionary; product: Product }) {
  const l = dict.product.labels;
  const img = productImages(p.slug);
  const name = tx(p.name, locale);
  const crumbs: Crumb[] = [
    { label: dict.common.breadcrumbHome, href: href(locale) },
    { label: dict.nav.allYarns, href: href(locale, 'products') },
    { label: name, href: href(locale, `products/${p.slug}`) },
  ];
  const related = p.related.map((s) => productBySlug[s]).filter(Boolean);
  const quoteHref = href(locale, 'request-a-quote', `yarn=${p.slug}`);
  const waMessage = dict.contact.whatsappProduct.replace('{yarn}', `${name}${locale === 'en' ? '' : ` (${p.nameEn})`}`);
  const facts = [
    { k: l.classification, v: tx(p.classification, locale) },
    { k: l.source, v: tx(p.source, locale) },
    { k: dict.productsPage.compare.criteria.moisture, v: <LevelDots level={p.compare.moisture} label={dict.common.levels[p.compare.moisture - 1]} /> },
    { k: dict.productsPage.compare.criteria.elasticity, v: <LevelDots level={p.compare.elasticity} label={dict.common.levels[p.compare.elasticity - 1]} /> },
    { k: dict.productsPage.compare.criteria.durability, v: <LevelDots level={p.compare.durability} label={dict.common.levels[p.compare.durability - 1]} /> },
  ];
  return (
    <>
      <PageHero eyebrow={dict.common.categories[p.category]} title={name} lead={tx(p.intro, locale)} crumbs={crumbs} image={img.main}>
        <div className="flex flex-wrap items-center gap-3">
          <Link href={quoteHref} className="btn-copper">
            {dict.cta.quoteThis}
          </Link>
          <WhatsAppButton dict={dict} message={waMessage} />
          <YarnViewer slug={p.slug} name={name} labels={dict.product.viewer} />
        </div>
        {locale !== 'en' && (
          <p className="mt-5 text-[14px] text-white/55">
            {l.nameEn}: <span className="text-white/85">{p.nameEn}</span>
          </p>
        )}
      </PageHero>

      <section className="bg-sand-50 py-16 md:py-24">
        <div className="container">
          <FallbackNote show={isFallback(p.intro, locale)} text={dict.common.fallbackNote} />
          <div className="grid gap-14 lg:grid-cols-12">
            <aside className="lg:col-span-4">
              <div className="card-surface p-7 lg:sticky lg:top-28">
                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-copper-700">{l.atAGlance}</p>
                <dl className="mt-5 divide-y divide-line">
                  <div className="pb-4">
                    <dt className="text-[12.5px] text-slate">{l.nameEn}</dt>
                    <dd className="mt-1 font-medium text-navy">{p.nameEn}</dd>
                  </div>
                  {facts.map((f) => (
                    <div key={f.k} className="py-4">
                      <dt className="text-[12.5px] text-slate">{f.k}</dt>
                      <dd className="mt-1.5 text-[15px] text-navy">{f.v}</dd>
                    </div>
                  ))}
                </dl>
                <Link href={quoteHref} className="btn-primary mt-4 w-full">
                  {dict.cta.quote}
                </Link>
                <div className="mt-6 border-t border-line pt-6">
                  <ContactList dict={dict} tone="light" showLocation={false} />
                </div>
              </div>
            </aside>

            <div className="space-y-14 lg:col-span-8">
              {p.note && (
                <div className="rounded-2xl border border-copper/30 bg-copper/5 p-6">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-copper-700">{l.note}</p>
                  <p className="mt-2 text-[15.5px] leading-relaxed text-charcoal">{tx(p.note, locale)}</p>
                </div>
              )}
              <div className="grid gap-10 md:grid-cols-2">
                <div>
                  <h2 className="display text-[26px] text-navy">{l.structure}</h2>
                  <p className="mt-3 text-[15.5px] leading-relaxed text-charcoal">{tx(p.structure, locale)}</p>
                </div>
                <div>
                  <h2 className="display text-[26px] text-navy">{l.texture}</h2>
                  <p className="mt-3 text-[15.5px] leading-relaxed text-charcoal">{tx(p.texture, locale)}</p>
                </div>
              </div>

              <div>
                <h2 className="display text-[26px] text-navy">{l.gallery}</h2>
                <Gallery images={img.gallery} small={img.gallerySmall} alt={`${name} – ${dict.common.renderNote}`} note={dict.common.renderNote} />
              </div>

              <div className="grid gap-10 md:grid-cols-2">
                <div>
                  <h2 className="display text-[26px] text-navy">{l.properties}</h2>
                  <div className="mt-4">
                    <List items={tx(p.properties, locale)} />
                  </div>
                </div>
                <div>
                  <h2 className="display text-[26px] text-navy">{l.advantages}</h2>
                  <div className="mt-4">
                    <List items={tx(p.advantages, locale)} />
                  </div>
                </div>
                <div>
                  <h2 className="display text-[26px] text-navy">{l.uses}</h2>
                  <div className="mt-4">
                    <List items={tx(p.uses, locale)} />
                  </div>
                </div>
                <div>
                  <h2 className="display text-[26px] text-navy">{l.products}</h2>
                  <div className="mt-4">
                    <List items={tx(p.products, locale)} />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-7 ring-1 ring-line">
                <h2 className="display text-[24px] text-navy">{l.care}</h2>
                <div className="mt-4">
                  <List items={tx(p.care, locale)} />
                </div>
              </div>

              {p.slug === 'cotton' && <ArrowLink href={href(locale, 'cotton')}>{dict.product.cottonLink}</ArrowLink>}

              <div className="rounded-2xl bg-anthracite p-8 text-offwhite md:p-10">
                <h2 className="display text-[30px]">{dict.product.quoteTitle}</h2>
                <p className="mt-3 max-w-lg text-offwhite/70">{dict.product.quoteText}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href={quoteHref} className="btn-copper">
                    {dict.cta.quoteThis}
                  </Link>
                  <WhatsAppButton dict={dict} message={waMessage} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-24">
        <div className="container">
          <h2 className="display text-[clamp(1.8rem,3vw,2.6rem)] text-navy">{l.related}</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (
              <ProductCard key={r.slug} to={href(locale, `products/${r.slug}`)} image={productImages(r.slug).mainSmall} name={tx(r.name, locale)} subtitle={tx(r.tagline, locale)} tag={dict.common.categories[r.category]} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
