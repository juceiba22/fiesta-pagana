'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Vuelve a pedir la página cada 15 s para mostrar el QR apenas se aprueba el pago.
export default function AutoRefresh() {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => router.refresh(), 15000);
    return () => clearInterval(interval);
  }, [router]);

  return null;
}
