"use client";

import { useEffect, useState } from "react";

export function StatusBarGlass() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Escucha pasiva para no bloquear los 60fps del scroll en móviles
    const handleScroll = () => setIsScrolled(window.scrollY > 15);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-40 pointer-events-none transition-opacity duration-500 ${
        isScrolled ? "opacity-100" : "opacity-0"
      }`}
      style={{
        // Altura a prueba de balas: Toma la cámara dinámica o un mínimo de 24px + el área de difuminado
        height: "calc(max(env(safe-area-inset-top), 24px) + 80px)",

        // 🍎 FIX SAFARI iOS & IPAD: Obliga al navegador a usar la GPU para renderizar el cristal.
        // Sin esto, Safari rompe el "Progressive Blur".
        transform: "translate3d(0, 0, 0)",
        WebkitTransform: "translate3d(0, 0, 0)",
        willChange: "opacity", // Optimización para Android Chrome

        // 1. LA MAGIA DE APPLE: Desenfoque alto + Saturación para que los colores brillen a través
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",

        // 2. EL VIDRIO: Tinte sutil oscuro (Funde con tu tema Dark)
        backgroundColor: "rgba(7, 8, 15, 0.4)",

        // 3. EL DESVANECIMIENTO CRUZADO (Compatibilidad Universal Cross-Browser)
        maskImage:
          "linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)",
        WebkitMaskImage:
          "-webkit-linear-gradient(top, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)",
      }}
    />
  );
}
