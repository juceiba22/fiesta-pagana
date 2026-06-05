export default function Confirmacion() {
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

      <div className="relative z-10 w-full max-w-3xl mx-auto px-6 py-12 flex flex-col items-center animate-fade-in">
        <div className="w-full bg-[#0a0a0c]/80 backdrop-blur-xl border border-neutral-800/60 rounded-sm p-8 sm:p-12 shadow-[0_10px_50px_rgba(0,0,0,0.8)] relative text-center">
          
          {/* Subtle ornate corners (pure CSS) */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-neutral-600/40" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-neutral-600/40" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-neutral-600/40" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-neutral-600/40" />

          <h2 className="text-2xl md:text-3xl font-cinzel-dec text-neutral-200 tracking-widest leading-relaxed mb-6">
            ¿Ya hiciste la transferencia?
          </h2>
          <p className="text-neutral-400 text-sm md:text-base font-light tracking-[0.1em] leading-loose">
            ¡Compartile el comprobante a alguien del staff de la Fiesta Pagana y te anotamos en la lista!
          </p>
        </div>
      </div>
    </main>
  );
}
