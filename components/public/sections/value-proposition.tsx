import { Users, Eye, Brain, Compass } from 'lucide-react';

const values = [
  {
    icon: Users,
    title: 'AtenciÃ³n personalizada',
    desc: 'Cada caso es Ãºnico. Te escuchamos y dedicamos el tiempo necesario para entender tu situaciÃ³n a fondo.',
  },
  {
    icon: Eye,
    title: 'ComunicaciÃ³n transparente',
    desc: 'Te mantenemos informado en cada etapa del proceso, con un lenguaje claro y sin tecnicismos innecesarios.',
  },
  {
    icon: Brain,
    title: 'Estrategia jurÃ­dica',
    desc: 'DiseÃ±amos una estrategia legal a tu medida, evaluando riesgos y oportunidades para tomar las mejores decisiones.',
  },
  {
    icon: Compass,
    title: 'AcompaÃ±amiento integral',
    desc: 'Te acompaÃ±amos durante todo el proceso, desde la primera consulta hasta la resoluciÃ³n final de tu caso.',
  },
];

export function ValueProposition() {
  return (
    <section id="propuesta" className="py-24 bg-white">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-gold font-semibold">
            Â¿Por quÃ© elegirnos?
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-navy mt-4">
            Una firma jurÃ­dica pensada para ti
          </h2>
          <p className="mt-4 text-muted-foreground leading-loose">
            No gestionamos casos en serie. Trabajamos con un nÃºmero limitado de
            clientes para garantizar dedicaciÃ³n, cercanÃ­a y resultados.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <div
              key={v.title}
              className="group relative bg-white border border-border rounded-lg p-8 hover:border-gold/50 hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-md bg-navy text-gold group-hover:bg-gold group-hover:text-navy transition-colors">
                <v.icon className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-navy mb-3">
                {v.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-loose">
                {v.desc}
              </p>
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gold group-hover:w-full transition-all duration-300 rounded-b-lg" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

