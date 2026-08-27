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
import type { Servicio } from '@/types/database';

const defaultImages: Record<string, string> = {
  'derecho-civil': 'https://images.pexels.com/photos/8731037/pexels-photo-8731037.jpeg?auto=compress&cs=tinysrgb&w=400',
  'derecho-penal': 'https://images.pexels.com/photos/6077381/pexels-photo-6077381.jpeg?auto=compress&cs=tinysrgb&w=400',
  'derecho-laboral': 'https://images.pexels.com/photos/5668792/pexels-photo-5668792.jpeg?auto=compress&cs=tinysrgb&w=400',
  'derecho-familiar': 'https://images.pexels.com/photos/7841469/pexels-photo-7841469.jpeg?auto=compress&cs=tinysrgb&w=400',
  'derecho-empresarial': 'https://images.pexels.com/photos/7841457/pexels-photo-7841457.jpeg?auto=compress&cs=tinysrgb&w=400',
  'derecho-administrativo': 'https://images.pexels.com/photos/7876093/pexels-photo-7876093.jpeg?auto=compress&cs=tinysrgb&w=400',
};

function slugify(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export default function AdminServiciosPage() {
  const supabase = createClient();
  const [items, setItems] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Servicio | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    slug: '',
    descripcion: '',
    imagen_url: '',
    contenido: '',
    meta_titulo: '',
    meta_descripcion: '',
    orden: 0,
    estado: true,
  });

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('servicios').select('*').order('orden', { ascending: true });
    setItems((data as Servicio[]) || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  function openNew() {
    setEditing(null);
    setForm({ nombre: '', slug: '', descripcion: '', imagen_url: '', contenido: '', meta_titulo: '', meta_descripcion: '', orden: 0, estado: true });
    setOpen(true);
  }

  function openEdit(s: Servicio) {
    setEditing(s);
    setForm({
      nombre: s.nombre,
      slug: s.slug,
      descripcion: s.descripcion || '',
      imagen_url: s.imagen_url || '',
      contenido: s.contenido || '',
      meta_titulo: s.meta_titulo || '',
      meta_descripcion: s.meta_descripcion || '',
      orden: s.orden,
      estado: s.estado,
    });
    setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, slug: form.slug || slugify(form.nombre) };
    if (editing) {
      await supabase.from('servicios').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('servicios').insert(payload);
    }
    setSaving(false);
    setOpen(false);
    load();
  }

  async function toggleEstado(s: Servicio) {
    await supabase.from('servicios').update({ estado: !s.estado }).eq('id', s.id);
    load();
  }

  async function remove(s: Servicio) {
    if (!confirm(`¿Eliminar ${s.nombre}?`)) return;
    await supabase.from('servicios').delete().eq('id', s.id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-navy">Servicios</h1>
          <p className="text-sm text-muted-foreground">Gestiona las áreas de práctica del sitio.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="bg-navy hover:bg-navy-light">
              <Plus className="h-4 w-4" /> Nuevo servicio
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? 'Editar servicio' : 'Nuevo servicio'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={save} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value, slug: editing ? form.slug : slugify(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>Slug (URL)</Label>
                  <Input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="derecho-civil" />
                </div>
                <div className="space-y-2">
                  <Label>Orden</Label>
                  <Input type="number" value={form.orden} onChange={(e) => setForm({ ...form, orden: Number(e.target.value) })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Descripción corta</Label>
                <Textarea rows={2} value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>URL de imagen</Label>
                <Input value={form.imagen_url} onChange={(e) => setForm({ ...form, imagen_url: e.target.value })} placeholder={defaultImages['derecho-civil']} />
                {form.imagen_url && <img src={form.imagen_url} alt="" className="h-24 w-40 object-cover rounded mt-2" />}
              </div>
              <div className="space-y-2">
                <Label>Contenido (HTML permitido)</Label>
                <Textarea rows={6} value={form.contenido} onChange={(e) => setForm({ ...form, contenido: e.target.value })} />
                <p className="text-xs text-muted-foreground">Puedes usar etiquetas HTML: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, etc.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Meta título (SEO)</Label>
                  <Input value={form.meta_titulo} onChange={(e) => setForm({ ...form, meta_titulo: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Meta descripción (SEO)</Label>
                  <Input value={form.meta_descripcion} onChange={(e) => setForm({ ...form, meta_descripcion: e.target.value })} />
                </div>
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
      ) : (
        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-left">
              <tr>
                <th className="p-4 font-medium">Servicio</th>
                <th className="p-4 font-medium">Slug</th>
                <th className="p-4 font-medium">Orden</th>
                <th className="p-4 font-medium">Estado</th>
                <th className="p-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((s) => (
                <tr key={s.id} className="hover:bg-secondary/20">
                  <td className="p-4 font-medium text-navy">{s.nombre}</td>
                  <td className="p-4 text-muted-foreground font-mono text-xs">{s.slug}</td>
                  <td className="p-4 text-muted-foreground">{s.orden}</td>
                  <td className="p-4"><Switch checked={s.estado} onCheckedChange={() => toggleEstado(s)} /></td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(s)}><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => remove(s)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
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
