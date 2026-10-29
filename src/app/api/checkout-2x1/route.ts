import { NextResponse } from 'next/server';
import { requestPreference2x1 } from '@/lib/mercadopago';
import {
  buscarEntradaExistente,
  consumirUso,
  crearEntrada,
  liberarUso,
  normalizarCodigo,
} from '@/lib/promo2x1';

// Código 2x1 + tarjeta: vale por 2 entradas a $10.000 + $1.000 de recargo de Mercado Pago.
export async function POST(req: Request) {
  try {
    const { nombre, email, codigo } = await req.json();
    const codigo2x1 = normalizarCodigo(codigo);

    if (!nombre || !email || !codigo2x1) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Formato de email inválido' }, { status: 400 });
    }

    let entrada = await buscarEntradaExistente(codigo2x1, email);

    if (entrada && entrada.estado_pago === 'approved') {
      return NextResponse.json({ url: `${process.env.NEXT_PUBLIC_SITE_URL}/entrada/${entrada.id}` });
    }

    // Si quedó un pago pendiente de este mail se reutiliza (el uso del código ya está tomado).
    if (!entrada) {
      if (!(await consumirUso(codigo2x1))) {
        return NextResponse.json({ error: 'Código 2x1 inválido o ya utilizado' }, { status: 400 });
      }
      entrada = await crearEntrada({ codigo: codigo2x1, nombre, email, metodo: 'mercadopago' });
      if (!entrada) {
        await liberarUso(codigo2x1);
        return NextResponse.json({ error: 'Error guardando en BD' }, { status: 500 });
      }
    }

    const url = await requestPreference2x1(nombre, email, entrada.id);
    return NextResponse.json({ url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
