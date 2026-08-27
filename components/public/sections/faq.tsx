import { FaqAccordion } from '@/components/public/sections/faq-accordion';
import type { Faq } from '@/types/database';

export function FaqSection({ faqs }: { faqs: Faq[] }) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section id="faq" className="py-24 bg-secondary/40">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-xs uppercase tracking-[0.2em] text-gold font-semibold">
            Preguntas Frecuentes
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-navy mt-4">
            Resolvemos tus dudas
          </h2>
        </div>
        <FaqAccordion faqs={faqs} />
      </div>
    </section>
  );
}
