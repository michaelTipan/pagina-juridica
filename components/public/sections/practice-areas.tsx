import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Briefcase } from 'lucide-react';
import type { Servicio } from '@/types/database';

const defaultImages: Record<string, string> = {
  'derecho-civil': 'https://images.pexels.com/photos/8731037/pexels-photo-8731037.jpeg?auto=compress&cs=tinysrgb&w=800',
  'derecho-penal': 'https://images.pexels.com/photos/6077381/pexels-photo-6077381.jpeg?auto=compress&cs=tinysrgb&w=800',
  'derecho-laboral': 'https://images.pexels.com/photos/5668792/pexels-photo-5668792.jpeg?auto=compress&cs=tinysrgb&w=800',
  'derecho-familiar': 'https://images.pexels.com/photos/7841469/pexels-photo-7841469.jpeg?auto=compress&cs=tinysrgb&w=800',
  'derecho-empresarial': 'https://images.pexels.com/photos/7841457/pexels-photo-7841457.jpeg?auto=compress&cs=tinysrgb&w=800',
  'derecho-administrativo': 'https://images.pexels.com/photos/7876093/pexels-photo-7876093.jpeg?auto=compress&cs=tinysrgb&w=800',
};

export function PracticeAreas({ servicios }: { servicios: Servicio[] }) {
  return (
    <section id="areas" className="py-24 bg-white">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.2em] text-gold font-semibold">
              Ãreas de PrÃ¡ctica
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-navy mt-4">
              Soluciones legales en cada Ã¡rea del derecho
            </h2>
          </div>
          <Link
            href="/servicios"
            className="inline-flex items-center gap-2 text-sm font-medium text-navy hover:text-gold transition-colors"
          >
            Ver todas las Ã¡reas <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicios.map((s) => (
            <Link
              key={s.id}
              href={`/servicios/${s.slug}`}
              className="group relative overflow-hidden rounded-lg bg-navy aspect-[4/5] flex flex-col justify-end p-8 sm:p-10 hover:shadow-2xl transition-all duration-500"
            >
              <Image
                src={s.imagen_url || defaultImages[s.slug] || defaultImages['derecho-civil']}
                alt={s.nombre}
                fill
                className="object-cover opacity-50 group-hover:opacity-40 group-hover:scale-105 transition-all duration-500"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-transparent" />
              <div className="relative z-10">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-md bg-gold/20 border border-gold/40 text-gold">
                  <Briefcase className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-white mb-2">
                  {s.nombre}
                </h3>
                <p className="text-sm text-white/70 leading-loose line-clamp-3">
                  {s.descripcion}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-gold group-hover:gap-3 transition-all">
                  Conocer mÃ¡s <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

