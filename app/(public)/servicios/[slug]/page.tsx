import { createPublicClient } from '@/lib/supabase/public';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowLeft, MessageCircle } from 'lucide-react';
import type { Metadata } from 'next';
import { getSiteConfig, whatsappLink } from '@/lib/data';

const defaultImages: Record<string, string> = {
  'derecho-civil': 'https://images.pexels.com/photos/8731037/pexels-photo-8731037.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'derecho-penal': 'https://images.pexels.com/photos/6077381/pexels-photo-6077381.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'derecho-laboral': 'https://images.pexels.com/photos/5668792/pexels-photo-5668792.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'derecho-familiar': 'https://images.pexels.com/photos/7841469/pexels-photo-7841469.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'derecho-empresarial': 'https://images.pexels.com/photos/7841457/pexels-photo-7841457.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'derecho-administrativo': 'https://images.pexels.com/photos/7876093/pexels-photo-7876093.jpeg?auto=compress&cs=tinysrgb&w=1600',
};

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from('servicios')
    .select('nombre, slug, meta_titulo, meta_descripcion, descripcion')
    .eq('slug', params.slug)
    .maybeSingle();

  if (!data) return { title: 'Área de práctica' };

  return {
    title: data.meta_titulo || data.nombre,
    description: data.meta_descripcion || data.descripcion || '',
    alternates: { canonical: `/servicios/${data.slug}` },
    openGraph: {
      title: data.meta_titulo || data.nombre,
      description: data.meta_descripcion || data.descripcion || '',
    },
  };
}

export default async function ServicioDetallePage({ params }: Props) {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from('servicios')
    .select('*')
    .eq('slug', params.slug)
    .eq('estado', true)
    .maybeSingle();

  if (!data) notFound();

  const config = await getSiteConfig();
  const imgUrl = data.imagen_url || defaultImages[data.slug] || defaultImages['derecho-civil'];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: `${data.nombre} - ${config.nombre_estudio}`,
    description: data.meta_descripcion || data.descripcion || '',
    areaServed: 'EC',
    url: `/servicios/${data.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="relative bg-navy pt-32 pb-24 text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={imgUrl}
            alt={data.nombre}
            fill
            priority
            className="object-cover opacity-25"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-navy/60" />
        </div>
        <div className="relative container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/servicios"
            className="inline-flex items-center gap-2 text-sm text-gold hover:text-gold-light mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Áreas de práctica
          </Link>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold leading-tight">
            {data.nombre}
          </h1>
          {data.descripcion && (
            <p className="mt-5 text-lg text-white/75 leading-relaxed max-w-2xl">
              {data.descripcion}
            </p>
          )}
        </div>
      </section>

      <article className="py-20 bg-white">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {data.contenido ? (
            <div
              className="prose-legal text-foreground"
              dangerouslySetInnerHTML={{ __html: data.contenido }}
            />
          ) : (
            <div className="prose-legal">
              <p>
                En {config.nombre_estudio} brindamos asesoría y representación
                legal en {data.nombre.toLowerCase()} con un enfoque estratégico
                y personalizado. Analizamos cada caso a fondo para diseñar la
                mejor ruta jurídica para ti.
              </p>
              <h2>Nuestro enfoque</h2>
              <p>
                Trabajamos de la mano contigo, con comunicación clara y
                constante. Desde la primera consulta hasta la resolución,
                mantenemos informado de cada avance.
              </p>
              <h2>¿Cómo podemos ayudarte?</h2>
              <p>
                Si necesitas asesoría en esta área, agenda una consulta. Te
                escucharemos y evaluaremos las mejores opciones para tu caso.
              </p>
            </div>
          )}

          <div className="mt-12 p-8 rounded-lg bg-secondary/50 border border-border text-center">
            <h3 className="font-serif text-xl font-semibold text-navy">
              ¿Necesitas asesoría en {data.nombre.toLowerCase()}?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Agenda una consulta hoy y conversemos sobre tu caso.
            </p>
            <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contacto"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-gold px-6 py-3 text-navy font-semibold hover:bg-gold-light transition-colors"
              >
                Agendar consulta <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={whatsappLink(config)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-navy/20 px-6 py-3 text-navy font-semibold hover:bg-navy hover:text-white transition-colors"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
