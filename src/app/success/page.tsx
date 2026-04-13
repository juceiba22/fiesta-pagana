export default function SuccessPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-6xl">🎉</div>
        <h1 className="text-4xl font-extrabold tracking-tighter">
          ENTRADA CONFIRMADA!
        </h1>
        <p className="text-neutral-400 font-light text-lg">
          Nos vemos el 8 de Julio en Club Napoles.
        </p>
        <a href="/" className="inline-block mt-4 px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 transition-colors">
          Volver al inicio
        </a>
      </div>
    </main>
  );
}
