'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { sendEmail } from '@/app/actions/send-email';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export function ContactForm({ areas }: { areas: string[] }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const nombre = String(formData.get('nombre') || '').trim();
    const correo = String(formData.get('correo') || '').trim();
    const telefono = String(formData.get('telefono') || '').trim();
    const area = String(formData.get('area') || '').trim();
    const mensaje = String(formData.get('mensaje') || '').trim();

    if (!nombre || !correo || !mensaje) {
      setError('Por favor completa los campos obligatorios.');
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: insertError } = await supabase.from('contactos').insert({
      nombre,
      correo,
      telefono: telefono || null,
      area: area || null,
      mensaje,
    });

    if (insertError) {
      setError('Ocurrió un error al guardar el mensaje. Inténtalo nuevamente.');
      setLoading(false);
      return;
    }

    const { success: emailSuccess } = await sendEmail({
      nombre,
      correo,
      telefono,
      area,
      mensaje,
    });

    if (!emailSuccess) {
      console.error('Error al enviar el correo, pero el mensaje fue guardado.');
    }

    setSuccess(true);
    form.reset();
    setLoading(false);
  }

  if (success) {
    return (
      <div className="rounded-lg border border-gold/40 bg-gold/5 p-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-gold mx-auto mb-4" />
        <h3 className="font-serif text-xl font-semibold text-navy">
          Mensaje enviado
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Gracias por escribirnos. Nos pondremos en contacto contigo a la
          brevedad.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => setSuccess(false)}
        >
          Enviar otro mensaje
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="nombre">
            Nombre <span className="text-destructive">*</span>
          </Label>
          <Input id="nombre" name="nombre" required placeholder="Tu nombre" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="correo">
            Correo <span className="text-destructive">*</span>
          </Label>
          <Input id="correo" name="correo" type="email" required placeholder="tu@correo.com" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input id="telefono" name="telefono" placeholder="+593 ..." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="area">Área legal</Label>
          <Select name="area">
            <SelectTrigger id="area">
              <SelectValue placeholder="Selecciona un área" />
            </SelectTrigger>
            <SelectContent>
              {areas.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="mensaje">
          Mensaje <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="mensaje"
          name="mensaje"
          required
          rows={5}
          placeholder="Cuéntanos brevemente sobre tu caso..."
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-navy hover:bg-navy-light text-white"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Enviando...
          </>
        ) : (
          'Enviar mensaje'
        )}
      </Button>
    </form>
  );
}
