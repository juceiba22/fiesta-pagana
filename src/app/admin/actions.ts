'use server'

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { supabaseServer } from '@/lib/supabase';
import { generarCodigo, normalizarCodigo } from '@/lib/promo2x1';

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
