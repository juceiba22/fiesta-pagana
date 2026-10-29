'use server'

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { supabaseServer } from '@/lib/supabase';
import { generarCodigo, liberarUso, normalizarCodigo, type Entrada2x1 } from '@/lib/promo2x1';
import { enviarVale2x1 } from '@/lib/email2x1';

// Las Server Actions se pueden invocar con un POST directo, así que se revalida
// el Basic Auth del panel dentro de cada una (igual que middleware.ts).
async function exigirAdmin() {
  const authHeader = (await headers()).get('authorization');
  const adminPass = process.env.ADMIN_PASSWORD;

  if (!authHeader || adminPass === undefined) throw new Error('No autorizado');

  const decoded = Buffer.from(authHeader.split(' ')[1] ?? '', 'base64').toString();
  const separador = decoded.indexOf(':');
  const user = decoded.slice(0, separador);
  const password = decoded.slice(separador + 1);

  if (user !== 'admin' || password !== adminPass) throw new Error('No autorizado');
}

export async function crearCodigo2x1(formData: FormData) {
  await exigirAdmin();

  const personalizado = normalizarCodigo(formData.get('codigo'));
  const usosMaximos = Math.max(1, Math.floor(Number(formData.get('usos_maximos')) || 1));
  const nota = String(formData.get('nota') ?? '').trim() || null;

  const { error } = await supabaseServer.from('codigos_2x1').insert({
    codigo: personalizado || generarCodigo(),
    usos_maximos: usosMaximos,
    nota,
  });

  if (error) console.error('Error creando código 2x1', error);

  revalidatePath('/admin');
}

// Verificada la transferencia en el banco: habilita el vale y avisa por mail.
export async function aprobarVale2x1(formData: FormData) {
  await exigirAdmin();

  const id = String(formData.get('id') ?? '');

  const { data: vale, error } = await supabaseServer
    .from('entradas_2x1')
    .update({ estado_pago: 'approved' })
    .eq('id', id)
    .eq('metodo', 'transferencia')
    .eq('estado_pago', 'pending')
    .select('*')
    .maybeSingle();

  if (error) console.error('Error aprobando vale 2x1', error);

  if (vale) {
    try {
      await enviarVale2x1(vale as Entrada2x1);
    } catch (emailError) {
      console.error('Error enviando email del vale 2x1:', emailError);
    }
  }

  revalidatePath('/admin');
}

// No se encontró la transferencia: se elimina el vale pendiente y se devuelve el uso del código.
export async function rechazarVale2x1(formData: FormData) {
  await exigirAdmin();

  const id = String(formData.get('id') ?? '');

  const { data: vale, error } = await supabaseServer
    .from('entradas_2x1')
    .delete()
    .eq('id', id)
    .eq('metodo', 'transferencia')
    .eq('estado_pago', 'pending')
    .select('codigo')
    .maybeSingle();

  if (error) console.error('Error rechazando vale 2x1', error);
  if (vale) await liberarUso(vale.codigo);

  revalidatePath('/admin');
}

export async function alternarCodigo2x1(formData: FormData) {
  await exigirAdmin();

  const codigo = normalizarCodigo(formData.get('codigo'));
  const activo = formData.get('activo') === 'true';

  const { error } = await supabaseServer
    .from('codigos_2x1')
    .update({ activo })
    .eq('codigo', codigo);

  if (error) console.error('Error actualizando código 2x1', error);

  revalidatePath('/admin');
}
