/**
 * Layer 0. CSS-only stand-in for the reference site's shader backdrop: neutral studio
 * gradient → product theme flood (--theme-mix) → energy burst (--burst).
 * Upgrading this to a WebGL shader is T06; keep the same CSS-variable contract.
 */
export function Backdrop() {
  return (
    <div className="layer layer--backdrop" aria-hidden="true">
      <div className="backdrop__theme" />
      <div className="backdrop__burst" />
    </div>
  );
}
