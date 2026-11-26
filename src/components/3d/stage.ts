import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export const brand = {
  navy900: '#0b1524',
  navy: '#14243b',
  navy700: '#1d3352',
  copper: '#a86b45',
  copperLight: '#d0a385',
  sand: '#f5f1ea',
};

/** Radial vignette background drawn on a canvas, used as scene.background. */
export function gradientTexture(inner: string, outer: string, glow?: { color: string; x: number; y: number; r: number; a: number }, w = 1024, h = 1024) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d')!;
  const rad = g.createRadialGradient(w * 0.5, h * 0.45, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.75);
  rad.addColorStop(0, inner);
  rad.addColorStop(1, outer);
  g.fillStyle = rad;
  g.fillRect(0, 0, w, h);
  if (glow) {
    const gl = g.createRadialGradient(w * glow.x, h * glow.y, 0, w * glow.x, h * glow.y, Math.max(w, h) * glow.r);
    const col = new THREE.Color(glow.color);
    const rgb = `${Math.round(col.r * 255)},${Math.round(col.g * 255)},${Math.round(col.b * 255)}`;
    gl.addColorStop(0, `rgba(${rgb},${glow.a})`);
    gl.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = gl;
    g.fillRect(0, 0, w, h);
  }
  // fine grain to avoid banding
  const img = g.getImageData(0, 0, w, h);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 3;
    img.data[i] += n;
    img.data[i + 1] += n;
    img.data[i + 2] += n;
  }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function createRenderer(canvas: HTMLCanvasElement, opts: { alpha?: boolean; antialias?: boolean; preserve?: boolean } = {}) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: opts.antialias ?? true,
    alpha: opts.alpha ?? false,
    preserveDrawingBuffer: opts.preserve ?? false,
    powerPreference: 'high-performance',
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.05;
  return renderer;
}

export function studioEnvironment(renderer: THREE.WebGLRenderer, intensity = 1) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();
  return { env, intensity };
}

/** Classic three-point light rig: warm key, cool fill, copper rim. */
export function lightRig(scene: THREE.Scene, opts: { key?: number; rim?: number; fill?: number; warm?: boolean } = {}) {
  const key = new THREE.DirectionalLight(opts.warm === false ? 0xffffff : 0xfff8f0, opts.key ?? 2.6);
  key.position.set(4, 6, 5);
  const fill = new THREE.DirectionalLight(0x9fb6d6, opts.fill ?? 0.6);
  fill.position.set(-6, -2, 3);
  const rim = new THREE.DirectionalLight(0xf2d6c2, (opts.rim ?? 2.2) * 0.7);
  rim.position.set(-3, 4, -6);
  const amb = new THREE.HemisphereLight(0xf6f4f0, 0x22324a, 0.9);
  scene.add(key, fill, rim, amb);
  return { key, fill, rim, amb };
}

export function disposeObject(obj: THREE.Object3D) {
  obj.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.geometry) m.geometry.dispose();
    const mat = m.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
    else mat?.dispose();
  });
}
