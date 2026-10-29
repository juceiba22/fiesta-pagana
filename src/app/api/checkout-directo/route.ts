import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { requestPreferenceDirecta } from '@/lib/mercadopago';

// Botón "Comprar con tarjeta": genera el link de pago sin pedir datos.
export async function POST() {
  try {
    const url = await requestPreferenceDirecta(crypto.randomUUID());
    return NextResponse.json({ url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error creando el link de pago' }, { status: 500 });
  }
}
