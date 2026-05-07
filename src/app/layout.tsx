import { DeviceProvider } from "@/entities/device/DeviceContext";
import { InstallPWA } from "@/shared/ui/InstallPWA"; // 👈 Añadimos la importación que faltaba
import { Navbar } from "@/shared/ui/Navbar";
import { Particles } from "@/shared/ui/Particles";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "EA YAMMIR FF | Configurador PRO",
  description:
    "Sensibilidad perfecta para Free Fire. IA optimizada para dar todo rojo.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "YAMMIR FF",
  },
  openGraph: {
    title: "EA YAMMIR FF | Configurador PRO",
    description:
      "Configuración precisa y matemática para dar TODO ROJO en Free Fire.",
    siteName: "EA YAMMIR FF",
    images: [
      {
        url: "/assets/preview.png",
        width: 1200,
        height: 630,
        alt: "Preview del Configurador PRO",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EA YAMMIR FF | Configurador PRO",
    description: "Calculadora de sensibilidad PRO para Free Fire.",
    images: ["/assets/preview.png"],
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
      <body
        className={`${inter.variable} min-h-screen text-zinc-50 antialiased bg-[#07080f]`}
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
