import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';
import { GraduationCap } from 'lucide-react';
import type { Metadata } from 'next';
import type { Abogado } from '@/types/database';

export const metadata: Metadata = {
  title: 'Equipo de Abogados',
  description:
    'Conoce al equipo de abogados de nuestro estudio jurídico boutique en Ecuador. Profesionales dedicados, cercanos y comprometidos con tu caso.',
  alternates: { canonical: '/equipo' },
};

const defaultPhotos: string[] = [
  'https://images.pexels.com/photos/32907706/pexels-photo-32907706.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/34073779/pexels-photo-34073779.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/32892533/pexels-photo-32892533.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/32800770/pexels-photo-32800770.jpeg?auto=compress&cs=tinysrgb&w=800',
];

export default async function EquipoPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('abogados')
    .select('*')
    .eq('estado', true)
    .order('orden', { ascending: true });
  const abogados = (data as Abogado[]) || [];

  return (
    <>
      <section className="bg-navy pt-32 pb-20 text-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="text-xs uppercase tracking-[0.2em] text-gold font-semibold">
            Nuestro Equipo
          </span>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl font-semibold leading-tight max-w-3xl">
            Abogados que escuchan y defienden tus intereses
          </h1>
          <p className="mt-5 text-white/70 text-lg max-w-2xl leading-relaxed">
            Un equipo cercano y comprometido, con formación sólida y enfoque
            estratégico para cada caso.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {abogados.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              Próximamente conocerás a nuestro equipo de abogados.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {abogados.map((a, i) => (
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
                  <div className="p-6">
                    <h2 className="font-serif text-xl font-semibold text-navy">
                      {a.nombre}
                    </h2>
                    <p className="text-sm text-gold font-medium mt-1">{a.cargo}</p>
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                      <GraduationCap className="h-3.5 w-3.5" /> {a.especialidad}
                    </p>
                    {a.biografia && (
                      <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                        {a.biografia}
                      </p>
                    )}
                    {a.formacion && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                          Formación
                        </p>
                        <p className="text-sm text-foreground leading-relaxed">
                          {a.formacion}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
