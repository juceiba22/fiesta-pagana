import { NextResponse } from 'next/server';
import {
  buscarEntradaExistente,
  consumirUso,
  crearEntrada,
  liberarUso,
  normalizarCodigo,
} from '@/lib/promo2x1';

// "Ya transferí": con un código 2x1 válido se registra el vale por 2 entradas como PENDIENTE.
// Queda habilitado (y se envía el mail) recién cuando el admin verifica la transferencia.
export async function POST(req: Request) {
  try {
    const { nombre, email, codigo } = await req.json();
    const codigoNormalizado = normalizarCodigo(codigo);

    if (!nombre || !email || !codigoNormalizado) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Formato de email inválido' }, { status: 400 });
    }

    // Si este mail ya canjeó el código (p. ej. doble click), se devuelve el mismo vale.
    const existente = await buscarEntradaExistente(codigoNormalizado, email);
    if (existente && (existente.metodo === 'transferencia' || existente.estado_pago === 'approved')) {
      return NextResponse.json({ id: existente.id });
    }

    if (!(await consumirUso(codigoNormalizado))) {
      return NextResponse.json({ error: 'Código inválido o ya utilizado' }, { status: 400 });
    }

    const entrada = await crearEntrada({
      codigo: codigoNormalizado,
      nombre,
      email,
      metodo: 'transferencia',
    });

    if (!entrada) {
      await liberarUso(codigoNormalizado);
      return NextResponse.json({ error: 'Error guardando en BD' }, { status: 500 });
    }

    return NextResponse.json({ id: entrada.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
