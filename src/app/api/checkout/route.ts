import { NextResponse } from 'next/server';
import { requestPreference } from '@/lib/mercadopago';
import { supabaseServer } from '@/lib/supabase';
import crypto from 'crypto';

const SECRET = process.env.OTP_SECRET || 'secret-pagana-2026';

export async function POST(req: Request) {
  try {
    const { nombre, email, token, code } = await req.json();

    if (!nombre || !email || !token || !code) {
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

    const expectedHash = crypto.createHmac('sha256', SECRET).update(email + code).digest('hex');
    if (token !== expectedHash) {
      return NextResponse.json({ error: 'Código de verificación incorrecto' }, { status: 400 });
    }

    // Si ya existe un pending para este email, reutilizarlo
    const { data: existing } = await supabaseServer
      .from('tickets')
      .select('id')
      .eq('email_comprador', email)
      .eq('estado_pago', 'pending')
      .single();

    if (existing) {
      const initPointUrl = await requestPreference(nombre, email, existing.id);
      return NextResponse.json({ url: initPointUrl });
    }

    // Si no existe, crear uno nuevo
    const { data: ticket, error: dbError } = await supabaseServer
      .from('tickets')
      .insert({
        nombre_comprador: nombre,
        email_comprador: email,
        estado_pago: 'pending',
        monto: 20000,
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