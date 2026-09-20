import { site } from '@/content/site';

/** Closing statement + legal footer. Pure brand showcase: no store links, no lead form. */
export function OutroSection() {
  return (
    <section className="outro" id="about">
      <h2 className="outro__title">{site.outro.title}</h2>
      <p className="outro__body">{site.outro.body}</p>

      <footer className="footer">
        <p className="footer__disclaimer">{site.footer.disclaimer}</p>
        <div className="footer__row">
          <span>{site.footer.legalEntity}</span>
          <nav aria-label="Legal">
            {site.footer.links.map((link) => (
              <a key={link.label} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </section>
  );
}
