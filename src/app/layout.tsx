import { DeviceProvider } from "@/entities/device/DeviceContext";
import { InstallPWA } from "@/shared/ui/InstallPWA";
import { Navbar } from "@/shared/ui/Navbar";
import { Particles } from "@/shared/ui/Particles";
import { PullToRefresh } from "@/shared/ui/PullToRefresh";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "EA YAMMIR FF - CONFIGURADOR PRO",
  description: "💎 Tu Ventaja VIP en Free Fire.",
  manifest: "/manifest.json",
  // 🍎 REGLA 1: statusBarStyle en black-translucent permite que el fondo suba
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "EA Yammir FF",
  },
  icons: { icon: "/icon.png", apple: "/icon.png" },
};

// 📱 REGLA 1: viewportFit: "cover" rompe los márgenes blancos en Android/iOS
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#07080f",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${inter.variable} bg-[#07080f] text-zinc-50 antialiased min-h-[100dvh]`}
      >
        {/* Fondo inmersivo global Edge-to-Edge */}
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

          <PullToRefresh>
            {/* El contenedor respeta el Notch (pt-safe-top) y la barra inferior de gestos (pb-safe-bottom) */}
            <main className="mx-auto w-full max-w-[1400px] pb-safe-bottom">
              {children}
            </main>
          </PullToRefresh>
        </DeviceProvider>
      </body>
    </html>
  );
}
