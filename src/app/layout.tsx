import { DeviceProvider } from "@/entities/device/DeviceContext";
import { InstallPWA } from "@/shared/ui/InstallPWA";
import { Navbar } from "@/shared/ui/Navbar";
import { Particles } from "@/shared/ui/Particles";
import { ProgressiveBlur } from "@/shared/ui/ProgressiveBlur";
import { PullToRefresh } from "@/shared/ui/PullToRefresh";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// 👇 FIX: Sin barra diagonal (/) al final para evitar la doble barra (//) en las imágenes Open Graph
const SITE_URL = "https://configurador-pro-ea-yammir-ff.netlify.app";

export const metadata: Metadata = {
  title: "EA YAMMIR FF - CONFIGURADOR PRO",
  description: "💎 Tu Ventaja VIP en Free Fire.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "EA Yammir FF",
  },
  icons: { icon: "/icon.png", apple: "/icon.png" },

  // 👇 BANNER MASTER FIX (Open Graph)
  openGraph: {
    title: "EA YAMMIR FF - CONFIGURADOR PRO",
    description: "💎 Tu Ventaja VIP en Free Fire.",
    url: SITE_URL,
    siteName: "EA Yammir FF",
    images: [
      {
        url: `${SITE_URL}/og-image.jpeg`, // Genera la ruta exacta y limpia
        width: 1200,
        height: 630,
        alt: "Configurador PRO EA Yammir FF",
      },
    ],
    locale: "es_ES",
    type: "website",
  },

  // 👇 TWITTER/X BANNER CARD
  twitter: {
    card: "summary_large_image",
    title: "EA YAMMIR FF - CONFIGURADOR PRO",
    description: "💎 Tu Ventaja VIP en Free Fire.",
    images: [`${SITE_URL}/og-image.jpeg`],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover", // Inmersión Edge-to-Edge nativa
  themeColor: "#07080f", // Fondo oscuro blindado en Safari/Chrome
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${inter.variable} bg-[#07080f] text-zinc-50 antialiased min-h-[100dvh]`}
      >
        {/* Fondo inmersivo con gradiente y partículas */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[-2] overflow-hidden bg-[#07080f]"
        >
          <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(255,107,53,0.12)_0%,transparent_70%)]" />
        </div>

        <Particles />

        <DeviceProvider>
          <ProgressiveBlur />
          <Navbar />
          <InstallPWA />

          <PullToRefresh>
            <main className="mx-auto w-full max-w-[1400px] pb-safe-bottom">
              {children}
            </main>
          </PullToRefresh>
        </DeviceProvider>
      </body>
    </html>
  );
}
