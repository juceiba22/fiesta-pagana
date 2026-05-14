'use client'

import { useState } from 'react';

export default function Home() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [statusText, setStatusText] = useState('ADQUIRIR LLAVE DEL PORTAL');
  const [errorMsg, setErrorMsg] = useState('');

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !nombre) {
      setErrorMsg("Debes nombrar tu presencia y destino.");
      return;
    }
    setErrorMsg('');
    setLoading(true);
    setStatusText('INVOCANDO...');

    if (!validateEmail(email)) {
      setErrorMsg("El rastro está difuso. Formato inválido.");
      setLoading(false);
      setStatusText('ADQUIRIR LLAVE DEL PORTAL');
      return;
    }

    try {
      const response = await fetch('/api/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.error || "Las sombras ocultan la respuesta. Intenta de nuevo.");
        setLoading(false);
        setStatusText('ADQUIRIR LLAVE DEL PORTAL');
        return;
      }

      const { token } = data;
      setOtpToken(token);
      setStep(2);
      setStatusText('ATRAVESAR EL UMBRAL');
      setLoading(false);
    } catch (error) {
      console.error(error);
      setErrorMsg("El eco se perdió en el vacío.");
      setLoading(false);
      setStatusText('ADQUIRIR LLAVE DEL PORTAL');
    }
  };

  const handleVerifyAndCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      setErrorMsg("El sello requiere 6 símbolos.");
      return;
    }
    setErrorMsg('');
    setLoading(true);
    setStatusText('TRASPASANDO...');

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, token: otpToken, code: otpCode })
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.error || "Sello rechazado. Las puertas siguen cerradas.");
        setLoading(false);
        setStatusText('ATRAVESAR EL UMBRAL');
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        setErrorMsg("El camino se ha desvanecido.");
        setLoading(false);
        setStatusText('ATRAVESAR EL UMBRAL');
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Un velo interrumpió el pasaje.");
      setLoading(false);
      setStatusText('ATRAVESAR EL UMBRAL');
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-[#030303] overflow-hidden selection:bg-neutral-800 selection:text-neutral-300">
      {/* Background Ambience - Fog and Shadows */}
      <div className="absolute inset-0 bg-mystic-fog z-0 opacity-90" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] opacity-30 z-0 mix-blend-overlay pointer-events-none" />

      {/* Fog Elements */}
      <div className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-800/10 via-transparent to-transparent blur-[100px] animate-fog z-0" style={{ animationDuration: '30s' }} />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-[#2a0808] rounded-full opacity-20 animate-pulse-mystic z-0" />
      <div className="absolute bottom-0 left-1/4 w-full h-1/2 bg-gradient-to-t from-black via-[#0a0a0c]/80 to-transparent z-0" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-12 flex flex-col items-center">

        {/* Header Section - Mysterious */}
        <div className="text-center space-y-8 mb-12 animate-float-slow">
          <p className="text-neutral-500 text-xs md:text-sm tracking-[0.4em] font-light uppercase opacity-80">
            Poesía • Música • Misterio
          </p>

          <div className="relative inline-block">
            <h1 className="font-fell text-7xl md:text-8xl lg:text-[10rem] text-[#d4d4d8] leading-none text-center drop-shadow-[0_0_20px_rgba(200,200,200,0.1)] tracking-tighter" style={{ textShadow: '2px 4px 15px rgba(0,0,0,0.8)' }}>
              FIESTA<br />PAGANA
            </h1>
            {/* Subtle ghostly glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-white/5 blur-[60px] rounded-full -z-10" />
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16 mt-8">
            <div className="text-center">
              <p className="text-neutral-400 font-fell text-xl md:text-2xl tracking-widest">MIÉRCOLES 8</p>
              <p className="text-neutral-600 font-fell text-lg tracking-[0.2em] uppercase mt-1">DE JULIO</p>
            </div>
            <div className="hidden md:block w-px h-16 bg-gradient-to-b from-transparent via-neutral-700 to-transparent opacity-50"></div>
            <div className="text-center">
              <p className="text-neutral-400 font-fell text-xl md:text-2xl tracking-widest">21:00 hs</p>
              <p className="text-neutral-600 font-fell text-sm md:text-base tracking-[0.2em] uppercase mt-1">ENTRADAS A LA VENTA</p>
            </div>
          </div>
        </div>

        {/* Form Container - Occult/Shadowy Vibe */}
        <div className="w-full max-w-md bg-[#0a0a0c]/80 backdrop-blur-xl border border-neutral-800/60 rounded-sm p-8 sm:p-10 shadow-[0_10px_50px_rgba(0,0,0,0.8)] relative">

          {/* Subtle ornate corners (pure CSS) */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-neutral-600/40" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-neutral-600/40" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-neutral-600/40" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-neutral-600/40" />

          <p className="text-center text-neutral-400 text-xs sm:text-sm tracking-[0.15em] font-light mb-8 italic">
            "VALOR DEL INGRESO: $20.000"
          </p>

          {step === 1 ? (
            <form onSubmit={handleRequestCode} className="space-y-6">
              <div className="space-y-2">
                <label className="text-neutral-500 text-xs uppercase tracking-[0.2em] pl-1 font-fell">Identidad</label>
                <input
                  type="text"
                  required
                  placeholder="Tu nombre terrenal"
                  className="w-full px-4 py-3 bg-[#050505] text-neutral-300 rounded-none border-b border-neutral-800 focus:outline-none focus:border-neutral-500 focus:bg-[#080808] transition-all font-light placeholder:text-neutral-700 placeholder:font-fell placeholder:italic"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-neutral-500 text-xs uppercase tracking-[0.2em] pl-1 font-fell">Vínculo</label>
                <input
                  type="email"
                  required
                  placeholder="Tu correo de contacto"
                  className="w-full px-4 py-3 bg-[#050505] text-neutral-300 rounded-none border-b border-neutral-800 focus:outline-none focus:border-neutral-500 focus:bg-[#080808] transition-all font-light placeholder:text-neutral-700 placeholder:font-fell placeholder:italic"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="h-6 flex items-center justify-center">
                {errorMsg && (
                  <p className="text-[#8a2be2] text-xs font-medium animate-fade-in tracking-wider">{errorMsg}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-2 bg-transparent hover:bg-[#111] text-neutral-300 font-fell tracking-[0.3em] text-lg transition-all disabled:opacity-50 border border-neutral-700/50 hover:border-neutral-400/80 hover:text-white shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"
              >
                {statusText}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyAndCheckout} className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-fell text-neutral-300 text-center mb-2 tracking-widest">EL SELLO</h2>
              <p className="text-neutral-500 text-xs mb-8 text-center tracking-wider leading-relaxed">Las sombras han entregado un fragmento a <br /><span className="text-neutral-300 italic">{email}</span></p>

              <div className="space-y-2">
                <input
                  type="text"
                  required
                  placeholder="· · · · · ·"
                  maxLength={6}
                  className="w-full px-4 py-4 bg-[#050505] text-neutral-200 rounded-none border-y border-neutral-800 focus:outline-none focus:border-neutral-500 transition-all font-mono text-center tracking-[1.5em] text-2xl placeholder:text-neutral-800 placeholder:tracking-[1em]"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                />
              </div>

              <div className="h-6 flex items-center justify-center">
                {errorMsg && (
                  <p className="text-[#8a2be2] text-xs font-medium animate-fade-in tracking-wider">{errorMsg}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || otpCode.length !== 6}
                className="w-full py-4 mt-2 bg-transparent hover:bg-[#111] text-neutral-300 font-fell tracking-[0.3em] text-lg transition-all disabled:opacity-50 border border-neutral-700/50 hover:border-neutral-400/80 hover:text-white shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"
              >
                {statusText}
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => { setStep(1); setErrorMsg(''); setStatusText('RECLAMAR MI LUGAR EN EL RITUAL'); }}
                className="w-full pt-4 bg-transparent text-neutral-600 text-xs hover:text-neutral-300 transition-colors disabled:opacity-50 tracking-[0.2em] uppercase font-fell"
              >
                Retirarse en las sombras
              </button>
            </form>
          )}
        </div>

        {/* Footer Details */}
        <div className="mt-16 flex items-center justify-center gap-6 text-neutral-600 text-xs font-fell tracking-[0.3em] uppercase">
          <span>+18 Años</span>
          <span className="text-neutral-800 text-[10px]">❖</span>
          <span>ÚLTIMOS CUPOS DISPONIBLES</span>
        </div>
      </div>
    </main>
  );
}
