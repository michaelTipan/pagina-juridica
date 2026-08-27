import { Search, PenTool, HandHeart } from 'lucide-react';

const steps = [
  {
    num: '01',
    icon: Search,
    title: 'Analizamos tu situación',
    desc: 'En una primera consulta escuchamos tu caso, revisamos la documentación y evaluamos las opciones legales disponibles para ti.',
  },
  {
    num: '02',
    icon: PenTool,
    title: 'Diseñamos una estrategia legal',
    desc: 'Con un diagnóstico claro, construimos un plan jurídico detallado, con objetivos, plazos y una estimación honesta de costos.',
  },
  {
    num: '03',
    icon: HandHeart,
    title: 'Te acompañamos durante el proceso',
    desc: 'Ejecutamos la estrategia contigo a cada paso, con comunicación constante y disponible para resolver tus dudas.',
  },
];

export function Methodology() {
  return (
    <section className="py-24 bg-secondary/40">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-gold font-semibold">
            Metodología de trabajo
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-navy mt-4">
            Cómo trabajamos contigo
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Un proceso claro y transparente, diseñado para que sepas siempre en
            qué está tu caso y qué sigue.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0">
          {steps.map((s, i) => (
            <div
              key={s.num}
              className="relative flex flex-col items-center text-center px-6 md:px-8"
            >
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-px bg-border" />
              )}
              <div className="relative z-10 mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-navy text-gold border-4 border-secondary/40">
                <s.icon className="h-9 w-9" />
                <span className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-gold text-navy text-xs font-bold">
                  {s.num}
                </span>
              </div>
              <h3 className="font-serif text-xl font-semibold text-navy mb-3">
                {s.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
