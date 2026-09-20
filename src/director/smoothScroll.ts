import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * One smooth-scroll instance for the app, ticked by GSAP so Lenis, ScrollTrigger and any
 * GSAP tween share a single clock. Skipped entirely for reduced-motion users.
 * Returns a disposer.
 */
export function startSmoothScroll(): () => void {
  if (prefersReducedMotion()) return () => {};

  lenis = new Lenis({ autoRaf: false, lerp: 0.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);

  const tick = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
  };
}

/** Programmatic scroll (pixel offset or CSS selector) that works with or without Lenis. */
export function scrollToTarget(target: number | string, immediate = false): void {
  if (lenis) {
    lenis.scrollTo(target, { immediate });
    return;
  }
  const behavior: ScrollBehavior = immediate ? 'auto' : 'smooth';
  if (typeof target === 'number') window.scrollTo({ top: target, behavior });
  else document.querySelector(target)?.scrollIntoView({ behavior });
}

export { gsap, ScrollTrigger };
