import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MessageCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import type { ConfiguracionWeb } from '@/types/database';
import { whatsappLink } from '@/lib/data';

const heroImg =
  'https://images.pexels.com/photos/5673490/pexels-photo-5673490.jpeg?auto=compress&cs=tinysrgb&w=1600';

export function HeroSection({ config }: { config: ConfiguracionWeb }) {
  return (
    <section className="relative min-h-[100svh] flex items-center bg-navy overflow-hidden pt-24">
      <div className="absolute inset-0">
        <video autoPlay loop muted playsInline className="object-cover w-full h-full opacity-30"><source src="https://videos.pexels.com/video-files/5673489/5673489-uhd_2560_1440_24fps.mp4" type="video/mp4" /></video>
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-navy/60" />
      </div>

      <div className="relative container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 mb-6 animate-fade-up">
            <ShieldCheck className="h-4 w-4 text-gold" />
            <span className="text-xs uppercase tracking-[0.18em] text-gold font-medium">
              Estudio JurÃƒÂ­dico Boutique Ã‚Â· Ecuador
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-[1.1] text-balance animate-fade-up delay-100">
            Soluciones legales estratÃƒÂ©gicas para proteger tus derechos y
            <span className="text-gold"> patrimonio</span>.
          </h1>

          <p className="mt-6 text-lg text-white/75 leading-loose max-w-2xl text-white/80 animate-fade-up delay-200">
            Un equipo jurÃƒÂ­dico especializado brindando asesorÃƒÂ­a personalizada,
            transparente y enfocada en encontrar la mejor soluciÃƒÂ³n para cada
            caso.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-up delay-300">
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-gold px-7 py-3.5 text-navy font-semibold hover:bg-gold-light transition-colors"
            >
              <Calendar className="h-5 w-5" /> Agendar consulta
            </Link>
            <a
              href={whatsappLink(config)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-white/30 px-7 py-3.5 text-white font-semibold hover:bg-white/10 transition-colors"
            >
              <MessageCircle className="h-5 w-5" /> WhatsApp
            </a>
          </div>

          <div className="mt-14 grid grid-cols-3 gap-6 max-w-lg animate-fade-up delay-400">
            {[
              { k: '6', v: 'ÃƒÂreas de prÃƒÂ¡ctica' },
              { k: '100%', v: 'AtenciÃƒÂ³n personalizada' },
              { k: 'Confidencial', v: 'Sigilo profesional' },
            ].map((s) => (
              <div key={s.v} className="border-l border-gold/40 pl-4">
                <div className="font-serif text-2xl font-semibold text-white">{s.k}</div>
                <div className="text-xs text-white/60 mt-1">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Link
        href="#propuesta"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 hover:text-gold transition-colors animate-fade-in delay-500"
        aria-label="Ver mÃƒÂ¡s"
      >
        <ArrowRight className="h-5 w-5 rotate-90" />
      </Link>
    </section>
  );
}


