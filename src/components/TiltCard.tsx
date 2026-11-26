'use client';

import { useRef, type ReactNode } from 'react';

/** Card with a light perspective tilt and a soft light that follows the pointer (desktop only). */
export function TiltCard({ children, className = '', max = 7 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  function onMove(e: React.PointerEvent) {
    if (e.pointerType !== 'mouse') return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty('--rx', `${(0.5 - y) * max}deg`);
      el.style.setProperty('--ry', `${(x - 0.5) * max}deg`);
      el.style.setProperty('--lx', `${x * 100}%`);
      el.style.setProperty('--ly', `${y * 100}%`);
      el.style.setProperty('--la', '1');
    });
  }
  function onLeave() {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--la', '0');
  }
  return (
    <div className="[perspective:1100px]">
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className={`group/tilt relative transition-transform duration-500 ease-cine [transform-style:preserve-3d] [transform:rotateX(var(--rx,0))_rotateY(var(--ry,0))] motion-reduce:![transform:none] ${className}`}
      >
        {children}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-[var(--la,0)] transition-opacity duration-500 [background:radial-gradient(420px_circle_at_var(--lx,50%)_var(--ly,50%),rgba(255,236,214,0.22),transparent_45%)]"
        />
      </div>
    </div>
  );
}
