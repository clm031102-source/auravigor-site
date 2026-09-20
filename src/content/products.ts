import type { Product, ProductFeature } from './types';

/**
 * ⚠️ PLACEHOLDER DATA
 * SKU list comes from the brand brief; every dimension, colour and line of copy below is a
 * stand-in so the experience runs end to end. Nothing here is an approved product claim.
 * Replace per docs/ASSETS.md + docs/TASKS.md (T02 / T03) and flip `placeholder` to false.
 */

const placeholderFeatures = (subject: string): ProductFeature[] => [
  {
    id: 'formula',
    icon: 'formula',
    title: 'The Formula',
    body: `[Placeholder] One or two sentences on what goes into ${subject}. Replace with approved copy.`,
    faceAngle: Math.PI * 0.62,
  },
  {
    id: 'source',
    icon: 'source',
    title: 'Sourcing',
    body: '[Placeholder] Where the key ingredients come from and why it matters. Replace with approved copy.',
    faceAngle: Math.PI * 0.78,
  },
  {
    id: 'taste',
    icon: 'taste',
    title: 'Taste & Mix',
    body: '[Placeholder] Flavour, mixability or how to take it. Replace with approved copy.',
    faceAngle: Math.PI * 1.22,
  },
  {
    id: 'quality',
    icon: 'quality',
    title: 'Quality',
    body: '[Placeholder] Testing, certification or manufacturing standard. Replace with approved copy.',
    faceAngle: Math.PI * 1.38,
  },
];

export const products: Product[] = [
  {
    id: 'eaa',
    name: 'EAA',
    category: 'Essential Amino Acids',
    description: '[Placeholder] A short, sensory line about EAA. Two sentences at most.',
    theme: { primary: '#e8400c', secondary: '#ffb02e', ink: '#ffffff' },
    packaging: {
      type: 'tub',
      heightMm: 170,
      diameterMm: 110,
      label: { bottomMm: 12, heightMm: 112 },
      bodyColor: '#101012',
      lidColor: '#0a0a0b',
    },
    features: placeholderFeatures('EAA'),
    placeholder: true,
  },
  {
    id: 'arginine-4x',
    name: 'Arginine',
    line: '4X',
    category: 'L-Arginine',
    description: '[Placeholder] A short, sensory line about 4X Arginine. Two sentences at most.',
    theme: { primary: '#5b16d6', secondary: '#d14bff', ink: '#ffffff' },
    packaging: {
      type: 'tub',
      heightMm: 150,
      diameterMm: 100,
      label: { bottomMm: 10, heightMm: 98 },
      bodyColor: '#101012',
      lidColor: '#0a0a0b',
    },
    features: placeholderFeatures('4X Arginine'),
    placeholder: true,
  },
  {
    id: 'gluta-4x',
    name: 'Gluta',
    line: '4X',
    category: 'L-Glutamine',
    description: '[Placeholder] A short, sensory line about 4X Gluta. Two sentences at most.',
    theme: { primary: '#0b4fd8', secondary: '#35d0ff', ink: '#ffffff' },
    packaging: {
      type: 'tub',
      heightMm: 150,
      diameterMm: 100,
      label: { bottomMm: 10, heightMm: 98 },
      bodyColor: '#101012',
      lidColor: '#0a0a0b',
    },
    features: placeholderFeatures('4X Gluta'),
    placeholder: true,
  },
  {
    id: 'vine-flam',
    name: 'VINE·FLAM',
    category: 'Apple Cider Vinegar Capsules',
    description: '[Placeholder] A short, sensory line about VINE·FLAM. Two sentences at most.',
    theme: { primary: '#b3121f', secondary: '#ff7a3d', ink: '#ffffff' },
    packaging: {
      type: 'bottle',
      heightMm: 125,
      diameterMm: 66,
      label: { bottomMm: 8, heightMm: 72 },
      bodyColor: '#f4f2ee',
      lidColor: '#0a0a0b',
    },
    features: placeholderFeatures('VINE·FLAM'),
    placeholder: true,
  },
  {
    id: 'enzymes',
    name: 'Enzymes',
    category: 'Digestive Enzyme Complex',
    description: '[Placeholder] A short, sensory line about Digestive Enzymes. Two sentences at most.',
    theme: { primary: '#0a7d4f', secondary: '#9be15d', ink: '#ffffff' },
    packaging: {
      type: 'bottle',
      heightMm: 125,
      diameterMm: 66,
      label: { bottomMm: 8, heightMm: 72 },
      bodyColor: '#f4f2ee',
      lidColor: '#0a0a0b',
    },
    features: placeholderFeatures('Digestive Enzymes'),
    placeholder: true,
  },
];

export const productCount = products.length;
