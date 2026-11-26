import Link from 'next/link';
import { TiltCard } from '@/components/TiltCard';
import { asset } from '@/config/site';

/** Premium product card: 3D render with perspective tilt and light on hover. */
export function ProductCard({ to, image, name, subtitle, tag, index, size = 'md' }: { to: string; image: string; name: string; subtitle?: string; tag?: string; index?: number; size?: 'md' | 'lg' }) {
  return (
    <TiltCard className="h-full rounded-[22px]">
      <Link href={to} className="group relative block h-full overflow-hidden rounded-[22px] bg-ink text-white shadow-[0_30px_60px_-35px_rgba(24,25,27,0.6)]">
        <div className={`relative overflow-hidden ${size === 'lg' ? 'aspect-[4/5]' : 'aspect-[4/4.6]'}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset(image)}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full scale-[1.04] object-cover transition-transform duration-[1200ms] ease-cine [transform:translateZ(0)] group-hover:scale-[1.12]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
          {typeof index === 'number' && <span className="absolute start-5 top-5 text-[11px] tabular-nums tracking-[0.25em] text-white/55">{String(index + 1).padStart(2, '0')}</span>}
          {tag && <span className="absolute end-5 top-5 rounded-full border border-white/20 bg-ink/40 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-white/80 backdrop-blur">{tag}</span>}
          <div className="absolute inset-x-0 bottom-0 p-6 [transform:translateZ(40px)]">
            <h3 className="display text-[28px] leading-tight transition-transform duration-700 ease-cine group-hover:-translate-y-1">{name}</h3>
            {subtitle && <p className="mt-2 max-h-0 overflow-hidden text-[14px] leading-relaxed text-white/70 opacity-0 transition-all duration-700 ease-cine group-hover:max-h-24 group-hover:opacity-100 group-focus-visible:max-h-24 group-focus-visible:opacity-100 max-lg:max-h-24 max-lg:opacity-100">{subtitle}</p>}
          </div>
        </div>
      </Link>
    </TiltCard>
  );
}
