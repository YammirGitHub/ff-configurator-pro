"use client";

import { useEffect, useState } from "react";

export function StatusBarGlass() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 15);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-40 pointer-events-none transition-opacity duration-500 will-change-[opacity,backdrop-filter] ${
        isScrolled ? "opacity-100" : "opacity-0"
      }`}
      style={{
        // Altura dinámica: Cubre el notch + espacio extra para el difuminado
        height:
          "calc(var(--spacing-safe-top, env(safe-area-inset-top)) + 80px)",

        // 1. LA MAGIA DE APPLE: Desenfoque + Saturación alta
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",

        // 2. EL VIDRIO: Un tinte sutil oscuro (ya que tu PWA es Dark Mode)
        backgroundColor: "rgba(10, 12, 20, 0.4)",

        // 3. EL DESVANECIMIENTO: Se derrite suavemente hacia abajo (sin cortes rectos)
        maskImage:
          "linear-gradient(to bottom, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)",
      }}
    />
  );
}
