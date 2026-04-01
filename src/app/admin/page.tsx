import { supabaseServer } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {

  const { data: tickets, error } = await supabaseServer
    .from('tickets')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return <div>Error cargando datos: {error.message}</div>;

  const aprobados = tickets?.filter(t => t.estado_pago === 'approved') || [];
  const recaudacion = aprobados.reduce((acc, curr) => acc + Number(curr.monto), 0);

  return (
    <div className="min-h-screen bg-black text-white p-10 font-sans">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-2 gap-6 mb-12">
        <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
          <p className="text-neutral-400 font-light">Total Recaudado</p>
          <p className="text-4xl font-bold mt-2">${recaudacion}</p>
        </div>
        <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
          <p className="text-neutral-400 font-light">Entradas Aprobadas</p>
          <p className="text-4xl font-bold mt-2">{aprobados.length}</p>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-neutral-950 border-b border-neutral-800 text-neutral-400 text-sm font-light">
            <tr>
              <th className="p-4">Email</th>
              <th className="p-4">Nombre</th>
              <th className="p-4">Estado</th>
              <th className="p-4">ID Pago</th>
            </tr>
          </thead>
          <tbody>
            {!tickets?.length && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-neutral-500">No hay tickets.</td>
              </tr>
            )}
            {tickets?.map(t => (
              <tr key={t.id} className="border-b border-neutral-800/50">
                <td className="p-4">{t.email_comprador}</td>
                <td className="p-4">{t.nombre_comprador}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    t.estado_pago === 'approved' ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-500'
                  }`}>
                    {t.estado_pago.toUpperCase()}
                  </span>
                </td>
                <td className="p-4 text-xs font-mono text-neutral-500">{t.mercadopago_payment_id || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
