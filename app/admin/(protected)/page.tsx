'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Users, Briefcase, FileText, Mail } from 'lucide-react';
import Link from 'next/link';

interface Counts {
  abogados: number;
  servicios: number;
  articulos: number;
  contactos: number;
  contactosNoLeidos: number;
}

export default function AdminDashboard() {
  const supabase = createClient();
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    (async () => {
      const [ab, sv, ar, ct, ctUnread] = await Promise.all([
        supabase.from('abogados').select('*', { count: 'exact', head: true }),
        supabase.from('servicios').select('*', { count: 'exact', head: true }),
        supabase.from('articulos').select('*', { count: 'exact', head: true }),
        supabase.from('contactos').select('*', { count: 'exact', head: true }),
        supabase.from('contactos').select('*', { count: 'exact', head: true }).eq('leido', false),
      ]);
      setCounts({
        abogados: ab.count || 0,
        servicios: sv.count || 0,
        articulos: ar.count || 0,
        contactos: ct.count || 0,
        contactosNoLeidos: ctUnread.count || 0,
      });
    })();
  }, [supabase]);

  const cards = [
    { label: 'Abogados', value: counts?.abogados, icon: Users, href: '/admin/abogados', color: 'bg-navy' },
    { label: 'Servicios', value: counts?.servicios, icon: Briefcase, href: '/admin/servicios', color: 'bg-gold' },
    { label: 'Artículos', value: counts?.articulos, icon: FileText, href: '/admin/articulos', color: 'bg-navy' },
    { label: 'Mensajes sin leer', value: counts?.contactosNoLeidos, icon: Mail, href: '/admin/contactos', color: 'bg-gold' },
  ];

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-navy mb-2">
        Panel de administración
      </h1>
      <p className="text-muted-foreground text-sm mb-8">
        Resumen general del contenido del sitio.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="bg-white rounded-lg border border-border p-6 hover:shadow-lg transition-shadow"
          >
            <div className={`inline-flex h-11 w-11 items-center justify-center rounded-md ${c.color} ${c.color === 'bg-gold' ? 'text-navy' : 'text-gold'}`}>
              <c.icon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-3xl font-serif font-semibold text-navy">
              {c.value === undefined ? '—' : c.value}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 bg-white rounded-lg border border-border p-6">
        <h2 className="font-serif text-lg font-semibold text-navy mb-4">
          Accesos rápidos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Link href="/admin/abogados" className="px-4 py-3 rounded-md border border-border text-sm hover:border-gold hover:text-gold transition-colors">
            Gestionar abogados
          </Link>
          <Link href="/admin/servicios" className="px-4 py-3 rounded-md border border-border text-sm hover:border-gold hover:text-gold transition-colors">
            Gestionar servicios
          </Link>
          <Link href="/admin/articulos" className="px-4 py-3 rounded-md border border-border text-sm hover:border-gold hover:text-gold transition-colors">
            Gestionar artículos
          </Link>
          <Link href="/admin/faq" className="px-4 py-3 rounded-md border border-border text-sm hover:border-gold hover:text-gold transition-colors">
            Gestionar preguntas frecuentes
          </Link>
          <Link href="/admin/contactos" className="px-4 py-3 rounded-md border border-border text-sm hover:border-gold hover:text-gold transition-colors">
            Ver mensajes
          </Link>
          <Link href="/admin/configuracion" className="px-4 py-3 rounded-md border border-border text-sm hover:border-gold hover:text-gold transition-colors">
            Configuración general
          </Link>
        </div>
      </div>
    </div>
  );
}
