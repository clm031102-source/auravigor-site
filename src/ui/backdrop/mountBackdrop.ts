import { createColorTransition, parseColor } from './colorTransition';
import { createBackdropRenderer, type BackdropFrame } from './renderer';

const colorProperties = {
  themeA: '--theme-a',
  themeB: '--theme-b',
  top: '--studio-top',
  mid: '--studio-mid',
  floor: '--studio-floor',
  glow: '--studio-glow',
  void: '--void',
} as const;

/** Read the director's CSS outputs, never scroll position; keep frame state outside React. */
export function mountBackdrop(canvas: HTMLCanvasElement, layer: HTMLDivElement) {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const stage = document.querySelector('.stage');
  const transitions = Object.fromEntries(
    Object.keys(colorProperties).map((name) => [name, createColorTransition()]),
  );
  let renderer: ReturnType<typeof createBackdropRenderer> = null;
  let frameId = 0;
  let inStage = true;
  let contextLost = false;
  let failed = false;
  let elapsed = 0;
  let previousTime: number | undefined;

  const stop = () => {
    cancelAnimationFrame(frameId);
    frameId = 0;
    previousTime = undefined;
    layer.dataset.running = 'false';
  };
  const fallback = () => {
    stop();
    layer.dataset.renderer = 'css';
    renderer?.dispose();
    renderer = null;
  };

  const draw = (now: number) => {
    frameId = 0;
    if (!renderer) return;
    const style = getComputedStyle(document.documentElement);
    const colors = {} as BackdropFrame['colors'];
    for (const name of Object.keys(colorProperties) as (keyof typeof colorProperties)[]) {
      const color = parseColor(style.getPropertyValue(colorProperties[name]));
      if (!color) {
        failed = true;
        fallback();
        return;
      }
      colors[name] = transitions[name].sample(color, now);
    }
    if (previousTime !== undefined) elapsed += Math.min(now - previousTime, 100) / 1000;
    previousTime = now;
    const amount = (property: string) => {
      const value = Number.parseFloat(style.getPropertyValue(property));
      return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
    };
    renderer.draw({
      time: elapsed,
      themeMix: amount('--theme-mix'),
      burst: amount('--burst'),
      colors,
    });
    layer.dataset.renderer = 'webgl';
    layer.dataset.running = 'true';
    frameId = requestAnimationFrame(draw);
  };

  const sync = () => {
    if (motion.matches || contextLost || failed) {
      fallback();
      return;
    }
    if (document.hidden || !inStage) {
      stop();
      return;
    }
    if (!renderer) {
      renderer = createBackdropRenderer(canvas);
      if (!renderer) {
        failed = true;
        fallback();
        return;
      }
    }
    if (!frameId) frameId = requestAnimationFrame(draw);
  };

  const onLost = (event: Event) => {
    event.preventDefault();
    contextLost = true;
    fallback();
  };
  const onRestored = () => {
    contextLost = false;
    failed = false;
    sync();
  };
  const observer = new IntersectionObserver(([entry]) => {
    // Visibility only: the existing director remains the sole source of scroll progress.
    inStage = entry.isIntersecting;
    sync();
  });
  if (stage) observer.observe(stage);
  motion.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', onRestored);
  sync();

  return () => {
    observer.disconnect();
    motion.removeEventListener('change', sync);
    document.removeEventListener('visibilitychange', sync);
    canvas.removeEventListener('webglcontextlost', onLost);
    canvas.removeEventListener('webglcontextrestored', onRestored);
    fallback();
  };
}
