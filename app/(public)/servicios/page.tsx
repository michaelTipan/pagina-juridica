import { createPublicClient } from '@/lib/supabase/public';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Briefcase } from 'lucide-react';
import type { Servicio } from '@/types/database';

export const metadata: Metadata = {
  title: 'Áreas de Práctica',
  description:
    'Asesoría legal especializada en derecho civil, penal, laboral, familiar, empresarial y administrativo en Ecuador.',
  alternates: { canonical: '/servicios' },
};

const defaultImages: Record<string, string> = {
  'derecho-civil': 'https://images.pexels.com/photos/8731037/pexels-photo-8731037.jpeg?auto=compress&cs=tinysrgb&w=800',
  'derecho-penal': 'https://images.pexels.com/photos/6077381/pexels-photo-6077381.jpeg?auto=compress&cs=tinysrgb&w=800',
  'derecho-laboral': 'https://images.pexels.com/photos/5668792/pexels-photo-5668792.jpeg?auto=compress&cs=tinysrgb&w=800',
  'derecho-familiar': 'https://images.pexels.com/photos/7841469/pexels-photo-7841469.jpeg?auto=compress&cs=tinysrgb&w=800',
  'derecho-empresarial': 'https://images.pexels.com/photos/7841457/pexels-photo-7841457.jpeg?auto=compress&cs=tinysrgb&w=800',
  'derecho-administrativo': 'https://images.pexels.com/photos/7876093/pexels-photo-7876093.jpeg?auto=compress&cs=tinysrgb&w=800',
};

export default async function ServiciosPage() {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from('servicios')
    .select('*')
    .eq('estado', true)
    .order('orden', { ascending: true });
  const servicios = (data as Servicio[]) || [];

  return (
    <>
      <section className="bg-navy pt-32 pb-20 text-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="text-xs uppercase tracking-[0.2em] text-gold font-semibold">
            Áreas de Práctica
          </span>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl font-semibold leading-tight max-w-3xl">
            Especialistas en cada rama del derecho
          </h1>
          <p className="mt-5 text-white/70 text-lg max-w-2xl leading-relaxed">
            Brindamos asesoría legal estratégica en distintas áreas, con un
            enfoque personalizado y orientado a resultados.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicios.map((s) => (
              <Link
                key={s.id}
                href={`/servicios/${s.slug}`}
                className="group relative overflow-hidden rounded-lg bg-navy aspect-[4/5] flex flex-col justify-end p-6 hover:shadow-2xl transition-all duration-500"
              >
                <Image
                  src={s.imagen_url || defaultImages[s.slug] || defaultImages['derecho-civil']}
                  alt={s.nombre}
                  fill
                  className="object-cover opacity-50 group-hover:opacity-40 group-hover:scale-105 transition-all duration-500"
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-transparent" />
                <div className="relative z-10">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-md bg-gold/20 border border-gold/40 text-gold">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-white mb-2">
                    {s.nombre}
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed line-clamp-3">
                    {s.descripcion}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-gold group-hover:gap-3 transition-all">
                    Conocer más <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
