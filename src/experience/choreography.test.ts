import { describe, expect, it } from 'vitest';
import { resolveActs, actStartVh, TOTAL_VH } from '@/director/acts';
import { castPose, type CastInput } from './choreography';

const COUNT = 5;
const at = (scrolledVh: number, index: number, overrides: Partial<CastInput> = {}) =>
  castPose({
    index,
    count: COUNT,
    activeIndex: 0,
    ring: 0,
    local: resolveActs(scrolledVh).local,
    exit: 0,
    faceAngle: Math.PI,
    aspect: 16 / 9,
    time: 0,
    ...overrides,
  });

describe('castPose', () => {
  it('centres the active pack on the hero ring', () => {
    const pose = at(0, 0);
    expect(pose.x).toBeCloseTo(0);
    expect(pose.z).toBeCloseTo(0);
    expect(pose.s).toBeCloseTo(1);
  });

  it('keeps ring neighbours visible and ordered left to right', () => {
    const xs = [3, 4, 0, 1, 2].map((i) => at(0, i).x);
    expect([...xs].sort((a, b) => a - b)).toEqual(xs);
    expect(at(0, 1).s).toBeGreaterThan(0.9);
  });

  it('clears the stage for the hero pack during features', () => {
    const vh = actStartVh('features') + 100;
    expect(at(vh, 0).s).toBeGreaterThan(1.5);
    expect(at(vh, 0).ry).toBeCloseTo(Math.PI, 1);
    for (let i = 1; i < COUNT; i += 1) expect(at(vh, i).s).toBeLessThan(0.01);
  });

  it('lines everyone up at the end, evenly spaced', () => {
    const poses = Array.from({ length: COUNT }, (_, i) => at(TOTAL_VH, i));
    poses.forEach((p) => expect(p.s).toBeGreaterThan(0.5));
    const gaps = poses.slice(1).map((p, i) => p.x - poses[i].x);
    gaps.forEach((g) => expect(g).toBeCloseTo(gaps[0]));
    expect(gaps[0]).toBeGreaterThan(0);
  });

  it('centres the hero pack in portrait', () => {
    const pose = at(actStartVh('features') + 100, 0, { aspect: 9 / 16 });
    expect(pose.x).toBeCloseTo(0);
    expect(pose.y).toBeGreaterThan(0.5);
  });
});
