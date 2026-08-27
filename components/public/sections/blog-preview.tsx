import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CalendarDays } from 'lucide-react';
import type { Articulo } from '@/types/database';

function formatDate(d: string | null) {
  if (!d) return '';
  try {
    return new Date(d).toLocaleDateString('es-EC', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

export function BlogPreview({ articulos }: { articulos: Articulo[] }) {
  if (!articulos || articulos.length === 0) return null;

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.2em] text-gold font-semibold">
              Blog Jurídico
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-navy mt-4">
              Información legal que te orienta
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Guías y análisis jurídicos para ayudarte a entender tus derechos y
              tomar decisiones informadas.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-navy hover:text-gold transition-colors"
          >
            Ver todos los artículos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articulos.map((a) => (
            <Link
              key={a.id}
              href={`/blog/${a.slug}`}
              className="group flex flex-col bg-white border border-border rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
                <Image
                  src={a.imagen_url || 'https://images.pexels.com/photos/7876088/pexels-photo-7876088.jpeg?auto=compress&cs=tinysrgb&w=800'}
                  alt={a.titulo}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(min-width: 768px) 33vw, 100vw"
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {formatDate(a.fecha_publicacion || a.created_at)}
                </div>
                <h3 className="font-serif text-lg font-semibold text-navy group-hover:text-gold transition-colors line-clamp-2">
                  {a.titulo}
                </h3>
                {a.resumen && (
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
                    {a.resumen}
                  </p>
                )}
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-gold group-hover:gap-3 transition-all">
                  Leer artículo <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
