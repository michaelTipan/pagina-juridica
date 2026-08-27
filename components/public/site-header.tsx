'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Scale, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/servicios', label: 'Áreas de Práctica' },
  { href: '/equipo', label: 'Equipo' },
  { href: '/blog', label: 'Blog' },
  { href: '/contacto', label: 'Contacto' },
];

export function SiteHeader({ nombreEstudio }: { nombreEstudio: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-navy/95 backdrop-blur-md shadow-lg py-3'
          : 'bg-navy py-5'
      )}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 text-white">
          <div className="flex h-10 w-10 items-center justify-center border border-gold rounded-sm">
            <Scale className="h-5 w-5 text-gold" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-serif text-lg font-semibold">
              {nombreEstudio}
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-gold/90">
              Estudio Jurídico
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-white/80 hover:text-gold transition-colors font-medium"
            >
              {l.label}
            </Link>
          ))}
          <Button
            asChild
            size="sm"
            className="bg-gold text-navy hover:bg-gold-light font-semibold"
          >
            <Link href="/contacto">Agendar consulta</Link>
          </Button>
        </nav>

        <button
          className="lg:hidden text-white p-2"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-navy-light border-t border-white/10 animate-fade-in">
          <nav className="container mx-auto max-w-7xl px-4 py-4 flex flex-col gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-3 px-2 text-white/90 hover:text-gold border-b border-white/5 text-sm font-medium"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/contacto"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-md bg-gold px-4 py-3 text-navy font-semibold"
            >
              <Phone className="h-4 w-4" /> Agendar consulta
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
