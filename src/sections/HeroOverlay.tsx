import { useEffect, useRef } from 'react';
import { products } from '@/content/products';
import { site } from '@/content/site';
import { ringState } from '@/director/scrollState';
import { wrapCentered } from '@/director/math';
import { TUNING } from '@/experience/choreography';
import { useAppStore } from '@/store/useAppStore';

/**
 * Act 1 — product picker. The ring itself is WebGL; every control is DOM so it is reachable by
 * keyboard and screen readers: drag, arrow buttons, ← / → keys.
 */
export function HeroOverlay() {
  const activeIndex = useAppStore((s) => s.activeIndex);
  const act = useAppStore((s) => s.act);
  const stepProduct = useAppStore((s) => s.stepProduct);
  const settleRing = useAppStore((s) => s.settleRing);
  const drag = useRef<{
    startX: number;
    startY: number;
    startTarget: number;
    moved: boolean;
  } | null>(null);
  const suppressClick = useRef(false);
  const product = products[activeIndex];
  const interactive = act === 'hero';

  useEffect(() => {
    if (!interactive) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (useAppStore.getState().menuOpen) return;
      if (event.key === 'ArrowLeft') stepProduct(-1);
      if (event.key === 'ArrowRight') stepProduct(1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (drag.current?.moved) settleRing(ringState.target);
      drag.current = null;
      ringState.dragging = false;
    };
  }, [interactive, stepProduct, settleRing]);

  const endDrag = () => {
    if (!drag.current) return;
    const moved = drag.current.moved;
    drag.current = null;
    ringState.dragging = false;
    if (moved) settleRing(ringState.target);
  };

  return (
    <div className="overlay overlay--hero" data-interactive={interactive} inert={!interactive}>
      <div
        className="hero__drag"
        onPointerDown={(event) => {
          if (!interactive || event.button !== 0 || !event.isPrimary) return;
          suppressClick.current = false;
          drag.current = {
            startX: event.clientX,
            startY: event.clientY,
            startTarget: ringState.target,
            moved: false,
          };
        }}
        onPointerMove={(event) => {
          if (!drag.current || !event.isPrimary) return;
          if ((event.buttons & 1) === 0) {
            endDrag();
            return;
          }
          const dx = event.clientX - drag.current.startX;
          const dy = event.clientY - drag.current.startY;
          if (!drag.current.moved) {
            if (Math.max(Math.abs(dx), Math.abs(dy)) < TUNING.picker.dragThreshold) return;
            if (event.pointerType === 'touch' && Math.abs(dy) > Math.abs(dx)) {
              drag.current = null;
              return;
            }
            drag.current.moved = true;
            suppressClick.current = true;
            ringState.dragging = true;
            event.currentTarget.setPointerCapture(event.pointerId);
          }
          const travelled = dx / (window.innerWidth * TUNING.picker.slotTravel);
          ringState.target = drag.current.startTarget - travelled;
        }}
        onPointerUp={endDrag}
        onPointerCancel={() => {
          endDrag();
          suppressClick.current = false;
        }}
        onLostPointerCapture={endDrag}
        onClickCapture={(event) => {
          if (suppressClick.current) {
            event.preventDefault();
            event.stopPropagation();
            suppressClick.current = false;
          }
        }}
      >
        {products.map((item, index) => (
          <button
            key={item.id}
            id={`hero-product-${item.id}`}
            type="button"
            className="product-target"
            aria-label={`${item.line ? `${item.line} ` : ''}${item.name}`}
            aria-pressed={activeIndex === index}
            onClick={() =>
              settleRing(
                ringState.position + wrapCentered(index - ringState.position, products.length),
              )
            }
          />
        ))}
      </div>

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
