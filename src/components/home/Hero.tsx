'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { asset } from '@/config/site';
import { href, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/locales';

/**
 * Home hero. A pre-rendered poster shows immediately; the live WebGL yarn scene loads after first paint
 * and fades in over it. Reduced motion or no WebGL: the poster stays.
 */
export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [live, setLive] = useState(false);
  const h = dict.home.hero;

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const test = document.createElement('canvas');
    if (!test.getContext('webgl2') && !test.getContext('webgl')) return;

    let disposed = false;
    let raf = 0;
    let cleanup = () => {};
    const start = async () => {
      const [{ createRenderer }, { createHero }] = await Promise.all([import('@/components/3d/stage'), import('@/components/3d/heroScene')]);
      if (disposed) return;
      const mobile = window.innerWidth < 768 || ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8) < 4;
      const renderer = createRenderer(canvas, { antialias: !mobile || window.devicePixelRatio < 2 });
      const size = () => {
        const w = section.clientWidth;
        const hh = section.clientHeight;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));
        renderer.setSize(w, hh, false);
        hero.resize(w / hh);
      };
      const hero = createHero({ aspect: section.clientWidth / section.clientHeight, mobile });
      await hero.build(undefined, () => new Promise((r) => setTimeout(r, 0)));
      if (disposed) {
        hero.dispose();
        renderer.dispose();
        return;
      }
      size();
      let px = 0;
      let py = 0;
      let tx = 0;
      let ty = 0;
      let visible = true;
      const onPointer = (e: PointerEvent) => {
        tx = (e.clientX / window.innerWidth) * 2 - 1;
        ty = -((e.clientY / window.innerHeight) * 2 - 1);
      };
      const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
      io.observe(section);
      const t0 = performance.now();
      const loop = () => {
        raf = requestAnimationFrame(loop);
        if (!visible || document.hidden) return;
        px += (tx - px) * 0.04;
        py += (ty - py) * 0.04;
        const scroll = Math.min(1, Math.max(0, window.scrollY / section.clientHeight));
        hero.update((performance.now() - t0) / 1000, scroll, px, py);
        renderer.render(hero.scene, hero.camera);
      };
      loop();
      setLive(true);
      window.addEventListener('pointermove', onPointer, { passive: true });
      window.addEventListener('resize', size);
      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        window.removeEventListener('pointermove', onPointer);
        window.removeEventListener('resize', size);
        hero.dispose();
        renderer.dispose();
      };
    };
    // start after the page is interactive
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    const id = idle ? idle(() => start(), { timeout: 1200 }) : window.setTimeout(start, 300);
    return () => {
      disposed = true;
      if (!idle) window.clearTimeout(id);
      cleanup();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative isolate h-[100svh] min-h-[620px] overflow-hidden bg-ink text-white">
      <picture>
        <source media="(max-width: 767px)" srcSet={asset('/images/hero/poster-mobile.webp')} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset('/images/hero/poster.webp')} alt="" aria-hidden="true" fetchPriority="high" className="absolute inset-0 -z-20 h-full w-full object-cover" />
      </picture>
      <canvas ref={canvasRef} aria-hidden="true" className={`absolute inset-0 -z-10 h-full w-full transition-opacity duration-[1600ms] ${live ? 'opacity-100' : 'opacity-0'}`} />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(11,21,36,0.88)_0%,rgba(11,21,36,0.55)_38%,rgba(11,21,36,0)_70%)] max-md:bg-[linear-gradient(0deg,rgba(11,21,36,0.95)_10%,rgba(11,21,36,0.5)_45%,rgba(11,21,36,0)_70%)] rtl:md:bg-[linear-gradient(270deg,rgba(11,21,36,0.88)_0%,rgba(11,21,36,0.55)_38%,rgba(11,21,36,0)_70%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-ink to-transparent" />

      <div className="container flex h-full flex-col justify-end pb-24 md:justify-center md:pb-0">
        <div className="max-w-3xl">
          <p className="eyebrow animate-rise text-copper-300 [animation-delay:200ms]">{h.eyebrow}</p>
          <h1 className="display mt-6 animate-rise text-[clamp(3rem,8vw,7rem)] [animation-delay:320ms]">{h.title}</h1>
          <p className="mt-7 max-w-xl animate-rise text-[clamp(1.05rem,1.6vw,1.3rem)] leading-relaxed text-white/75 [animation-delay:460ms]">{h.lead}</p>
          <div className="mt-10 flex animate-rise flex-wrap gap-3 [animation-delay:600ms]">
            <Link href={href(locale, 'products')} className="btn-copper">
              {dict.cta.explore}
            </Link>
            <Link href={href(locale, 'about')} className="btn-ghost-light">
              {dict.cta.discover}
            </Link>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-8 start-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-white/50 md:flex rtl:translate-x-1/2" aria-hidden="true">
        {dict.common.scroll}
        <span className="relative h-12 w-px overflow-hidden bg-white/15">
          <span className="absolute inset-0 animate-line bg-copper-300" />
        </span>
      </div>
    </section>
  );
}
