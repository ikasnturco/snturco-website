'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Dictionary } from '@/locales';

type Labels = Dictionary['product']['viewer'];
type Kind = 'yarn' | 'cotton';

/**
 * Interactive 3D yarn viewer. Nothing loads until the visitor opens it (three.js and the model are
 * fetched on demand). Drag to rotate, scroll or pinch to zoom, double-click or "Reset" to return.
 * Falls back to a message when WebGL is not available.
 */
export function YarnViewer({ slug, kind = 'yarn', name, labels }: { slug: string; kind?: Kind; name: string; labels: Labels }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="btn-ghost-light" data-viewer-open>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M12 3 4 7.5v9L12 21l8-4.5v-9L12 3Z" />
          <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
        </svg>
        {labels.open}
      </button>
      {open && <ViewerDialog slug={slug} kind={kind} name={name} labels={labels} onClose={() => setOpen(false)} />}
    </>
  );
}

function ViewerDialog({ slug, kind, name, labels, onClose }: { slug: string; kind: Kind; name: string; labels: Labels; onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const resetRef = useRef<() => void>(() => {});
  const [state, setState] = useState<'loading' | 'ready' | 'unsupported'>('loading');

  const close = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [close]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const box = boxRef.current;
    if (!canvas || !box) return;
    const test = document.createElement('canvas');
    if (!test.getContext('webgl2') && !test.getContext('webgl')) {
      setState('unsupported');
      return;
    }
    let disposed = false;
    let cleanup = () => {};
    (async () => {
      try {
        const [{ createRenderer, studioEnvironment }, { createViewer }, { looks, cottonLooks }, { OrbitControls }] = await Promise.all([
          import('@/components/3d/stage'),
          import('@/components/3d/viewerScene'),
          import('@/components/3d/looks'),
          import('three/examples/jsm/controls/OrbitControls.js'),
        ]);
        if (disposed) return;
        const look = (kind === 'cotton' ? cottonLooks[slug] : looks[slug]) ?? looks.cotton;
        const mobile = window.innerWidth < 768;
        const renderer = createRenderer(canvas, { antialias: true });
        const { env } = studioEnvironment(renderer);
        const v = createViewer({ look, seed: slug.length * 31 + 7, aspect: box.clientWidth / box.clientHeight, mobile });
        v.scene.environment = env;
        v.scene.environmentIntensity = 0.5;
        const controls = new OrbitControls(v.camera, canvas);
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.enablePan = false;
        controls.minDistance = 2.6;
        controls.maxDistance = 22;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        controls.autoRotate = !reduce;
        controls.autoRotateSpeed = 0.6;
        controls.addEventListener('start', () => (controls.autoRotate = false));
        resetRef.current = () => {
          v.camera.position.copy(v.home);
          controls.target.set(0, 0, 0);
          controls.update();
        };
        const size = () => {
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));
          renderer.setSize(box.clientWidth, box.clientHeight, false);
          v.resize(box.clientWidth / box.clientHeight);
        };
        size();
        let raf = 0;
        const loop = () => {
          raf = requestAnimationFrame(loop);
          controls.update();
          renderer.render(v.scene, v.camera);
        };
        loop();
        setState('ready');
        const onDbl = () => resetRef.current();
        canvas.addEventListener('dblclick', onDbl);
        window.addEventListener('resize', size);
        cleanup = () => {
          cancelAnimationFrame(raf);
          canvas.removeEventListener('dblclick', onDbl);
          window.removeEventListener('resize', size);
          controls.dispose();
          v.dispose();
          env.dispose();
          renderer.dispose();
        };
      } catch {
        if (!disposed) setState('unsupported');
      }
    })();
    return () => {
      disposed = true;
      cleanup();
    };
  }, [slug, kind]);

  return (
    <div role="dialog" aria-modal="true" aria-label={`${labels.title}: ${name}`} className="fixed inset-0 z-[80] flex flex-col bg-ink text-offwhite" data-viewer>
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 md:px-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-champagne">{labels.title}</p>
          <p className="display mt-1 text-[22px]">{name}</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => resetRef.current()} className="btn-ghost-light !px-4 !py-2 text-[13px]" disabled={state !== 'ready'}>
            {labels.reset}
          </button>
          <button type="button" onClick={close} className="btn-copper !px-4 !py-2 text-[13px]" autoFocus>
            {labels.close}
          </button>
        </div>
      </div>
      <div ref={boxRef} className="relative flex-1 touch-none">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full cursor-grab active:cursor-grabbing" aria-label={labels.hint} />
        {state !== 'ready' && (
          <div className="absolute inset-0 flex items-center justify-center p-8 text-center text-[15px] text-offwhite/70" aria-live="polite">
            {state === 'loading' ? (
              <span className="flex items-center gap-3">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-champagne border-t-transparent" aria-hidden="true" />
                {labels.loading}
              </span>
            ) : (
              labels.unsupported
            )}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 border-t border-white/10 px-5 py-3 text-[12.5px] text-offwhite/55 md:flex-row md:justify-between md:px-8">
        <span>{labels.hint}</span>
        <span>{labels.note}</span>
      </div>
    </div>
  );
}
