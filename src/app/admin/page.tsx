import { supabaseServer } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {

  const { data: tickets, error } = await supabaseServer
    .from('tickets')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return <div className="p-10 text-white">Error cargando datos: {error.message}</div>;

  const aprobados = tickets?.filter(t => t.estado_pago === 'approved') || [];
  const recaudacion = aprobados.reduce((acc, curr) => acc + Number(curr.monto), 0);

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