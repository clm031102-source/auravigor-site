import { useEffect, useRef } from 'react';
import { products } from '@/content/products';
import { site } from '@/content/site';
import { ringState } from '@/director/scrollState';
import { useAppStore } from '@/store/useAppStore';

/** Fraction of the viewport width the pointer travels to move the ring by one slot. */
const SLOT_TRAVEL = 0.22;

/**
 * Act 1 — product picker. The ring itself is WebGL; every control is DOM so it is reachable by
 * keyboard and screen readers: drag, arrow buttons, ← / → keys.
 */
export function HeroOverlay() {
  const activeIndex = useAppStore((s) => s.activeIndex);
  const act = useAppStore((s) => s.act);
  const stepProduct = useAppStore((s) => s.stepProduct);
  const settleRing = useAppStore((s) => s.settleRing);
  const drag = useRef<{ startX: number; startTarget: number } | null>(null);
  const product = products[activeIndex];
  const interactive = act === 'hero';

  useEffect(() => {
    if (!interactive) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') stepProduct(-1);
      if (event.key === 'ArrowRight') stepProduct(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [interactive, stepProduct]);

  const endDrag = () => {
    if (!drag.current) return;
    drag.current = null;
    ringState.dragging = false;
    settleRing(ringState.target);
  };

  return (
    <div className="overlay overlay--hero" data-interactive={interactive}>
      <div
        className="hero__drag"
        onPointerDown={(event) => {
          if (!interactive) return;
          event.currentTarget.setPointerCapture(event.pointerId);
          drag.current = { startX: event.clientX, startTarget: ringState.target };
          ringState.dragging = true;
        }}
        onPointerMove={(event) => {
          if (!drag.current) return;
          const travelled =
            (event.clientX - drag.current.startX) / (window.innerWidth * SLOT_TRAVEL);
          ringState.target = drag.current.startTarget - travelled;
        }}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      />

      <div className="hero__pedestal">
        <button
          type="button"
          className="hero__arrow"
          aria-label={site.hero.prev}
          onClick={() => stepProduct(-1)}
        >
          ←
        </button>
        <div className="hero__name" aria-live="polite">
          {product.line && <span className="hero__line">{product.line}</span>}
          <span>{product.name}</span>
          <small>{product.category}</small>
        </div>
        <button
          type="button"
          className="hero__arrow"
          aria-label={site.hero.next}
          onClick={() => stepProduct(1)}
        >
          →
        </button>
      </div>

      <p className="hero__hint">{site.hero.hint}</p>
    </div>
  );
}
