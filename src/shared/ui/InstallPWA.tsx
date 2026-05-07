"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Escucha el evento nativo del navegador que avisa que la app se puede instalar
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsVisible(false); // Si aceptó instalarla, ocultamos el banner
    }
    setDeferredPrompt(null);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: "spring", bounce: 0.4 }}
          className="fixed bottom-6 left-0 right-0 z-[100] mx-auto w-full max-w-[400px] px-4"
        >
          <div className="flex items-center justify-between gap-4 rounded-[20px] border border-[#ff6b35]/30 bg-[#0e1020]/95 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff6b35] to-[#f7931e] text-2xl shadow-inner">
                📲
              </div>
              <div>
                <p className="font-display text-[15px] font-black leading-tight text-white">
                  Instalar App VIP
                </p>
                <p className="text-[11px] font-medium text-zinc-400">
                  Acceso rápido sin navegador
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsVisible(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
              <button
                onClick={handleInstall}
                className="rounded-xl bg-[#ff6b35] px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-white shadow-[0_4px_15px_rgba(255,107,53,0.4)] transition-all hover:scale-105 hover:bg-[#ff7b4c] active:scale-95"
              >
                Instalar
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
