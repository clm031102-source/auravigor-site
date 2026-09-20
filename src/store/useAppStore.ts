import { create } from 'zustand';
import { productCount } from '@/content/products';
import type { ActId } from '@/director/acts';
import { mod } from '@/director/math';
import { ringState } from '@/director/scrollState';

/**
 * Discrete UI state only. Anything that changes every frame lives in director/scrollState.ts.
 */
interface AppState {
  /** WebGL scene created and first frame drawn. */
  ready: boolean;
  /** Selected product (index into content/products). */
  activeIndex: number;
  act: ActId;
  featureIndex: number;
  soundOn: boolean;
  menuOpen: boolean;

  setReady: () => void;
  /** Move the ring by whole slots (−1 / +1 from the arrows, any delta from drag release). */
  stepProduct: (delta: number) => void;
  /** Snap the ring to the slot nearest an arbitrary (possibly fractional, unwrapped) position. */
  settleRing: (position: number) => void;
  setAct: (act: ActId) => void;
  setFeatureIndex: (index: number) => void;
  toggleSound: () => void;
  toggleMenu: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  ready: false,
  activeIndex: 0,
  act: 'hero',
  featureIndex: 0,
  soundOn: false,
  menuOpen: false,

  setReady: () => set({ ready: true }),
  stepProduct: (delta) => {
    ringState.target = Math.round(ringState.target) + delta;
    set({ activeIndex: mod(ringState.target, productCount) });
  },
  settleRing: (position) => {
    ringState.target = Math.round(position);
    set({ activeIndex: mod(ringState.target, productCount) });
  },
  setAct: (act) => set((s) => (s.act === act ? s : { act })),
  setFeatureIndex: (featureIndex) =>
    set((s) => (s.featureIndex === featureIndex ? s : { featureIndex })),
  toggleSound: () => set((s) => ({ soundOn: !s.soundOn })),
  toggleMenu: () => set((s) => ({ menuOpen: !s.menuOpen })),
}));
