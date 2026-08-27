# Estudio Jurídico Montero & Asociados

Aplicación web profesional para un estudio jurídico boutique en Ecuador. Sitio público con blog, áreas de práctica, equipo y contacto, más un panel administrativo (CMS) para gestionar todo el contenido.

## Requisitos

- Node.js 18+
- Cuenta de Supabase (ya provisionada en este proyecto)

## Instalación

```bash
npm install
```

### Variables de entorno

El archivo `.env` ya incluye las credenciales de Supabase. Para producción, define además:

```
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
```

## Desarrollo

```bash
npm run dev
```

## Producción

```bash
npm run build
npm start
```

## Estructura

```
app/
  (public)/            # Sitio público con header/footer
    page.tsx           # Home
    servicios/         # Áreas de práctica + detalle
    equipo/            # Equipo de abogados
    blog/              # Blog + detalle de artículo
    contacto/          # Formulario de contacto
  admin/
    login/             # Inicio de sesión
    (protected)/       # Panel CMS (requiere autenticación)
      page.tsx         # Dashboard
      abogados/        # CRUD abogados
      servicios/       # CRUD servicios
      articulos/       # CRUD artículos
      faq/             # CRUD preguntas frecuentes
      contactos/       # Mensajes recibidos
      configuracion/   # Configuración general (solo admin)
  sitemap.ts           # Sitemap dinámico
  robots.ts            # Robots.txt
components/
  public/              # Componentes del sitio público
  admin/               # Componentes del panel
  ui/                  # Componentes shadcn/ui
  providers/           # AuthProvider
lib/
  supabase/            # Clientes Supabase (cliente/servidor)
  data.ts              # Helpers de configuración del sitio
types/
  database.ts          # Tipos TypeScript de la base de datos
middleware.ts          # Refresco de sesión Supabase
```

## Roles

- **ADMIN**: acceso completo, incluyendo configuración general.
- **EDITOR**: gestión de contenido (abogados, servicios, artículos, FAQ, mensajes).

## Crear el primer administrador

1. Ve al panel de Supabase → Authentication → Users → Add user.
2. Crea un usuario con email y contraseña.
3. En la tabla `profiles`, asigna `role = 'admin'` a ese usuario.
4. Inicia sesión en `/admin/login`.

## Base de datos

El esquema se crea automáticamente con la migración `create_lawfirm_schema`. Incluye:

- `profiles` — usuarios administrativos con rol.
- `abogados` — equipo de abogados.
- `servicios` — áreas de práctica con SEO.
- `articulos` — blog jurídico.
- `faq` — preguntas frecuentes.
- `configuracion_web` — configuración del sitio (fila única).
- `contactos` — mensajes del formulario.

Todas las tablas tienen **Row Level Security** habilitado:

- Contenido público: lectura abierta a todos.
- Escritura: solo usuarios autenticados con rol admin/editor.
- Configuración: solo admin.
- Contactos: cualquier visitante puede enviar; solo admin/editor puede leer.

## SEO

- Metadata dinámica por página.
- Open Graph y Twitter Cards.
- Schema.org `LegalService` en el layout general y `Article` en cada artículo.
- `sitemap.xml` y `robots.txt` generados dinámicamente.
- URLs amigables (`/servicios/derecho-civil`, `/blog/mi-articulo`).

## Personalización

Toda la información de contacto (WhatsApp, correo, dirección, redes sociales, nombre del estudio y mensaje de WhatsApp) se edita desde **Admin → Configuración general**.
