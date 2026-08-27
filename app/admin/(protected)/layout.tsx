'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/providers/auth-provider';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { Scale, Loader2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/admin/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/40">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-secondary/30">
      <AdminSidebar profile={profile} />
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <header className="bg-white border-b border-border h-16 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-navy transition-colors">
              <Scale className="h-4 w-4 text-gold" /> Ver sitio
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-right hidden sm:block">
              <p className="font-medium text-navy">{profile?.full_name || user.email}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                {profile?.role || 'editor'}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => signOut()}>
              <LogOut className="h-4 w-4" /> Salir
            </Button>
          </div>
        </header>
        <div className="flex-1 p-6 lg:p-8 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
