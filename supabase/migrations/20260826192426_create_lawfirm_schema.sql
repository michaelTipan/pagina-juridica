/*
# Create schema for boutique law firm website (Ecuador)

This migration creates the complete database for a public-facing law firm website
with an admin CMS (Supabase Auth). All public content (abogados, servicios,
articulos, faq, configuracion_web) is readable by anon visitors. Contact messages
are insertable by anon. Admin/manager data (profiles) is read/written by
authenticated admins only.

## 1. New Tables
- `profiles` — admin users with a role (admin | editor). Linked to auth.users.
- `abogados` — attorneys shown on the public team section.
- `servicios` — practice areas with SEO content.
- `articulos` — blog posts with slug, content, image, author, published state.
- `faq` — frequently asked questions.
- `configuracion_web` — single-row site configuration (logo, whatsapp, email, etc).
- `contactos` — messages submitted from the public contact form (insert-only for anon).

## 2. Security
- RLS enabled on every table.
- Public read on content tables (anon + authenticated).
- Admin write on content tables (authenticated with profile role admin/editor).
- Contactos: anon can INSERT only; admins can SELECT/UPDATE/DELETE.
- Profiles: each authenticated user reads/updates only their own profile; admins all.
- Helper SQL functions: `is_admin()` and `is_editor_or_admin()` check the caller's
  profile role for use in RLS policies.

## 3. Notes
- `configuracion_web` is constrained to a single row via a check constraint.
- All content tables include `orden`, `estado`, and timestamps.
- Soft ordering: abogados and servicios sort by `orden`.
*/

-- Extensions
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- profiles (created first so helper functions can reference it)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'editor' check (role in ('admin','editor')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- ---------------------------------------------------------------------------
-- Helper functions for role checks
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

create or replace function public.is_editor_or_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin','editor')
  );
$$;

-- profiles policies
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select to authenticated using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_insert_admin" on public.profiles;
create policy "profiles_insert_admin" on public.profiles
  for insert to authenticated with check (public.is_admin());

drop policy if exists "profiles_delete_admin" on public.profiles;
create policy "profiles_delete_admin" on public.profiles
  for delete to authenticated using (public.is_admin());

-- ---------------------------------------------------------------------------
-- abogados
-- ---------------------------------------------------------------------------
create table if not exists public.abogados (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  cargo text not null,
  especialidad text not null,
  biografia text,
  formacion text,
  foto_url text,
  orden int not null default 0,
  estado boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.abogados enable row level security;

drop policy if exists "abogados_select_public" on public.abogados;
create policy "abogados_select_public" on public.abogados
  for select to anon, authenticated using (true);

drop policy if exists "abogados_insert_admin" on public.abogados;
create policy "abogados_insert_admin" on public.abogados
  for insert to authenticated with check (public.is_editor_or_admin());

drop policy if exists "abogados_update_admin" on public.abogados;
create policy "abogados_update_admin" on public.abogados
  for update to authenticated using (public.is_editor_or_admin())
  with check (public.is_editor_or_admin());

drop policy if exists "abogados_delete_admin" on public.abogados;
create policy "abogados_delete_admin" on public.abogados
  for delete to authenticated using (public.is_editor_or_admin());

-- ---------------------------------------------------------------------------
-- servicios
-- ---------------------------------------------------------------------------
create table if not exists public.servicios (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  slug text not null unique,
  descripcion text,
  imagen_url text,
  contenido text,
  meta_titulo text,
  meta_descripcion text,
  orden int not null default 0,
  estado boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.servicios enable row level security;

drop policy if exists "servicios_select_public" on public.servicios;
create policy "servicios_select_public" on public.servicios
  for select to anon, authenticated using (true);

drop policy if exists "servicios_insert_admin" on public.servicios;
create policy "servicios_insert_admin" on public.servicios
  for insert to authenticated with check (public.is_editor_or_admin());

drop policy if exists "servicios_update_admin" on public.servicios;
create policy "servicios_update_admin" on public.servicios
  for update to authenticated using (public.is_editor_or_admin())
  with check (public.is_editor_or_admin());

drop policy if exists "servicios_delete_admin" on public.servicios;
create policy "servicios_delete_admin" on public.servicios
  for delete to authenticated using (public.is_editor_or_admin());

-- ---------------------------------------------------------------------------
-- articulos
-- ---------------------------------------------------------------------------
create table if not exists public.articulos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  slug text not null unique,
  resumen text,
  contenido text,
  imagen_url text,
  autor text,
  publicado boolean not null default false,
  fecha_publicacion timestamptz,
  meta_titulo text,
  meta_descripcion text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.articulos enable row level security;

drop policy if exists "articulos_select_public" on public.articulos;
create policy "articulos_select_public" on public.articulos
  for select to anon, authenticated using (true);

drop policy if exists "articulos_insert_admin" on public.articulos;
create policy "articulos_insert_admin" on public.articulos
  for insert to authenticated with check (public.is_editor_or_admin());

drop policy if exists "articulos_update_admin" on public.articulos;
create policy "articulos_update_admin" on public.articulos
  for update to authenticated using (public.is_editor_or_admin())
  with check (public.is_editor_or_admin());

drop policy if exists "articulos_delete_admin" on public.articulos;
create policy "articulos_delete_admin" on public.articulos
  for delete to authenticated using (public.is_editor_or_admin());

-- ---------------------------------------------------------------------------
-- faq
-- ---------------------------------------------------------------------------
create table if not exists public.faq (
  id uuid primary key default gen_random_uuid(),
  pregunta text not null,
  respuesta text not null,
  orden int not null default 0,
  estado boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.faq enable row level security;

drop policy if exists "faq_select_public" on public.faq;
create policy "faq_select_public" on public.faq
  for select to anon, authenticated using (true);

drop policy if exists "faq_insert_admin" on public.faq;
create policy "faq_insert_admin" on public.faq
  for insert to authenticated with check (public.is_editor_or_admin());

drop policy if exists "faq_update_admin" on public.faq;
create policy "faq_update_admin" on public.faq
  for update to authenticated using (public.is_editor_or_admin())
  with check (public.is_editor_or_admin());

drop policy if exists "faq_delete_admin" on public.faq;
create policy "faq_delete_admin" on public.faq
  for delete to authenticated using (public.is_editor_or_admin());

-- ---------------------------------------------------------------------------
-- configuracion_web (single row)
-- ---------------------------------------------------------------------------
create table if not exists public.configuracion_web (
  id int primary key default 1 check (id = 1),
  nombre_estudio text not null default 'Estudio Jurídico',
  logo_url text,
  whatsapp text,
  email text,
  direccion text,
  facebook text,
  instagram text,
  linkedin text,
  mensaje_whatsapp text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.configuracion_web enable row level security;

drop policy if exists "config_select_public" on public.configuracion_web;
create policy "config_select_public" on public.configuracion_web
  for select to anon, authenticated using (true);

drop policy if exists "config_update_admin" on public.configuracion_web;
create policy "config_update_admin" on public.configuracion_web
  for update to authenticated using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "config_insert_admin" on public.configuracion_web;
create policy "config_insert_admin" on public.configuracion_web
  for insert to authenticated with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- contactos
-- ---------------------------------------------------------------------------
create table if not exists public.contactos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  correo text not null,
  telefono text,
  area text,
  mensaje text not null,
  leido boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.contactos enable row level security;

drop policy if exists "contactos_insert_public" on public.contactos;
create policy "contactos_insert_public" on public.contactos
  for insert to anon, authenticated with check (true);

drop policy if exists "contactos_select_admin" on public.contactos;
create policy "contactos_select_admin" on public.contactos
  for select to authenticated using (public.is_editor_or_admin());

drop policy if exists "contactos_update_admin" on public.contactos;
create policy "contactos_update_admin" on public.contactos
  for update to authenticated using (public.is_editor_or_admin())
  with check (public.is_editor_or_admin());

drop policy if exists "contactos_delete_admin" on public.contactos;
create policy "contactos_delete_admin" on public.contactos
  for delete to authenticated using (public.is_editor_or_admin());

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
create index if not exists abogados_orden_idx on public.abogados (orden);
create index if not exists servicios_orden_idx on public.servicios (orden);
create index if not exists servicios_slug_idx on public.servicios (slug);
create index if not exists articulos_slug_idx on public.articulos (slug);
create index if not exists articulos_publicado_idx on public.articulos (publicado, fecha_publicacion desc);
create index if not exists faq_orden_idx on public.faq (orden);
create index if not exists contactos_created_at_idx on public.contactos (created_at desc);

-- ---------------------------------------------------------------------------
-- Seed default configuracion row + default services + default FAQ
-- ---------------------------------------------------------------------------
insert into public.configuracion_web (id, nombre_estudio, whatsapp, email, direccion, mensaje_whatsapp)
values (1, 'Estudio Jurídico Montero & Asociados', '593999999999', 'contacto@monteroasociados.com', 'Av. Amazonas N34-451 y Av. Atahualpa, Quito, Ecuador', 'Hola, me gustaría agendar una consulta jurídica.')
on conflict (id) do nothing;

insert into public.servicios (nombre, slug, descripcion, orden, estado) values
('Derecho Civil', 'derecho-civil', 'Asesoría y representación en contratos, obligaciones, sucesiones y disputas patrimoniales.', 1, true),
('Derecho Penal', 'derecho-penal', 'Defensa técnica especializada en procesos penales y garantías del debido proceso.', 2, true),
('Derecho Laboral', 'derecho-laboral', 'Patrocinio en conflictos individuales y colectivos de trabajo, despidos y reclamaciones.', 3, true),
('Derecho Familiar', 'derecho-familiar', 'Divorcios, tenencia, pensión de alimentos, y resolución de conflictos familiares.', 4, true),
('Derecho Empresarial', 'derecho-empresarial', 'Constitución de empresas, contratos comerciales y asesoría societaria continua.', 5, true),
('Derecho Administrativo', 'derecho-administrativo', 'Contencioso administrativo, recursos y reclamaciones frente a entidades públicas.', 6, true)
on conflict (slug) do nothing;

insert into public.faq (pregunta, respuesta, orden, estado) values
('¿Cuánto cuesta una consulta?', 'El valor de la consulta varía según el área y la complejidad del caso. Te brindamos una cotización clara y sin compromiso después de la primera evaluación.', 1, true),
('¿Qué documentos necesito para la primera reunión?', 'Reúne toda la documentación relacionada con tu caso: contratos, correspondencia, notificaciones y cualquier antecedente. En la primera reunión te indicaremos los documentos específicos.', 2, true),
('¿Cómo puedo agendar una reunión?', 'Puedes agendar una consulta escribiéndonos por WhatsApp, mediante el formulario de contacto o al correo institucional. Te responderemos en horario hábil para coordinar la fecha.', 3, true),
('¿La información que comparto es confidencial?', 'Sí. El secreto profesional es un deber esencial de nuestra práctica. Toda la información que nos compartas está protegida por el sigilo profesional.', 4, true)
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- Trigger: auto-create profile on signup
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    coalesce(new.raw_user_meta_data->>'role', 'editor')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at_profiles on public.profiles;
create trigger set_updated_at_profiles before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_abogados on public.abogados;
create trigger set_updated_at_abogados before update on public.abogados
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_servicios on public.servicios;
create trigger set_updated_at_servicios before update on public.servicios
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_articulos on public.articulos;
create trigger set_updated_at_articulos before update on public.articulos
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_faq on public.faq;
create trigger set_updated_at_faq before update on public.faq
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_config on public.configuracion_web;
create trigger set_updated_at_config before update on public.configuracion_web
for each row execute function public.set_updated_at();
