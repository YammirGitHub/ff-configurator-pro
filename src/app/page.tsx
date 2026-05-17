"use client";

import { useDevice } from "@/entities/device/DeviceContext";
import { DeviceBrand } from "@/entities/device/types";
import { computeProConfig } from "@/features/calculator/math";
import { auth, db } from "@/shared/config/firebase";
import { PremiumModal } from "@/shared/ui/PremiumModal";
import { triggerHaptic } from "@/shared/utils/haptics"; // 👈 IMPORTADO PARA EL FIX DE HAPTICS
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

function StepBadge({ n }: { n: number }) {
  return (
    <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#ff6b35] to-[#f7931e] text-[11px] lg:text-xs font-bold text-white shadow-[0_4px_12px_rgba(255,107,53,0.4)]">
      {n}
    </span>
  );
}

function StepHeading({ step, label }: { step: number; label: string }) {
  return (
    <h3 className="flex items-center gap-3 font-display text-xs lg:text-sm font-semibold uppercase tracking-[0.2em] text-[#8b8fa5]">
      <StepBadge n={step} />
      {label}
    </h3>
  );
}

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[28px] border border-white/[0.06] bg-[#0e1020]/80 p-5 lg:p-8 shadow-[0_8px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      {children}
    </div>
  );
}

function SensRow({
  label,
  desc,
  value,
  index,
}: {
  label: string;
  desc: string;
  value: number;
  index: number;
}) {
  const prevRef = useRef(value);
  const [pop, setPop] = useState(false);

  useEffect(() => {
    if (prevRef.current !== value) {
      setPop(true);
      const t = setTimeout(() => setPop(false), 350);
      prevRef.current = value;
      return () => clearTimeout(t);
    }
  }, [value]);

  const pct = clamp(((value - 30) / 170) * 100, 0, 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.05] bg-[#141728]/60 px-4 py-3 lg:px-5 lg:py-3.5 transition-all hover:border-white/10 hover:bg-[#141728] w-full"
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 rounded-l-2xl bg-gradient-to-r from-[#ff6b35]/10 to-transparent transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
      <div className="relative flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="font-body text-sm lg:text-base font-bold text-zinc-100">
            {label}
          </p>
          <p className="mt-1 font-body text-[11px] lg:text-xs font-medium text-zinc-400 line-clamp-1">
            {desc}
          </p>
        </div>
        <span
          className={`selectable-text font-mono min-w-[56px] rounded-xl border border-[#ff6b35]/20 bg-[#ff6b35]/10 px-3 py-1.5 text-center text-base lg:text-lg font-black text-[#ff8c5a] ${pop ? "animate-number-pop" : ""}`}
        >
          {value}
        </span>
      </div>
    </motion.div>
  );
}

const BRANDS: { id: DeviceBrand; name: string; icon: string }[] = [
  { id: "apple", name: "iPhone", icon: "🍏" },
  { id: "samsung", name: "Samsung", icon: "📱" },
  { id: "xiaomi", name: "Xiaomi", icon: "🟠" },
  { id: "poco", name: "Poco", icon: "🚀" },
  { id: "motorola", name: "Motorola", icon: "🔵" },
  { id: "huawei", name: "Huawei", icon: "🌸" },
  { id: "honor", name: "Honor", icon: "✨" },
  { id: "realme", name: "Realme", icon: "⚡" },
];

export default function Home() {
  const {
    selectedBrand,
    selectedDevice,
    setBrand,
    setDevice,
    getModelsByBrand,
  } = useDevice();
  const [dpiMode, setDpiMode] = useState(false);
  const [firePref, setFirePref] = useState("medium");
  const [result, setResult] = useState<any>(null);
  const [scale, setScale] = useState(1);
  const router = useRouter();

  const [savedConfigs, setSavedConfigs] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [showVault, setShowVault] = useState(false);

  const [isVip, setIsVip] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        setIsAuthLoading(false); // 👈 AÑADE ESTA LÍNEA AQUÍ
      } else {
        setUserEmail(user.email || "");
        const isAdmin = user.email === "jjhor24@gmail.com";

        try {
          const userRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setIsVip(isAdmin || data.activo === true);

            if (data.savedConfigs) {
              setSavedConfigs(data.savedConfigs);
            }
          } else {
            setIsVip(isAdmin);
          }
        } catch (e) {
          console.error("Error cargando datos", e);
        }
        setIsAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSaveToCloud = async () => {
    if (!auth.currentUser || !result || !selectedDevice) return;
    setIsSaving(true);
    try {
      const newConfig = {
        id: Date.now().toString(),
        name: `${selectedDevice.name} (${Math.round(scale * 100)}%)`,
        date: new Date().toLocaleDateString(),
        brand: selectedBrand,
        device: selectedDevice,
        dpiMode,
        firePref,
        scale,
        result,
      };

      const updatedConfigs = [newConfig, ...savedConfigs];
      const userRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userRef, { savedConfigs: updatedConfigs }, { merge: true });

      setSavedConfigs(updatedConfigs);
      setSaveMsg("¡Guardado! ☁️");

      // 👇 FIX BUG 2: Vibración segura que no crashea en Safari iOS
      triggerHaptic("light");

      setTimeout(() => setSaveMsg(""), 3000);
    } catch (error) {
      setSaveMsg("Error ❌");
      setTimeout(() => setSaveMsg(""), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadConfig = (config: any) => {
    setBrand(config.brand);
    setDevice(config.device);
    setDpiMode(config.dpiMode);
    setFirePref(config.firePref);
    setScale(config.scale || 1);
    setResult(config.result);
    setShowVault(false);
  };

  const handleDeleteConfig = async (id: string) => {
    if (!auth.currentUser) return;
    const updatedConfigs = savedConfigs.filter((c) => c.id !== id);
    setSavedConfigs(updatedConfigs);
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userRef, { savedConfigs: updatedConfigs }, { merge: true });
    } catch (error) {
      console.error("Error eliminando configuración", error);
    }
  };

  const handleGenerateClick = () => {
    if (!isVip) {
      setShowPremiumModal(true);
      // 👇 FIX BUG 2: Notificación táctil de denegación segura para iOS y Android
      triggerHaptic("error");
      return;
    }

    if (!selectedDevice) return;
    setResult(computeProConfig(selectedDevice, dpiMode, firePref));
    setScale(1);

    // 👇 FIX BUG 2: Latido premium de éxito universal
    triggerHaptic("success");
  };

  // 👇 FIX BUG 1: Observador de Scroll a prueba de fugas de memoria con desmonte limpio
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (result && window.innerWidth < 1024) {
      timeoutId = setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      }, 350);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [result]);

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBrand(e.target.value as DeviceBrand);
    setResult(null);
    setScale(1);
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!selectedBrand) return;
    const model = getModelsByBrand(selectedBrand).find(
      (m) => m.name === e.target.value,
    );
    setDevice(model ?? null);
    setResult(null);
    setScale(1);
  };

  const currentSens = result
    ? {
        general: clamp(Math.round(result.sensConfig.general * scale), 30, 200),
        redDot: clamp(Math.round(result.sensConfig.redDot * scale), 40, 200),
        scope2x: clamp(Math.round(result.sensConfig.scope2x * scale), 35, 200),
        scope4x: clamp(Math.round(result.sensConfig.scope4x * scale), 30, 200),
        sniper: clamp(Math.round(result.sensConfig.sniper * scale), 30, 200),
        camera360: clamp(
          Math.round(result.sensConfig.camera360 * scale),
          40,
          200,
        ),
      }
    : null;

  let currentBtnSize = result?.optimalButtonSize ?? 0;
  if (result) {
    if (scale < 1)
      currentBtnSize = clamp(
        Math.round(result.optimalButtonSize + (1 - scale) * 12),
        40,
        60,
      );
    else if (scale > 1)
      currentBtnSize = clamp(
        Math.round(result.optimalButtonSize - (scale - 1) * 12),
        40,
        60,
      );
  }

  const tierName =
    result?.tier === "high"
      ? "Alta"
      : result?.tier === "mid_high"
        ? "Media Alta"
        : result?.tier === "mid"
          ? "Media"
          : "Baja";

  const sensRows = currentSens
    ? [
        {
          label: "⚙️ General",
          desc: "Velocidad base para girar fluido sin perder control.",
          val: currentSens.general,
        },
        {
          label: "🔴 Punto Rojo",
          desc: "Pensada para levantar al rojo sin pasarse por encima de la cabeza.",
          val: currentSens.redDot,
        },
        {
          label: "🔍 Mira 2x",
          desc: "Control en media distancia, evita saltos bruscos al arrastrar.",
          val: currentSens.scope2x,
        },
        {
          label: "🔭 Mira 4x",
          desc: "Estabilidad alta para tiros alineados al pecho/cabeza.",
          val: currentSens.scope4x,
        },
        {
          label: "🎯 Francotirador",
          desc: "Precisión fina para que no se quede pegado ni se vaya demasiado.",
          val: currentSens.sniper,
        },
        {
          label: "📷 Cámara 360°",
          desc: "Giros rápidos para revisar entorno sin mareos.",
          val: currentSens.camera360,
        },
      ]
    : [];
  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-[1400px] flex-col gap-6 px-4 pt-28 pb-12 sm:px-8 lg:gap-8 lg:px-12 lg:pt-36">
      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        userEmail={userEmail}
      />

      <AnimatePresence>
        {showVault && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#07080f]/80 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-[500px]"
            >
              <GlassCard className="p-6 lg:p-8 flex flex-col max-h-[80vh]">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl lg:text-2xl font-display font-black text-white">
                      📂 Bóveda VIP
                    </h3>
                    <p className="text-[#8b8fa5] text-[11px] lg:text-xs font-medium uppercase tracking-widest mt-1">
                      Tus configuraciones guardadas
                    </p>
                  </div>
                  <button
                    onClick={() => setShowVault(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-zinc-400 transition-colors hover:bg-red-500/20 hover:text-red-400"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-hide">
                  {savedConfigs.length === 0 ? (
                    <div className="text-center py-10">
                      <span className="text-4xl opacity-30 block mb-3">👻</span>
                      <p className="text-sm font-semibold text-zinc-500">
                        Aún no hay configuraciones guardadas
                      </p>
                    </div>
                  ) : (
                    savedConfigs.map((config) => (
                      <div
                        key={config.id}
                        className="group flex items-center justify-between rounded-2xl border border-white/5 bg-[#141728]/80 p-4 transition-all hover:border-[#ff6b35]/30 hover:bg-[#141728]"
                      >
                        <div>
                          <p className="font-bold text-white text-sm">
                            {config.name}
                          </p>
                          <p className="text-[11px] font-semibold text-[#8b8fa5] uppercase tracking-wider mt-0.5">
                            {config.date} •{" "}
                            {config.dpiMode ? "Con DPI" : "Sin DPI"}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleLoadConfig(config)}
                            className="rounded-xl bg-white/5 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-[#ff6b35] hover:shadow-[0_0_15px_rgba(255,107,53,0.4)]"
                          >
                            Cargar
                          </button>
                          <button
                            onClick={() => handleDeleteConfig(config.id)}
                            className="rounded-xl bg-white/5 px-3 py-2 text-xs font-bold text-zinc-400 transition-all hover:bg-red-500/20 hover:text-red-400"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid w-full grid-cols-1 items-start gap-6 lg:grid-cols-2 lg:gap-8">
        <GlassCard className="flex flex-col gap-6 lg:gap-8">
          <section className="space-y-4">
            <StepHeading step={1} label="Selecciona tu Marca" />
            <div className="relative group">
              <select
                onChange={handleBrandChange}
                value={selectedBrand ?? ""}
                className="w-full cursor-pointer appearance-none rounded-xl border border-white/[0.07] bg-[#141728] px-5 py-4 font-body text-sm lg:text-base font-semibold text-zinc-100 outline-none transition-all focus:border-[#ff6b35]/60 hover:border-white/[0.12]"
              >
                <option value="" disabled>
                  Selecciona marca…
                </option>
                {BRANDS.map((brand) => (
                  <option
                    key={brand.id}
                    value={brand.id}
                    className="bg-[#0e1020]"
                  >
                    {brand.icon} {brand.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-5 flex items-center text-[#4a4f6a] group-focus-within:text-[#ff6b35]">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </section>

          <AnimatePresence>
            {selectedBrand && (
              <motion.section
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 overflow-hidden"
              >
                <StepHeading step={2} label="Busca tu Modelo" />
                <div className="relative group">
                  <select
                    onChange={handleModelChange}
                    value={selectedDevice?.name ?? ""}
                    className="w-full cursor-pointer appearance-none rounded-xl border border-white/[0.07] bg-[#141728] px-5 py-4 font-body text-sm lg:text-base font-semibold text-zinc-100 outline-none transition-all focus:border-[#ff6b35]/60 hover:border-white/[0.12]"
                  >
                    <option value="" disabled>
                      Toca aquí para elegir…
                    </option>
                    {getModelsByBrand(selectedBrand).map((model, idx) => (
                      <option
                        key={idx}
                        value={model.name}
                        className="bg-[#0e1020]"
                      >
                        {model.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-5 flex items-center text-[#4a4f6a] group-focus-within:text-[#ff6b35]">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {selectedDevice && (
              <motion.section
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 overflow-hidden"
              >
                <StepHeading step={3} label="Preferencias" />
                <div className="space-y-4 rounded-2xl border border-white/[0.06] bg-[#141728]/60 p-5">
                  <div>
                    <p className="mb-2 font-body text-[11px] lg:text-xs font-semibold uppercase tracking-[0.2em] text-[#8b8fa5]">
                      Modo DPI
                    </p>
                    <div className="flex overflow-hidden rounded-xl border border-white/[0.06] bg-[#0e1020] p-1.5">
                      {[
                        { val: true, label: "Con DPI" },
                        { val: false, label: "Sin DPI" },
                      ].map(({ val, label }) => (
                        <button
                          key={String(val)}
                          onClick={() => setDpiMode(val)}
                          className={`flex-1 rounded-[10px] py-3 font-body text-xs lg:text-sm font-bold uppercase tracking-wider transition-all active:scale-95 ${dpiMode === val ? "bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white shadow-md" : "text-[#8b8fa5] hover:text-zinc-300"}`}
                        >
                          {dpiMode === val && "✓ "} {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="pt-2">
                    <p className="mb-2 font-body text-[11px] lg:text-xs font-semibold uppercase tracking-[0.2em] text-[#8b8fa5]">
                      Tamaño de Disparo
                    </p>
                    <div className="relative">
                      <select
                        value={firePref}
                        onChange={(e) => setFirePref(e.target.value)}
                        className="w-full cursor-pointer appearance-none rounded-xl border border-white/[0.07] bg-[#141728] px-4 py-3.5 font-body text-xs lg:text-sm font-semibold text-zinc-200 outline-none focus:border-[#ff6b35]/60"
                      >
                        <option value="small">
                          Botón Pequeño — Dedos rápidos
                        </option>
                        <option value="medium">
                          Botón Mediano — Equilibrado
                        </option>
                        <option value="large">
                          Botón Grande — Más estabilidad
                        </option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#4a4f6a]">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {selectedDevice && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleGenerateClick}
                className={`w-full overflow-hidden rounded-[16px] py-5 lg:py-6 font-display text-sm lg:text-base font-bold uppercase tracking-[0.2em] shadow-[0_8px_24px_rgba(255,107,53,0.3)] active:scale-[0.98] transition-all duration-300 ${isVip ? "bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white" : "bg-gradient-to-r from-[#ffd700] to-[#f7931e] text-[#4a3000]"}`}
              >
                <span className="relative flex items-center justify-center gap-2">
                  {isVip
                    ? "🚀 Generar Configuración PRO"
                    : "🔒 Desbloquear VIP para Generar"}
                </span>
              </motion.button>
            )}
          </AnimatePresence>
        </GlassCard>

        <div className="w-full">
          <AnimatePresence mode="wait">
            {result && currentSens ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
              >
                <div className="relative flex flex-col overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#0e1020]/90 p-5 lg:p-8 shadow-[0_8px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl">
                  <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[radial-gradient(circle,rgba(255,107,53,0.15)_0%,transparent_70%)]" />
                  <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-2">
                    <div>
                      <h2 className="font-display text-2xl lg:text-[26px] font-black leading-tight text-white flex items-center gap-2">
                        ✨ Configuración PRO
                      </h2>
                      <p className="mt-2 font-body text-xs lg:text-sm uppercase tracking-widest text-[#8b8fa5]">
                        <span className="font-semibold text-[#ff7b3c]">
                          {selectedDevice?.name}
                        </span>
                        <span className="mx-2 opacity-30">|</span>Gama:{" "}
                        <span className="font-bold text-white">{tierName}</span>
                        <span className="mx-2 opacity-30">|</span>
                        {dpiMode ? (
                          <span className="text-green-400">
                            Con DPI ({result.usedDpi})
                          </span>
                        ) : (
                          <span className="text-zinc-300">Sin DPI</span>
                        )}
                      </p>
                    </div>
                    <div className="flex-shrink-0 flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-1.5">
                      <p className="font-body text-[10px] lg:text-xs font-semibold uppercase tracking-[0.2em] text-[#8b8fa5]">
                        Escala global
                      </p>
                      <div className="flex items-center rounded-xl border border-white/[0.08] bg-[#141728] p-1 shadow-inner">
                        <button
                          onClick={() =>
                            setScale((prev) =>
                              Math.max(0.1, Math.round((prev - 0.1) * 10) / 10),
                            )
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.03] text-zinc-400 transition-all hover:bg-white/10 hover:text-[#ff6b35] active:scale-90"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              d="M20 12H4"
                            />
                          </svg>
                        </button>
                        <span className="min-w-[56px] text-center font-mono text-[11px] lg:text-[12px] font-bold text-[#ffd36b]">
                          {Math.round(scale * 100)}%
                        </span>
                        <button
                          onClick={() =>
                            setScale((prev) =>
                              Math.min(2.0, Math.round((prev + 0.1) * 10) / 10),
                            )
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.03] text-zinc-400 transition-all hover:bg-white/10 hover:text-[#ff6b35] active:scale-90"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="relative z-10 my-4 lg:my-5 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />
                  <div className="relative z-10 flex flex-col gap-2 lg:gap-3 mb-5">
                    {sensRows.map((item, i) => (
                      <SensRow
                        key={item.label}
                        label={item.label}
                        desc={item.desc}
                        value={item.val}
                        index={i}
                      />
                    ))}
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group relative z-10 overflow-hidden rounded-[20px] border border-[#ffb74d]/20 bg-gradient-to-br from-[rgba(255,183,77,0.08)] to-[rgba(255,140,0,0.04)] p-5 lg:p-6 mb-4"
                  >
                    <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    <div className="relative flex items-center justify-between">
                      <div>
                        <p className="font-display text-sm lg:text-base font-bold uppercase tracking-[0.1em] text-[#ffd36b]">
                          🔥 Tamaño de Disparo
                        </p>
                        <p className="mt-1 font-body text-[10px] lg:text-[11px] text-amber-500/70 uppercase tracking-widest font-semibold">
                          Calculado por IA
                        </p>
                      </div>
                      <div className="selectable-text rounded-2xl bg-gradient-to-r from-[#f6d559] to-[#ffe899] px-6 lg:px-8 py-3 shadow-[0_8px_20px_rgba(246,213,89,0.2)]">
                        <span className="font-mono text-2xl lg:text-3xl font-black text-[#4a3000]">
                          {currentBtnSize}%
                        </span>
                      </div>
                    </div>
                  </motion.div>
                  <div className="flex gap-3 relative z-10">
                    <button
                      onClick={() => setShowVault(true)}
                      className="flex-1 rounded-xl bg-white/5 py-3.5 text-[11px] lg:text-xs font-bold uppercase tracking-widest text-[#8b8fa5] transition-all hover:bg-white/10 hover:text-white active:scale-95 shadow-inner"
                    >
                      📂 Mi Bóveda
                    </button>
                    <button
                      onClick={handleSaveToCloud}
                      disabled={isSaving}
                      className="flex-1 rounded-xl bg-gradient-to-r from-[#ff6b35] to-[#f7931e] py-3.5 text-[11px] lg:text-xs font-bold uppercase tracking-widest text-white transition-all hover:brightness-110 active:scale-95 disabled:pointer-events-none disabled:opacity-50 shadow-[0_4px_15px_rgba(255,107,53,0.3)]"
                    >
                      {isSaving
                        ? "⏳ Guardando..."
                        : saveMsg
                          ? saveMsg
                          : "💾 Guardar"}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hidden lg:flex min-h-[500px] flex-col items-center justify-center rounded-[28px] border border-dashed border-white/[0.06] bg-white/[0.01]"
              >
                <div className="animate-float text-center">
                  <div className="mx-auto mb-5 flex h-16 w-16 lg:h-20 lg:w-20 items-center justify-center rounded-3xl border border-white/[0.06] bg-[#0e1020]/60">
                    <span className="text-3xl lg:text-4xl opacity-40">🎯</span>
                  </div>
                  <p className="font-display text-xs lg:text-sm font-semibold uppercase tracking-[0.4em] text-[#4a4f6a]">
                    Sistema en Espera
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
