'use client'

import { useState } from 'react';

export default function Home() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [statusText, setStatusText] = useState('COMPRAR');
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !nombre) {
      setErrorMsg("Debes ingresar tu nombre y mail.");
      return;
    }
    setErrorMsg('');
    setLoading(true);
    setStatusText('PROCESANDO...');

    if (!validateEmail(email)) {
      setErrorMsg("Formato de email inválido.");
      setLoading(false);
      setStatusText('COMPRAR');
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
        setErrorMsg(data.error || "Hubo un error. Intenta de nuevo.");
        setLoading(false);
        setStatusText('COMPRAR');
        return;
      }

      const { token } = data;
      setOtpToken(token);
      setStep(2);
      setStatusText('VERIFICAR CÓDIGO');
      setLoading(false);
    } catch (error) {
      console.error(error);
      setErrorMsg("Hubo un error de conexión.");
      setLoading(false);
      setStatusText('COMPRAR');
    }
  };

  const handleVerifyAndCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      setErrorMsg("El código requiere 6 dígitos.");
      return;
    }
    setErrorMsg('');
    setLoading(true);
    setStatusText('VERIFICANDO...');

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, token: otpToken, code: otpCode })
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.error || "Código incorrecto.");
        setLoading(false);
        setStatusText('VERIFICAR CÓDIGO');
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        setErrorMsg("Error al generar el link de pago.");
        setLoading(false);
        setStatusText('VERIFICAR CÓDIGO');
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Hubo un error inesperado.");
      setLoading(false);
      setStatusText('VERIFICAR CÓDIGO');
    }
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

        {/* Header Section - Mysterious */}
        <div className="text-center space-y-8 mb-12 animate-float-slow">
          <p className="text-neutral-500 text-xs md:text-sm tracking-[0.4em] font-light uppercase opacity-80">
            Teatro • Música en Vivo • Fiesta
          </p>

          <div className="relative inline-block">
            <h1 className="font-cinzel-dec text-7xl md:text-8xl lg:text-[10rem] text-[#d4d4d8] leading-none text-center drop-shadow-[0_0_20px_rgba(200,200,200,0.1)] tracking-tighter" style={{ textShadow: '2px 4px 15px rgba(0,0,0,0.8)' }}>
              FIESTA<br />PAGANA
            </h1>
            {/* Subtle ghostly glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-white/5 blur-[60px] rounded-full -z-10" />
          </div>

          <div className="max-w-2xl mx-auto mt-10 text-center space-y-5">
            <div className="flex flex-col items-center gap-3 mt-4 text-neutral-300 font-cinzel-dec text-lg md:text-xl tracking-[0.15em] uppercase text-center">
              <p>Ninio Ancestral & Los Barones del Conurbano</p>
              <p className="text-neutral-700 text-xs">❖</p>
              <p>Gugú Petite-Mort</p>
              <p className="text-neutral-700 text-xs">❖</p>
              <p>Materio Primo</p>
              <p className="text-neutral-700 text-xs">❖</p>
              <p>Fiesta</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16 mt-12">
            <div className="text-center">
              <p className="text-neutral-400 font-cinzel-dec text-xl md:text-2xl tracking-widest">MIÉRCOLES 8</p>
              <p className="text-neutral-600 font-cinzel-dec text-lg tracking-[0.2em] uppercase mt-1">DE JULIO</p>
            </div>
            <div className="hidden md:block w-px h-16 bg-gradient-to-b from-transparent via-neutral-700 to-transparent opacity-50"></div>
            <div className="text-center">
              <p className="text-neutral-400 font-cinzel-dec text-xl md:text-2xl tracking-widest">21:00 hs</p>
              <p className="text-neutral-600 font-cinzel-dec text-sm md:text-base tracking-[0.2em] uppercase mt-1">ENTRADAS A LA VENTA</p>
            </div>
          </div>
        </div>

        {/* Transfer Box */}
        <div className="w-full max-w-md mb-6 bg-[#0a0a0c]/80 backdrop-blur-xl border border-neutral-800/60 rounded-sm p-6 shadow-[0_5px_30px_rgba(0,0,0,0.8)] relative text-center">
          <p className="text-neutral-400 font-cinzel-dec text-sm md:text-base tracking-[0.15em] uppercase mb-4">
            Comprar entrada con transferencia
          </p>
          <div className="flex items-center justify-between bg-[#050505] border border-neutral-800 p-3 px-4">
            <span className="text-neutral-200 font-mono tracking-wider text-sm md:text-base">fiesta.pagana</span>
            <button 
              onClick={() => {
                navigator.clipboard.writeText('fiesta.pagana');
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
                setTimeout(() => {
                  window.location.href = '/confirmacion';
                }, 10000);
              }}
              className="text-xs text-neutral-500 hover:text-white transition-colors uppercase tracking-[0.1em]"
            >
              {copied ? 'Copiado' : 'Copiar'}
            </button>
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
            "ENTRADAS ANTICIPADAS: $20.000"
          </p>

          {step === 1 ? (
            <form onSubmit={handleRequestCode} className="space-y-6">
              <div className="space-y-2">
                <label className="text-neutral-500 text-xs uppercase tracking-[0.2em] pl-1 font-cinzel-dec">Nombre y Apellido</label>
                <input
                  type="text"
                  required
                  placeholder="Tu nombre"
                  className="w-full px-4 py-3 bg-[#050505] text-neutral-300 rounded-none border-b border-neutral-800 focus:outline-none focus:border-neutral-500 focus:bg-[#080808] transition-all font-light placeholder:text-neutral-700 placeholder:font-cinzel-dec placeholder:italic"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-neutral-500 text-xs uppercase tracking-[0.2em] pl-1 font-cinzel-dec">Mail</label>
                <input
                  type="email"
                  required
                  placeholder="Tu correo de contacto"
                  className="w-full px-4 py-3 bg-[#050505] text-neutral-300 rounded-none border-b border-neutral-800 focus:outline-none focus:border-neutral-500 focus:bg-[#080808] transition-all font-light placeholder:text-neutral-700 placeholder:font-cinzel-dec placeholder:italic"
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
                className="w-full py-4 mt-2 bg-transparent hover:bg-[#111] text-neutral-300 font-cinzel-dec tracking-[0.3em] text-lg transition-all disabled:opacity-50 border border-neutral-700/50 hover:border-neutral-400/80 hover:text-white shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"
              >
                {statusText}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyAndCheckout} className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-cinzel-dec text-neutral-300 text-center mb-2 tracking-widest">CÓDIGO DE VERIFICACIÓN</h2>
              <p className="text-neutral-500 text-xs mb-8 text-center tracking-wider leading-relaxed">Te enviamos un código de acceso a <br /><span className="text-neutral-300 italic">{email}</span></p>

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
                className="w-full py-4 mt-2 bg-transparent hover:bg-[#111] text-neutral-300 font-cinzel-dec tracking-[0.3em] text-lg transition-all disabled:opacity-50 border border-neutral-700/50 hover:border-neutral-400/80 hover:text-white shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"
              >
                {statusText}
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => { setStep(1); setErrorMsg(''); setStatusText('COMPRAR'); }}
                className="w-full pt-4 bg-transparent text-neutral-600 text-xs hover:text-neutral-300 transition-colors disabled:opacity-50 tracking-[0.2em] uppercase font-cinzel-dec"
              >
                Volver al inicio
              </button>
            </form>
          )}
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
