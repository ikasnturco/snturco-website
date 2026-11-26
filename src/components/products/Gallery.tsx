'use client';

import { useEffect, useState } from 'react';
import { asset } from '@/config/site';

/** Image gallery with a full-screen viewer (arrow keys, Escape). */
export function Gallery({ images, small, alt, note }: { images: string[]; small: string[]; alt: string; note: string }) {
  const [open, setOpen] = useState<number | null>(null);
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') setOpen((i) => ((i ?? 0) + 1) % images.length);
      if (e.key === 'ArrowLeft') setOpen((i) => ((i ?? 0) - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, images.length]);

  return (
    <>
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3">
        {small.map((src, i) => (
          <button key={src} type="button" onClick={() => setOpen(i)} className={`group relative overflow-hidden rounded-xl bg-ink ${i === 0 ? 'col-span-2 md:col-span-1' : ''}`} aria-label={`${alt} (${i + 1}/${images.length})`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(src)} alt={`${alt} (${i + 1})`} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover transition duration-700 ease-cine group-hover:scale-105" />
          </button>
        ))}
      </div>
      <p className="mt-3 text-[12px] text-slate">{note}</p>
      {open !== null && (
        <div role="dialog" aria-modal="true" aria-label={alt} className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/95 p-4" onClick={() => setOpen(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset(images[open])} alt={`${alt} (${open + 1})`} className="max-h-[88vh] max-w-full rounded-xl object-contain" onClick={(e) => e.stopPropagation()} />
          <button type="button" onClick={() => setOpen(null)} className="absolute end-5 top-5 rounded-full border border-white/30 px-4 py-2 text-white" autoFocus>
            ✕
          </button>
          <p className="absolute bottom-5 text-[13px] tabular-nums text-white/60">
            {open + 1} / {images.length}
          </p>
        </div>
      )}
    </>
  );
}
