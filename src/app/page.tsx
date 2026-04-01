
'use client'

import { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email })
      });

      const data = await response.json();
      console.log("RESPONSE:", data);

      const { url } = data;

      if (url) {
        window.location.href = url; // Redirect a Mercado Pago
      } else {
        alert("Hubo un error contactando a Mercado Pago.");
      }
    } catch (error) {
      console.error(error);
      alert("Error procesando pago.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      <div className="max-w-md w-full text-center space-y-8 animate-fade-in">
        <div className="space-y-2">
          <h1 className="text-6xl font-extrabold tracking-tighter sm:text-7xl">
            FIESTA PAGANA
          </h1>
          <p className="text-neutral-400 text-lg sm:text-xl font-light tracking-wide">
            15 NOVIEMBRE | SECRET LOCATION
          </p>
        </div>

        <form onSubmit={handleCheckout} className="space-y-4 pt-8">
          <input
            type="text"
            required
            placeholder="Tu nombre completo"
            className="w-full px-4 py-3 bg-neutral-900 text-white rounded-xl border border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-500 transition-all font-light placeholder:text-neutral-600"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <input
            type="email"
            required
            placeholder="Introduce tu e-mail"
            className="w-full px-4 py-3 bg-neutral-900 text-white rounded-xl border border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-500 transition-all font-light placeholder:text-neutral-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-4 bg-white text-black font-semibold tracking-wide text-lg rounded-xl hover:bg-neutral-200 transition-colors disabled:opacity-50"
          >
            {loading ? 'PROCESANDO...' : 'COMPRAR ENTRADA'}
          </button>
        </form>
      </div>
    </main>
  );
}
