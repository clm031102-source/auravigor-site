import { products } from '@/content/products';
import { useAppStore } from '@/store/useAppStore';

/** Act 2 — the chosen product steps forward; name + one short paragraph. */
export function RevealOverlay() {
  const product = products[useAppStore((s) => s.activeIndex)];

  return (
    <div className="overlay overlay--reveal">
      <div className="copy">
        <h1 className="copy__title">
          {product.line && <span className="copy__line">{product.line} </span>}
          {product.name}
        </h1>
        <p className="copy__eyebrow">{product.category}</p>
        <p className="copy__body">{product.description}</p>
      </div>
    </div>
  );
}
