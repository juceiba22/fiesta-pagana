import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY as string);
const SECRET = process.env.OTP_SECRET || 'secret-pagana-2026';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Formato de email inválido' }, { status: 400 });
    }

    const domain = email.split('@')[1];
    if (!domain || !domain.includes('.')) {
      return NextResponse.json({ error: 'Dominio de email inválido' }, { status: 400 });
    }

    // Generate 6 digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Create a hash token
    const token = crypto.createHmac('sha256', SECRET).update(email + code).digest('hex');

    // Send email via Resend
    const resendResponse = await resend.emails.send({
      from: 'Fiesta Pagana <onboarding@resend.dev>',
      to: email,
      subject: '🔑 Tu código de acceso - Fiesta Pagana',
      html: `
        <div style="background-color: #050505; color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px 20px; text-align: center;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #111111; border: 1px solid #222222; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            <div style="padding: 40px 20px; border-bottom: 1px solid #222;">
              <h1 style="color: #ffffff; font-size: 32px; font-weight: 800; letter-spacing: 4px; margin: 0;">FIESTA PAGANA</h1>
              <p style="color: #888888; font-size: 14px; margin-top: 10px; letter-spacing: 2px;">CÓDIGO DE VERIFICACIÓN</p>
            </div>
            <div style="padding: 40px 30px;">
              <h2 style="color: #dddddd; font-size: 22px; font-weight: 500; margin-bottom: 20px;">Valida tu Email</h2>
              <p style="color: #aaaaaa; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                Ingresa el siguiente código de 6 dígitos en la página para continuar con el pago de tu entrada.
              </p>
              <div style="background-color: #000000; border: 1px solid #333333; padding: 25px; border-radius: 8px; margin: 0 auto; display: inline-block;">
                <p style="color: #ffffff; font-size: 36px; font-family: monospace; font-weight: bold; letter-spacing: 8px; margin: 0;">
                  ${code}
                </p>
              </div>
              <p style="color: #555555; text-align: center; margin-top: 30px; font-size: 14px;">Este código es temporal y de un solo uso.</p>
            </div>
          </div>
        </div>
      `
    });

    if (resendResponse.error) {
      console.error("Resend API Error:", resendResponse.error);
      return NextResponse.json({ error: 'Error enviando email: ' + resendResponse.error.message }, { status: 500 });
    }

    return NextResponse.json({ token });
  } catch (err) {
    console.error('Error enviando código:', err);
    return NextResponse.json({ error: 'Error interno enviando código' }, { status: 500 });
  }
}
