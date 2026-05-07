"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Particles() {
  const [particles, setParticles] = useState<{ id: number; size: number; x: number; duration: number }[]>([]);

  // Generamos las partículas solo en el cliente (Navegador)
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 15 : 30; // Menos partículas en móvil para cuidar la batería

    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      size: Math.random() * 3 + 2,
      x: Math.random() * 100,
      duration: Math.random() * 10 + 15,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Tus gradientes de fondo de auth.css */}
      <div className="absolute top-[30%] left-[20%] w-[500px] h-[500px] bg-orange-500/10 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-[70%] left-[80%] w-[400px] h-[400px] bg-amber-500/10 blur-[100px] rounded-full -translate-x-1/2 -translate-y-1/2" />

      {/* Las partículas flotantes */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: "110vh", x: `${p.x}vw`, opacity: Math.random() * 0.5 + 0.3 }}
          animate={{ y: "-10vh", x: `${p.x + (Math.random() * 10 - 5)}vw` }}
          transition={{ duration: p.duration, repeat: Infinity, ease: "linear" }}
          style={{
            width: p.size,
            height: p.size,
            background: "radial-gradient(circle, rgba(255,107,53,1) 0%, rgba(255,107,53,0) 70%)",
            borderRadius: "50%",
            position: "absolute",
            boxShadow: "0 0 10px rgba(255,107,53,0.5)",
          }}
        />
      ))}
    </div>
  );
}
