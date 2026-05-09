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
    if (!code.trim()) return setError("⚠️ Ingresa tu voucher.");
    setLoading(true);
    setError("");

    try {
      const codeRef = doc(db, "vip_codes", code.trim().toUpperCase());
      const codeSnap = await getDoc(codeRef);
      if (!codeSnap.exists() || codeSnap.data().usado)
        throw new Error("❌ Voucher inválido o usado.");

      await updateDoc(codeRef, { usado: true });
      if (auth.currentUser) {
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          activo: true,
          rol: "vip",
        });
        alert("🎉 ¡BIENVENIDO AL MODO VIP!");
        window.location.reload();
      }
    } catch (e: any) {
      setError(e.message);
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
          // z-[200] y padding reducido para móviles
          className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 bg-[#07080f]/95 backdrop-blur-sm font-body"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            // max-h-[95vh] es la clave para que no se salga de la pantalla del iPhone
            className="w-full max-w-lg max-h-[95vh] overflow-hidden"
          >
            <GlassCard className="relative flex flex-col h-full border-[#ffd700]/20 shadow-[0_0_60px_rgba(255,107,53,0.1)] p-0">
              {/* Botón de cerrar flotante para no estorbar */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md"
              >
                ✕
              </button>

              {/* CONTENEDOR CON SCROLL INTERNO (Para que quepa en cualquier iPhone) */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-8 custom-scrollbar">
                {/* CABECERA OPTIMIZADA */}
                <div className="text-center mb-6">
                  <span className="inline-block px-3 py-1 rounded-full border border-[#ffd700]/10 bg-[#ffd700]/5 text-[9px] font-black uppercase tracking-widest text-[#ffd700] mb-2">
                    💎 ACCESO VIP ILIMITADO
                  </span>
                  <h2 className="font-display text-xl sm:text-2xl font-black text-white leading-tight">
                    Desbloquea el{" "}
                    <span className="bg-gradient-to-r from-[#ffd700] to-[#f7931e] bg-clip-text text-transparent">
                      Modo PRO
                    </span>
                  </h2>
                </div>

                {/* ZONA DE PAGO COMPACTA */}
                <div className="bg-[#141728]/80 rounded-2xl border border-white/5 p-4 sm:p-6 mb-6">
                  <div className="flex flex-col items-center gap-4 text-center">
                    {/* QR - Tamaño responsivo */}
                    <div className="relative w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] rounded-xl border border-white/10 bg-white p-1 shadow-xl">
                      <Image
                        src="/yape-qr.jpg"
                        alt="QR Yape"
                        fill
                        priority
                        className="object-contain p-1"
                      />
                    </div>

                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-[#8b8fa5] uppercase tracking-widest">
                        Pago Único
                      </p>
                      <p className="font-display text-3xl font-black text-white">
                        S/ 10.00
                      </p>

                      <div className="flex justify-center gap-2">
                        <span className="px-2 py-1 rounded bg-[#7422ff]/20 text-[#a37cff] text-[10px] font-bold">
                          💜 Yape
                        </span>
                        <span className="px-2 py-1 rounded bg-[#00b1ff]/20 text-[#54cfff] text-[10px] font-bold">
                          💙 Plin
                        </span>
                      </div>

                      <p className="font-mono text-sm font-bold text-[#ff6b35] flex items-center justify-center gap-2">
                        {yapeNumber}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(yapeNumber);
                            alert("Copiado!");
                          }}
                          className="bg-white/5 p-1 rounded hover:bg-white/10"
                        >
                          📋
                        </button>
                      </p>
                    </div>
                  </div>

                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 flex items-center justify-center gap-2 bg-[#25D366] text-white text-[11px] font-black uppercase tracking-wider py-3.5 rounded-xl shadow-lg active:scale-95 transition-all"
                  >
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12.004 2c-5.523 0-10 4.477-10 10a9.982 9.982 0 0 0 1.465 5.148l-1.465 5.352 5.512-1.445A9.967 9.967 0 0 0 12.004 22c5.523 0 10-4.477 10-10s-4.477-10-10-10zm0 18c-1.777 0-3.441-.466-4.893-1.28l-.35-.196-3.255.853.868-3.167-.215-.342A7.957 7.957 0 0 1 4.004 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                    </svg>
                    Enviar Captura
                  </a>
                </div>

                {/* CANJE SIMPLIFICADO */}
                <div className="border-t border-white/10 pt-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#ffd36b] mb-3 text-center">
                    🎟️ ¿Ya tienes tu código VIP?
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="VIP-XXXX-XXXX"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-white outline-none focus:border-[#ffd700]/50 transition-all"
                    />
                    <button
                      onClick={handleRedeem}
                      disabled={loading}
                      className="bg-gradient-to-r from-[#ffd700] to-[#f7931e] text-[#4a3000] text-[10px] font-black uppercase px-4 rounded-xl active:scale-95 disabled:opacity-50"
                    >
                      OK
                    </button>
                  </div>
                  {error && (
                    <p className="text-[10px] text-red-400 mt-2 text-center font-bold">
                      {error}
                    </p>
                  )}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
