'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Loader2, GripVertical } from 'lucide-react';
import type { Faq } from '@/types/database';

export default function AdminFaqPage() {
  const supabase = createClient();
  const [items, setItems] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    pregunta: '',
    respuesta: '',
    orden: 0,
    estado: true,
  });

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('faq').select('*').order('orden', { ascending: true });
    setItems((data as Faq[]) || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  function openNew() {
    setEditing(null);
    setForm({ pregunta: '', respuesta: '', orden: items.length, estado: true });
    setOpen(true);
  }

  function openEdit(f: Faq) {
    setEditing(f);
    setForm({ pregunta: f.pregunta, respuesta: f.respuesta, orden: f.orden, estado: f.estado });
    setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    if (editing) {
      await supabase.from('faq').update(form).eq('id', editing.id);
    } else {
      await supabase.from('faq').insert(form);
    }
    setSaving(false);
    setOpen(false);
    load();
  }

  async function toggleEstado(f: Faq) {
    await supabase.from('faq').update({ estado: !f.estado }).eq('id', f.id);
    load();
  }

  async function remove(f: Faq) {
    if (!confirm('¿Eliminar esta pregunta?')) return;
    await supabase.from('faq').delete().eq('id', f.id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-navy">Preguntas Frecuentes</h1>
          <p className="text-sm text-muted-foreground">Gestiona las preguntas frecuentes del sitio.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="bg-navy hover:bg-navy-light">
              <Plus className="h-4 w-4" /> Nueva pregunta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editing ? 'Editar pregunta' : 'Nueva pregunta'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={save} className="space-y-4">
              <div className="space-y-2">
                <Label>Pregunta</Label>
                <Input required value={form.pregunta} onChange={(e) => setForm({ ...form, pregunta: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Respuesta</Label>
                <Textarea rows={4} required value={form.respuesta} onChange={(e) => setForm({ ...form, respuesta: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Orden</Label>
                <Input type="number" value={form.orden} onChange={(e) => setForm({ ...form, orden: Number(e.target.value) })} />
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={form.estado} onCheckedChange={(v) => setForm({ ...form, estado: v })} />
                <Label>Activa</Label>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={saving} className="bg-navy hover:bg-navy-light">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Guardar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-gold" /></div>
      ) : items.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">No hay preguntas frecuentes.</p>
      ) : (
        <div className="space-y-3">
          {items.map((f) => (
            <div key={f.id} className="bg-white rounded-lg border border-border p-5 flex items-start gap-4">
              <GripVertical className="h-5 w-5 text-muted-foreground/40 mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="font-medium text-navy">{f.pregunta}</h3>
                  <span className="text-xs text-muted-foreground">#{f.orden}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{f.respuesta}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Switch checked={f.estado} onCheckedChange={() => toggleEstado(f)} />
                <Button size="icon" variant="ghost" onClick={() => openEdit(f)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => remove(f)} className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
