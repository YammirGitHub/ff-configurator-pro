"use client";

import { useEffect, useState } from "react";

export function StatusBarGlass() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 15);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // LA TÉCNICA "STACKED BLUR" (El Anti-Bug de Safari iOS)
  // Apilamos tiras de cristal con desenfoque descendente para crear el "Progressive Blur".
  return (
    <div
      className={`fixed top-0 left-0 right-0 z-40 flex flex-col pointer-events-none transition-opacity duration-500 will-change-opacity ${
        isScrolled ? "opacity-100" : "opacity-0"
      }`}
      style={{
        // Cubre la cámara (Notch) + 36px adicionales para la caída suave
        height: "calc(max(env(safe-area-inset-top), 24px) + 36px)",
      }}
    >
      {/* 1. ZONA DE BATERÍA/HORA: Cristal fuerte para legibilidad */}
      <div
        className="w-full flex-1"
        style={{
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          backgroundColor: "rgba(7, 8, 15, 0.45)",
        }}
      />

      {/* 2. CAÍDA MEDIA: Comienza el desvanecimiento */}
      <div
        className="w-full h-3"
        style={{
          backdropFilter: "blur(12px) saturate(140%)",
          WebkitBackdropFilter: "blur(12px) saturate(140%)",
          backgroundColor: "rgba(7, 8, 15, 0.25)",
        }}
      />

      {/* 3. CAÍDA LIGERA: El cristal se hace casi transparente */}
      <div
        className="w-full h-3"
        style={{
          backdropFilter: "blur(6px) saturate(110%)",
          WebkitBackdropFilter: "blur(6px) saturate(110%)",
          backgroundColor: "rgba(7, 8, 15, 0.1)",
        }}
      />

      {/* 4. CAÍDA FINAL: Desenfoque mínimo antes de desaparecer */}
      <div
        className="w-full h-3"
        style={{
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
          backgroundColor: "rgba(7, 8, 15, 0.03)",
        }}
      />
    </div>
  );
}
