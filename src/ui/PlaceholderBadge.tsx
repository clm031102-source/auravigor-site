import { products } from '@/content/products';

/** Dev-only reminder of how much placeholder content is left. Never rendered in production. */
export function PlaceholderBadge() {
  if (!import.meta.env.DEV) return null;
  const pending = products.filter((p) => p.placeholder || !p.labelSrc).length;
  if (!pending) return null;
  return (
    <div className="placeholder-badge">
      {pending}/{products.length} products still use placeholder copy or label
    </div>
  );
}
