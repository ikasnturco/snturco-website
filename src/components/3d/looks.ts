import type { FibreLook } from './yarn';

/**
 * Visual fibre characters used by the 3D renders. These describe how each fibre type looks
 * (matte or lustrous, staple or filament, hairy, crimped, slubby), not technical test values.
 */
export const looks: Record<string, FibreLook> = {
  cotton: { color: '#efe6d4', jitter: 0.1, roughness: 0.82, sheen: 0.7, filament: false, staple: 9, hair: 0.75, crimp: 0.05, slub: 0.12, fibre: 0.021, twistDeg: 28, plies: 2 },
  polyester: { color: '#f3f5f7', jitter: 0.03, roughness: 0.28, sheen: 0.2, clearcoat: 0.4, filament: true, staple: 0, hair: 0.02, crimp: 0, slub: 0, fibre: 0.03, twistDeg: 8, plies: 1 },
  viscose: { color: '#f1ebe2', jitter: 0.05, roughness: 0.26, sheen: 0.5, clearcoat: 0.25, filament: true, staple: 0, hair: 0.08, crimp: 0.02, slub: 0, fibre: 0.027, twistDeg: 16, plies: 1 },
  acrylic: { color: '#f2eee8', jitter: 0.08, roughness: 0.7, sheen: 0.8, filament: false, staple: 12, hair: 0.6, crimp: 0.35, slub: 0.05, fibre: 0.027, twistDeg: 18, plies: 2 },
  nylon: { color: '#f5f7fa', jitter: 0.02, roughness: 0.18, sheen: 0.15, clearcoat: 0.6, filament: true, staple: 0, hair: 0, crimp: 0, slub: 0, fibre: 0.036, twistDeg: 5, plies: 1 },
  wool: { color: '#e9ddc5', jitter: 0.12, roughness: 0.78, sheen: 0.9, filament: false, staple: 14, hair: 0.95, crimp: 1, slub: 0.15, fibre: 0.03, twistDeg: 22, plies: 2 },
  silk: { color: '#f2e6cb', jitter: 0.04, roughness: 0.16, sheen: 1, clearcoat: 0.5, filament: true, staple: 0, hair: 0.03, crimp: 0, slub: 0.02, fibre: 0.018, twistDeg: 10, plies: 2 },
  linen: { color: '#cfc2a3', jitter: 0.14, roughness: 0.62, sheen: 0.35, filament: false, staple: 40, hair: 0.35, crimp: 0, slub: 0.85, fibre: 0.03, twistDeg: 14, plies: 1 },
  bamboo: { color: '#ede7d9', jitter: 0.05, roughness: 0.34, sheen: 0.6, clearcoat: 0.15, filament: false, staple: 22, hair: 0.25, crimp: 0, slub: 0.02, fibre: 0.024, twistDeg: 20, plies: 1 },
  elastane: { color: '#f7f7f5', jitter: 0.02, roughness: 0.3, sheen: 0.1, clearcoat: 0.7, filament: true, staple: 0, hair: 0, crimp: 0, slub: 0, fibre: 0.066, twistDeg: 3, plies: 1 },
  lycra: { color: '#f6f6f2', jitter: 0.02, roughness: 0.28, sheen: 0.1, clearcoat: 0.8, filament: true, staple: 0, hair: 0, crimp: 0, slub: 0, fibre: 0.078, twistDeg: 2, plies: 1 },
  polyamide: { color: '#eef0f2', jitter: 0.03, roughness: 0.4, sheen: 0.4, clearcoat: 0.2, filament: true, staple: 0, hair: 0.02, crimp: 0.25, slub: 0, fibre: 0.027, twistDeg: 12, plies: 1 },
  polypropylene: { color: '#f4f3ec', jitter: 0.02, roughness: 0.45, sheen: 0.1, clearcoat: 0.3, filament: true, staple: 0, hair: 0, crimp: 0, slub: 0, fibre: 0.048, twistDeg: 6, plies: 1 },
  hemp: { color: '#b8a685', jitter: 0.18, roughness: 0.72, sheen: 0.25, filament: false, staple: 30, hair: 0.6, crimp: 0, slub: 0.7, fibre: 0.042, twistDeg: 18, plies: 2 },
};

/** Cotton varieties: same fibre family, different staple length, fineness, tone and lustre. */
export const cottonLooks: Record<string, FibreLook> = {
  'american-cotton': { ...looks.cotton, color: '#f0e9da', staple: 8, fibre: 0.024, twistDeg: 30 },
  'egyptian-cotton': { ...looks.cotton, color: '#f1e8d3', staple: 15, fibre: 0.0168, roughness: 0.6, sheen: 0.85, hair: 0.45, twistDeg: 24 },
  'turkish-cotton': { ...looks.cotton, color: '#efe3cb', staple: 11, fibre: 0.0204, hair: 0.65, twistDeg: 26 },
  'pima-cotton': { ...looks.cotton, color: '#f3ecdd', staple: 16, fibre: 0.0162, roughness: 0.58, sheen: 0.9, hair: 0.4, twistDeg: 23 },
  'supima-cotton': { ...looks.cotton, color: '#f5efe2', staple: 17, fibre: 0.0156, roughness: 0.55, sheen: 0.95, hair: 0.35, twistDeg: 22, plies: 3 },
  'giza-cotton': { ...looks.cotton, color: '#efe2c6', staple: 17, fibre: 0.015, roughness: 0.56, sheen: 0.95, hair: 0.35, twistDeg: 22 },
  'organic-cotton': { ...looks.cotton, color: '#e6d9bd', jitter: 0.14, staple: 10, fibre: 0.0216, hair: 0.8, twistDeg: 27 },
  'anatolian-cotton': { ...looks.cotton, color: '#ecdcbf', staple: 10, fibre: 0.0216, hair: 0.7, slub: 0.18, twistDeg: 27, plies: 1 },
  'sea-island-cotton': { ...looks.cotton, color: '#f6f0e3', staple: 19, fibre: 0.0138, roughness: 0.5, sheen: 1, hair: 0.25, twistDeg: 20 },
};
