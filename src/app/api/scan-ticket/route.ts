import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

// Vale 2x1: el mismo QR se puede escanear una vez por persona (hasta `cantidad`).
async function scanVale2x1(id: string) {
  // Ids que no son uuid no pueden ser un vale (evita un error de cast en Postgres)
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ error: 'Entrada no encontrada' }, { status: 404 });
  }

  const { data: vale } = await supabaseServer
    .from('entradas_2x1')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!vale) {
    return NextResponse.json({ error: 'Entrada no encontrada' }, { status: 404 });
  }

  if (vale.estado_pago !== 'approved') {
    return NextResponse.json({ error: 'Pago pendiente, no habilitada', ticket: vale }, { status: 400 });
  }

  if (vale.ingresos >= vale.cantidad) {
    return NextResponse.json(
      { error: `Este vale YA FUE USADO (${vale.ingresos}/${vale.cantidad})`, ticket: vale },
      { status: 400 }
    );
  }

  // Update condicionado al contador leído: dos escaneos simultáneos no pasan ambos.
  const { data: actualizado, error: updateError } = await supabaseServer
    .from('entradas_2x1')
    .update({ ingresos: vale.ingresos + 1 })
    .eq('id', id)
    .eq('ingresos', vale.ingresos)
    .select('*');

  if (updateError) {
    return NextResponse.json({ error: 'Error al actualizar en BD' }, { status: 500 });
  }
  if (!actualizado || actualizado.length === 0) {
    return NextResponse.json({ error: 'Escaneo simultáneo, volvé a intentar' }, { status: 409 });
  }

  return NextResponse.json({ success: true, ticket: actualizado[0] });
}

export async function POST(req: Request) {
  try {
    const { password, ticketId } = await req.json();

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
    }

    if (!ticketId) {
      return NextResponse.json({ error: 'Falta ticketId' }, { status: 400 });
    }

    const { data: ticket, error: fetchError } = await supabaseServer
      .from('entradas_fisicas')
      .select('*')
      .eq('id', ticketId)
      .single();

    if (fetchError || !ticket) {
      return await scanVale2x1(ticketId);
    }

    if (ticket.ingreso_registrado) {
      return NextResponse.json({ error: 'Esta entrada YA FUE ESCANEADA', ticket }, { status: 400 });
    }

    const { error: updateError } = await supabaseServer
      .from('entradas_fisicas')
      .update({ ingreso_registrado: true })
      .eq('id', ticketId);

    if (updateError) {
      return NextResponse.json({ error: 'Error al actualizar en BD' }, { status: 500 });
    }

    return NextResponse.json({ success: true, ticket });
  } catch (err) {
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
