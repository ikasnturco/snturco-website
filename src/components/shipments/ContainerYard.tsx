'use client';

import { useEffect, useRef, useState } from 'react';
import type { Dictionary } from '@/locales';
import type { PublicShipmentData } from '@/data/shipments';

/**
 * Shipments section: a live 3D container yard driven by scroll, one container per shipment record.
 * Counters come from src/data/shipments.json (computed at build time). With no verified records the
 * scene runs as a clearly labelled illustration and no figures are shown.
 */
export function ContainerYard({ dict, data }: { dict: Dictionary; data: PublicShipmentData }) {
  const t = dict.home.shipments;
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [mode, setMode] = useState<'loading' | 'live' | 'static' | 'none'>('loading');

  useEffect(() => {
    const wrap = wrapRef.current!;
    const canvas = canvasRef.current!;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const test = document.createElement('canvas');
    if (!test.getContext('webgl2') && !test.getContext('webgl')) {
      setMode('none');
      return;
    }
    let disposed = false;
    let raf = 0;
    let cleanup = () => {};
    let started = false;

    async function start() {
      if (started) return;
      started = true;
      const [{ createRenderer, studioEnvironment }, { createYard }, THREE] = await Promise.all([import('@/components/3d/stage'), import('@/components/3d/containerScene'), import('three')]);
      if (disposed) return;
      const mobile = window.innerWidth < 768;
      const renderer = createRenderer(canvas, { antialias: true });
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      const env = studioEnvironment(renderer).env;
      const yard = createYard({ containers: data.containers, aspect: canvas.clientWidth / Math.max(1, canvas.clientHeight), mobile, env });
      const size = () => {
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));
        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
        yard.resize(canvas.clientWidth / Math.max(1, canvas.clientHeight));
      };
      size();
      let p = reduced ? 1 : 0;
      let visible = true;
      const t0 = performance.now();
      const frame = () => {
        yard.update(p, (performance.now() - t0) / 1000);
        renderer.render(yard.scene, yard.camera);
      };
      if (reduced) {
        frame();
        setMode('static');
        setProgress(1);
      } else {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
        gsap.registerPlugin(ScrollTrigger);
        const st = ScrollTrigger.create({
          trigger: wrap,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          onUpdate: (self) => {
            p = self.progress;
            setProgress(self.progress);
          },
        });
        const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: '20% 0px' });
        io.observe(wrap);
        const loop = () => {
          raf = requestAnimationFrame(loop);
          if (visible && !document.hidden) frame();
        };
        loop();
        setMode('live');
        cleanup = () => {
          st.kill();
          io.disconnect();
        };
      }
      window.addEventListener('resize', size);
      const prev = cleanup;
      cleanup = () => {
        prev();
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', size);
        yard.dispose();
        env.dispose();
        renderer.dispose();
      };
    }
    const io = new IntersectionObserver(([e]) => e.isIntersecting && start(), { rootMargin: '100% 0px' });
    io.observe(wrap);
    return () => {
      disposed = true;
      io.disconnect();
      cleanup();
    };
  }, [data.containers]);

  const showCounters = !data.demo && (progress > 0.86 || mode === 'static' || mode === 'none');
  const intro = progress < 0.12 || mode !== 'live';
  const counters = [
    { label: t.counters.shipments, value: data.totals.successfulShipments },
    { label: t.counters.containers, value: data.totals.containersShipped },
    { label: t.counters.orders, value: data.totals.completedOrders },
  ];

  return (
    <section data-yard ref={wrapRef} id="shipments" aria-labelledby="shipments-title" className={`relative bg-ink text-white ${mode === 'live' || mode === 'loading' ? 'h-[420vh]' : ''}`}>
      <div className={`${mode === 'live' || mode === 'loading' ? 'sticky top-0 h-[100svh]' : 'relative h-[80svh] min-h-[560px]'} overflow-hidden`}>
        <canvas ref={canvasRef} aria-hidden="true" className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ${mode === 'live' || mode === 'static' ? 'opacity-100' : 'opacity-0'}`} />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(11,21,36,0.85)_0%,rgba(11,21,36,0)_30%,rgba(11,21,36,0)_60%,rgba(11,21,36,0.9)_100%)]" />

        <div className={`absolute inset-x-0 top-0 pt-28 transition-all duration-700 md:pt-32 ${intro || progress > 0.86 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="container">
            <p className="eyebrow text-copper-300">{t.eyebrow}</p>
            <h2 id="shipments-title" className="display mt-4 max-w-2xl text-[clamp(2rem,4.4vw,3.8rem)]">
              {t.title}
            </h2>
            <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-white/70">{t.text}</p>
          </div>
        </div>

        {data.demo && (
          <div className="absolute inset-x-0 bottom-0 pb-10 md:pb-14">
            <div className="container">
              <div className="max-w-md rounded-2xl border border-copper-300/30 bg-ink/70 p-5 backdrop-blur-md" role="note">
                <p className="inline-flex items-center gap-2 rounded-full bg-copper/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-copper-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-copper-300" aria-hidden="true" />
                  {t.demoBadge}
                </p>
                <p className="mt-3 text-[14px] leading-relaxed text-white/75">{t.demoText}</p>
              </div>
            </div>
          </div>
        )}

        {!data.demo && (
          <div className={`absolute inset-x-0 bottom-0 pb-12 transition-all duration-700 md:pb-16 ${showCounters ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
            <div className="container">
              <dl className="grid max-w-3xl gap-6 sm:grid-cols-3">
                {counters.map((c) => (
                  <div key={c.label} className="flex flex-col-reverse border-t border-white/20 pt-4">
                    <dt className="mt-1 text-[13px] uppercase tracking-[0.16em] text-white/60">{c.label}</dt>
                    <dd className="display text-[clamp(2.6rem,5vw,4.2rem)] tabular-nums text-white">
                      <CountUp value={c.value} run={showCounters} />
                    </dd>
                  </div>
                ))}
              </dl>
              {data.updated && (
                <p className="mt-6 text-[12px] text-white/45">
                  {t.updated}: {data.updated}
                </p>
              )}
            </div>
          </div>
        )}

        {mode === 'none' && <p className="absolute inset-x-0 top-1/2 text-center text-white/60">{t.fallback}</p>}
      </div>
    </section>
  );
}

function CountUp({ value, run }: { value: number; run: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const t0 = performance.now();
    const dur = 1400;
    const tick = () => {
      const k = Math.min(1, (performance.now() - t0) / dur);
      setN(Math.round(value * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [run, value]);
  return <>{n.toLocaleString()}</>;
}
