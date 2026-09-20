import { site } from '@/content/site';
import { products } from '@/content/products';
import { actStartVh } from '@/director/acts';
import { prefersReducedMotion, scrollToTarget } from '@/director/smoothScroll';
import { useAppStore } from '@/store/useAppStore';

/** Act 5 — the whole range lines up. */
export function LineupOverlay() {
  const act = useAppStore((s) => s.act);
  const activeIndex = useAppStore((s) => s.activeIndex);
  const settleRing = useAppStore((s) => s.settleRing);
  const interactive = act === 'lineup';
  return (
    <div className="overlay overlay--lineup" data-interactive={interactive} inert={!interactive}>
      {products.map((product, index) => (
        <button
          key={product.id}
          id={`lineup-product-${product.id}`}
          type="button"
          className="product-target product-target--lineup"
          aria-pressed={activeIndex === index}
          onClick={() => {
            settleRing(index);
            scrollToTarget(
              (actStartVh('reveal') * window.innerHeight) / 100,
              prefersReducedMotion(),
            );
          }}
        >
          <span className="product-target__name">
            {product.line && `${product.line} `}
            {product.name}
          </span>
        </button>
      ))}
      <div className="lineup__copy">
        <h2 className="copy__title copy__title--sm">{site.lineup.title}</h2>
        <p className="copy__body">{site.lineup.caption}</p>
      </div>
    </div>
  );
}
