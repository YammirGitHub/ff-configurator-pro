import { DeviceProvider } from "@/entities/device/DeviceContext";
import { InstallPWA } from "@/shared/ui/InstallPWA";
import { Navbar } from "@/shared/ui/Navbar";
import { Particles } from "@/shared/ui/Particles";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// 1. Configuración de la "Cáscara" de la App (Apple y Manifest)
export const metadata: Metadata = {
  title: "EA YAMMIR FF - CONFIGURADOR PRO V2.0",
  description: "💎 Tu Ventaja VIP en Free Fire. Optimización de rendimiento.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent", // 👈 Permite que el fondo suba detrás de la hora
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

// 2. Configuración física de la pantalla (El "Asesino" de bordes negros)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover", // 👈 CRÍTICO: Obliga a la web a usar el área del Notch
  themeColor: "#07080f", // 👈 Camuflaje para la barra de Android/Chrome
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="dark">
      {/* El body debe tener el mismo color que la barra para que no haya cortes */}
      <body
        className={`${inter.variable} bg-[#07080f] text-zinc-50 antialiased`}
      >
        {/* Resplandor de fondo inmersivo */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[-2] overflow-hidden"
        >
          <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(255,107,53,0.12)_0%,transparent_70%)]" />
        </div>

        <Particles />

        <div
          id="native-scroll"
          className="absolute inset-0 w-full overflow-y-auto overflow-x-hidden"
        >
          <DeviceProvider>
            <Navbar />
            <InstallPWA />
            <main className="mx-auto w-full max-w-[1400px]">{children}</main>
          </DeviceProvider>
        </div>
      </body>
    </html>
  );
}
