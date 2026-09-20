import { lazy, Suspense, useEffect } from 'react';
import { products } from '@/content/products';
import { startSmoothScroll } from '@/director/smoothScroll';
import { FaqSection } from '@/sections/FaqSection';
import { OutroSection } from '@/sections/OutroSection';
import { Stage } from '@/sections/Stage';
import { useAppStore } from '@/store/useAppStore';
import { Backdrop } from '@/ui/Backdrop';
import { Header } from '@/ui/Header';
import { Loader } from '@/ui/Loader';
import { PlaceholderBadge } from '@/ui/PlaceholderBadge';
import { SloganLayer } from '@/ui/SloganLayer';

// three.js + R3F are ~90% of the bundle: load them after the shell has painted.
const Experience = lazy(() => import('@/experience/Experience').then((m) => ({ default: m.Experience })));

/**
 * Layer map (back → front). Full explanation in docs/ARCHITECTURE.md.
 *   0 Backdrop      fixed   CSS gradients driven by --theme-mix / --burst
 *   1 SloganLayer   fixed   giant type that the pack overlaps
 *   2 Experience    fixed   transparent WebGL canvas, pointer-events: none
 *   3 <main>        flow    pinned Stage overlays, then FAQ + outro in normal flow
 *   4 Header / Loader
 */
export function App() {
  const activeIndex = useAppStore((s) => s.activeIndex);

  useEffect(() => startSmoothScroll(), []);

  // The active product's theme drives every themed surface through three CSS variables.
  useEffect(() => {
    const { primary, secondary, ink } = products[activeIndex].theme;
    const root = document.documentElement;
    root.style.setProperty('--theme-a', primary);
    root.style.setProperty('--theme-b', secondary);
    root.style.setProperty('--theme-ink', ink);
  }, [activeIndex]);

  return (
    <>
      <Backdrop />
      <SloganLayer />
      <Suspense fallback={null}>
        <Experience />
      </Suspense>
      <Header />
      <main id="top">
        <Stage />
        <FaqSection />
        <OutroSection />
      </main>
      <Loader />
      <PlaceholderBadge />
    </>
  );
}
