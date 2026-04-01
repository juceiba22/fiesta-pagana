import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { supabaseServer } from '@/lib/supabase';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN as string
});

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
          const { error } = await supabaseServer
            .from('tickets')
            .update({
              estado_pago: 'approved',
              mercadopago_payment_id: String(dataID),
            })
            .eq('id', ticketId)
            .eq('estado_pago', 'pending');

          if (error) console.error('Error actualizando DB', error);
        }
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 500 });
  }
}