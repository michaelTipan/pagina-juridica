export type Role = 'admin' | 'editor';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: Role;
  created_at: string;
  updated_at: string;
}

export interface Abogado {
  id: string;
  nombre: string;
  cargo: string;
  especialidad: string;
  biografia: string | null;
  formacion: string | null;
  foto_url: string | null;
  orden: number;
  estado: boolean;
  created_at: string;
  updated_at: string;
}

export interface Servicio {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  imagen_url: string | null;
  contenido: string | null;
  meta_titulo: string | null;
  meta_descripcion: string | null;
  orden: number;
  estado: boolean;
  created_at: string;
  updated_at: string;
}

export interface Articulo {
  id: string;
  titulo: string;
  slug: string;
  resumen: string | null;
  contenido: string | null;
  imagen_url: string | null;
  autor: string | null;
  publicado: boolean;
  fecha_publicacion: string | null;
  meta_titulo: string | null;
  meta_descripcion: string | null;
  created_at: string;
  updated_at: string;
}

export interface Faq {
  id: string;
  pregunta: string;
  respuesta: string;
  orden: number;
  estado: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConfiguracionWeb {
  id: number;
  nombre_estudio: string;
  logo_url: string | null;
  whatsapp: string | null;
  email: string | null;
  direccion: string | null;
  facebook: string | null;
  instagram: string | null;
  linkedin: string | null;
  mensaje_whatsapp: string | null;
  created_at: string;
  updated_at: string;
}

export interface Contacto {
  id: string;
  nombre: string;
  correo: string;
  telefono: string | null;
  area: string | null;
  mensaje: string;
  leido: boolean;
  created_at: string;
}
