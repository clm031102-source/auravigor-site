import { products } from '@/content/products';
import { useAppStore } from '@/store/useAppStore';

/**
 * Act 3 — feature callouts. The pack turns to the label panel that matches the callout
 * (ProductFeature.faceAngle); the dots on the right mirror the reference site's step nav.
 * All features stay in the DOM (good for SEO / screen readers); only the current one is shown.
 */
export function FeaturesOverlay() {
  const product = products[useAppStore((s) => s.activeIndex)];
  const featureIndex = useAppStore((s) => s.featureIndex);

  return (
    <div className="overlay overlay--features">
      <ol className="features">
        {product.features.map((feature, index) => (
          <li
            key={feature.id}
            className="copy features__item"
            data-current={index === featureIndex}
          >
            <p className="copy__eyebrow">
              {String(index + 1).padStart(2, '0')} /{' '}
              {String(product.features.length).padStart(2, '0')}
            </p>
            <h2 className="copy__title copy__title--sm">{feature.title}</h2>
            <p className="copy__body">{feature.body}</p>
          </li>
        ))}
      </ol>

      <div className="dots" aria-hidden="true">
        {product.features.map((feature, index) => (
          <span
            key={feature.id}
            className="dots__dot"
            data-current={index === featureIndex}
            data-icon={feature.icon}
          />
        ))}
      </div>
    </div>
  );
}
