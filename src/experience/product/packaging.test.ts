import { describe, expect, it } from 'vitest';
import { products } from '@/content/products';
import { buildPack } from './packaging';

describe('buildPack', () => {
  it.each(products.map((p) => [p.id, p] as const))('%s builds a valid pack', (_, product) => {
    const pack = buildPack(product.packaging);
    const ys = pack.bodyProfile.map(([, y]) => y);
    expect(pack.bodyProfile.every(([r]) => r >= 0 && r <= pack.radius + 1e-9)).toBe(true);
    expect([...ys].sort((a, b) => a - b)).toEqual(ys);
    expect(pack.lid.centerY + pack.lid.height / 2).toBeCloseTo(pack.height);
  });

  it('keeps the label on the straight wall', () => {
    const pack = buildPack({ ...products[0].packaging, label: { bottomMm: 0, heightMm: 9999 } });
    const wallTop = pack.bodyProfile[3][1];
    expect(pack.label.centerY + pack.label.height / 2).toBeLessThanOrEqual(wallTop + 1e-9);
    expect(pack.label.centerY - pack.label.height / 2).toBeGreaterThan(0);
  });

  it('reports the artwork aspect for one full wrap', () => {
    const pack = buildPack(products[0].packaging);
    expect(pack.labelAspect).toBeCloseTo((2 * Math.PI * pack.label.radius) / pack.label.height);
    expect(pack.labelAspect).toBeGreaterThan(2);
  });
});
