import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, CalendarDays, User } from 'lucide-react';
import type { Metadata } from 'next';
import { getSiteConfig, whatsappLink } from '@/lib/data';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('articulos')
    .select('titulo, slug, meta_titulo, meta_descripcion, resumen')
    .eq('slug', params.slug)
    .maybeSingle();

  if (!data) return { title: 'Artículo no encontrado' };

  return {
    title: data.meta_titulo || data.titulo,
    description: data.meta_descripcion || data.resumen || '',
    alternates: { canonical: `/blog/${data.slug}` },
    openGraph: {
      type: 'article',
      title: data.meta_titulo || data.titulo,
      description: data.meta_descripcion || data.resumen || '',
    },
  };
}

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

export default async function ArticuloPage({ params }: Props) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('articulos')
    .select('*')
    .eq('slug', params.slug)
    .eq('publicado', true)
    .maybeSingle();

  if (!data) notFound();

  const config = await getSiteConfig();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.titulo,
    description: data.meta_descripcion || data.resumen || '',
    datePublished: data.fecha_publicacion || data.created_at,
    author: { '@type': 'Organization', name: data.autor || config.nombre_estudio },
    publisher: { '@type': 'Organization', name: config.nombre_estudio },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="relative bg-navy pt-32 pb-24 text-white overflow-hidden">
        <div className="absolute inset-0">
          {data.imagen_url && (
            <Image
              src={data.imagen_url}
              alt={data.titulo}
              fill
              priority
              className="object-cover opacity-25"
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-navy/60" />
        </div>
        <div className="relative container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-gold hover:text-gold-light mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Blog
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
            {data.titulo}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/60">
            {data.autor && (
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" /> {data.autor}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" /> {formatDate(data.fecha_publicacion || data.created_at)}
            </span>
          </div>
        </div>
      </section>

      <article className="py-16 bg-white">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {data.resumen && (
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 font-medium italic border-l-4 border-gold pl-6">
              {data.resumen}
            </p>
          )}
          {data.contenido ? (
            <div
              className="prose-legal text-foreground"
              dangerouslySetInnerHTML={{ __html: data.contenido }}
            />
          ) : (
            <p className="text-muted-foreground">Contenido no disponible.</p>
          )}

          <div className="mt-12 p-8 rounded-lg bg-secondary/50 border border-border text-center">
            <h2 className="font-serif text-xl font-semibold text-navy">
              ¿Tienes una duda legal similar?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Conversemos sobre tu caso. Agenda una consulta sin compromiso.
            </p>
            <a
              href={whatsappLink(config)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-gold px-6 py-3 text-navy font-semibold hover:bg-gold-light transition-colors"
            >
              Escríbenos por WhatsApp
            </a>
          </div>
        </div>
      </article>
    </>
  );
}
