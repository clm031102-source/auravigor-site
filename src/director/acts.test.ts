import { describe, expect, it } from 'vitest';
import { ACTS, TOTAL_VH, actStartVh, featureBlend, resolveActs } from './acts';

describe('resolveActs', () => {
  it('starts in the hero with everything else untouched', () => {
    const snap = resolveActs(0);
    expect(snap.act).toBe('hero');
    expect(snap.vis.hero).toBe(1);
    expect(snap.local.reveal).toBe(0);
    expect(snap.local.lineup).toBe(0);
  });

  it('reports exactly one current act at every scroll position', () => {
    for (let vh = 0; vh <= TOTAL_VH; vh += 7) {
      const snap = resolveActs(vh);
      const visible = ACTS.filter((a) => snap.vis[a.id] > 0).map((a) => a.id);
      expect(visible.every((id) => id === snap.act)).toBe(true);
    }
  });

  it('marks passed acts as complete and future acts as not started', () => {
    const snap = resolveActs(actStartVh('features') + 10);
    expect(snap.act).toBe('features');
    expect(snap.local.hero).toBe(1);
    expect(snap.local.reveal).toBe(1);
    expect(snap.local.slogan).toBe(0);
  });

  it('holds the last act at the end of the stage', () => {
    const snap = resolveActs(TOTAL_VH);
    expect(snap.act).toBe('lineup');
    expect(snap.local.lineup).toBe(1);
    expect(snap.vis.lineup).toBe(1);
  });
});

describe('featureBlend', () => {
  it('walks through every feature in order', () => {
    const seen = new Set<number>();
    for (let p = 0; p <= 1; p += 0.01) seen.add(featureBlend(p, 4).index);
    expect([...seen]).toEqual([0, 1, 2, 3]);
  });

  it('never blends past the last feature', () => {
    expect(featureBlend(1, 4)).toEqual({ index: 3, next: 3, t: 0 });
  });

  it('copes with a single feature', () => {
    expect(featureBlend(0.5, 1)).toEqual({ index: 0, next: 0, t: 0 });
  });
});
