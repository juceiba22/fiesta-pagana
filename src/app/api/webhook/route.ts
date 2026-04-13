import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { supabaseServer } from '@/lib/supabase';
import { Resend } from 'resend';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN as string
});

const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const dataID = url.searchParams.get('data.id') || url.searchParams.get('id');

    if (dataID) {
      const payment = new Payment(client);
      const paymentInfo = await payment.get({ id: dataID });

      if (paymentInfo.status === 'approved') {
        const ticketId = paymentInfo.external_reference;

        if (ticketId) {
          const { data: updatedTicket, error } = await supabaseServer
            .from('tickets')
            .update({
              estado_pago: 'approved',
              mercadopago_payment_id: String(dataID),
            })
            .eq('id', ticketId)
            .eq('estado_pago', 'pending')
            .select()
            .single();

          if (error) {
            console.error('Error actualizando DB', error);
          } else if (updatedTicket) {
            try {
              await resend.emails.send({
                from: 'Fiesta Pagana <bienvenido@fiestta-pagana.com>',
                to: updatedTicket.email_comprador,
                subject: '¡Bienvenido a la Fiesta Pagana! – Tu entrada está confirmada.',
                html: `
                  <div style="background-color: #050505; color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px 20px; text-align: center;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #111111; border: 1px solid #222222; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                      <div style="padding: 40px 20px; border-bottom: 1px solid #222;">
                        <h1 style="color: #ffffff; font-size: 32px; font-weight: 800; letter-spacing: 4px; margin: 0;">FIESTA PAGANA</h1>
                        <p style="color: #888888; font-size: 14px; margin-top: 10px; letter-spacing: 2px;">8 DE NOVIEMBRE | CLUB NAPOLES </p>
                      </div>
                      <div style="padding: 40px 30px;">
                        <h2 style="color: #dddddd; font-size: 22px; font-weight: 500; margin-bottom: 20px;">¡Hola ${updatedTicket.nombre_comprador}!</h2>
                        <p style="color: #aaaaaa; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                          Tu pago ha sido procesado exitosamente y tu entrada está confirmada. Prepárate para sumergirte en una noche inolvidable. El ritual comienza pronto.
                        </p>
                        <div style="background-color: #000000; border: 1px solid #333333; padding: 25px; border-radius: 8px; margin: 0 auto;">
                          <p style="color: #666666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px 0;">CODIGO DE ACCESO AL MUNDO PAGANO</p>
                          <p style="color: #ffffff; font-size: 18px; font-family: monospace; font-weight: bold; margin: 0; word-break: break-all;">
                            ${updatedTicket.id}
                          </p>
                        </div>
                      </div>
                      <div style="background-color: #000000; padding: 20px; text-align: center;">
                        <p style="color: #555555; font-size: 12px; margin: 0;">Revelaremos la ubicación exacta 24hs antes del evento.</p>
                        <p style="color: #444444; font-size: 12px; margin-top: 10px;">&copy; ${new Date().getFullYear()} Fiesta Pagana</p>
                      </div>
                    </div>
                  </div>
                `
              });
              console.log('Email de bienvenida enviado a:', updatedTicket.email_comprador);
            } catch (emailError) {
              console.error('Error enviando email via Resend:', emailError);
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 500 });
  }
}