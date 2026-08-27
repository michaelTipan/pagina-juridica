import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Linkedin, GraduationCap } from 'lucide-react';
import type { Abogado } from '@/types/database';

const defaultPhotos: string[] = [
  'https://images.pexels.com/photos/32907706/pexels-photo-32907706.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/34073779/pexels-photo-34073779.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/32892533/pexels-photo-32892533.jpeg?auto=compress&cs=tinysrgb&w=800',
];

export function TeamPreview({ abogados }: { abogados: Abogado[] }) {
  if (!abogados || abogados.length === 0) return null;

  return (
    <section id="equipo" className="py-24 bg-secondary/40">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.2em] text-gold font-semibold">
            Nuestro Equipo
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-navy mt-4">
            Abogados dedicados a tu caso
          </h2>
          <p className="mt-4 text-muted-foreground leading-loose">
            Un equipo cercano, con formación sólida y compromiso real con cada
            cliente.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {abogados.slice(0, 3).map((a, i) => (
            <div
              key={a.id}
              className="group bg-white rounded-lg overflow-hidden border border-border hover:shadow-xl transition-all duration-300"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
                <Image
                  src={a.foto_url || defaultPhotos[i % defaultPhotos.length]}
                  alt={a.nombre}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </div>
              <div className="p-8">
                <h3 className="font-serif text-xl font-semibold text-navy">
                  {a.nombre}
                </h3>
                <p className="text-sm text-gold font-medium mt-1">{a.cargo}</p>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5" /> {a.especialidad}
                </p>
                {a.biografia && (
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {a.biografia}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/equipo"
            className="inline-flex items-center gap-2 text-sm font-medium text-navy hover:text-gold transition-colors"
          >
            Conoce a todo el equipo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
