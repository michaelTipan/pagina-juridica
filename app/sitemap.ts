import type { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/servicios`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/equipo`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/contacto`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.7 },
  ];

  const [{ data: servicios }, { data: articulos }] = await Promise.all([
    supabase.from('servicios').select('slug, updated_at').eq('estado', true),
    supabase.from('articulos').select('slug, updated_at').eq('publicado', true),
  ]);

  const servicioRoutes: MetadataRoute.Sitemap = (servicios || []).map((s) => ({
    url: `${baseUrl}/servicios/${s.slug}`,
    lastModified: new Date(s.updated_at as string),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const articuloRoutes: MetadataRoute.Sitemap = (articulos || []).map((a) => ({
    url: `${baseUrl}/blog/${a.slug}`,
    lastModified: new Date(a.updated_at as string),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...servicioRoutes, ...articuloRoutes];
}
