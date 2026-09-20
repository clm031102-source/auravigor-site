import type { ActId } from '@/director/acts';
import { easeInOut, lerp, smoothstep, wrapCentered } from '@/director/math';

/**
 * Where every pack is, for any scroll position. Pure maths, no three.js, fully unit-tested.
 * All the "feel" numbers of the film live in TUNING — this is the file to edit when the
 * motion needs art direction.
 */

export interface Pose {
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  rz: number;
  /** Uniform scale. 0 = hidden. */
  s: number;
}

export interface CastInput {
  index: number;
  count: number;
  activeIndex: number;
  /** ringState.position — fractional, unwrapped slot the ring is currently showing. */
  ring: number;
  local: Record<ActId, number>;
  /** 0..1 — FAQ sliding over the stage. */
  exit: number;
  /** Blended faceAngle of the feature currently on screen (active product only). */
  faceAngle: number;
  /** Viewport width ÷ height. */
  aspect: number;
  /** Seconds, for the idle float. */
  time: number;
}

export const TUNING = {
  ring: { spacing: 2.05, depth: 0.5, yaw: 0.28, tilt: -0.2, tiltPerSlot: -0.05, bob: 0.06 },
  reveal: { x: 1.25, y: 0, z: 1.2, rx: 0.08, ry: -0.45, rz: -0.26, s: 1.5, drift: 0.55 },
  features: { x: 1.35, y: -0.1, z: 1.6, rx: 0, rz: -0.1, s: 1.6 },
  slogan: { x: 0, y: 0, z: 1, rx: 0, rz: 0, s: 1.35 },
  lineup: { spacing: 1.45, y: -0.15, z: 0, rx: 0.05, ry: 0.4, rz: -0.16, s: 0.95 },
  away: { spread: 1.6, depth: 4 },
  exitLift: 4.5,
  /** Below this aspect the layout is treated as portrait: packs are centred and lifted. */
  portrait: { from: 0.85, to: 1.45, lift: 0.95, scale: 0.68, lineupSpacing: 0.42 },
} as const;

const FULL_TURN = Math.PI * 2;

export const mixPose = (a: Pose, b: Pose, t: number): Pose => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  z: lerp(a.z, b.z, t),
  rx: lerp(a.rx, b.rx, t),
  ry: lerp(a.ry, b.ry, t),
  rz: lerp(a.rz, b.rz, t),
  s: lerp(a.s, b.s, t),
});

/**
 * Slot on the hero arc: evenly spaced across the screen, curving away from the camera.
 * The ring is endless — a pack leaving one edge shrinks to nothing and re-enters on the other.
 */
export function ringPose(index: number, count: number, ring: number): Pose {
  const { spacing, depth, yaw, tilt, tiltPerSlot } = TUNING.ring;
  const offset = wrapCentered(index - ring, count);
  const edge = 1 - smoothstep(count / 2 - 0.5, count / 2, Math.abs(offset));
  return {
    x: offset * spacing,
    y: 0,
    z: -offset * offset * depth,
    rx: 0,
    ry: offset * yaw,
    rz: tilt + offset * tiltPerSlot,
    s: edge,
  };
}

export function castPose(input: CastInput): Pose {
  const { index, count, activeIndex, ring, local, exit, faceAngle, aspect, time } = input;
  const T = TUNING;

  // 0 = portrait phone, 1 = desktop landscape
  const wide = smoothstep(T.portrait.from, T.portrait.to, aspect);
  const side = wide; // how far off-centre the hero pack may sit
  const lift = (1 - wide) * T.portrait.lift;
  const fit = lerp(T.portrait.scale, 1, wide);

  const toReveal = easeInOut(smoothstep(0, 0.75, local.reveal));
  const toFeatures = easeInOut(smoothstep(0, 0.14, local.features));
  const toSlogan = easeInOut(smoothstep(0, 0.4, local.slogan));
  const toLineup = easeInOut(smoothstep(0, 0.55, local.lineup));

  const slot =
    (index - (count - 1) / 2) * T.lineup.spacing * lerp(T.portrait.lineupSpacing, 1, wide);
  const isActive = index === activeIndex;

  let pose = ringPose(index, count, ring);
  pose.s *= fit;

  if (isActive) {
    const reveal: Pose = {
      x: T.reveal.x * side,
      y: T.reveal.y + lift,
      z: T.reveal.z,
      rx: T.reveal.rx,
      ry: T.reveal.ry + local.reveal * T.reveal.drift,
      rz: T.reveal.rz,
      s: T.reveal.s * fit,
    };
    const features: Pose = {
      x: T.features.x * side,
      y: T.features.y + lift,
      z: T.features.z,
      rx: T.features.rx,
      ry: faceAngle,
      rz: T.features.rz,
      s: T.features.s * fit,
    };
    const slogan: Pose = {
      x: T.slogan.x,
      y: T.slogan.y,
      z: T.slogan.z,
      rx: T.slogan.rx,
      ry: FULL_TURN, // keeps turning the same way until the front faces us again
      rz: T.slogan.rz,
      s: T.slogan.s * fit,
    };
    const lineup: Pose = {
      x: slot,
      y: T.lineup.y,
      z: T.lineup.z,
      rx: T.lineup.rx,
      ry: FULL_TURN + T.lineup.ry,
      rz: T.lineup.rz,
      s: T.lineup.s * fit,
    };
    pose = mixPose(pose, reveal, toReveal);
    pose = mixPose(pose, features, toFeatures);
    pose = mixPose(pose, slogan, toSlogan);
    pose = mixPose(pose, lineup, toLineup);
  } else {
    const away = easeInOut(smoothstep(0, 0.6, local.reveal));
    const gone: Pose = {
      ...pose,
      x: pose.x * (1 + away * T.away.spread),
      z: pose.z - away * T.away.depth,
      s: pose.s * (1 - away),
    };
    const lineup: Pose = {
      x: slot,
      y: T.lineup.y,
      z: T.lineup.z,
      rx: T.lineup.rx,
      ry: T.lineup.ry,
      rz: T.lineup.rz,
      s: T.lineup.s * fit,
    };
    pose = mixPose(gone, lineup, toLineup);
  }

  pose.y += Math.sin(time * 0.8 + index * 1.7) * TUNING.ring.bob;
  pose.y += exit * T.exitLift;
  return pose;
}
