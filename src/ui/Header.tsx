import { site } from '@/content/site';
import { scrollToTarget } from '@/director/smoothScroll';
import { useAppStore } from '@/store/useAppStore';

const MENU: { label: string; target: number | string }[] = [
  { label: 'Products', target: 0 },
  { label: 'FAQ', target: '#faq' },
  { label: 'About', target: '#about' },
];

/** Persistent chrome: progress bar, sound toggle (state only — audio is T12), wordmark, menu (full menu is T14). */
export function Header() {
  const soundOn = useAppStore((s) => s.soundOn);
  const toggleSound = useAppStore((s) => s.toggleSound);
  const menuOpen = useAppStore((s) => s.menuOpen);
  const toggleMenu = useAppStore((s) => s.toggleMenu);

  return (
    <header className="header">
      <div className="header__progress" aria-hidden="true" />

      <button type="button" className="header__btn" aria-pressed={soundOn} onClick={toggleSound}>
        Sound {soundOn ? 'on' : 'off'}
      </button>

      <button type="button" className="header__logo" onClick={() => scrollToTarget(0)} aria-label={`${site.brand} — back to top`}>
        {site.brand}
      </button>

      <button type="button" className="header__btn" aria-expanded={menuOpen} aria-controls="menu" onClick={toggleMenu}>
        Menu
      </button>

      <nav id="menu" className="menu" hidden={!menuOpen} aria-label="Main">
        {MENU.map((item) => (
          <a
            key={item.label}
            href={typeof item.target === 'string' ? item.target : '#'}
            onClick={(event) => {
              event.preventDefault();
              toggleMenu();
              scrollToTarget(item.target);
            }}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
