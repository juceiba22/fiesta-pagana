import { NextResponse, after } from 'next/server';
import {
  buscarEntradaExistente,
  consumirUso,
  crearEntrada,
  liberarUso,
  normalizarCodigo,
} from '@/lib/promo2x1';
import { enviarVale2x1 } from '@/lib/email2x1';

// "Ya transferí": con un código 2x1 válido se emite al instante un vale por 2 entradas.
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

    // El vale ya está emitido y se muestra en pantalla: el mail es un respaldo y se envía
    // después de responder, así una demora de Resend no deja al usuario esperando.
    after(async () => {
      try {
        await enviarVale2x1(entrada);
      } catch (emailError) {
        console.error('Error enviando email del vale 2x1:', emailError);
      }
    });

    return NextResponse.json({ id: entrada.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
