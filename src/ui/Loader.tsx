import { site } from '@/content/site';
import { useAppStore } from '@/store/useAppStore';

/** Covers the page until the WebGL scene exists. Real asset-progress loader is T11. */
export function Loader() {
  const ready = useAppStore((s) => s.ready);
  return (
    <div className="loader" data-ready={ready} aria-hidden={ready} role="status">
      <span>{site.brand}</span>
    </div>
  );
}
