import { describe, expect, it } from 'vitest';
import { createColorTransition, parseColor } from './colorTransition';

describe('backdrop color transitions', () => {
  it('reads the hex and RGB forms used by the CSS color contract', () => {
    expect(parseColor('#ff8000')).toEqual([1, 128 / 255, 0]);
    expect(parseColor('#0bf')).toEqual([0, 187 / 255, 1]);
    expect(parseColor('rgb(255 128 0)')).toEqual([1, 128 / 255, 0]);
    expect(parseColor('rgb(100%, 0%, 0%)')).toEqual([1, 0, 0]);
    expect(parseColor('')).toBeNull();
    expect(parseColor('not-a-color')).toBeNull();
  });

  it('starts at the selected product color without flashing another color', () => {
    const transition = createColorTransition();
    expect(transition.sample([0.2, 0.4, 0.6], 100)).toEqual([0.2, 0.4, 0.6]);
  });

  it('reaches the next color within 600ms without restarting on every frame', () => {
    const transition = createColorTransition();
    transition.sample([1, 0, 0], 0);
    expect(transition.sample([0, 0, 1], 100)).toEqual([1, 0, 0]);
    expect(transition.sample([0, 0, 1], 400)).toEqual([0.5, 0, 0.5]);
    expect(transition.sample([0, 0, 1], 700)).toEqual([0, 0, 1]);
    expect(transition.sample([0, 0, 1], 1000)).toEqual([0, 0, 1]);
  });

  it('retargets rapid product changes from the currently displayed color', () => {
    const transition = createColorTransition();
    transition.sample([1, 0, 0], 0);
    transition.sample([0, 0, 1], 100);
    const visible = transition.sample([0, 0, 1], 300);
    expect(transition.sample([0, 1, 0], 300)).toEqual(visible);
    expect(transition.sample([0, 1, 0], 900)).toEqual([0, 1, 0]);
  });
});
