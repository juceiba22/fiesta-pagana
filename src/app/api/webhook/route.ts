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

    // MP envia a veces un topic 'payment', validamos que lo sea
    if (dataID) {
      const payment = new Payment(client);
      const paymentInfo = await payment.get({ id: dataID });

      if (paymentInfo.status === 'approved') {
        const email = paymentInfo.external_reference; // Tomamos el email como referencia
        
        // Actualizar el ticket a estado aprobado en Supabase
        if(email){
           const { error } = await supabaseServer
             .from('tickets')
             .update({
               estado_pago: 'approved',
               mercadopago_payment_id: String(dataID),
             })
             .eq('email_comprador', email)
             .eq('estado_pago', 'pending');
             
           if (error) console.error("Error actualizando DB", error);
        }
      }
    }

    // Siempre retornar 200 a MP para evitar reintentos
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    // Even if we have an error, returning 200 helps prevent Mercadopago spam, but tracking it is good.
    return NextResponse.json({ error: 'Webhook Error' }, { status: 500 });
  }
}
