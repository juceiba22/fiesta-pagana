import { NextResponse } from 'next/server';
import { buscarCodigo, codigoDisponible, normalizarCodigo } from '@/lib/promo2x1';

export async function POST(req: Request) {
  try {
    const { codigo } = await req.json();
    const normalizado = normalizarCodigo(codigo);

    if (!normalizado) {
      return NextResponse.json({ error: 'Ingresá un código' }, { status: 400 });
    }

    const registro = await buscarCodigo(normalizado);
    if (!registro || !codigoDisponible(registro)) {
      return NextResponse.json({ error: 'Código inválido o ya utilizado' }, { status: 400 });
    }

    return NextResponse.json({ valid: true, codigo: normalizado });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
