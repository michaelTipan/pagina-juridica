'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Save, CheckCircle2, AlertCircle, Lock } from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';
import type { ConfiguracionWeb } from '@/types/database';

export default function AdminConfiguracionPage() {
  const supabase = createClient();
  const { profile } = useAuth();
  const [config, setConfig] = useState<ConfiguracionWeb | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = profile?.role === 'admin';

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('configuracion_web')
        .select('*')
        .eq('id', 1)
        .maybeSingle();
      setConfig(data as ConfiguracionWeb);
      setLoading(false);
    })();
  }, [supabase]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!config) return;
    setSaving(true);
    setError(null);
    setSaved(false);

    const { error } = await supabase
      .from('configuracion_web')
      .update({
        nombre_estudio: config.nombre_estudio,
        logo_url: config.logo_url,
        whatsapp: config.whatsapp,
        email: config.email,
        direccion: config.direccion,
        facebook: config.facebook,
        instagram: config.instagram,
        linkedin: config.linkedin,
        mensaje_whatsapp: config.mensaje_whatsapp,
      })
      .eq('id', 1);

    if (error) {
      setError('No se pudo guardar. Verifica tus permisos.');
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  }

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-gold" /></div>;
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-16">
        <Lock className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="font-serif text-xl text-navy">Acceso restringido</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Solo los administradores pueden modificar la configuración general.
        </p>
      </div>
    );
  }

  if (!config) return null;

  const update = (field: keyof ConfiguracionWeb, value: string) =>
    setConfig({ ...config, [field]: value });

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-2xl font-semibold text-navy mb-1">Configuración general</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Modifica la información de contacto y apariencia del sitio.
      </p>

      <form onSubmit={save} className="space-y-6 bg-white rounded-lg border border-border p-6">
        <div className="space-y-2">
          <Label>Nombre del estudio</Label>
          <Input value={config.nombre_estudio} onChange={(e) => update('nombre_estudio', e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>URL del logo</Label>
          <Input value={config.logo_url || ''} onChange={(e) => update('logo_url', e.target.value)} placeholder="https://..." />
        </div>

        <div className="border-t border-border pt-6">
          <h2 className="font-serif text-lg text-navy mb-4">Contacto</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>WhatsApp (con código de país)</Label>
              <Input value={config.whatsapp || ''} onChange={(e) => update('whatsapp', e.target.value)} placeholder="593999999999" />
            </div>
            <div className="space-y-2">
              <Label>Correo institucional</Label>
              <Input type="email" value={config.email || ''} onChange={(e) => update('email', e.target.value)} />
            </div>
          </div>
          <div className="space-y-2 mt-4">
            <Label>Dirección</Label>
            <Input value={config.direccion || ''} onChange={(e) => update('direccion', e.target.value)} />
          </div>
          <div className="space-y-2 mt-4">
            <Label>Mensaje inicial de WhatsApp</Label>
            <Textarea rows={2} value={config.mensaje_whatsapp || ''} onChange={(e) => update('mensaje_whatsapp', e.target.value)} />
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <h2 className="font-serif text-lg text-navy mb-4">Redes sociales</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Facebook</Label>
              <Input value={config.facebook || ''} onChange={(e) => update('facebook', e.target.value)} placeholder="https://facebook.com/..." />
            </div>
            <div className="space-y-2">
              <Label>Instagram</Label>
              <Input value={config.instagram || ''} onChange={(e) => update('instagram', e.target.value)} placeholder="https://instagram.com/..." />
            </div>
            <div className="space-y-2">
              <Label>LinkedIn</Label>
              <Input value={config.linkedin || ''} onChange={(e) => update('linkedin', e.target.value)} placeholder="https://linkedin.com/..." />
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            <AlertCircle className="h-4 w-4" /> {error}
          </div>
        )}
        {saved && (
          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-md">
            <CheckCircle2 className="h-4 w-4" /> Configuración guardada correctamente.
          </div>
        )}

        <Button type="submit" disabled={saving} className="bg-navy hover:bg-navy-light">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Guardar cambios
        </Button>
      </form>
    </div>
  );
}
