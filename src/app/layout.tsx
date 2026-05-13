import { DeviceProvider } from "@/entities/device/DeviceContext";
import { InstallPWA } from "@/shared/ui/InstallPWA";
import { Navbar } from "@/shared/ui/Navbar";
import { Particles } from "@/shared/ui/Particles";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "EA YAMMIR FF - CONFIGURADOR PRO V2.0",
  description:
    "💎 Tu Ventaja VIP en Free Fire. Optimización de rendimiento y canje de códigos diarios.",

  // 🍎 Configuración para que en iPhone se vea como una App Real
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Yammir Sens",
  },

  // 🌐 Configuración Open Graph (Lo que se ve al pasar el link por WhatsApp)
  openGraph: {
    title: "EA YAMMIR FF - CONFIGURADOR PRO",
    description: "💎 Activa tu ventaja VIP. Optimización extrema sin lag.",
    url: "https://tu-dominio.vercel.app", // Cámbialo por tu URL real de Vercel luego
    siteName: "EA Yammir FF",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "EA YAMMIR FF Preview",
      },
    ],
    locale: "es_PE",
    type: "website",
  },

  // 🐦 Twitter (Por si lo compartes por ahí)
  twitter: {
    card: "summary_large_image",
    title: "EA YAMMIR FF PRO",
    images: ["/og-image.png"],
  },

  // 📱 Iconos de acceso directo
  icons: {
    icon: "/icon.png",
    apple: "/icon.png", // Muy importante para iOS
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#07080f",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="dark">
      {/* 👇 FIX 1: 100dvh en el body universal */}
      <body
        className={`${inter.variable} min-h-[100dvh] text-zinc-50 antialiased bg-[#07080f]`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[-2] overflow-hidden"
        >
          <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(255,107,53,0.12)_0%,transparent_70%)]" />
        </div>

        <Particles />

        <DeviceProvider>
          <Navbar />
          <InstallPWA />
          <main className="mx-auto w-full max-w-[1400px]">{children}</main>
        </DeviceProvider>
      </body>
    </html>
  );
}
