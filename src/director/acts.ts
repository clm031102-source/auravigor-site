import { clamp01, smoothstep } from './math';

/**
 * The pinned part of the page is one long scroll "timeline" cut into acts.
 * Lengths are in viewport heights of scroll distance. Retiming the whole film = editing this array.
 *
 *   hero      product ring, user picks a SKU
 *   reveal    backdrop floods with the SKU theme, pack comes forward, name + description
 *   features  pack turns to its back label, feature callouts step through
 *   slogan    energy burst, giant slogan behind the pack
 *   lineup    back to neutral, the whole range lines up
 *
 * FAQ + outro follow in normal document flow (see sections/).
 */
export const ACTS = [
  { id: 'hero', lengthVh: 40, fadeIn: false, fadeOut: true },
  { id: 'reveal', lengthVh: 160, fadeIn: true, fadeOut: true },
  { id: 'features', lengthVh: 400, fadeIn: true, fadeOut: true },
  { id: 'slogan', lengthVh: 200, fadeIn: true, fadeOut: true },
  { id: 'lineup', lengthVh: 200, fadeIn: true, fadeOut: false },
] as const;

export type ActId = (typeof ACTS)[number]['id'];

export const ACT_IDS: ActId[] = ACTS.map((a) => a.id);

export const TOTAL_VH: number = ACTS.reduce((sum, a) => sum + a.lengthVh, 0);

/** Share of an act's length spent fading its DOM overlay in / out. */
export const OVERLAY_FADE = 0.14;

export interface ActSnapshot {
  act: ActId;
  /** 0..1 progress inside each act. Acts already passed read 1, acts not reached read 0. */
  local: Record<ActId, number>;
  /** 0..1 DOM overlay visibility per act (only the current act is ever non-zero). */
  vis: Record<ActId, number>;
}

/** Pure: scroll distance (in vh) → which act we are in and how far through it. */
export function resolveActs(scrolledVh: number): ActSnapshot {
  const local = {} as Record<ActId, number>;
  const vis = {} as Record<ActId, number>;
  let act: ActId = ACTS[0].id;
  let cursor = 0;

  ACTS.forEach((a, i) => {
    const p = clamp01((scrolledVh - cursor) / a.lengthVh);
    local[a.id] = p;
    const isLast = i === ACTS.length - 1;
    const isCurrent = scrolledVh >= cursor && (scrolledVh < cursor + a.lengthVh || isLast);
    if (isCurrent) act = a.id;
    const fadeIn = a.fadeIn ? smoothstep(0, OVERLAY_FADE, p) : 1;
    const fadeOut = a.fadeOut ? 1 - smoothstep(1 - OVERLAY_FADE, 1, p) : 1;
    vis[a.id] = isCurrent ? fadeIn * fadeOut : 0;
    cursor += a.lengthVh;
  });

  return { act, local, vis };
}

/** Scroll offset (in vh) at which an act starts — used by menu / deep links. */
export function actStartVh(id: ActId): number {
  let cursor = 0;
  for (const a of ACTS) {
    if (a.id === id) return cursor;
    cursor += a.lengthVh;
  }
  return 0;
}

export interface FeatureBlend {
  /** Feature currently on screen. */
  index: number;
  /** Feature we are turning towards (equals `index` when settled). */
  next: number;
  /** 0..1 blend from `index` to `next`. */
  t: number;
}

/** Share of each feature's slot used to turn towards the next one. */
export const FEATURE_TURN = 0.3;

/** Pure: progress through the features act → which callout is up and how far we are into the turn. */
export function featureBlend(progress: number, count: number): FeatureBlend {
  if (count <= 1) return { index: 0, next: 0, t: 0 };
  const f = clamp01(progress) * count;
  const index = Math.min(Math.floor(f), count - 1);
  const within = f - index;
  const next = Math.min(index + 1, count - 1);
  const t = next === index ? 0 : smoothstep(1 - FEATURE_TURN, 1, within);
  return { index, next, t };
}
