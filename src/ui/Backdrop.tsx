import { useEffect, useRef } from 'react';
import { mountBackdrop } from './backdrop/mountBackdrop';

/** Layer 0 keeps the CSS fallback underneath an independent, decorative WebGL surface. */
export function Backdrop() {
  const layer = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvas.current || !layer.current) return undefined;
    return mountBackdrop(canvas.current, layer.current);
  }, []);

  return (
    <div ref={layer} className="layer layer--backdrop" aria-hidden="true">
      <div className="backdrop__theme" />
      <div className="backdrop__burst" />
      <canvas ref={canvas} className="backdrop__canvas" />
    </div>
  );
}
