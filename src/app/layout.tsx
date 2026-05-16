import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "EA YAMMIR FF",
  description: "Configurador PRO VIP",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent", // 👈 REGLA 1: La barra de iOS se vuelve de cristal puro
    title: "EA Yammir",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // 👈 Previene zoom accidental
  viewportFit: "cover", // 👈 REGLA 1: Rompe las áreas seguras y expande al 100% físico
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="dark">
      {/* El body no debe tener paddings globales para no romper el Edge-to-Edge */}
      <body className={`${inter.variable} bg-black text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
