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
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import type { Abogado } from '@/types/database';

const defaultPhoto = 'https://images.pexels.com/photos/32907706/pexels-photo-32907706.jpeg?auto=compress&cs=tinysrgb&w=400';

export default function AdminAbogadosPage() {
  const supabase = createClient();
  const [items, setItems] = useState<Abogado[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Abogado | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    cargo: '',
    especialidad: '',
    biografia: '',
    formacion: '',
    foto_url: '',
    orden: 0,
    estado: true,
  });

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('abogados').select('*').order('orden', { ascending: true });
    setItems((data as Abogado[]) || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  function openNew() {
    setEditing(null);
    setForm({ nombre: '', cargo: '', especialidad: '', biografia: '', formacion: '', foto_url: '', orden: 0, estado: true });
    setOpen(true);
  }

  function openEdit(a: Abogado) {
    setEditing(a);
    setForm({
      nombre: a.nombre,
      cargo: a.cargo,
      especialidad: a.especialidad,
      biografia: a.biografia || '',
      formacion: a.formacion || '',
      foto_url: a.foto_url || '',
      orden: a.orden,
      estado: a.estado,
    });
    setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    if (editing) {
      await supabase.from('abogados').update(form).eq('id', editing.id);
    } else {
      await supabase.from('abogados').insert(form);
    }
    setSaving(false);
    setOpen(false);
    load();
  }

  async function toggleEstado(a: Abogado) {
    await supabase.from('abogados').update({ estado: !a.estado }).eq('id', a.id);
    load();
  }

  async function remove(a: Abogado) {
    if (!confirm(`¿Eliminar a ${a.nombre}?`)) return;
    await supabase.from('abogados').delete().eq('id', a.id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-navy">Abogados</h1>
          <p className="text-sm text-muted-foreground">Gestiona el equipo de abogados del sitio.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="bg-navy hover:bg-navy-light">
              <Plus className="h-4 w-4" /> Nuevo abogado
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? 'Editar abogado' : 'Nuevo abogado'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={save} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Cargo</Label>
                  <Input required value={form.cargo} onChange={(e) => setForm({ ...form, cargo: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Especialidad</Label>
                  <Input required value={form.especialidad} onChange={(e) => setForm({ ...form, especialidad: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Orden</Label>
                  <Input type="number" value={form.orden} onChange={(e) => setForm({ ...form, orden: Number(e.target.value) })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>URL de foto</Label>
                <Input value={form.foto_url} onChange={(e) => setForm({ ...form, foto_url: e.target.value })} placeholder={defaultPhoto} />
                {form.foto_url && <img src={form.foto_url} alt="" className="h-24 w-24 object-cover rounded mt-2" />}
              </div>
              <div className="space-y-2">
                <Label>Biografía</Label>
                <Textarea rows={3} value={form.biografia} onChange={(e) => setForm({ ...form, biografia: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Formación</Label>
                <Textarea rows={2} value={form.formacion} onChange={(e) => setForm({ ...form, formacion: e.target.value })} />
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={form.estado} onCheckedChange={(v) => setForm({ ...form, estado: v })} />
                <Label>Activo (visible en el sitio)</Label>
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
        <p className="text-center text-muted-foreground py-12">No hay abogados registrados.</p>
      ) : (
        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-left">
              <tr>
                <th className="p-4 font-medium">Foto</th>
                <th className="p-4 font-medium">Nombre</th>
                <th className="p-4 font-medium">Cargo</th>
                <th className="p-4 font-medium">Orden</th>
                <th className="p-4 font-medium">Estado</th>
                <th className="p-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((a) => (
                <tr key={a.id} className="hover:bg-secondary/20">
                  <td className="p-4">
                    <img src={a.foto_url || defaultPhoto} alt={a.nombre} className="h-12 w-12 rounded-full object-cover" />
                  </td>
                  <td className="p-4 font-medium text-navy">{a.nombre}</td>
                  <td className="p-4 text-muted-foreground">{a.cargo}</td>
                  <td className="p-4 text-muted-foreground">{a.orden}</td>
                  <td className="p-4">
                    <Switch checked={a.estado} onCheckedChange={() => toggleEstado(a)} />
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(a)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => remove(a)} className="text-destructive">
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
    </div>
  );
}
