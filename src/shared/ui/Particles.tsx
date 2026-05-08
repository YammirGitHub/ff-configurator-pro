"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Particles() {
  const [particles, setParticles] = useState<
    { id: number; size: number; x: number; duration: number }[]
  >([]);

  // Generamos las partículas solo en el cliente (Navegador)
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    // Límite estricto y seguro: 12 en móvil para fluidez absoluta, 25 en PC
    const count = isMobile ? 12 : 25;

    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      size: Math.random() * 3 + 2, // Partículas más finas
      x: Math.random() * 100,
      duration: Math.random() * 12 + 15, // Movimiento un poco más lento y elegante
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 🔥 OPTIMIZACIÓN 1: ADIÓS AL BLUR
        Reemplazamos el 'blur-[120px]' que calcina la GPU por un radial-gradient nativo.
        Visualmente es idéntico, pero a nivel de procesador el costo es CERO.
      */}
      <div className="absolute top-[30%] left-[20%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(249,115,22,0.06)_0%,transparent_60%)] rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-[70%] left-[80%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(245,158,11,0.06)_0%,transparent_60%)] rounded-full -translate-x-1/2 -translate-y-1/2" />

      {/* Las partículas flotantes optimizadas */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            y: "110vh",
            x: `${p.x}vw`,
            opacity: Math.random() * 0.4 + 0.2,
          }}
          animate={{ y: "-10vh", x: `${p.x + (Math.random() * 10 - 5)}vw` }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            width: p.size,
            height: p.size,
            // 🔥 OPTIMIZACIÓN 2: Color sólido con opacidad en lugar de radial-gradient por partícula
            backgroundColor: "rgba(255,107,53,0.7)",
            borderRadius: "50%",
            position: "absolute",
            // 🔥 OPTIMIZACIÓN 3: Eliminamos el boxShadow y activamos Hardware Acceleration
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
}
