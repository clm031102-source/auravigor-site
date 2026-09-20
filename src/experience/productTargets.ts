import { Box3, Camera, Vector3 } from 'three';

/** Project rendered world bounds onto DOM controls without making the canvas interactive. */
export function projectProductBounds(bounds: Box3, camera: Camera, width: number, height: number) {
  if (bounds.isEmpty()) return null;
  const points = [];
  for (const x of [bounds.min.x, bounds.max.x]) {
    for (const y of [bounds.min.y, bounds.max.y]) {
      for (const z of [bounds.min.z, bounds.max.z]) {
        points.push(new Vector3(x, y, z).project(camera));
      }
    }
  }
  if (points.every((p) => p.z < -1) || points.every((p) => p.z > 1)) return null;
  const left = Math.max(0, ((Math.min(...points.map((p) => p.x)) + 1) * width) / 2);
  const right = Math.min(width, ((Math.max(...points.map((p) => p.x)) + 1) * width) / 2);
  const top = Math.max(0, ((1 - Math.max(...points.map((p) => p.y))) * height) / 2);
  const bottom = Math.min(height, ((1 - Math.min(...points.map((p) => p.y))) * height) / 2);
  if (right <= left || bottom <= top) return null;
  return { x: left, y: top, width: right - left, height: bottom - top };
}
