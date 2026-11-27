'use client';

import { useEffect, useRef, useState } from 'react';
import { asset } from '@/config/site';
import type { Dictionary } from '@/locales';

/**
 * Scroll-controlled 3D story. The animation is a pre-rendered frame sequence (rendered from the
 * Three.js fibre engine by scripts/render) drawn on a canvas. Scrolling down plays it forward,
 * scrolling up plays it backward (GSAP ScrollTrigger, scrubbed).
 */
export const STORY = {
  desktop: { dir: '/animations/story/desktop', frames: 144, w: 1440, h: 810 },
  mobile: { dir: '/animations/story/mobile', frames: 96, w: 720, h: 1280 },
};
/** Where each caption starts (fraction of the scroll). Matches src/components/3d/story.ts. */
const BEATS = [0, 0.1, 0.28, 0.38, 0.52, 0.64, 0.7, 0.86, 0.96];
const STATIONS = [0.72, 0.76, 0.8, 0.84];

const frameUrl = (dir: string, i: number) => asset(`${dir}/${String(i).padStart(3, '0')}.webp`);

export function StorySequence({ dict, nextId }: { dict: Dictionary; nextId: string }) {
  const s = dict.home.story;
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReduced(true);
      return;
    }
    const wrap = wrapRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const portrait = window.matchMedia('(max-aspect-ratio: 1/1)').matches;
    const set = portrait ? STORY.mobile : STORY.desktop;
    const images: (HTMLImageElement | null)[] = new Array(set.frames).fill(null);
    let current = 0;
    let disposed = false;
    let started = false;
    let killTrigger = () => {};

    const draw = (p: number) => {
      current = p;
      const f = p * (set.frames - 1);
      const lo = Math.floor(f);
      const k = f - lo;
      const nearest = (i: number) => {
        for (let d = 0; d < set.frames; d++) {
          if (images[i - d]) return images[i - d];
          if (images[i + d]) return images[i + d];
        }
        return null;
      };
      const a = nearest(lo);
      const b = images[Math.min(set.frames - 1, lo + 1)];
      const cw = canvas.width;
      const ch = canvas.height;
      const scale = Math.max(cw / set.w, ch / set.h);
      const dw = set.w * scale;
      const dh = set.h * scale;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2;
      ctx.fillStyle = '#18191b';
      ctx.fillRect(0, 0, cw, ch);
      if (a) {
        ctx.globalAlpha = 1;
        ctx.drawImage(a, dx, dy, dw, dh);
      }
      if (b && a !== b && k > 0.02) {
        ctx.globalAlpha = k;
        ctx.drawImage(b, dx, dy, dw, dh);
        ctx.globalAlpha = 1;
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      draw(current);
    };

    const load = (i: number) =>
      new Promise<void>((resolve) => {
        if (images[i]) return resolve();
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => {
          images[i] = img;
          resolve();
        };
        img.onerror = () => resolve();
        img.src = frameUrl(set.dir, i);
      });

    async function preload() {
      // Coarse pass first (every 6th frame) so scrubbing works quickly, then fill in.
      const order: number[] = [];
      for (const step of [6, 2, 1]) for (let i = 0; i < set.frames; i += step) if (!order.includes(i)) order.push(i);
      order.push(set.frames - 1);
      const coarse = Math.ceil(set.frames / 6) + 1;
      let done = 0;
      const queue = [...order];
      const worker = async () => {
        while (queue.length && !disposed) {
          const i = queue.shift()!;
          await load(i);
          done++;
          if (done <= coarse) setLoaded(Math.min(1, done / coarse));
          if (done === coarse) {
            setReady(true);
            draw(current);
          }
        }
      };
      await Promise.all([worker(), worker(), worker(), worker()]);
      draw(current);
    }

    async function start() {
      if (started) return;
      started = true;
      resize();
      preload();
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      const st = ScrollTrigger.create({
        trigger: wrap,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          draw(self.progress);
          setProgress(self.progress);
        },
      });
      killTrigger = () => st.kill();
    }

    const io = new IntersectionObserver(([e]) => e.isIntersecting && start(), { rootMargin: '150% 0px' });
    io.observe(wrap);
    window.addEventListener('resize', resize);
    return () => {
      disposed = true;
      io.disconnect();
      window.removeEventListener('resize', resize);
      killTrigger();
    };
  }, []);

  if (reduced) {
    // Static version: four key moments with their captions.
    const keys = [0, 3, 5, 8];
    return (
      <section aria-label={s.eyebrow} className="bg-ink py-24 text-white">
        <div className="container">
          <p className="eyebrow text-copper-300">{s.eyebrow}</p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {keys.map((b) => (
              <figure key={b} className="overflow-hidden rounded-2xl bg-navy-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={frameUrl(STORY.desktop.dir, Math.round(BEATS[b] * (STORY.desktop.frames - 1)) + (b === 8 ? -4 : 6))} alt="" loading="lazy" className="aspect-video w-full object-cover" />
                <figcaption className="p-6">
                  <p className="display text-2xl">{s.beats[b].title}</p>
                  <p className="mt-2 text-white/65">{s.beats[b].text}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    );
  }

  let beat = 0;
  for (let i = 0; i < BEATS.length; i++) if (progress >= BEATS[i] - 0.005) beat = i;
  const station = STATIONS.findIndex((t) => Math.abs(progress - t) < 0.021);
  const fadeOut = Math.min(1, Math.max(0, (progress - 0.975) / 0.025));

  return (
    <section data-story ref={wrapRef} aria-label={s.eyebrow} className="relative h-[420vh] bg-ink text-white md:h-[480vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(24,25,27,0.65)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-ink" style={{ opacity: fadeOut }} />

        {!ready && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5" role="status">
            <p className="text-[12px] uppercase tracking-[0.3em] text-white/60">{s.loading}</p>
            <div className="h-px w-56 overflow-hidden bg-white/15">
              <div className="h-full bg-copper-300 transition-[width] duration-300" style={{ width: `${Math.round(loaded * 100)}%` }} />
            </div>
            <p className="text-[12px] tabular-nums text-white/40">{Math.round(loaded * 100)}%</p>
          </div>
        )}

        {/* scrim keeps captions readable over dense fibre frames */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-ink/90 via-ink/50 to-transparent" />
        {/* captions */}
        <div className="absolute inset-x-0 bottom-0 pb-16 md:pb-20">
          <div className="container">
            <p className="eyebrow text-copper-300">{s.eyebrow}</p>
            <div className="relative mt-4 h-[150px] max-w-xl md:h-[170px]">
              {s.beats.map((b, i) => (
                <div
                  key={i}
                  aria-hidden={i !== beat}
                  className={`absolute inset-0 transition-all duration-700 ease-cine ${i === beat && ready ? 'translate-y-0 opacity-100' : i < beat ? '-translate-y-4 opacity-0' : 'translate-y-4 opacity-0'}`}
                >
                  <p className="display text-[clamp(2rem,4.4vw,3.6rem)] [text-shadow:0_2px_24px_rgba(24,25,27,0.8)]">{b.title}</p>
                  {b.text && <p className="mt-3 max-w-md text-[16px] leading-relaxed text-white/70 md:text-[18px]">{b.text}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* fibre labels while the four yarns are shown */}
        <div className="pointer-events-none absolute inset-x-0 top-[18%]">
          <div className="container relative">
            {s.yarns.map((y, i) => (
              <div key={y.name} className={`absolute start-5 top-0 w-64 transition-all duration-500 md:start-8 ${station === i ? 'opacity-100' : 'translate-y-3 opacity-0'}`}>
                <p className="text-[11px] uppercase tracking-[0.3em] text-copper-300">0{i + 1} / 04</p>
                <p className="display mt-2 text-4xl">{y.name}</p>
                <p className="mt-1 text-[15px] text-white/70">{y.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* progress rail */}
        <div className="absolute end-5 top-1/2 hidden h-48 -translate-y-1/2 md:block md:end-8" aria-hidden="true">
          <div className="relative h-full w-px bg-white/15">
            <div className="absolute inset-x-0 top-0 bg-copper-300" style={{ height: `${progress * 100}%` }} />
            {BEATS.map((b) => (
              <span key={b} className={`absolute -start-[3px] h-[7px] w-[7px] rounded-full border ${progress >= b ? 'border-copper-300 bg-copper-300' : 'border-white/30 bg-ink'}`} style={{ top: `calc(${b * 100}% - 3px)` }} />
            ))}
          </div>
        </div>

        <a href={`#${nextId}`} className="absolute end-5 top-24 text-[12px] text-white/45 underline-offset-4 hover:text-white hover:underline md:end-8">
          {s.skip}
        </a>
      </div>
    </section>
  );
}
