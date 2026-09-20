/**
 * Content schema. Everything a non-engineer may want to change lives in src/content/*
 * and is typed here. Components never hard-code copy, colours or product facts.
 */

export type PackagingType = 'tub' | 'bottle';

export interface PackagingSpec {
  type: PackagingType;
  /** Real-world outer dimensions in millimetres (lid included). Drives proportions. */
  heightMm: number;
  diameterMm: number;
  /** Printed label band, measured up from the base of the container. */
  label: { bottomMm: number; heightMm: number };
  bodyColor: string;
  lidColor: string;
}

export type FeatureIcon = 'formula' | 'source' | 'taste' | 'quality';

export interface ProductFeature {
  id: string;
  icon: FeatureIcon;
  title: string;
  body: string;
  /**
   * Y-rotation of the pack (radians) while this feature is on screen.
   * 0 = front panel faces the camera, Math.PI = back panel.
   * Tune per SKU once the real label artwork is in place so the matching
   * label panel points at the viewer.
   */
  faceAngle: number;
}

export interface ProductTheme {
  /** Outer colour of the themed backdrop. */
  primary: string;
  /** Hot centre of the themed backdrop. */
  secondary: string;
  /** Text colour used on top of the themed backdrop. */
  ink: string;
}

export interface Product {
  id: string;
  /** Short display name shown on the pedestal and as the reveal headline. */
  name: string;
  /** Optional range prefix, e.g. "4X". */
  line?: string;
  /** Category line under the name, e.g. "Essential Amino Acids". */
  category: string;
  description: string;
  theme: ProductTheme;
  packaging: PackagingSpec;
  /**
   * Flat label artwork under /public (see docs/ASSETS.md for the export spec).
   * When omitted a placeholder label is generated at runtime so the site always runs.
   */
  labelSrc?: string;
  /** Optional GLB that replaces the procedural pack entirely (pouches, odd shapes). */
  modelSrc?: string;
  features: ProductFeature[];
  /** True while any field above is still placeholder copy. Surfaces in the dev badge. */
  placeholder: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface SiteContent {
  brand: string;
  /** Two lines max — rendered huge behind the product in the slogan act. */
  slogan: [string, string?];
  hero: { hint: string; prev: string; next: string };
  lineup: { title: string; caption: string };
  faqTitle: string;
  outro: { title: string; body: string };
  footer: { legalEntity: string; disclaimer: string; links: { label: string; href: string }[] };
}
