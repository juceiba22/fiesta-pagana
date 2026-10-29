import { Resend } from 'resend';
import type { Entrada2x1 } from '@/lib/promo2x1';

const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function enviarVale2x1(entrada: Entrada2x1) {
  const link = `${process.env.NEXT_PUBLIC_SITE_URL}/entrada/${entrada.id}`;
  const nombre = entrada.nombre.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

  await resend.emails.send({
    from: 'Fiesta Pagana <bienvenido@fiestta-pagana.com>',
    to: entrada.email,
    subject: '¡Tu vale 2x1 para la Fiesta Pagana está listo!',
    html: `
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&display=swap" rel="stylesheet">
      </head>
      <div style="background-color: #050505; color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px 20px; text-align: center;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #111111; border: 1px solid #222222; border-radius: 12px; overflow: hidden;">
          <div style="padding: 40px 20px; border-bottom: 1px solid #222;">
            <h1 style="font-family: 'Cinzel Decorative', serif; color: #ffffff; font-size: 32px; font-weight: 800; letter-spacing: 4px; margin: 0;">FIESTA PAGANA</h1>
            <p style="color: #888888; font-size: 14px; margin-top: 10px; letter-spacing: 2px;">6 DE NOVIEMBRE | EL PORTAL TEATRO</p>
          </div>
          <div style="padding: 40px 30px;">
            <h2 style="color: #dddddd; font-size: 22px; font-weight: 500; margin-bottom: 20px;">¡Hola ${nombre}!</h2>
            <p style="color: #aaaaaa; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              Tu vale 2x1 está confirmado y es válido para <strong style="color: #ffffff;">2 personas</strong>.
              Presentá el código QR de este link en la puerta; se escanea una vez por cada persona que ingresa.
            </p>
            <a href="${link}" style="background-color: #ffffff; color: #000000; padding: 18px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; font-size: 14px; letter-spacing: 1px;">
              VER MI VALE POR 2
            </a>
          </div>
          <div style="background-color: #000000; padding: 20px; text-align: center;">
            <p style="color: #444444; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} Fiesta Pagana</p>
          </div>
        </div>
      </div>
    `,
  });
}
