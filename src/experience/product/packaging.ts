import type { PackagingSpec } from '@/content/types';

/** 1 world unit = 100 mm. Every pack in the scene is built at true relative scale. */
export const MM = 0.01;

export interface PackGeometry {
  /** Total height incl. lid, world units. The pack is built with its base at y = 0. */
  height: number;
  radius: number;
  /** Lathe profile of the container (without lid): [radius, y] pairs, bottom to top. */
  bodyProfile: [number, number][];
  lid: { radius: number; height: number; centerY: number };
  /** Open cylinder that carries the label artwork, floated a hair off the wall. */
  label: { radius: number; height: number; centerY: number };
  /** Width ÷ height of the flat label artwork that wraps this pack exactly once. */
  labelAspect: number;
}

interface ShapeRules {
  lidHeight: number; // share of total height
  lidRadius: number; // share of body radius
  neckRadius: number; // share of body radius
  shoulderHeight: number; // share of total height
  bevel: number; // share of body radius
}

const SHAPES: Record<PackagingSpec['type'], ShapeRules> = {
  // Wide-mouth powder tub: lid is as wide as the body, almost no shoulder.
  tub: { lidHeight: 0.15, lidRadius: 1.0, neckRadius: 0.93, shoulderHeight: 0.05, bevel: 0.07 },
  // Capsule bottle: narrow neck, rounded shoulder, small cap.
  bottle: { lidHeight: 0.17, lidRadius: 0.66, neckRadius: 0.6, shoulderHeight: 0.16, bevel: 0.1 },
};

const SHOULDER_STEPS = 8;

/**
 * Pure: packaging spec (mm) → everything needed to build the meshes.
 * Tub and bottle are both surfaces of revolution, so a label flat is all the art we need.
 * Anything that is not rotationally symmetric (pouches, boxes) must ship as a GLB instead
 * — see Product.modelSrc.
 */
export function buildPack(spec: PackagingSpec): PackGeometry {
  const rules = SHAPES[spec.type];
  const height = spec.heightMm * MM;
  const radius = (spec.diameterMm / 2) * MM;

  const lidHeight = height * rules.lidHeight;
  const bodyTop = height - lidHeight * 0.85; // neck tucks slightly into the lid
  const shoulderHeight = height * rules.shoulderHeight;
  const wallTop = bodyTop - shoulderHeight;
  const bevel = radius * rules.bevel;
  const neckRadius = radius * rules.neckRadius;

  const bodyProfile: [number, number][] = [
    [0, 0],
    [radius - bevel, 0],
    [radius, bevel],
    [radius, wallTop],
  ];
  for (let i = 1; i <= SHOULDER_STEPS; i += 1) {
    const t = i / SHOULDER_STEPS;
    const ease = (1 - Math.cos(t * Math.PI)) / 2;
    bodyProfile.push([radius + (neckRadius - radius) * ease, wallTop + shoulderHeight * t]);
  }

  // The label has to sit on the straight wall; clamp whatever the spec asks for.
  const labelBottom = Math.max(spec.label.bottomMm * MM, bevel);
  const labelTop = Math.min(labelBottom + spec.label.heightMm * MM, wallTop);
  const labelHeight = Math.max(labelTop - labelBottom, 0.01);
  const labelRadius = radius * 1.004;

  return {
    height,
    radius,
    bodyProfile,
    lid: {
      radius: radius * rules.lidRadius,
      height: lidHeight,
      centerY: height - lidHeight / 2,
    },
    label: {
      radius: labelRadius,
      height: labelHeight,
      centerY: labelBottom + labelHeight / 2,
    },
    labelAspect: (2 * Math.PI * labelRadius) / labelHeight,
  };
}
