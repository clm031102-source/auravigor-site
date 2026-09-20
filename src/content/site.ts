import type { FaqItem, SiteContent } from './types';

/** ⚠️ PLACEHOLDER COPY — see docs/TASKS.md T03. Nothing here is approved for publication. */
export const site: SiteContent = {
  brand: 'AURAVIGOR',
  slogan: ['NO', 'SHORTCUTS'],
  hero: {
    hint: 'Drag to choose · Scroll to discover',
    prev: 'Previous product',
    next: 'Next product',
  },
  lineup: {
    title: 'The Lineup',
    caption: '[Placeholder] One line that frames the full range.',
  },
  faqTitle: 'Questions, answered',
  outro: {
    title: 'Built for the work',
    body: '[Placeholder] A closing brand statement. Two or three sentences about who AuraVigor is for.',
  },
  footer: {
    legalEntity: '© AUXILIFE NUTRITION LIMITED',
    disclaimer:
      '[Placeholder — legal to confirm per market] These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.',
    links: [
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
};

export const faq: FaqItem[] = [
  {
    id: 'what',
    question: '[Placeholder] What makes AuraVigor different?',
    answer: '[Placeholder] Approved answer goes here.',
  },
  {
    id: 'who',
    question: '[Placeholder] Who are these products for?',
    answer: '[Placeholder] Approved answer goes here.',
  },
  {
    id: 'how',
    question: '[Placeholder] How should I take them?',
    answer: '[Placeholder] Approved answer goes here.',
  },
  {
    id: 'tested',
    question: '[Placeholder] Are the products third-party tested?',
    answer: '[Placeholder] Approved answer goes here.',
  },
  {
    id: 'where',
    question: '[Placeholder] Where can I find AuraVigor?',
    answer: '[Placeholder] Approved answer goes here.',
  },
];
