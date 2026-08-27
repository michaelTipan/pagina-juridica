import Link from 'next/link';
import { MessageCircle, Calendar, ArrowRight } from 'lucide-react';

export function CtaSection({
  whatsapp,
  nombreEstudio,
}: {
  whatsapp: string;
  nombreEstudio: string;
}) {
  return (
    <section className="relative py-24 bg-navy overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-gold blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-gold blur-3xl" />
      </div>
      <div className="relative container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-xs uppercase tracking-[0.2em] text-gold font-semibold">
          Hablemos de tu caso
        </span>
        <h2 className="mt-4 font-serif text-3xl sm:text-5xl font-semibold text-white leading-tight text-balance">
          Tu problema legal tiene una solución. Hablemos hoy.
        </h2>
        <p className="mt-6 text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
          {nombreEstudio} está listo para escucharte. Agenda una consulta y
          descubre cómo podemos ayudarte a proteger lo que más te importa.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contacto"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-gold px-7 py-3.5 text-navy font-semibold hover:bg-gold-light transition-colors"
          >
            <Calendar className="h-5 w-5" /> Agendar consulta
          </Link>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-white/30 px-7 py-3.5 text-white font-semibold hover:bg-white/10 transition-colors"
          >
            <MessageCircle className="h-5 w-5" /> WhatsApp
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
