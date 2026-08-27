'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Mail, Trash2, Loader2, MailOpen, Calendar } from 'lucide-react';
import type { Contacto } from '@/types/database';

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleString('es-EC', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return d;
  }
}

export default function AdminContactosPage() {
  const supabase = createClient();
  const [items, setItems] = useState<Contacto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Contacto | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('contactos')
      .select('*')
      .order('created_at', { ascending: false });
    setItems((data as Contacto[]) || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  async function markRead(c: Contacto) {
    await supabase.from('contactos').update({ leido: true }).eq('id', c.id);
    load();
  }

  async function remove(c: Contacto) {
    if (!confirm('¿Eliminar este mensaje?')) return;
    await supabase.from('contactos').delete().eq('id', c.id);
    setSelected(null);
    load();
  }

  const unreadCount = items.filter((i) => !i.leido).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-navy">Mensajes</h1>
          <p className="text-sm text-muted-foreground">
            Mensajes recibidos desde el formulario de contacto.
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-gold text-navy">{unreadCount} sin leer</Badge>
            )}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-gold" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-16">
          <Mail className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No hay mensajes todavía.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-left">
              <tr>
                <th className="p-4 font-medium">Nombre</th>
                <th className="p-4 font-medium">Correo</th>
                <th className="p-4 font-medium">Área</th>
                <th className="p-4 font-medium">Fecha</th>
                <th className="p-4 font-medium">Estado</th>
                <th className="p-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((c) => (
                <tr
                  key={c.id}
                  className={`hover:bg-secondary/20 cursor-pointer ${!c.leido ? 'font-semibold' : ''}`}
                  onClick={() => {
                    setSelected(c);
                    if (!c.leido) markRead(c);
                  }}
                >
                  <td className="p-4 text-navy">
                    <div className="flex items-center gap-2">
                      {!c.leido && <span className="h-2 w-2 rounded-full bg-gold" />}
                      {c.nombre}
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{c.correo}</td>
                  <td className="p-4 text-muted-foreground">{c.area || '—'}</td>
                  <td className="p-4 text-muted-foreground text-xs">
                    <Calendar className="inline h-3 w-3 mr-1" />
                    {formatDate(c.created_at)}
                  </td>
                  <td className="p-4">
                    {c.leido ? (
                      <MailOpen className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Mail className="h-4 w-4 text-gold" />
                    )}
                  </td>
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end">
                      <Button size="icon" variant="ghost" onClick={() => remove(c)} className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Mensaje de {selected?.nombre}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Correo</p>
                  <a href={`mailto:${selected.correo}`} className="text-navy hover:text-gold">
                    {selected.correo}
                  </a>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Teléfono</p>
                  <p className="text-navy">{selected.telefono || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Área</p>
                  <p className="text-navy">{selected.area || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Fecha</p>
                  <p className="text-navy text-xs">{formatDate(selected.created_at)}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Mensaje</p>
                <div className="bg-secondary/30 rounded-md p-4 text-sm text-foreground whitespace-pre-wrap">
                  {selected.mensaje}
                </div>
              </div>
              <DialogFooter>
                <a href={`mailto:${selected.correo}`}>
                  <Button className="bg-navy hover:bg-navy-light">Responder</Button>
                </a>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
