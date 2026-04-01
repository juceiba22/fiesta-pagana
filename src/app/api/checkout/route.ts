import { NextResponse } from 'next/server';
import { requestPreference } from '@/lib/mercadopago';
import { supabaseServer } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { nombre, email } = await req.json();

    if (!nombre || !email) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }

    const { data: ticket, error: dbError } = await supabaseServer
      .from('tickets')
      .insert({
        nombre_comprador: nombre,
        email_comprador: email,
        estado_pago: 'pending',
        monto: 15000,
      })
      .select('id')
      .single();

    if (dbError || !ticket) {
      console.error(dbError);
      return NextResponse.json({ error: 'Error guardando en BD' }, { status: 500 });
    }

    const initPointUrl = await requestPreference(nombre, email, ticket.id);

    return NextResponse.json({ url: initPointUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}