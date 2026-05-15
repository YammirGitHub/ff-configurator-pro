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

  // 👇 ESTA ES LA LLAVE MAESTRA QUE LE FALTABA A NEXT.JS PARA IOS
  manifest: "/manifest.json",

  // 🍎 Configuración para que en iPhone se vea como una App Real
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Yammir Sens",
  },

  // 🌐 Configuración Open Graph
  openGraph: {
    title: "EA YAMMIR FF - CONFIGURADOR PRO",
    description: "💎 Activa tu ventaja VIP. Optimización extrema sin lag.",
    url: "https://configurador-pro-ea-yammir-ff.netlify.app",
    siteName: "EA Yammir FF",
    images: [
      {
        // 👇 FIX CRÍTICO: Usamos tu .jpeg PERO con la ruta absoluta completa
        url: "https://configurador-pro-ea-yammir-ff.netlify.app/og-image.jpeg",
        width: 1200,
        height: 630,
        alt: "EA YAMMIR FF Preview",
      },
    ],
    locale: "es_PE",
    type: "website",
  },

  // 🐦 Twitter
  twitter: {
    card: "summary_large_image",
    title: "EA YAMMIR FF PRO",
    // 👇 FIX: También aquí .jpeg y ruta completa
    images: ["https://configurador-pro-ea-yammir-ff.netlify.app/og-image.jpeg"],
  },
  // 📱 Iconos
  icons: {
    icon: "/icon.png", // 👈 PNG
    apple: "/icon.png", // 👈 PNG
  },
};

// 👇 LA PIEZA PERDIDA: El controlador del "Notch" y la pantalla completa
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Evita que hagan zoom pellizcando (como app nativa)
  viewportFit: "cover", // 👈 ESTA ES LA MAGIA: Mata el borde negro de iOS
  // 👇 ELIMINAMOS EL themeColor POR COMPLETO AQUÍ
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="dark">
      {/* 👇 FIX: 100dvh en el body universal */}
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
