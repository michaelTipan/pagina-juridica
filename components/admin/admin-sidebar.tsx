'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  HelpCircle,
  Settings,
  Mail,
  Scale,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Profile } from '@/types/database';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/abogados', label: 'Abogados', icon: Users },
  { href: '/admin/servicios', label: 'Servicios', icon: Briefcase },
  { href: '/admin/articulos', label: 'Artículos', icon: FileText },
  { href: '/admin/faq', label: 'Preguntas Frecuentes', icon: HelpCircle },
  { href: '/admin/contactos', label: 'Mensajes', icon: Mail },
  { href: '/admin/configuracion', label: 'Configuración', icon: Settings },
];

export function AdminSidebar({ profile }: { profile: Profile | null }) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 bg-navy text-white flex-col fixed inset-y-0 left-0 z-40">
      <div className="h-16 flex items-center gap-2.5 px-6 border-b border-white/10">
        <div className="flex h-9 w-9 items-center justify-center border border-gold rounded-sm">
          <Scale className="h-5 w-5 text-gold" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-serif text-sm font-semibold">CMS Admin</span>
          <span className="text-[10px] uppercase tracking-[0.15em] text-gold/80">
            Estudio Jurídico
          </span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href);
          const disabled =
            item.href === '/admin/configuracion' && profile?.role !== 'admin';
          return (
            <Link
              key={item.href}
              href={disabled ? '#' : item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors',
                active
                  ? 'bg-gold text-navy'
                  : 'text-white/70 hover:text-white hover:bg-white/5',
                disabled && 'opacity-40 pointer-events-none'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <p className="text-xs text-white/50">Sesión iniciada como</p>
        <p className="text-sm font-medium truncate">{profile?.email}</p>
      </div>
    </aside>
  );
}
