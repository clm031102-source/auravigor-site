import { describe, expect, it } from 'vitest';
import { Box3, PerspectiveCamera, Vector3 } from 'three';
import { projectProductBounds } from '@/experience/productTargets';

const camera = new PerspectiveCamera(32, 16 / 9, 0.1, 50);
camera.position.z = 9;
camera.updateMatrixWorld();
const pack = new Box3(new Vector3(-0.5, -0.8, -0.5), new Vector3(0.5, 0.8, 0.5));

describe('projectProductBounds', () => {
  it('keeps the clickable bounds centred on the rendered pack', () => {
    const rect = projectProductBounds(pack, camera, 1440, 810);
    expect(rect).not.toBeNull();
    expect(rect?.x).toBeLessThan(720);
    expect(rect?.y).toBeLessThan(405);
    expect((rect?.x ?? 0) + (rect?.width ?? 0) / 2).toBeCloseTo(720);
    expect((rect?.y ?? 0) + (rect?.height ?? 0) / 2).toBeCloseTo(405);
  });

  it('follows a product moving to the right and fits the visible viewport', () => {
    const shifted = pack.clone().translate(new Vector3(4.8, 0, 0));
    const rect = projectProductBounds(shifted, camera, 1440, 810);
    expect(rect).not.toBeNull();
    expect(rect?.x).toBeGreaterThan(720);
    expect((rect?.x ?? 0) + (rect?.width ?? 0)).toBeLessThanOrEqual(1440);
  });

  it('does not create targets for packs outside the viewport or behind the camera', () => {
    expect(
      projectProductBounds(pack.clone().translate(new Vector3(100, 0, 0)), camera, 1440, 810),
    ).toBeNull();
    expect(
      projectProductBounds(pack.clone().translate(new Vector3(0, 0, 12)), camera, 1440, 810),
    ).toBeNull();
    expect(projectProductBounds(new Box3(), camera, 1440, 810)).toBeNull();
  });
});
