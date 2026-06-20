import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

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
      return NextResponse.json({ error: 'Entrada no encontrada' }, { status: 404 });
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
