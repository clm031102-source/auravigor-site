import { useRef } from 'react';
import { TOTAL_VH } from '@/director/acts';
import { useScrollDirector } from '@/director/useScrollDirector';
import { useAppStore } from '@/store/useAppStore';
import { FeaturesOverlay } from './FeaturesOverlay';
import { HeroOverlay } from './HeroOverlay';
import { LineupOverlay } from './LineupOverlay';
import { RevealOverlay } from './RevealOverlay';

/**
 * The pinned film. A tall spacer provides the scroll distance (sum of act lengths + one
 * viewport); a sticky 100vh child holds every act's DOM overlay stacked on top of each other.
 * Each overlay fades with its own --vis-<act> variable.
 */
export function Stage() {
  const ref = useRef<HTMLElement>(null);
  useScrollDirector(ref);
  const act = useAppStore((s) => s.act);

  return (
    <section ref={ref} className="stage" style={{ height: `${TOTAL_VH + 100}vh` }} data-act={act}>
      <div className="stage__pin">
        <HeroOverlay />
        <RevealOverlay />
        <FeaturesOverlay />
        <LineupOverlay />
      </div>
    </section>
  );
}
