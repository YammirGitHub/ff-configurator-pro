"use client";

import { triggerHaptic } from "@/shared/utils/haptics";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation"; // 👈 IMPORTAR
import { useState } from "react";
export function PullToRefresh({ children }: { children: React.ReactNode }) {
  const [startY, setStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter(); // 👈 INICIAR ROUTER
  // Distancia necesaria para activar la recarga
  const THRESHOLD = 90;

  const handleTouchStart = (e: React.TouchEvent) => {
    // Solo permitimos jalar si estamos en el tope absoluto de la página
    if (window.scrollY <= 0) {
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY > 0 && !isRefreshing && window.scrollY <= 0) {
      const currentY = e.touches[0].clientY;
      const distance = currentY - startY;

      // Si jala hacia abajo
      if (distance > 0) {
        // Frenamos visualmente un poco la distancia para que se sienta "pesado/premium"
        setPullDistance(Math.min(distance * 0.5, THRESHOLD + 20));
      }
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance >= THRESHOLD && !isRefreshing) {
      // 1. Activamos recarga
      setIsRefreshing(true);
      triggerHaptic("success");
      // 👈 FIX: Soft Refresh inmersivo
      router.refresh(); // Actualiza Server Components en segundo plano
      // 2. Simulamos tiempo de espera visual y recargamos
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } else {
      // Si no jaló lo suficiente, se cancela
      setPullDistance(0);
    }
    setStartY(0);
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="w-full min-h-[100dvh]"
    >
      <AnimatePresence>
        {(pullDistance > 0 || isRefreshing) && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{
              opacity: 1,
              // Baja dinámicamente con tu dedo, se clava en 40px si refresca
              y: isRefreshing ? 40 : Math.max(0, pullDistance - 40),
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed left-1/2 z-[100] flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-[#0d0f1a] border border-[#ff6b35]/30 shadow-[0_4px_20px_rgba(255,107,53,0.4)] backdrop-blur-xl"
            style={{ top: "env(safe-area-inset-top)" }}
          >
            <motion.div
              animate={{ rotate: isRefreshing ? 360 : pullDistance * 2 }}
              transition={
                isRefreshing
                  ? { repeat: Infinity, duration: 0.6, ease: "linear" }
                  : { type: "spring", stiffness: 200 }
              }
              className="text-xl"
            >
              {isRefreshing ? "⏳" : "💎"}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </div>
  );
}
