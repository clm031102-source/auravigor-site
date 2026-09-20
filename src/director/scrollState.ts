import { ACT_IDS, type ActId, type ActSnapshot } from './acts';

/**
 * Transient, mutable state written by the scroll driver and read inside useFrame().
 * Deliberately NOT React state: it changes every frame and must never trigger a re-render.
 * Discrete values the DOM cares about (current act, feature index) are mirrored into the
 * zustand store only when they change — see sections/Stage.tsx.
 */
const zeroes = (): Record<ActId, number> =>
  Object.fromEntries(ACT_IDS.map((id) => [id, 0])) as Record<ActId, number>;

export interface ScrollState extends ActSnapshot {
  /** 0..1 across the whole pinned stage. */
  total: number;
  /** 0..1 over the first viewport of scrolling past the stage (FAQ sliding in). */
  exit: number;
}

export const scrollState: ScrollState = {
  act: 'hero',
  local: zeroes(),
  vis: { ...zeroes(), hero: 1 },
  total: 0,
  exit: 0,
};

/**
 * Hero ring, in "slots". `target` is where the user asked to go (may be fractional while
 * dragging, may exceed the product count — it wraps). `position` eases after it each frame.
 */
export const ringState = {
  position: 0,
  target: 0,
  dragging: false,
};
