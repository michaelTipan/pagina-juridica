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
import { Plus, Pencil, Trash2, Loader2, Eye, EyeOff } from 'lucide-react';
import type { Articulo } from '@/types/database';

const defaultImg = 'https://images.pexels.com/photos/7876088/pexels-photo-7876088.jpeg?auto=compress&cs=tinysrgb&w=800';

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatDate(d: string | null) {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('es-EC', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '—';
  }
}

export default function AdminArticulosPage() {
  const supabase = createClient();
  const [items, setItems] = useState<Articulo[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Articulo | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    titulo: '',
    slug: '',
    resumen: '',
    contenido: '',
    imagen_url: '',
    autor: '',
    publicado: false,
    fecha_publicacion: '',
    meta_titulo: '',
    meta_descripcion: '',
  });

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('articulos')
      .select('*')
      .order('created_at', { ascending: false });
    setItems((data as Articulo[]) || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  function openNew() {
    setEditing(null);
    setForm({
      titulo: '',
      slug: '',
      resumen: '',
      contenido: '',
      imagen_url: '',
      autor: '',
      publicado: false,
      fecha_publicacion: new Date().toISOString().slice(0, 10),
      meta_titulo: '',
      meta_descripcion: '',
    });
    setOpen(true);
  }

  function openEdit(a: Articulo) {
    setEditing(a);
    setForm({
      titulo: a.titulo,
      slug: a.slug,
      resumen: a.resumen || '',
      contenido: a.contenido || '',
      imagen_url: a.imagen_url || '',
      autor: a.autor || '',
      publicado: a.publicado,
      fecha_publicacion: a.fecha_publicacion
        ? a.fecha_publicacion.slice(0, 10)
        : '',
      meta_titulo: a.meta_titulo || '',
      meta_descripcion: a.meta_descripcion || '',
    });
    setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      slug: form.slug || slugify(form.titulo),
      fecha_publicacion: form.fecha_publicacion
        ? new Date(form.fecha_publicacion).toISOString()
        : form.publicado
        ? new Date().toISOString()
        : null,
    };
    if (editing) {
      await supabase.from('articulos').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('articulos').insert(payload);
    }
    setSaving(false);
    setOpen(false);
    load();
  }

  async function togglePublicado(a: Articulo) {
    await supabase
      .from('articulos')
      .update({
        publicado: !a.publicado,
        fecha_publicacion: !a.publicado
          ? new Date().toISOString()
          : a.fecha_publicacion,
      })
      .eq('id', a.id);
    load();
  }

  async function remove(a: Articulo) {
    if (!confirm(`¿Eliminar "${a.titulo}"?`)) return;
    await supabase.from('articulos').delete().eq('id', a.id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-navy">Artículos</h1>
          <p className="text-sm text-muted-foreground">Gestiona el blog jurídico del sitio.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="bg-navy hover:bg-navy-light">
              <Plus className="h-4 w-4" /> Nuevo artículo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? 'Editar artículo' : 'Nuevo artículo'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={save} className="space-y-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input
                  required
                  value={form.titulo}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      titulo: e.target.value,
                      slug: editing ? form.slug : slugify(e.target.value),
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Slug (URL)</Label>
                  <Input
                    required
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="que-hacer-ante-despido"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Autor</Label>
                  <Input
                    value={form.autor}
                    onChange={(e) => setForm({ ...form, autor: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Resumen</Label>
                <Textarea
                  rows={2}
                  value={form.resumen}
                  onChange={(e) => setForm({ ...form, resumen: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>URL de imagen</Label>
                <Input
                  value={form.imagen_url}
                  onChange={(e) => setForm({ ...form, imagen_url: e.target.value })}
                  placeholder={defaultImg}
                />
                {form.imagen_url && (
                  <img src={form.imagen_url} alt="" className="h-24 w-40 object-cover rounded mt-2" />
                )}
              </div>
              <div className="space-y-2">
                <Label>Contenido (HTML permitido)</Label>
                <Textarea
                  rows={10}
                  value={form.contenido}
                  onChange={(e) => setForm({ ...form, contenido: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Puedes usar etiquetas HTML: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, etc.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Meta título (SEO)</Label>
                  <Input
                    value={form.meta_titulo}
                    onChange={(e) => setForm({ ...form, meta_titulo: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Meta descripción (SEO)</Label>
                  <Input
                    value={form.meta_descripcion}
                    onChange={(e) => setForm({ ...form, meta_descripcion: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Fecha de publicación</Label>
                <Input
                  type="date"
                  value={form.fecha_publicacion}
                  onChange={(e) => setForm({ ...form, fecha_publicacion: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={form.publicado}
                  onCheckedChange={(v) => setForm({ ...form, publicado: v })}
                />
                <Label>Publicado</Label>
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
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-gold" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">No hay artículos.</p>
      ) : (
        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-left">
              <tr>
                <th className="p-4 font-medium">Título</th>
                <th className="p-4 font-medium">Fecha</th>
                <th className="p-4 font-medium">Estado</th>
                <th className="p-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((a) => (
                <tr key={a.id} className="hover:bg-secondary/20">
                  <td className="p-4">
                    <p className="font-medium text-navy line-clamp-1">{a.titulo}</p>
                    <p className="text-xs text-muted-foreground font-mono">/{a.slug}</p>
                  </td>
                  <td className="p-4 text-muted-foreground">{formatDate(a.fecha_publicacion)}</td>
                  <td className="p-4">
                    <Button
                      size="sm"
                      variant={a.publicado ? 'default' : 'outline'}
                      onClick={() => togglePublicado(a)}
                      className={a.publicado ? 'bg-gold text-navy hover:bg-gold-light' : ''}
                    >
                      {a.publicado ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                      {a.publicado ? 'Publicado' : 'Borrador'}
                    </Button>
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
