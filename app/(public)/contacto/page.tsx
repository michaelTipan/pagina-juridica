import { createPublicClient } from '@/lib/supabase/public';
import type { Metadata } from 'next';
import { ContactForm } from '@/components/public/contact-form';
import { Mail, MapPin, Phone, MessageCircle, Facebook, Instagram, Linkedin } from 'lucide-react';
import { getSiteConfig, whatsappLink } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Contacto',
  description:
    'Contáctanos para agendar una consulta jurídica. Estudio jurídico boutique en Quito, Ecuador. WhatsApp, correo y formulario disponibles.',
  alternates: { canonical: '/contacto' },
};

const areas = [
  'Derecho Civil',
  'Derecho Penal',
  'Derecho Laboral',
  'Derecho Familiar',
  'Derecho Empresarial',
  'Derecho Administrativo',
  'Otra',
];

export default async function ContactoPage() {
  const config = await getSiteConfig();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: config.nombre_estudio,
    email: config.email,
    address: config.direccion
      ? { '@type': 'PostalAddress', streetAddress: config.direccion, addressCountry: 'EC' }
      : undefined,
    areaServed: 'EC',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="bg-navy pt-32 pb-20 text-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="text-xs uppercase tracking-[0.2em] text-gold font-semibold">
            Contacto
          </span>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl font-semibold leading-tight max-w-3xl">
            Conversemos sobre tu caso
          </h1>
          <p className="mt-5 text-white/70 text-lg max-w-2xl leading-relaxed">
            Escríbenos por WhatsApp, correo o mediante el formulario. Te
            responderemos a la brevedad para coordinar una consulta.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-navy mb-6">
                Información de contacto
              </h2>
              <div className="space-y-5">
                {config.whatsapp && (
                  <a
                    href={whatsappLink(config)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-gold/50 transition-colors group"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-md bg-navy text-gold group-hover:bg-gold group-hover:text-navy transition-colors">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-navy">WhatsApp</p>
                      <p className="text-sm text-muted-foreground">+{config.whatsapp}</p>
                    </div>
                  </a>
                )}
                {config.email && (
                  <a
                    href={`mailto:${config.email}`}
                    className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-gold/50 transition-colors group"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-md bg-navy text-gold group-hover:bg-gold group-hover:text-navy transition-colors">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-navy">Correo</p>
                      <p className="text-sm text-muted-foreground">{config.email}</p>
                    </div>
                  </a>
                )}
                {config.direccion && (
                  <div className="flex items-start gap-4 p-4 rounded-lg border border-border">
                    <div className="flex h-11 w-11 items-center justify-center rounded-md bg-navy text-gold">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-navy">Dirección</p>
                      <p className="text-sm text-muted-foreground">{config.direccion}</p>
                    </div>
                  </div>
                )}
              </div>

              {(config.facebook || config.instagram || config.linkedin) && (
                <div className="mt-8">
                  <p className="text-sm font-medium text-navy mb-3">Redes sociales</p>
                  <div className="flex gap-3">
                    {config.facebook && (
                      <a href={config.facebook} target="_blank" rel="noopener noreferrer" className="flex h-11 w-11 items-center justify-center rounded-md border border-border hover:border-gold hover:text-gold transition-colors" aria-label="Facebook">
                        <Facebook className="h-5 w-5" />
                      </a>
                    )}
                    {config.instagram && (
                      <a href={config.instagram} target="_blank" rel="noopener noreferrer" className="flex h-11 w-11 items-center justify-center rounded-md border border-border hover:border-gold hover:text-gold transition-colors" aria-label="Instagram">
                        <Instagram className="h-5 w-5" />
                      </a>
                    )}
                    {config.linkedin && (
                      <a href={config.linkedin} target="_blank" rel="noopener noreferrer" className="flex h-11 w-11 items-center justify-center rounded-md border border-border hover:border-gold hover:text-gold transition-colors" aria-label="LinkedIn">
                        <Linkedin className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold text-navy mb-6">
                Envíanos un mensaje
              </h2>
              <ContactForm areas={areas} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
