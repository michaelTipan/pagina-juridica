'use server';

import { Resend } from 'resend';
import { createClient } from '@/lib/supabase/server';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123'); 

export async function sendEmail({
  nombre,
  correo,
  telefono,
  area,
  mensaje,
}: {
  nombre: string;
  correo: string;
  telefono: string;
  area: string;
  mensaje: string;
}) {
  const supabase = await createClient();
  const { data: config } = await supabase.from('configuracion_web').select('email').eq('id', 1).single();
  const toEmail = config?.email || 'admin@example.com';

  if (!process.env.RESEND_API_KEY) {
    console.warn('No RESEND_API_KEY found, skipping actual email send.');
    return { success: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Contacto Web <onboarding@resend.dev>', 
      to: [toEmail],
      subject: `Nuevo mensaje de: ${nombre}`,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Correo:</strong> ${correo}</p>
        <p><strong>Teléfono:</strong> ${telefono || 'No especificado'}</p>
        <p><strong>Área legal:</strong> ${area || 'No especificada'}</p>
        <br/>
        <p><strong>Mensaje:</strong></p>
        <p>${mensaje}</p>
      `,
    });

    if (error) {
      console.error('Error enviando correo:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error inesperado:', error);
    return { success: false, error };
  }
}
