type Props = { className?: string; inverted?: boolean; withTagline?: boolean; tagline?: string };

/** SNTURCO mark: an "S" drawn as a single yarn strand, ending in a copper thread tail. */
export function LogoMark({ size = 40, inverted = false }: { size?: number; inverted?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <rect width="48" height="48" rx="10" fill={inverted ? '#F1EEE9' : '#202124'} />
      <path
        d="M32.5 15.2c-2-2.3-5-3.6-8.4-3.6-4.8 0-8.3 2.6-8.3 6.4 0 4 3.7 5.4 8.4 6.5 4.8 1.1 8.5 2.6 8.5 6.7 0 4-3.7 6.9-8.8 6.9-3.6 0-6.8-1.4-8.8-3.9"
        fill="none"
        stroke={inverted ? '#202124' : '#F1EEE9'}
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path d="M15.1 34.2c-1.6-1.9-3.8-2.5-6.1-1.9" fill="none" stroke="#C6A98E" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="32.5" cy="15.2" r="2.1" fill="#C6A98E" />
    </svg>
  );
}

export function Logo({ className = '', inverted = false, withTagline = false, tagline = '' }: Props) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`} dir="ltr">
      <LogoMark inverted={inverted} />
      <span className="flex flex-col leading-none">
        <span className={`font-sans text-[19px] font-semibold tracking-brand ${inverted ? 'text-offwhite' : 'text-anthracite'}`}>SNTURCO</span>
        {withTagline && (
          <span className={`mt-1.5 text-[10px] uppercase tracking-[0.18em] ${inverted ? 'text-white/60' : 'text-slate'}`}>{tagline}</span>
        )}
      </span>
    </span>
  );
}
