import { supabaseServer } from '@/lib/supabase';
import { QRCodeSVG } from 'qrcode.react';

export default async function EntradaPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const { data: entrada } = await supabaseServer
    .from('entradas_fisicas')
    .select('*')
    .eq('id', id)
    .single();

  if (!entrada) {
    return (
      <main className="relative min-h-screen flex flex-col items-center justify-center bg-[#030303]">
        <h1 className="text-neutral-300 text-2xl font-cinzel-dec tracking-widest mb-4">Entrada no válida</h1>
        <p className="text-neutral-500 tracking-widest text-sm">El código escaneado no existe.</p>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-[#030303] overflow-hidden selection:bg-neutral-800 selection:text-neutral-300">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-60"
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-mystic-fog z-0 opacity-70" />

      <div className="absolute bottom-0 left-1/4 w-full h-1/2 bg-gradient-to-t from-black via-[#0a0a0c]/80 to-transparent z-0" />

      <div className="relative z-10 w-full max-w-md mx-auto px-6 py-12 flex flex-col items-center animate-fade-in">
        <div className="w-full bg-[#0a0a0c]/80 backdrop-blur-xl border border-neutral-800/60 rounded-sm p-8 text-center shadow-[0_10px_50px_rgba(0,0,0,0.8)] relative">
          
          <h2 className="text-xl md:text-2xl font-cinzel-dec text-neutral-200 tracking-widest leading-relaxed mb-6">
            Te esperamos en la<br/>Fiesta Pagana
          </h2>
          <p className="text-neutral-400 text-sm font-light tracking-[0.1em] mb-8">
            Presenta este código en la puerta
          </p>

          <div className="bg-white p-4 rounded-xl inline-block mb-6 shadow-2xl">
            <QRCodeSVG value={id} size={200} />
          </div>

          <p className="text-neutral-500 font-mono tracking-widest text-xs uppercase mb-2">
            Entrada a nombre de:
          </p>
          <p className="text-neutral-300 font-cinzel-dec text-lg tracking-widest">
            {entrada.nombre}
          </p>
          
          {entrada.ingreso_registrado && (
            <div className="mt-8 p-3 bg-red-950/50 border border-red-900/50 text-red-400 text-xs tracking-widest uppercase font-cinzel-dec rounded">
              Esta entrada ya ingresó
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
