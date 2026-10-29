import crypto from 'crypto';
import { supabaseServer } from '@/lib/supabase';

export const PRECIO_2X1 = 10000;
export const RECARGO_MERCADOPAGO = 1000;
export const ENTRADAS_POR_VALE = 2;
export const PREFIJO_REFERENCIA_2X1 = '2x1:';

export type Metodo2x1 = 'transferencia' | 'mercadopago';

export type Codigo2x1 = {
  codigo: string;
  usos_maximos: number;
  usos: number;
  activo: boolean;
  nota: string | null;
  created_at: string;
};

export type Entrada2x1 = {
  id: string;
  codigo: string;
  nombre: string;
  email: string;
  metodo: Metodo2x1;
  estado_pago: 'pending' | 'approved';
  monto: number;
  cantidad: number;
  ingresos: number;
  mercadopago_payment_id: string | null;
  created_at: string;
};

export const normalizarCodigo = (codigo: unknown) =>
  typeof codigo === 'string' ? codigo.trim().toUpperCase().replace(/\s+/g, '') : '';

export const normalizarEmail = (email: string) => email.trim().toLowerCase();

// Sin 0/O ni 1/I/L para que sea fácil de dictar y copiar.
const ALFABETO = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

export const generarCodigo = (largo = 8) =>
  Array.from({ length: largo }, () => ALFABETO[crypto.randomInt(ALFABETO.length)]).join('');

export async function buscarCodigo(codigo: string): Promise<Codigo2x1 | null> {
  const { data } = await supabaseServer
    .from('codigos_2x1')
    .select('*')
    .eq('codigo', codigo)
    .maybeSingle();
  return (data as Codigo2x1 | null) ?? null;
}

export const codigoDisponible = (c: Codigo2x1) => c.activo && c.usos < c.usos_maximos;

// Toma un uso del código de forma atómica (update condicionado al valor leído).
export async function consumirUso(codigo: string): Promise<boolean> {
  for (let intento = 0; intento < 5; intento++) {
    const actual = await buscarCodigo(codigo);
    if (!actual || !codigoDisponible(actual)) return false;

    const { data } = await supabaseServer
      .from('codigos_2x1')
      .update({ usos: actual.usos + 1 })
      .eq('codigo', codigo)
      .eq('usos', actual.usos)
      .select('codigo');

    if (data && data.length > 0) return true;
  }
  return false;
}

export async function liberarUso(codigo: string) {
  const actual = await buscarCodigo(codigo);
  if (!actual || actual.usos === 0) return;
  await supabaseServer
    .from('codigos_2x1')
    .update({ usos: actual.usos - 1 })
    .eq('codigo', codigo)
    .eq('usos', actual.usos);
}

// Un mismo mail no obtiene dos vales con el mismo código: si ya tiene uno, se reutiliza.
export async function buscarEntradaExistente(codigo: string, email: string): Promise<Entrada2x1 | null> {
  const { data } = await supabaseServer
    .from('entradas_2x1')
    .select('*')
    .eq('codigo', codigo)
    .eq('email', normalizarEmail(email))
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data as Entrada2x1 | null) ?? null;
}

export async function crearEntrada(params: {
  codigo: string;
  nombre: string;
  email: string;
  metodo: Metodo2x1;
}): Promise<Entrada2x1 | null> {
  const { codigo, nombre, email, metodo } = params;
  const { data, error } = await supabaseServer
    .from('entradas_2x1')
    .insert({
      codigo,
      nombre: nombre.trim(),
      email: normalizarEmail(email),
      metodo,
      // Mercado Pago se aprueba por webhook; la transferencia, a mano desde el admin.
      estado_pago: 'pending',
      monto: metodo === 'transferencia' ? PRECIO_2X1 : PRECIO_2X1 + RECARGO_MERCADOPAGO,
      cantidad: ENTRADAS_POR_VALE,
    })
    .select('*')
    .single();

  if (error || !data) {
    console.error('Error creando entrada 2x1', error);
    return null;
  }
  return data as Entrada2x1;
}
