'use client';

import { useEffect } from 'react';

/**
 * Adds the "in" class to every `.reveal` element when it scrolls into view.
 * Mounted once in the layout. Without JavaScript or with reduced motion everything is visible.
 */
export function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('no-js');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.classList.add('reduced');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    const observe = () => document.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el));
    observe();
    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}
