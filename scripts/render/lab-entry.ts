/* Browser entry for offline renders. Bundled by scripts/render/run.mjs and driven by Playwright. */
import * as THREE from 'three';
import { createRenderer, studioEnvironment } from '../../src/components/3d/stage';
import { shots, type ShotKind } from '../../src/components/3d/productShots';
import { looks, cottonLooks } from '../../src/components/3d/looks';
import { createStory } from '../../src/components/3d/story';
import { createHero } from '../../src/components/3d/heroScene';
import { createYard } from '../../src/components/3d/containerScene';

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const renderer = createRenderer(canvas, { preserve: true, antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

function encode(w: number, h: number, quality: number, type = 'image/webp') {
  const out = document.createElement('canvas');
  out.width = w;
  out.height = h;
  const g = out.getContext('2d')!;
  g.imageSmoothingEnabled = true;
  g.imageSmoothingQuality = 'high';
  g.drawImage(canvas, 0, 0, w, h);
  return out.toDataURL(type, quality);
}

function setSize(w: number, h: number, ss: number) {
  renderer.setPixelRatio(1);
  renderer.setSize(w * ss, h * ss, false);
}

(window as any).renderShot = (o: { kind: ShotKind; key: string; cotton?: boolean; w: number; h: number; seed: number; tint?: string; background?: 'dark' | 'light'; angle?: number; ss?: number; quality?: number; q?: number }) => {
  const look = (o.cotton ? cottonLooks : looks)[o.key];
  if (!look) throw new Error('unknown look ' + o.key);
  const ss = o.ss ?? 2;
  setSize(o.w, o.h, ss);
  const { scene, camera } = shots[o.kind]({ look, seed: o.seed, aspect: o.w / o.h, tint: o.tint, background: o.background, angle: o.angle, quality: o.quality });
  renderer.render(scene, camera);
  const url = encode(o.w, o.h, o.q ?? 0.86);
  scene.traverse((x: any) => { x.geometry?.dispose?.(); x.material?.dispose?.(); });
  return url;
};

let story: ReturnType<typeof createStory> | null = null;
(window as any).renderStory = (o: { t: number; w: number; h: number; ss?: number; q?: number; quality?: number; type?: string }) => {
  const ss = o.ss ?? 2;
  setSize(o.w, o.h, ss);
  if (!story) story = createStory({ aspect: o.w / o.h, quality: o.quality ?? 1 });
  story.update(o.t);
  renderer.render(story.scene, story.camera);
  return encode(o.w, o.h, o.q ?? 0.8, o.type);
};
(window as any).resetStory = () => { story = null; };
(window as any).renderHero = async (o: { w: number; h: number; mobile?: boolean; time?: number; scroll?: number; ss?: number; q?: number; type?: string }) => {
  const ss = o.ss ?? 2;
  setSize(o.w, o.h, ss);
  const hero = createHero({ aspect: o.w / o.h, mobile: o.mobile });
  await hero.build();
  hero.update(o.time ?? 2, o.scroll ?? 0, 0, 0);
  renderer.render(hero.scene, hero.camera);
  const url = encode(o.w, o.h, o.q ?? 0.82, o.type);
  hero.dispose();
  return url;
};
(window as any).renderYard = (o: { w: number; h: number; sizes: string[]; p: number; ss?: number; q?: number }) => {
  const ss = o.ss ?? 1;
  setSize(o.w, o.h, ss);
  const yard = createYard({ containers: o.sizes.map((size, i) => ({ size: size as any, isNew: i >= o.sizes.length - 1 })), aspect: o.w / o.h, env: studioEnvironment(renderer).env });
  yard.update(o.p, 0);
  renderer.render(yard.scene, yard.camera);
  const url = encode(o.w, o.h, o.q ?? 0.85);
  yard.dispose();
  return url;
};
(window as any).ready = true;
