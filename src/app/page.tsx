'use client'

import { useState } from 'react';

const inputClass = "w-full px-4 py-3 bg-[#050505] text-neutral-300 rounded-none border-b border-neutral-800 focus:outline-none focus:border-neutral-500 focus:bg-[#080808] transition-all font-light placeholder:text-neutral-700 placeholder:font-cinzel-dec placeholder:italic";
const buttonClass = "w-full py-4 bg-transparent hover:bg-[#111] text-neutral-300 font-cinzel-dec tracking-[0.2em] text-base md:text-lg transition-all disabled:opacity-50 border border-neutral-700/50 hover:border-neutral-400/80 hover:text-white shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]";
const labelClass = "text-neutral-500 text-xs uppercase tracking-[0.2em] pl-1 font-cinzel-dec";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [codigo, setCodigo] = useState('');
  const [codigoValido, setCodigoValido] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  const tieneCodigo = codigo.trim().length > 0;

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const verificarCodigo = async () => {
    if (!tieneCodigo) {
      setCodigoValido(null);
      return;
    }
    try {
      const response = await fetch('/api/validate-2x1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo })
      });
      setCodigoValido(response.ok);
    } catch (error) {
      console.error(error);
      setCodigoValido(null);
    }
  };

  // Con código 2x1 hacen falta nombre y mail para emitir el vale
  const datosDelVale = () => {
    if (!nombre || !email) {
      setErrorMsg("Debes ingresar tu nombre y mail para recibir tu vale.");
      return false;
    }
    if (!validateEmail(email)) {
      setErrorMsg("Formato de email inválido.");
      return false;
    }
    return true;
  };

  // Llama a la API y devuelve el JSON (o muestra el error y devuelve null)
  const llamarApi = async (ruta: string, body?: object) => {
    setErrorMsg('');
    setLoading(true);
    try {
      const response = await fetch(ruta, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body ?? {})
      });
      const data = await response.json();
      if (!response.ok) {
        setErrorMsg(data.error || "Hubo un error. Intenta de nuevo.");
        setLoading(false);
        return null;
      }
      return data;
    } catch (error) {
      console.error(error);
      setErrorMsg("Hubo un error de conexión.");
      setLoading(false);
      return null;
    }
  };

  // "Ya transferí": con un código 2x1 válido se emite al instante el vale por 2
  const handleTransferido = async () => {
    if (!datosDelVale()) return;
    const data = await llamarApi('/api/redeem-2x1', { nombre, email, codigo });
    if (data?.id) window.location.href = `/entrada/${data.id}`;
    else if (data) { setErrorMsg("No pudimos generar tu vale."); setLoading(false); }
  };

  // Tarjeta: sin código va directo a Mercado Pago, sin pedir datos
  const handleTarjeta = async () => {
    if (tieneCodigo && !datosDelVale()) return;
    const data = tieneCodigo
      ? await llamarApi('/api/checkout-2x1', { nombre, email, codigo })
      : await llamarApi('/api/checkout-directo');
    if (data?.url) window.location.href = data.url;
    else if (data) { setErrorMsg("Error al generar el link de pago."); setLoading(false); }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-[#030303] overflow-hidden selection:bg-neutral-800 selection:text-neutral-300">
      {/* Background Ambience - Video and Fog */}
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

      {/* Fog Elements */}
      <div className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-800/10 via-transparent to-transparent blur-[100px] animate-fog z-0" style={{ animationDuration: '30s' }} />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-[#2a0808] rounded-full opacity-20 animate-pulse-mystic z-0" />
      <div className="absolute bottom-0 left-1/4 w-full h-1/2 bg-gradient-to-t from-black via-[#0a0a0c]/80 to-transparent z-0" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-12 flex flex-col items-center">

        {/* Header Section */}
        <div className="text-center space-y-8 mb-12 animate-float-slow">
          <div className="relative inline-block">
            <h1 className="font-cinzel-dec text-7xl md:text-8xl lg:text-[10rem] text-[#d4d4d8] leading-none text-center drop-shadow-[0_0_20px_rgba(200,200,200,0.1)] tracking-tighter" style={{ textShadow: '2px 4px 15px rgba(0,0,0,0.8)' }}>
              FIESTA<br />PAGANA
            </h1>
            {/* Subtle ghostly glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-white/5 blur-[60px] rounded-full -z-10" />
          </div>

          <p className="text-neutral-300 font-cinzel-dec text-lg md:text-2xl tracking-[0.15em] uppercase">
            Teatro + Folclore + Cachengue
          </p>
        </div>

        <div className="w-full max-w-md space-y-6">

          {/* Código promocional */}
          <div className="bg-[#0a0a0c]/80 backdrop-blur-xl border border-neutral-800/60 rounded-sm p-6 shadow-[0_5px_30px_rgba(0,0,0,0.8)] space-y-4">
            <div className="space-y-2">
              <label className={labelClass}>Tengo un código promocional</label>
              <input
                type="text"
                placeholder="Tu código"
                className={`${inputClass} font-mono uppercase tracking-widest placeholder:normal-case`}
                value={codigo}
                onChange={(e) => { setCodigo(e.target.value); setCodigoValido(null); setErrorMsg(''); }}
                onBlur={verificarCodigo}
              />
              {codigoValido === true && (
                <p className="text-neutral-400 text-[11px] tracking-wider pl-1">Código válido: 2 entradas por $10.000 (por tarjeta $11.000, incluye $1.000 de comisión).</p>
              )}
              {codigoValido === false && (
                <p className="text-[#8a2be2] text-[11px] tracking-wider pl-1">Código inválido o ya utilizado.</p>
              )}
            </div>

            {tieneCodigo && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <label className={labelClass}>Nombre y Apellido</label>
                  <input type="text" placeholder="Tu nombre" className={inputClass} value={nombre} onChange={(e) => setNombre(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Mail</label>
                  <input type="email" placeholder="Para enviarte tu vale" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
            )}
          </div>

          {/* Transferencia */}
          <div className="bg-[#0a0a0c]/80 backdrop-blur-xl border border-neutral-800/60 rounded-sm p-6 shadow-[0_5px_30px_rgba(0,0,0,0.8)] text-center space-y-4">
            <p className="text-neutral-400 font-cinzel-dec text-sm md:text-base tracking-[0.15em] uppercase">
              Comprar entrada con transferencia
            </p>
            <div className="flex items-center justify-between bg-[#050505] border border-neutral-800 p-3 px-4">
              <span className="text-neutral-200 font-mono tracking-wider text-sm md:text-base">fiesta.pagana</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText('fiesta.pagana');
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="text-xs text-neutral-500 hover:text-white transition-colors uppercase tracking-[0.1em]"
              >
                {copied ? 'Copiado' : 'Copiar'}
              </button>
            </div>
            <p className="text-neutral-500 text-xs tracking-wider">
              {tieneCodigo ? 'Valor: $10.000 por 2 entradas' : 'Valor: $10.000'}
            </p>

            {tieneCodigo ? (
              <button type="button" disabled={loading} onClick={handleTransferido} className={buttonClass}>
                YA TRANSFERÍ
              </button>
            ) : (
              <p className="text-neutral-500 text-xs tracking-wider leading-relaxed">
                Compartile el comprobante a alguien del staff de la Fiesta Pagana y te anotamos en la lista.
              </p>
            )}
          </div>

          {/* Tarjeta */}
          <div className="space-y-3">
            <div className="h-5 flex items-center justify-center">
              {errorMsg && (
                <p className="text-[#8a2be2] text-xs font-medium animate-fade-in tracking-wider text-center">{errorMsg}</p>
              )}
            </div>
            <button type="button" disabled={loading} onClick={handleTarjeta} className={buttonClass}>
              {loading ? 'PROCESANDO...' : 'COMPRAR CON TARJETA'}
            </button>
            <p className="text-center text-neutral-600 text-xs tracking-wider">
              {tieneCodigo ? '$11.000 por 2 entradas' : '$12.000'}
            </p>
          </div>
        </div>

        {/* Footer Details */}
        <div className="mt-16 flex items-center justify-center gap-6 text-neutral-600 text-xs font-cinzel-dec tracking-[0.3em] uppercase">
          <span>+18 Años</span>
          <span className="text-neutral-800 text-[10px]">❖</span>
          <span>ENTRADAS LIMITADAS</span>
        </div>
      </div>
    </main>
  );
}
