import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;
const base = (props: P) => ({
  width: 28,
  height: 28,
  viewBox: '0 0 32 32',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  ...props,
});

export const IconCone = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 4h8l5 23H7L12 4Z" />
    <path d="M10.6 10.5c3.6 1 7.2 1 10.8 0M9.4 16c4.4 1.2 8.8 1.2 13.2 0M8.2 21.5c5.2 1.3 10.4 1.3 15.6 0" />
  </svg>
);
export const IconFabric = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 7h22v18H5z" />
    <path d="M5 12h22M5 17h22M5 22h22M10 7v18M16 7v18M22 7v18" opacity=".55" />
  </svg>
);
export const IconFibre = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 24c4-10 9-14 20-16" />
    <path d="M6 18c5-6 10-8 18-8M9 27c3-7 8-12 17-14" opacity=".6" />
  </svg>
);
export const IconSearch = (p: P) => (
  <svg {...base(p)}>
    <circle cx="14" cy="14" r="8" />
    <path d="m20 20 7 7" />
  </svg>
);
export const IconDocument = (p: P) => (
  <svg {...base(p)}>
    <path d="M8 4h11l5 5v19H8z" />
    <path d="M19 4v5h5M12 15h8M12 19h8M12 23h5" />
  </svg>
);
export const IconSample = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 10 16 5l10 5-10 5-10-5Z" />
    <path d="M6 10v11l10 5 10-5V10M16 15v11" />
  </svg>
);
export const IconTruck = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 8h16v14H3zM19 13h5l4 4v5h-9" />
    <circle cx="8" cy="24" r="2.5" />
    <circle cx="23" cy="24" r="2.5" />
  </svg>
);
export const IconGlobe = (p: P) => (
  <svg {...base(p)}>
    <circle cx="16" cy="16" r="12" />
    <path d="M4 16h24M16 4c3.5 3.4 5 7.4 5 12s-1.5 8.6-5 12c-3.5-3.4-5-7.4-5-12s1.5-8.6 5-12Z" />
  </svg>
);
export const IconHandshake = (p: P) => (
  <svg {...base(p)}>
    <path d="m3 14 6-6 5 2 4-2 6 2 5 4" />
    <path d="m29 14-7 7-3-1-3 3-3-1-3 2-7-8" />
    <path d="m13 16 3 3M16 14l4 4" />
  </svg>
);
export const IconChat = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 7h22v14H14l-6 5v-5H5z" />
  </svg>
);
export const IconCheck = (p: P) => (
  <svg {...base(p)}>
    <path d="m7 16 6 6 12-12" />
  </svg>
);
export const IconChain = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="12" width="10" height="8" rx="4" />
    <rect x="19" y="12" width="10" height="8" rx="4" />
    <path d="M11 16h10" />
  </svg>
);
export const IconChart = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 27h24M8 22v-6M14 22V10M20 22v-9M26 22V6" />
  </svg>
);
export const IconMail = (p: P) => (
  <svg {...base(p)}>
    <rect x="4" y="7" width="24" height="18" rx="2" />
    <path d="m5 9 11 8 11-8" />
  </svg>
);
export const IconPin = (p: P) => (
  <svg {...base(p)}>
    <path d="M16 28s9-8.3 9-15a9 9 0 0 0-18 0c0 6.7 9 15 9 15Z" />
    <circle cx="16" cy="13" r="3" />
  </svg>
);
export const IconArrow = (p: P) => (
  <svg {...base({ width: 18, height: 18, strokeWidth: 1.8, ...p })} className={`rtl:-scale-x-100 ${p.className ?? ''}`}>
    <path d="M6 16h20M19 9l7 7-7 7" />
  </svg>
);
export const IconWhatsApp = (p: P) => (
  <svg width={26} height={26} viewBox="0 0 32 32" aria-hidden="true" {...p}>
    <path
      fill="currentColor"
      d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3Zm0 23.7c-2 0-4-.6-5.7-1.6l-.4-.2-3.9 1 1-3.8-.3-.4A10.7 10.7 0 1 1 16 26.7Zm5.9-8c-.3-.2-1.9-1-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.3-.7.1a8.8 8.8 0 0 1-4.4-3.8c-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.3 1.4 3.5c.2.2 2.4 3.6 5.8 5.1 2.1.9 3 1 4 .8.7-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5l-.6-.3Z"
    />
  </svg>
);

export const iconByKey = {
  yarns: IconCone,
  fabrics: IconFabric,
  raw: IconFibre,
} as const;

export const serviceIcons = [IconSearch, IconHandshake, IconSample, IconTruck, IconChain, IconChart];
