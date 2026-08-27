import { createClient } from '@/lib/supabase/server';
import type { ConfiguracionWeb } from '@/types/database';

export async function getSiteConfig(): Promise<ConfiguracionWeb> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('configuracion_web')
    .select('*')
    .eq('id', 1)
    .maybeSingle();

  if (data) return data as ConfiguracionWeb;

  // Fallback defaults so the site always renders even before config is set
  return {
    id: 1,
    nombre_estudio: 'Estudio Jurídico Montero & Asociados',
    logo_url: null,
    whatsapp: '593999999999',
    email: 'contacto@monteroasociados.com',
    direccion: 'Av. Amazonas N34-451 y Av. Atahualpa, Quito, Ecuador',
    facebook: null,
    instagram: null,
    linkedin: null,
    mensaje_whatsapp:
      'Hola, me gustaría agendar una consulta jurídica.',
    created_at: '',
    updated_at: '',
  };
}

export function whatsappLink(config: ConfiguracionWeb, message?: string) {
  const phone = (config.whatsapp || '').replace(/\D/g, '');
  const text = encodeURIComponent(message || config.mensaje_whatsapp || '');
  return `https://wa.me/${phone}?text=${text}`;
}
