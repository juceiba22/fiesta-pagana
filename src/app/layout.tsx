import type { Metadata } from "next";
import { Cinzel, Cinzel_Decorative } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" });
const cinzelDecorative = Cinzel_Decorative({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-cinzel-dec",
});

export const metadata: Metadata = {
  title: "Fiesta Pagana | Entradas",
  description: "Adquirí tus entradas para la Fiesta Pagana. Una noche donde la poesía y la música se vuelven ritual.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${cinzel.variable} ${cinzelDecorative.variable}`}>
      <body className="antialiased bg-black text-neutral-200">
        {children}
      </body>
    </html>
  );
}
