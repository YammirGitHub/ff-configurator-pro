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
    // 👇 CONTENEDOR PADRE: Exclusivo para manejar el desvanecimiento (Máscara) y Hardware Acceleration
    <div
      className={`fixed top-0 left-0 right-0 z-40 pointer-events-none transition-opacity duration-500 will-change-opacity ${
        isScrolled ? "opacity-100" : "opacity-0"
      }`}
      style={{
        height: "calc(max(env(safe-area-inset-top), 24px) + 80px)",
        // La máscara corta el contenido suavemente hacia abajo
        maskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
        WebkitMaskImage:
          "-webkit-linear-gradient(top, black 40%, transparent 100%)",
        // Obliga a Safari a usar la GPU
        transform: "translate3d(0, 0, 0)",
        WebkitTransform: "translate3d(0, 0, 0)",
      }}
    >
      {/* 👇 CONTENEDOR HIJO: Exclusivo para renderizar el Cristal Esmerilado */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          backgroundColor: "rgba(7, 8, 15, 0.4)", // Tinte sutil
        }}
      />
    </div>
  );
}
