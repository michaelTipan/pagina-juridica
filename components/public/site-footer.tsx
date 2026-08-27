import Link from 'next/link';
import { Scale, Mail, MapPin, Phone, Facebook, Instagram, Linkedin } from 'lucide-react';
import type { ConfiguracionWeb } from '@/types/database';
import { whatsappLink } from '@/lib/data';

const areas = [
  { label: 'Derecho Civil', slug: 'derecho-civil' },
  { label: 'Derecho Penal', slug: 'derecho-penal' },
  { label: 'Derecho Laboral', slug: 'derecho-laboral' },
  { label: 'Derecho Familiar', slug: 'derecho-familiar' },
  { label: 'Derecho Empresarial', slug: 'derecho-empresarial' },
  { label: 'Derecho Administrativo', slug: 'derecho-administrativo' },
];

export function SiteFooter({ config }: { config: ConfiguracionWeb }) {
  return (
    <footer className="bg-navy text-white/70">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5 text-white">
              <div className="flex h-10 w-10 items-center justify-center border border-gold rounded-sm">
                <Scale className="h-5 w-5 text-gold" />
              </div>
              <span className="font-serif text-lg font-semibold">
                {config.nombre_estudio}
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              Estudio jurídico boutique en Ecuador. Asesoría legal estratégica,
              personalizada y transparente para proteger tus derechos y tu
              patrimonio.
            </p>
            <div className="flex gap-3 pt-2">
              {config.facebook && (
                <a href={config.facebook} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-gold transition-colors" aria-label="Facebook">
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {config.instagram && (
                <a href={config.instagram} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-gold transition-colors" aria-label="Instagram">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {config.linkedin && (
                <a href={config.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-gold transition-colors" aria-label="LinkedIn">
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-serif text-white text-lg mb-4">Áreas de Práctica</h3>
            <ul className="space-y-2.5 text-sm">
              {areas.map((a) => (
                <li key={a.slug}>
                  <Link href={`/servicios/${a.slug}`} className="hover:text-gold transition-colors">
                    {a.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-white text-lg mb-4">Navegación</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/" className="hover:text-gold transition-colors">Inicio</Link></li>
              <li><Link href="/equipo" className="hover:text-gold transition-colors">Equipo</Link></li>
              <li><Link href="/blog" className="hover:text-gold transition-colors">Blog Jurídico</Link></li>
              <li><Link href="/contacto" className="hover:text-gold transition-colors">Contacto</Link></li>
              <li><Link href="/admin" className="hover:text-gold transition-colors">Acceso Administrativo</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-white text-lg mb-4">Contacto</h3>
            <ul className="space-y-3 text-sm">
              {config.direccion && (
                <li className="flex gap-3">
                  <MapPin className="h-5 w-5 text-gold flex-shrink-0" />
                  <span>{config.direccion}</span>
                </li>
              )}
              {config.email && (
                <li className="flex gap-3">
                  <Mail className="h-5 w-5 text-gold flex-shrink-0" />
                  <a href={`mailto:${config.email}`} className="hover:text-gold transition-colors">{config.email}</a>
                </li>
              )}
              {config.whatsapp && (
                <li className="flex gap-3">
                  <Phone className="h-5 w-5 text-gold flex-shrink-0" />
                  <a href={whatsappLink(config)} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
                    WhatsApp: +{config.whatsapp}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-4 text-xs text-white/50">
          <p>© {new Date().getFullYear()} {config.nombre_estudio}. Todos los derechos reservados.</p>
          <p>Estudio jurídico boutique · Quito, Ecuador</p>
        </div>
      </div>
    </footer>
  );
}
