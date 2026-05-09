"use client";

import { auth, db } from "@/shared/config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { GlassCard } from "./GlassCard";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

export function PremiumModal({
  isOpen,
  onClose,
  userEmail,
}: PremiumModalProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const yapeNumber = "930202704";
  const whatsappNumber = "51930202704";
  const amount = "10.00";

  const whatsappMessage = encodeURIComponent(
    `🔥 ¡Hola Yammir! Acabo de hacer mi Yape/Plin para el acceso VIP 💎.\n\n📧 Mi correo en la app es: ${userEmail}\n\n👉 Adjunto la captura de pago!`,
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const handleRedeem = async () => {
    if (!code.trim()) return setError("⚠️ Ingresa tu código de voucher.");
    setLoading(true);
    setError("");

    try {
      const codeRef = doc(db, "vip_codes", code.trim().toUpperCase());
      const codeSnap = await getDoc(codeRef);

      if (!codeSnap.exists()) {
        throw new Error("❌ Código inválido.");
      }

      if (codeSnap.data().usado) {
        throw new Error("🚫 Código ya activado.");
      }

      await updateDoc(codeRef, { usado: true });

      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          activo: true,
          rol: "vip",
        });

        alert("🎉 ¡BIENVENIDO AL MODO VIP EXCLUSIVO!");
        window.location.reload();
      }
    } catch (e: any) {
      setError(e.message || "Error al canjear.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#07080f]/95 backdrop-blur-sm font-body"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="w-full max-w-xl"
          >
            <GlassCard className="relative p-6 sm:p-8 lg:p-10 border-[#ffd700]/20 shadow-[0_0_60px_rgba(255,107,53,0.1)] overflow-hidden">
              {/* Cierre */}
              <button
                onClick={onClose}
                className="absolute top-5 right-5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-zinc-500 hover:bg-red-500/20 hover:text-red-400 active:scale-95 transition-colors"
              >
                ✕
              </button>

              {/* CABECERA */}
              <div className="relative z-10 text-center mb-8 lg:mb-10">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#ffd700]/10 bg-[#ffd700]/5 text-[10px] font-black uppercase tracking-widest text-[#ffd700] mb-3">
                  💎 ACCESO VIP DE POR VIDA
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-black text-white leading-tight">
                  Desbloquea el{" "}
                  <span className="bg-gradient-to-r from-[#ffd700] to-[#f7931e] bg-clip-text text-transparent">
                    Modo PRO
                  </span>
                </h2>
                <p className="mt-3 font-body text-xs sm:text-sm font-semibold text-zinc-400 max-w-md mx-auto">
                  Configuraciones calculadas por IA, optimización extrema y
                  ventajas exclusivas en Free Fire.
                </p>
              </div>

              {/* ZONA DE PAGO (Flexbox Robusto) */}
              <div className="relative z-10 bg-[#141728]/60 rounded-3xl border border-white/5 p-6 mb-8 shadow-inner">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* QR Container - FIJO Y SEGURO */}
                  <div className="relative w-[140px] h-[140px] aspect-square rounded-2xl border border-white/10 bg-[#0e1020] p-2 shadow-inner flex-shrink-0 group overflow-hidden">
                    <Image
                      src="/yape-qr.jpg"
                      alt="QR Yape/Plin"
                      fill
                      priority // 👈 Carga prioritaria
                      className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Fallback visual si no hay imagen */}
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-zinc-700 bg-[#0e1020] rounded-lg z-[-1]">
                      yape-qr.jpg
                    </div>
                  </div>

                  {/* Datos - ESPACIADO MEJORADO */}
                  <div className="flex-1 w-full text-center sm:text-left space-y-4">
                    <div>
                      <p className="text-[10px] font-bold text-[#8b8fa5] uppercase tracking-widest mb-1">
                        Pago Único
                      </p>
                      <p className="font-display text-3xl font-black text-[#ff6b35]">
                        S/ <span className="text-4xl">10.00</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 justification-center sm:justify-start">
                      <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-zinc-100 flex items-center gap-1.5">
                        💜 Yape
                      </div>
                      <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-zinc-100 flex items-center gap-1.5">
                        💙 Plin
                      </div>
                    </div>

                    <p className="font-mono text-base lg:text-lg font-bold text-white tracking-wider flex items-center justify-center sm:justify-start gap-2">
                      {yapeNumber}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(yapeNumber);
                          alert("✅ Número copiado!");
                        }}
                        className="text-[11px] text-[#ff6b35] font-black hover:text-white transition-colors p-1"
                      >
                        (Copiar)
                      </button>
                    </p>
                  </div>
                </div>

                <div className="relative my-6 h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />

                {/* BOTÓN WHATSAPP CORREGIDO Y SENIOR */}
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-full flex items-center justify-center gap-2.5 bg-[#25D366] text-white text-[13px] font-black uppercase tracking-wider py-4 rounded-xl transition-all shadow-[0_8px_20px_rgba(37,211,102,0.25)] hover:shadow-[0_12px_25px_rgba(37,211,102,0.35)] active:scale-[0.98]"
                >
                  {/* Logo SVG Oficial de WhatsApp Embedido */}
                  <svg
                    className="h-5 w-5 transition-transform group-hover:scale-110"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12.004 2c-5.523 0-10 4.477-10 10a9.982 9.982 0 0 0 1.465 5.148l-1.465 5.352 5.512-1.445A9.967 9.967 0 0 0 12.004 22c5.523 0 10-4.477 10-10s-4.477-10-10-10zm0 18c-1.777 0-3.441-.466-4.893-1.28l-.35-.196-3.255.853.868-3.167-.215-.342A7.957 7.957 0 0 1 4.004 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                    <path d="M17.152 14.887c-.28-.141-1.652-.816-1.908-.91-.256-.094-.442-.141-.628.141-.186.281-.722.91-.885 1.097-.163.186-.326.21-.606.069-.28-.141-1.18-.435-2.247-1.387-.83-.74-1.39-1.653-1.553-1.933-.163-.28-.018-.431.122-.57.126-.125.28-.326.42-.489.141-.163.186-.28.28-.466.094-.186.047-.35-.024-.489-.07-.141-.628-1.516-.861-2.074-.227-.54-.457-.466-.628-.475-.171-.008-.367-.009-.563-.009-.196 0-.516.074-.786.374-.27.301-1.033 1.011-1.033 2.466 0 1.455 1.056 2.861 1.201 3.05 1.455 1.908 3.334 2.89 3.567 2.99 1.123.479 1.637.527 2.223.44.596-.088 1.653-.676 1.886-1.328.233-.653.233-1.21.163-1.328-.07-.119-.256-.187-.536-.328z" />
                  </svg>
                  Enviar Captura por WhatsApp
                </a>
              </div>

              {/* SECCIÓN DE CANJE (Limpia) */}
              <div className="relative z-10 border-t border-dashed border-white/10 pt-7">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mb-4 text-center sm:text-left">
                  <h3 className="font-display text-xs lg:text-sm font-bold uppercase tracking-widest text-[#ffd36b]">
                    🎟️ ¿Ya tienes tu código VIP?
                  </h3>
                  <p className="text-[11px] text-zinc-500 font-medium">
                    Ingresa el voucher que te dio Yammir
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="text"
                    placeholder="VIP-XXXX-XXXX"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="flex-1 bg-black/50 border border-white/10 rounded-xl px-5 py-3.5 text-sm font-mono text-zinc-100 uppercase outline-none focus:border-[#ffd700]/50 transition-all placeholder:text-zinc-700"
                  />
                  <button
                    onClick={handleRedeem}
                    disabled={loading}
                    className="bg-gradient-to-r from-[#ffd700] to-[#f7931e] text-[#4a3000] text-[12px] sm:text-[13px] font-black uppercase tracking-wider py-3.5 sm:py-0 px-6 rounded-xl hover:brightness-110 active:scale-95 disabled:pointer-events-none disabled:opacity-50 transition-all shadow-[0_4px_12px_rgba(255,215,0,0.3)] disabled:shadow-none"
                  >
                    {loading ? "..." : "Canjear"}
                  </button>
                </div>
                {error && (
                  <p className="text-[11px] text-red-400 mt-2.5 font-semibold text-center sm:text-left">
                    {error}
                  </p>
                )}
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
