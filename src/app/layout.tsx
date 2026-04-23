import type { Metadata } from "next";
import { Inter, IM_Fell_English_SC } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fellEnglish = IM_Fell_English_SC({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-fell",
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
    <html lang="es" className={`${inter.variable} ${fellEnglish.variable}`}>
      <body className="antialiased bg-black text-neutral-200">
        {children}
      </body>
    </html>
  );
}
