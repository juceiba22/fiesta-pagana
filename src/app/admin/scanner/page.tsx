'use client'

import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function ScannerPage() {
  const [password, setPassword] = useState('');
  const [auth, setAuth] = useState(false);
  
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [statusText, setStatusText] = useState('');
  const [statusType, setStatusType] = useState<'success' | 'error' | 'idle'>('idle');
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password) setAuth(true); 
  };

  useEffect(() => {
    if (!auth) return;

    let scanner: Html5QrcodeScanner | null = null;
    try {
      scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scanner.render(async (decodedText) => {
        if (scanner) scanner.pause(true);
        setScanResult(decodedText);
        setStatusType('idle');
        setStatusText('Verificando...');

        try {
          let ticketId = decodedText;
          // Si el QR tiene la URL completa, extraemos solo el ID
          if (decodedText.includes('/entrada/')) {
            ticketId = decodedText.split('/entrada/')[1];
          }

          const res = await fetch('/api/scan-ticket', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password, ticketId })
          });

          const data = await res.json();
          
          if (res.ok) {
            setStatusType('success');
            setStatusText(`ACCESO PERMITIDO - ${data.ticket.nombre}`);
          } else {
            setStatusType('error');
            setStatusText(`DENEGADO - ${data.error}`);
          }
        } catch (e) {
          setStatusType('error');
          setStatusText('Error de conexión');
        }

        setTimeout(() => {
          setScanResult(null);
          setStatusText('');
          setStatusType('idle');
          if (scanner) scanner.resume();
        }, 3000);

      }, (err) => {
        // Ignoramos errores de lectura continuos
      });
    } catch (e) {
      console.error(e);
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(console.error);
      }
    };
  }, [auth, password]);

  if (!auth) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4">
        <h1 className="text-white font-cinzel-dec mb-6 text-xl text-center">Acceso Seguridad</h1>
        <form onSubmit={handleLogin} className="bg-[#0a0a0c] p-8 rounded border border-neutral-800 w-full max-w-sm shadow-2xl">
          <input 
            type="password" 
            placeholder="Contraseña"
            className="w-full bg-[#050505] border border-neutral-700 p-3 mb-6 text-neutral-200 outline-none focus:border-neutral-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-transparent hover:bg-white text-white hover:text-black border border-white py-3 transition-colors uppercase tracking-widest font-cinzel-dec">
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-4 flex flex-col items-center">
      <h1 className="font-cinzel-dec text-2xl my-6 tracking-widest uppercase">Escáner de Entradas</h1>
      
      <div className="w-full max-w-sm bg-white rounded p-2 mb-6">
        <div id="reader" className="w-full text-black"></div>
      </div>

      {scanResult && (
        <div className={`w-full max-w-sm p-6 text-center rounded border ${
          statusType === 'success' ? 'bg-green-950/50 border-green-500 text-green-400' :
          statusType === 'error' ? 'bg-red-950/50 border-red-500 text-red-400' :
          'bg-neutral-800 border-neutral-600 text-neutral-300'
        }`}>
          <p className="font-mono text-xs opacity-50 mb-4">{scanResult}</p>
          <p className="text-xl font-cinzel-dec uppercase tracking-widest">{statusText}</p>
        </div>
      )}
    </div>
  );
}
