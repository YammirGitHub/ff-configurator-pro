"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true); // Asumimos true para evitar parpadeos, luego verificamos
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    // 1. Verificar si ya estamos dentro de la App Instalada (Standalone)
    const checkStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    setIsStandalone(checkStandalone);

    if (checkStandalone) return; // Si ya está instalada, no hacemos nada más

    // 2. Lógica para ANDROID (Capturamos el evento nativo)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // 3. Lógica para iOS (Detectamos si es iPhone/iPad)
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

    if (isIOS) {
      setShowIOSPrompt(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  // Si ya se instaló o el usuario lo cerró, no mostramos nada
  if (isStandalone || closed) return null;

  return (
    <AnimatePresence>
      {/* 🤖 BANNER PARA ANDROID */}
      {deferredPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 left-0 right-0 z-[100] mx-auto w-max max-w-[90%] px-4"
        >
          <div className="flex items-center gap-4 rounded-2xl border border-[#ff6b35]/30 bg-[#0d0f1a]/95 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff6b35] to-[#f7931e] text-xl shadow-inner">
              💎
            </div>
            <div className="flex flex-col">
              <p className="font-display text-[13px] font-black text-white">
                Instalar EA YAMMIR FF
              </p>
              <p className="text-[10px] font-semibold text-zinc-400">
                Experiencia VIP sin lag
              </p>
            </div>
            <div className="flex items-center gap-2 ml-2">
              <button
                onClick={() => setClosed(true)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-zinc-400 transition-colors hover:bg-white/10"
              >
                ✕
              </button>
              <button
                onClick={handleInstallClick}
                className="rounded-xl bg-[#ff6b35] px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white shadow-lg active:scale-95 transition-transform"
              >
                Instalar
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* 🍎 BANNER INSTRUCTIVO PARA IOS (IPHONE) */}
      {showIOSPrompt && !deferredPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 left-0 right-0 z-[100] mx-auto w-full max-w-[400px] px-4"
        >
          <div className="relative flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-[#0d0f1a]/95 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl">
            <button
              onClick={() => setClosed(true)}
              className="absolute right-3 top-3 text-zinc-500 hover:text-white"
            >
              ✕
            </button>
            <div className="flex items-center gap-3 w-full">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/5 text-xl">
                🍏
              </div>
              <div className="flex-1">
                <p className="font-display text-[12px] font-black text-white leading-tight">
                  Instala la App en tu iPhone
                </p>
                <p className="text-[10px] font-medium text-zinc-400 mt-0.5 leading-snug">
                  Para no perder el VIP, instálala nativamente.
                </p>
              </div>
            </div>

            <div className="mt-1 w-full rounded-xl border border-white/5 bg-white/[0.02] p-3">
              <p className="text-[11px] font-semibold text-zinc-300 flex items-center gap-2">
                1. Toca el botón Compartir{" "}
                <svg
                  className="w-4 h-4 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
              </p>
              <p className="text-[11px] font-semibold text-zinc-300 flex items-center gap-2 mt-2">
                2. Selecciona{" "}
                <span className="bg-white/10 px-1.5 py-0.5 rounded text-white text-[10px]">
                  Agregar a Inicio
                </span>{" "}
                <span className="text-xl">➕</span>
              </p>
            </div>
          </div>
          {/* Triangulito apuntando hacia abajo en iOS */}
          <div className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b border-r border-white/10 bg-[#0d0f1a]/95 backdrop-blur-xl" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
