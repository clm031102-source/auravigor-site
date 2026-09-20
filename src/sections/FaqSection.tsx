import { faq, site } from '@/content/site';

/** Native <details> accordion: accessible and zero-JS. Motion polish is T07. */
export function FaqSection() {
  return (
    <section className="faq" id="faq">
      <h2 className="faq__title">{site.faqTitle}</h2>
      <div className="faq__list">
        {faq.map((item) => (
          <details key={item.id} className="faq__item">
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
