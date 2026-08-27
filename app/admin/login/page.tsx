'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Scale, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('Credenciales inválidas. Verifica tu correo y contraseña.');
      setLoading(false);
      return;
    }

    router.push('/admin');
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 text-white mb-2">
            <div className="flex h-11 w-11 items-center justify-center border border-gold rounded-sm">
              <Scale className="h-6 w-6 text-gold" />
            </div>
          </Link>
          <h1 className="font-serif text-2xl font-semibold text-white">
            Acceso Administrativo
          </h1>
          <p className="text-sm text-white/60 mt-1">
            Inicia sesión para gestionar el contenido del sitio
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-8 space-y-5 shadow-2xl">
          <div className="space-y-2">
            <Label htmlFor="email">Correo</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@estudio.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full bg-navy hover:bg-navy-light">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Ingresando...
              </>
            ) : (
              'Iniciar sesión'
            )}
          </Button>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-navy transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Volver al sitio
          </Link>
        </form>
      </div>
    </div>
  );
}
