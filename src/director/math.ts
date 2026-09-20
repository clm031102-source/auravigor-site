/** Small pure helpers shared by the director and the choreography. */

export const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const smoothstep = (edge0: number, edge1: number, v: number): number => {
  if (edge0 === edge1) return v < edge0 ? 0 : 1;
  const t = clamp01((v - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

export const easeInOut = (t: number): number => {
  const c = clamp01(t);
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
};

/** Wrap `v` into the half-open range [-size / 2, size / 2). */
export const wrapCentered = (v: number, size: number): number => {
  const half = size / 2;
  return ((((v + half) % size) + size) % size) - half;
};

/** Positive modulo. */
export const mod = (v: number, size: number): number => ((v % size) + size) % size;
