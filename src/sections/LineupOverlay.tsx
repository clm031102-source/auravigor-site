import { site } from '@/content/site';

/** Act 5 — the whole range lines up. */
export function LineupOverlay() {
  return (
    <div className="overlay overlay--lineup">
      <div className="lineup__copy">
        <h2 className="copy__title copy__title--sm">{site.lineup.title}</h2>
        <p className="copy__body">{site.lineup.caption}</p>
      </div>
    </div>
  );
}
