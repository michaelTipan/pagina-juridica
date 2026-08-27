import { createPublicClient } from '@/lib/supabase/public';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CalendarDays } from 'lucide-react';
import type { Metadata } from 'next';
import type { Articulo } from '@/types/database';

export const metadata: Metadata = {
  title: 'Blog Jurídico',
  description:
    'Guías y análisis jurídicos sobre derecho civil, penal, laboral, familiar y empresarial en Ecuador. Información legal útil para tus derechos.',
  alternates: { canonical: '/blog' },
};

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

export default async function BlogPage() {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from('articulos')
    .select('*')
    .eq('publicado', true)
    .order('fecha_publicacion', { ascending: false });
  const articulos = (data as Articulo[]) || [];

  return (
    <>
      <section className="bg-navy pt-32 pb-20 text-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="text-xs uppercase tracking-[0.2em] text-gold font-semibold">
            Blog Jurídico
          </span>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl font-semibold leading-tight max-w-3xl">
            Conoce tus derechos y toma decisiones informadas
          </h1>
          <p className="mt-5 text-white/70 text-lg max-w-2xl leading-relaxed">
            Artículos y guías jurídicas pensadas para ayudarte a entender tu
            situación legal.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {articulos.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              Pronto publicaremos contenido jurídico de interés.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatDate(a.fecha_publicacion || a.created_at)}
                    </div>
                    <h2 className="font-serif text-lg font-semibold text-navy group-hover:text-gold transition-colors line-clamp-2">
                      {a.titulo}
                    </h2>
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
          )}
        </div>
      </section>
    </>
  );
}
