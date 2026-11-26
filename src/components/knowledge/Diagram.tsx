import { tx, type L, type Locale } from '@/i18n/config';
import type { Topic } from '@/data/knowledge';

/** Simple, accurate line diagrams for the Textile Knowledge topics. Pure SVG, no images. */
const C = { navy: '#14243b', copper: '#a86b45', light: '#d0a385', sand: '#ebe4d8', slate: '#5c6470', ecru: '#efe6d4' };

const t: Record<string, L> = {
  natural: { en: 'Natural', tr: 'Doğal' },
  synthetic: { en: 'Synthetic', tr: 'Sentetik' },
  regenerated: { en: 'Regenerated', tr: 'Rejenere' },
  plant: { en: 'Plant', tr: 'Bitki' },
  animal: { en: 'Animal', tr: 'Hayvan' },
  polymer: { en: 'Polymer', tr: 'Polimer' },
  cellulose: { en: 'Cellulose', tr: 'Selüloz' },
  dissolve: { en: 'Dissolve', tr: 'Çözme' },
  extrude: { en: 'Extrude', tr: 'Çekim' },
  fibre: { en: 'Fibre', tr: 'Lif' },
  opening: { en: 'Opening', tr: 'Açma' },
  carding: { en: 'Carding', tr: 'Tarak' },
  drawing: { en: 'Drawing', tr: 'Cer' },
  roving: { en: 'Roving', tr: 'Fitil' },
  spinning: { en: 'Spinning', tr: 'Eğirme' },
  winding: { en: 'Winding', tr: 'Bobin' },
  ring: { en: 'Ring', tr: 'Ring' },
  openend: { en: 'Open-end', tr: 'Open-end' },
  filament: { en: 'Filament', tr: 'Filament' },
  staple: { en: 'Staple', tr: 'Kesikli lif' },
  low: { en: 'Low twist', tr: 'Az büküm' },
  high: { en: 'High twist', tr: 'Çok büküm' },
  finer: { en: 'finer', tr: 'daha ince' },
  heavier: { en: 'heavier', tr: 'daha kalın' },
  even: { en: 'Evenness', tr: 'Düzgünlük' },
  strength: { en: 'Strength', tr: 'Mukavemet' },
  hairiness: { en: 'Hairiness', tr: 'Tüylülük' },
  faults: { en: 'Faults', tr: 'Hatalar' },
  enduse: { en: 'End use', tr: 'Son kullanım' },
  fabric: { en: 'Fabric', tr: 'Kumaş' },
  count: { en: 'Count', tr: 'Numara' },
  yarn: { en: 'Yarn', tr: 'İplik' },
  apparel: { en: 'Apparel', tr: 'Giyim' },
  home: { en: 'Home', tr: 'Ev tekstili' },
  technical: { en: 'Technical', tr: 'Teknik' },
};

function Twisted({ x, y, w, turns, amp, color, color2 = C.light }: { x: number; y: number; w: number; turns: number; amp: number; color: string; color2?: string }) {
  const pts = (phase: number) =>
    Array.from({ length: 121 }, (_, i) => {
      const u = i / 120;
      return `${(x + u * w).toFixed(1)},${(y + Math.sin(u * turns * Math.PI * 2 + phase) * amp).toFixed(1)}`;
    }).join(' ');
  return (
    <g fill="none" strokeLinecap="round">
      <polyline points={pts(0)} stroke={color} strokeWidth={5} />
      <polyline points={pts(Math.PI)} stroke={color2} strokeWidth={5} />
    </g>
  );
}

function Hairy({ x, y, w, n, len, seed = 1 }: { x: number; y: number; w: number; n: number; len: number; seed?: number }) {
  let s = seed;
  const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  return (
    <g stroke={C.light} strokeWidth={1.2} fill="none" strokeLinecap="round">
      {Array.from({ length: n }, (_, i) => {
        const px = x + r() * w;
        const up = r() > 0.5 ? -1 : 1;
        return <path key={i} d={`M${px},${y + up * 4} q${(r() - 0.5) * len},${up * len * 0.6} ${(r() - 0.5) * len * 1.4},${up * len}`} />;
      })}
    </g>
  );
}

export function Diagram({ visual, locale }: { visual: Topic['visual']; locale: Locale }) {
  const s = (k: keyof typeof t) => tx(t[k], locale);
  const label = { fontSize: 15, fill: C.slate, fontFamily: 'Inter Variable, system-ui, sans-serif' } as const;
  const strong = { ...label, fill: C.navy, fontWeight: 600 } as const;
  let body: React.ReactNode;

  switch (visual) {
    case 'families':
      body = (
        <>
          {[
            { k: 'natural' as const, sub: `${s('plant')} · ${s('animal')}`, c: C.ecru },
            { k: 'regenerated' as const, sub: s('cellulose'), c: C.light },
            { k: 'synthetic' as const, sub: s('polymer'), c: '#9fb0c8' },
          ].map((f, i) => (
            <g key={f.k} transform={`translate(${30 + i * 180},40)`}>
              <circle cx={70} cy={70} r={62} fill={f.c} opacity={0.55} />
              <circle cx={70} cy={70} r={62} fill="none" stroke={C.navy} strokeOpacity={0.25} />
              <text x={70} y={68} textAnchor="middle" style={strong}>
                {s(f.k)}
              </text>
              <text x={70} y={90} textAnchor="middle" style={label}>
                {f.sub}
              </text>
            </g>
          ))}
        </>
      );
      break;
    case 'regenerated':
      body = (
        <>
          {(['cellulose', 'dissolve', 'extrude', 'fibre'] as const).map((k, i) => (
            <g key={k} transform={`translate(${20 + i * 140},70)`}>
              <rect width={110} height={56} rx={28} fill={i === 3 ? C.navy : C.sand} />
              <text x={55} y={33} textAnchor="middle" style={{ ...strong, fill: i === 3 ? '#fff' : C.navy }}>
                {s(k)}
              </text>
              {i < 3 && <path d="M116,28 h18 m-6,-6 l6,6 l-6,6" stroke={C.copper} strokeWidth={2} fill="none" />}
            </g>
          ))}
          <g transform="translate(450,150)" stroke={C.copper} strokeWidth={2}>
            {[0, 8, 16, 24, 32].map((d) => (
              <line key={d} x1={d} y1={0} x2={d + 10} y2={40} />
            ))}
          </g>
        </>
      );
      break;
    case 'process':
      body = (
        <>
          {(['opening', 'carding', 'drawing', 'roving', 'spinning', 'winding'] as const).map((k, i) => (
            <g key={k} transform={`translate(${14 + i * 94},60)`}>
              <circle cx={38} cy={38} r={34} fill={i === 4 ? C.copper : C.sand} />
              <text x={38} y={43} textAnchor="middle" style={{ ...strong, fontSize: 18, fill: i === 4 ? '#fff' : C.navy }}>
                {i + 1}
              </text>
              <text x={38} y={102} textAnchor="middle" style={{ ...label, fontSize: 13 }}>
                {s(k)}
              </text>
              {i < 5 && <path d="M76,38 h16" stroke={C.copper} strokeWidth={2} />}
            </g>
          ))}
        </>
      );
      break;
    case 'ring':
    case 'openend':
      body = (
        <>
          <text x={30} y={50} style={strong}>
            {s(visual === 'ring' ? 'ring' : 'openend')}
          </text>
          {visual === 'ring' ? (
            <>
              <Twisted x={30} y={110} w={520} turns={9} amp={9} color={C.navy} />
              <Hairy x={30} y={110} w={520} n={10} len={10} />
            </>
          ) : (
            <>
              <Twisted x={30} y={110} w={520} turns={6} amp={11} color={C.navy} />
              {Array.from({ length: 14 }, (_, i) => (
                <path key={i} d={`M${50 + i * 36},${96 + (i % 2) * 28} c6,-6 12,6 18,0`} stroke={C.navy} strokeWidth={3} fill="none" />
              ))}
              <Hairy x={30} y={110} w={520} n={34} len={16} seed={7} />
            </>
          )}
        </>
      );
      break;
    case 'filament':
      body = (
        <>
          <text x={30} y={46} style={strong}>
            {s('filament')}
          </text>
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={i} x1={30} x2={550} y1={66 + i * 5} y2={66 + i * 5} stroke={i % 2 ? C.light : C.navy} strokeWidth={3} strokeLinecap="round" />
          ))}
          <text x={30} y={140} style={strong}>
            {s('staple')}
          </text>
          {Array.from({ length: 22 }, (_, i) => {
            const x = 30 + ((i * 47) % 470);
            const y = 160 + (i % 5) * 5;
            return <line key={i} x1={x} x2={x + 70 + (i % 3) * 12} y1={y} y2={y + ((i % 2) - 0.5) * 3} stroke={i % 2 ? C.light : C.navy} strokeWidth={3} strokeLinecap="round" />;
          })}
        </>
      );
      break;
    case 'twist':
      body = (
        <>
          <text x={30} y={50} style={strong}>
            {s('low')}
          </text>
          <Twisted x={30} y={80} w={520} turns={4} amp={12} color={C.navy} />
          <text x={30} y={150} style={strong}>
            {s('high')}
          </text>
          <Twisted x={30} y={180} w={520} turns={16} amp={7} color={C.navy} />
        </>
      );
      break;
    case 'count':
    case 'nenm':
      body = (
        <>
          {[
            { n: visual === 'nenm' ? 'Ne 10 · Nm 17' : 'Ne 10', w: 14 },
            { n: visual === 'nenm' ? 'Ne 30 · Nm 51' : 'Ne 30', w: 7 },
            { n: visual === 'nenm' ? 'Ne 60 · Nm 102' : 'Ne 60', w: 3.5 },
          ].map((r, i) => (
            <g key={r.n} transform={`translate(0,${50 + i * 56})`}>
              <text x={30} y={6} style={strong}>
                {r.n}
              </text>
              <line x1={210} x2={550} y1={0} y2={0} stroke={C.navy} strokeWidth={r.w} strokeLinecap="round" />
            </g>
          ))}
          <text x={210} y={222} style={label}>
            {visual === 'nenm' ? 'Nm ≈ Ne × 1.693' : `↑ ${s('heavier')}   ↓ ${s('finer')}`}
          </text>
        </>
      );
      break;
    case 'quality':
      body = (
        <>
          {(['even', 'strength', 'hairiness', 'faults'] as const).map((k, i) => (
            <g key={k} transform={`translate(${20 + (i % 2) * 280},${40 + Math.floor(i / 2) * 90})`}>
              <rect width={250} height={68} rx={16} fill={C.sand} />
              <circle cx={34} cy={34} r={14} fill="none" stroke={C.copper} strokeWidth={2} />
              <path d="M27,34 l5,5 l9,-10" stroke={C.copper} strokeWidth={2} fill="none" />
              <text x={62} y={40} style={strong}>
                {s(k)}
              </text>
            </g>
          ))}
        </>
      );
      break;
    case 'choose':
      body = (
        <>
          {(['enduse', 'fabric', 'count', 'yarn'] as const).map((k, i) => (
            <g key={k} transform={`translate(${20 + i * 140},80)`}>
              <rect width={118} height={56} rx={12} fill={i === 3 ? C.copper : '#fff'} stroke={C.navy} strokeOpacity={0.2} />
              <text x={59} y={34} textAnchor="middle" style={{ ...strong, fill: i === 3 ? '#fff' : C.navy }}>
                {s(k)}
              </text>
              {i < 3 && <path d="M120,28 h18 m-6,-6 l6,6 l-6,6" stroke={C.copper} strokeWidth={2} fill="none" />}
            </g>
          ))}
        </>
      );
      break;
    case 'uses':
      body = (
        <>
          <circle cx={290} cy={120} r={42} fill={C.navy} />
          <text x={290} y={126} textAnchor="middle" style={{ ...strong, fill: '#fff' }}>
            {s('yarn')}
          </text>
          {(['apparel', 'home', 'technical'] as const).map((k, i) => {
            const a = -Math.PI / 2 + (i * Math.PI * 2) / 3;
            const x = 290 + Math.cos(a) * 160;
            const y = 120 + Math.sin(a) * 90;
            return (
              <g key={k}>
                <line x1={290} y1={120} x2={x} y2={y} stroke={C.copper} strokeWidth={1.5} strokeDasharray="4 4" />
                <rect x={x - 62} y={y - 20} width={124} height={40} rx={20} fill={C.sand} />
                <text x={x} y={y + 5} textAnchor="middle" style={strong}>
                  {s(k)}
                </text>
              </g>
            );
          })}
        </>
      );
      break;
  }

  return (
    <svg viewBox="0 0 580 240" className="h-auto w-full" role="img" aria-hidden="true">
      {body}
    </svg>
  );
}
