import { createPublicClient } from '@/lib/supabase/public';
import { getSiteConfig, whatsappLink } from '@/lib/data';
import { HeroSection } from '@/components/public/sections/hero';
import { ValueProposition } from '@/components/public/sections/value-proposition';
import { Methodology } from '@/components/public/sections/methodology';
import { PracticeAreas } from '@/components/public/sections/practice-areas';
import { TeamPreview } from '@/components/public/sections/team-preview';
import { BlogPreview } from '@/components/public/sections/blog-preview';
import { FaqSection } from '@/components/public/sections/faq';
import { CtaSection } from '@/components/public/sections/cta';
import type { Servicio, Abogado, Articulo, Faq } from '@/types/database';

export default async function HomePage() {
  const supabase = createPublicClient();
  const config = await getSiteConfig();

  const [
    { data: servicios },
    { data: abogados },
    { data: articulos },
    { data: faqs },
  ] = await Promise.all([
    supabase.from('servicios').select('*').eq('estado', true).order('orden', { ascending: true }),
    supabase.from('abogados').select('*').eq('estado', true).order('orden', { ascending: true }),
    supabase.from('articulos').select('*').eq('publicado', true).order('fecha_publicacion', { ascending: false }).limit(3),
    supabase.from('faq').select('*').eq('estado', true).order('orden', { ascending: true }),
  ]);

  return (
    <>
      <HeroSection config={config} />
      <ValueProposition />
      <Methodology />
      <PracticeAreas servicios={(servicios as Servicio[]) || []} />
      <TeamPreview abogados={(abogados as Abogado[]) || []} />
      <BlogPreview articulos={(articulos as Articulo[]) || []} />
      <FaqSection faqs={(faqs as Faq[]) || []} />
      <CtaSection
        whatsapp={whatsappLink(config)}
        nombreEstudio={config.nombre_estudio}
      />
    </>
  );
}
