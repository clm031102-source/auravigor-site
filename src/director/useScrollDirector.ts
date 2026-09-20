import { useEffect, type RefObject } from 'react';
import { products } from '@/content/products';
import { useAppStore } from '@/store/useAppStore';
import { ACT_IDS, TOTAL_VH, featureBlend, resolveActs } from './acts';
import { smoothstep } from './math';
import { scrollState } from './scrollState';
import { ScrollTrigger } from './smoothScroll';

/**
 * The single place where scroll becomes state.
 *
 *   scroll ──► resolveActs() ──► scrollState   (mutable, read by three.js in useFrame)
 *                           ├──► CSS variables (continuous DOM / backdrop animation)
 *                           └──► zustand       (act + feature index, only when they change)
 *
 * CSS variables written on <html>:
 *   --p-<act>      0..1 progress inside the act
 *   --vis-<act>    0..1 overlay visibility of the act
 *   --theme-mix    0..1 how much of the product theme floods the backdrop
 *   --burst        0..1 energy burst behind the slogan
 *   --progress     0..1 whole-stage progress (header progress bar)
 */
export function useScrollDirector(stageRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    const root = document.documentElement;

    const apply = () => {
      const { local, vis } = scrollState;
      ACT_IDS.forEach((id) => {
        root.style.setProperty(`--p-${id}`, local[id].toFixed(4));
        root.style.setProperty(`--vis-${id}`, vis[id].toFixed(4));
      });
      const themeIn = smoothstep(0.05, 0.6, local.reveal);
      const themeOut = smoothstep(0, 0.4, local.lineup);
      root.style.setProperty('--theme-mix', (themeIn * (1 - themeOut)).toFixed(4));
      root.style.setProperty(
        '--burst',
        (smoothstep(0, 0.3, local.slogan) * (1 - themeOut)).toFixed(4),
      );
      root.style.setProperty('--progress', scrollState.total.toFixed(4));

      const store = useAppStore.getState();
      store.setAct(scrollState.act);
      const count = products[store.activeIndex].features.length;
      store.setFeatureIndex(featureBlend(local.features, count).index);
    };

    const pinned = ScrollTrigger.create({
      trigger: stage,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        scrollState.total = self.progress;
        Object.assign(scrollState, resolveActs(self.progress * TOTAL_VH));
        apply();
      },
    });

    const exit = ScrollTrigger.create({
      trigger: stage,
      start: 'bottom bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        scrollState.exit = self.progress;
      },
    });

    apply();
    return () => {
      pinned.kill();
      exit.kill();
    };
  }, [stageRef]);
}
