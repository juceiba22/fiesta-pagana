import { supabaseServer } from '@/lib/supabase';
import type { Codigo2x1, Entrada2x1 } from '@/lib/promo2x1';
import { crearCodigo2x1, alternarCodigo2x1 } from './actions';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {

  const { data: tickets, error } = await supabaseServer
    .from('tickets')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return <div className="p-10 text-white">Error cargando datos: {error.message}</div>;

  const aprobados = tickets?.filter(t => t.estado_pago === 'approved') || [];
  const recaudacion = aprobados.reduce((acc, curr) => acc + Number(curr.monto), 0);

  const { data: codigosData, error: codigosError } = await supabaseServer
    .from('codigos_2x1')
    .select('*')
    .order('created_at', { ascending: false });
  const { data: valesData } = await supabaseServer
    .from('entradas_2x1')
    .select('*')
    .order('created_at', { ascending: false });

  const codigos = (codigosData ?? []) as Codigo2x1[];
  const vales = (valesData ?? []) as Entrada2x1[];
  const valesAprobados = vales.filter(v => v.estado_pago === 'approved');
  const recaudacionVales = valesAprobados.reduce((acc, curr) => acc + Number(curr.monto), 0);

  return (
    <div className="min-h-screen bg-black text-white p-10 font-sans">
      <h1 className="text-4xl font-bold mb-8 text-neutral-100">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-xl">
          <p className="text-neutral-400 font-light">Total Recaudado</p>
          <p className="text-4xl font-bold mt-2 text-green-500">
            ${recaudacion.toLocaleString('es-AR')}
          </p>
        </div>
        <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-xl">
          <p className="text-neutral-400 font-light">Entradas Aprobadas</p>
          <p className="text-4xl font-bold mt-2 text-blue-400">{aprobados.length}</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-neutral-100">Códigos 2x1</h2>

      {codigosError ? (
        <div className="mb-12 p-4 rounded-2xl border border-yellow-800/50 bg-yellow-900/20 text-yellow-500 text-sm">
          No se pudo leer la tabla de códigos 2x1 ({codigosError.message}). Ejecutá <span className="font-mono">supabase/2x1.sql</span> en Supabase.
        </div>
      ) : (
        <div className="mb-12 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-xl">
              <p className="text-neutral-400 font-light">Vales 2x1 emitidos (2 entradas c/u)</p>
              <p className="text-4xl font-bold mt-2 text-blue-400">{valesAprobados.length}</p>
            </div>
            <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-xl">
              <p className="text-neutral-400 font-light">Recaudado en vales 2x1</p>
              <p className="text-4xl font-bold mt-2 text-green-500">
                ${recaudacionVales.toLocaleString('es-AR')}
              </p>
            </div>
          </div>

          <form action={crearCodigo2x1} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-end gap-4">
            <label className="flex flex-col gap-1 text-xs text-neutral-400">
              Código (vacío = autogenerado)
              <input name="codigo" placeholder="PAGANA2X1" className="bg-black border border-neutral-700 rounded px-3 py-2 text-sm text-white font-mono uppercase" />
            </label>
            <label className="flex flex-col gap-1 text-xs text-neutral-400">
              Usos máximos
              <input name="usos_maximos" type="number" min={1} defaultValue={1} className="w-28 bg-black border border-neutral-700 rounded px-3 py-2 text-sm text-white" />
            </label>
            <label className="flex flex-col gap-1 text-xs text-neutral-400">
              Nota (opcional)
              <input name="nota" placeholder="Para quién es" className="bg-black border border-neutral-700 rounded px-3 py-2 text-sm text-white" />
            </label>
            <button type="submit" className="px-5 py-2 bg-white text-black text-sm font-semibold rounded hover:bg-neutral-200 transition-colors">
              Crear código
            </button>
          </form>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-neutral-950 border-b border-neutral-800 text-neutral-400 text-sm font-medium">
                  <tr>
                    <th className="p-4">Código</th>
                    <th className="p-4">Usos</th>
                    <th className="p-4">Nota</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {!codigos.length && (
                    <tr>
                      <td colSpan={5} className="p-10 text-center text-neutral-500 italic">
                        Todavía no creaste códigos 2x1.
                      </td>
                    </tr>
                  )}
                  {codigos.map(c => (
                    <tr key={c.codigo} className="border-b border-neutral-800/50">
                      <td className="p-4 font-mono font-bold tracking-wider">{c.codigo}</td>
                      <td className="p-4 text-neutral-300">{c.usos} / {c.usos_maximos}</td>
                      <td className="p-4 text-neutral-400">{c.nota || '---'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-[10px] font-bold rounded-full tracking-wider ${!c.activo
                            ? 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                            : c.usos >= c.usos_maximos
                              ? 'bg-yellow-900/30 text-yellow-500 border border-yellow-800/50'
                              : 'bg-green-900/30 text-green-400 border border-green-800/50'
                          }`}>
                          {!c.activo ? 'DESACTIVADO' : c.usos >= c.usos_maximos ? 'AGOTADO' : 'DISPONIBLE'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <form action={alternarCodigo2x1}>
                          <input type="hidden" name="codigo" value={c.codigo} />
                          <input type="hidden" name="activo" value={String(!c.activo)} />
                          <button type="submit" className="text-xs text-neutral-400 hover:text-white underline">
                            {c.activo ? 'Desactivar' : 'Activar'}
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-neutral-950 border-b border-neutral-800 text-neutral-400 text-sm font-medium">
                  <tr>
                    <th className="p-4">Fecha</th>
                    <th className="p-4">Nombre</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Código</th>
                    <th className="p-4">Método</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4">Ingresaron</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {!vales.length && (
                    <tr>
                      <td colSpan={7} className="p-10 text-center text-neutral-500 italic">
                        No hay vales 2x1 emitidos.
                      </td>
                    </tr>
                  )}
                  {vales.map(v => (
                    <tr key={v.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors">
                      <td className="p-4 text-neutral-400 whitespace-nowrap">
                        {new Date(v.created_at).toLocaleDateString('es-AR', {
                          day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                      <td className="p-4 text-neutral-300">{v.nombre}</td>
                      <td className="p-4 font-medium">{v.email}</td>
                      <td className="p-4 font-mono text-neutral-400">{v.codigo}</td>
                      <td className="p-4 text-neutral-400">{v.metodo === 'transferencia' ? 'Transferencia' : 'Mercado Pago'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-[10px] font-bold rounded-full tracking-wider ${v.estado_pago === 'approved'
                            ? 'bg-green-900/30 text-green-400 border border-green-800/50'
                            : 'bg-yellow-900/30 text-yellow-500 border border-yellow-800/50'
                          }`}>
                          {v.estado_pago.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-neutral-300">{v.ingresos} / {v.cantidad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4 text-neutral-100">Entradas</h2>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-neutral-950 border-b border-neutral-800 text-neutral-400 text-sm font-medium">
              <tr>
                <th className="p-4">Fecha</th>
                <th className="p-4">Email</th>
                <th className="p-4">Nombre</th>
                <th className="p-4">Estado</th>
                <th className="p-4">ID Pago</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {!tickets?.length && (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-neutral-500 italic">
                    No se encontraron tickets registrados.
                  </td>
                </tr>
              )}
              {tickets?.map(t => (
                <tr key={t.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors">
                  <td className="p-4 text-neutral-400 whitespace-nowrap">
                    {t.created_at
                      ? new Date(t.created_at).toLocaleDateString('es-AR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                      : 'Sin fecha'}
                  </td>
                  <td className="p-4 font-medium">{t.email_comprador}</td>
                  <td className="p-4 text-neutral-300">{t.nombre_comprador}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-[10px] font-bold rounded-full tracking-wider ${t.estado_pago === 'approved'
                        ? 'bg-green-900/30 text-green-400 border border-green-800/50'
                        : 'bg-yellow-900/30 text-yellow-500 border border-yellow-800/50'
                      }`}>
                      {t.estado_pago.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-xs font-mono text-neutral-500 italic">
                    {t.mercadopago_payment_id || '---'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}