import { site } from '@/content/site';

/**
 * Layer 1 — sits BETWEEN the backdrop and the product canvas so the pack overlaps the type,
 * exactly like the reference. That is why the canvas is transparent.
 */
export function SloganLayer() {
  return (
    <div className="layer layer--slogan" aria-hidden="true">
      <p className="slogan">
        {site.slogan.filter(Boolean).map((line) => (
          <span key={line}>{line}</span>
        ))}
      </p>
    </div>
  );
}
