'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ProductCard } from './ProductCard';
import { LevelDots } from '@/components/ui';
import { asset } from '@/config/site';

export type ExplorerItem = {
  slug: string;
  kind: 'yarn' | 'cotton';
  to: string;
  image: string;
  name: string;
  nameEn: string;
  tagline: string;
  category: 'natural' | 'synthetic' | 'regenerated' | 'cotton';
  specialty: boolean;
  search: string;
  compare?: { source: string; moisture: number; elasticity: number; durability: number; texture: string; uses: string };
};

type Labels = {
  search: string;
  searchPlaceholder: string;
  filterLabel: string;
  noResults: string;
  results: string[];
  categories: Record<string, string>;
  levels: string[];
  compare: { add: string; added: string; title: string; hint: string; open: string; clear: string; close: string; max: string; note: string; criteria: Record<'source' | 'moisture' | 'elasticity' | 'durability' | 'texture' | 'uses', string> };
};

const FILTERS = ['all', 'natural', 'synthetic', 'regenerated', 'cotton', 'specialty'] as const;
type Filter = (typeof FILTERS)[number];

export function ProductExplorer({ items, labels }: { items: ExplorerItem[]; labels: Labels }) {
  const [filter, setFilter] = useState<Filter>('all');
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [warn, setWarn] = useState(false);

  // read ?filter=...&q=... once, keep the URL in sync
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const f = sp.get('filter') as Filter | null;
    if (f && FILTERS.includes(f)) setFilter(f);
    if (sp.get('q')) setQ(sp.get('q')!);
  }, []);
  useEffect(() => {
    const sp = new URLSearchParams();
    if (filter !== 'all') sp.set('filter', filter);
    if (q) sp.set('q', q);
    const qs = sp.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${qs ? `?${qs}` : ''}`);
  }, [filter, q]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const list = useMemo(() => {
    const needle = q.trim().toLocaleLowerCase();
    return items.filter((it) => {
      const inFilter =
        filter === 'all' ? it.kind === 'yarn' || !!needle : filter === 'cotton' ? it.kind === 'cotton' : filter === 'specialty' ? it.specialty : it.kind === 'yarn' && it.category === filter;
      return inFilter && (!needle || it.search.includes(needle));
    });
  }, [items, filter, q]);

  const toggle = (slug: string) => {
    setWarn(false);
    setSelected((s) => {
      if (s.includes(slug)) return s.filter((x) => x !== slug);
      if (s.length >= 4) {
        setWarn(true);
        return s;
      }
      return [...s, slug];
    });
  };
  const chosen = selected.map((s) => items.find((i) => i.slug === s)!).filter(Boolean);
  const count = labels.results[Math.min(list.length, labels.results.length - 1)] ?? `${list.length}`;
  const c = labels.compare;

  return (
    <div>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label={labels.filterLabel} className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-[14px] transition ${filter === f ? 'border-navy bg-navy text-white' : 'border-navy/15 bg-white text-navy hover:border-navy/40'}`}
            >
              {labels.categories[f]}
            </button>
          ))}
        </div>
        <label className="relative block w-full lg:w-80">
          <span className="sr-only">{labels.search}</span>
          <svg className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-slate" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={labels.searchPlaceholder} className="w-full rounded-full border border-navy/15 bg-white py-3 pe-4 ps-11 text-[15px] outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/10" />
        </label>
      </div>
      <p className="mt-6 text-[13px] text-slate" aria-live="polite">
        {count}
      </p>

      {list.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-navy/20 p-10 text-center text-slate">{labels.noResults}</p>
      ) : (
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((it, i) => (
            <li key={`${it.kind}-${it.slug}`} className="relative">
              <ProductCard to={it.to} image={it.image} name={it.name} subtitle={it.tagline} tag={labels.categories[it.kind === 'cotton' ? 'cotton' : it.category]} index={i} />
              {it.compare && (
                <button
                  type="button"
                  onClick={() => toggle(it.slug)}
                  aria-pressed={selected.includes(it.slug)}
                  className={`absolute bottom-[-14px] end-5 z-10 rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium shadow-lg transition ${selected.includes(it.slug) ? 'border-copper bg-copper text-white' : 'border-line bg-white text-navy hover:border-copper'}`}
                >
                  {selected.includes(it.slug) ? `✓ ${c.added}` : `+ ${c.add}`}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* compare tray */}
      <div className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-500 ease-cine ${selected.length ? 'translate-y-0' : 'translate-y-full'}`} aria-hidden={!selected.length}>
        <div className="container pb-4">
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-white/95 p-3 shadow-2xl shadow-navy/20 backdrop-blur md:p-4">
            <p className="ps-2 text-[14px] font-medium text-navy">{c.title}</p>
            <ul className="flex flex-1 flex-wrap gap-2">
              {chosen.map((it) => (
                <li key={it.slug}>
                  <button type="button" onClick={() => toggle(it.slug)} className="rounded-full bg-sand px-3 py-1.5 text-[13px] text-navy hover:bg-sand-200" aria-label={`${it.name} ×`}>
                    {it.name} ×
                  </button>
                </li>
              ))}
            </ul>
            {warn && <p className="text-[12.5px] text-copper-700">{c.max}</p>}
            {selected.length < 2 && <p className="text-[12.5px] text-slate">{c.hint}</p>}
            <button type="button" onClick={() => setSelected([])} className="rounded-full px-4 py-2 text-[13px] text-slate hover:text-navy">
              {c.clear}
            </button>
            <button type="button" disabled={selected.length < 2} onClick={() => setOpen(true)} className="btn-primary !py-2.5">
              {c.open} ({selected.length})
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div role="dialog" aria-modal="true" aria-labelledby="compare-title" className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/60 p-0 backdrop-blur-sm md:items-center md:p-8" onClick={() => setOpen(false)}>
          <div className="max-h-[92vh] w-full max-w-6xl overflow-auto rounded-t-3xl bg-sand-50 p-6 md:rounded-3xl md:p-10" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-6">
              <h2 id="compare-title" className="display text-3xl text-navy md:text-4xl">
                {c.title}
              </h2>
              <button type="button" onClick={() => setOpen(false)} className="btn-outline !px-4 !py-2" autoFocus>
                {c.close}
              </button>
            </div>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-start text-[14.5px]">
                <thead>
                  <tr>
                    <th className="w-44" />
                    {chosen.map((it) => (
                      <th key={it.slug} scope="col" className="px-3 pb-4 text-start align-bottom">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={asset(it.image)} alt="" className="mb-3 aspect-[4/3] w-full rounded-xl object-cover" />
                        <Link href={it.to} className="display text-2xl text-navy hover:text-copper-700">
                          {it.name}
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(['source', 'moisture', 'elasticity', 'durability', 'texture', 'uses'] as const).map((k) => (
                    <tr key={k} className="border-t border-line">
                      <th scope="row" className="py-4 pe-4 text-start align-top text-[12.5px] font-semibold uppercase tracking-[0.12em] text-slate">
                        {c.criteria[k]}
                      </th>
                      {chosen.map((it) => {
                        const v = it.compare![k];
                        return (
                          <td key={it.slug} className="px-3 py-4 align-top text-charcoal">
                            {typeof v === 'number' ? <LevelDots level={v} label={labels.levels[v - 1]} /> : v}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-6 text-[13px] text-slate">{c.note}</p>
          </div>
        </div>
      )}
    </div>
  );
}
