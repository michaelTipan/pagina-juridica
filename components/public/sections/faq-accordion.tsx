'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { Faq } from '@/types/database';

export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  return (
    <Accordion type="single" collapsible className="space-y-4">
      {faqs.map((f) => (
        <AccordionItem
          key={f.id}
          value={f.id}
          className="border border-border rounded-lg px-6 bg-white hover:border-gold/40 transition-colors"
        >
          <AccordionTrigger className="text-left font-serif text-lg text-navy hover:no-underline">
            {f.pregunta}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed">
            {f.respuesta}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
