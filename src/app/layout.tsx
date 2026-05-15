import { DeviceProvider } from "@/entities/device/DeviceContext";
import { BottomNav } from "@/shared/ui/BottomNav";
import { InstallPWA } from "@/shared/ui/InstallPWA";
import { Navbar } from "@/shared/ui/Navbar";
import { Particles } from "@/shared/ui/Particles";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "EA YAMMIR FF - CONFIGURADOR PRO V2.0",
  description: "💎 Tu Ventaja VIP en Free Fire. Optimización de rendimiento.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent", // Inmersión Edge-to-Edge
    title: "EA Yammir FF",
  },
  icons: { icon: "/icon.png", apple: "/icon.png" },
  openGraph: {
    images: [
      {
        url: "https://configurador-pro-ea-yammir-ff.netlify.app/og-image.jpeg",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover", // Expande el diseño debajo del notch
  themeColor: "#07080f",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${inter.variable} bg-[#07080f] text-zinc-50 antialiased`}
      >
        {/* Fondo fijo detrás de toda la aplicación */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[-2] overflow-hidden bg-[#07080f]"
        >
          <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(255,107,53,0.12)_0%,transparent_70%)]" />
        </div>

        <Particles />

        <DeviceProvider>
          <Navbar />
          <InstallPWA />

          {/* El Túnel Invisible: Centrado y espaciado para no chocar con el BottomNav */}
          <main className="mx-auto w-full max-w-[1400px] pb-24">
            {children}
          </main>

          <BottomNav />
        </DeviceProvider>
      </body>
    </html>
  );
}
