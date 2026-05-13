"use client";

import { auth, db } from "@/shared/config/firebase";
import { GlassCard } from "@/shared/ui/GlassCard";
import { Particles } from "@/shared/ui/Particles";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ADMIN_EMAIL = "jjhor24@gmail.com";

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [allCodes, setAllCodes] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);

  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Sistema de Notificaciones y Modales
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user || user.email !== ADMIN_EMAIL) {
        router.push("/");
      } else {
        setIsAuthorized(true);
        await fetchData();
        setIsAuthLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchData = async () => {
    setIsDataLoading(true);
    try {
      const snapUsers = await getDocs(collection(db, "users"));
      const listUsers = snapUsers.docs.map((d) => ({ id: d.id, ...d.data() }));
      listUsers.sort(
        (a: any, b: any) =>
          (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0),
      );
      setUsers(listUsers);

      const snapCodes = await getDocs(collection(db, "vip_codes"));
      const listCodes = snapCodes.docs.map((d) => ({ id: d.id, ...d.data() }));
      listCodes.sort(
        (a: any, b: any) =>
          new Date(b.creadoEl).getTime() - new Date(a.creadoEl).getTime(),
      );
      setAllCodes(listCodes);
    } catch (e) {
      showToast("Error al cargar la base de datos", "error");
    } finally {
      setIsDataLoading(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="flex min-h-[100dvh] w-full items-center justify-center bg-[#07080f]">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <span className="text-4xl opacity-50">👑</span>
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.3em] text-[#ffd700]">
            Verificando Acceso Maestro...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) return null;

  const toggleVip = async (userId: string, currentStatus: boolean) => {
    setActionId(userId);
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        activo: !currentStatus,
        rol: !currentStatus ? "vip" : "user",
      });
      setUsers(
        users.map((u) =>
          u.id === userId ? { ...u, activo: !currentStatus } : u,
        ),
      );
      showToast(
        currentStatus ? "VIP revocado" : "VIP otorgado con éxito",
        "success",
      );
    } catch (e) {
      showToast("Error al actualizar usuario", "error");
    } finally {
      setActionId(null);
    }
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    setActionId(userToDelete);
    try {
      await deleteDoc(doc(db, "users", userToDelete));
      setUsers(users.filter((u) => u.id !== userToDelete));
      showToast("Usuario eliminado permanentemente", "success");
    } catch (e) {
      showToast("Error al eliminar usuario", "error");
    } finally {
      setActionId(null);
      setUserToDelete(null);
    }
  };

  const generateCodes = async (cantidad: number) => {
    for (let i = 0; i < cantidad; i++) {
      const code = `VIP-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      await setDoc(doc(db, "vip_codes", code), {
        usado: false,
        creadoEl: new Date().toISOString(),
      });
    }
    showToast(`Éxito: ${cantidad} códigos generados.`, "success");
    fetchData();
  };

  const filteredUsers = users.filter((u) => {
    if (!search.trim()) return true;
    const correoSeguro = u.email || "";
    return correoSeguro.toLowerCase().includes(search.toLowerCase());
  });

  const totalVips = users.filter((u) => u.activo).length;

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col items-center px-4 pt-28 pb-12 sm:px-8 lg:px-12 lg:pt-36 font-body bg-[#07080f]">
      <Particles />

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-0 right-0 z-[300] mx-auto w-max max-w-[90%] px-4"
          >
            <div
              className={`flex items-center gap-3 rounded-full px-5 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl border ${toast.type === "success" ? "bg-[#25D366]/10 border-[#25D366]/30 text-[#25D366]" : "bg-red-500/10 border-red-500/30 text-red-400"}`}
            >
              <span className="text-lg">
                {toast.type === "success" ? "✅" : "⚠️"}
              </span>
              <p className="text-[13px] font-bold tracking-wide">{toast.msg}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {userToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-[360px]"
            >
              <GlassCard className="p-6 border border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.15)] text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-3xl">
                  ⚠️
                </div>
                <h3 className="text-lg font-display font-black text-white mb-2">
                  ¿Eliminar Usuario?
                </h3>
                <p className="text-zinc-400 text-xs font-medium mb-6">
                  Esta acción borrará al usuario de la base de datos
                  permanentemente. No se puede deshacer.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setUserToDelete(null)}
                    className="flex-1 rounded-xl bg-white/5 py-3 text-xs font-bold text-white hover:bg-white/10 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmDeleteUser}
                    className="flex-1 rounded-xl bg-red-500 py-3 text-xs font-bold text-white hover:bg-red-600 transition-colors shadow-lg active:scale-95"
                  >
                    Sí, eliminar
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-[1200px] space-y-6 lg:space-y-8">
        <div className="flex flex-col items-center md:items-start md:flex-row md:justify-between md:mb-2">
          <div className="text-center md:text-left">
            <h1 className="font-display text-2xl lg:text-3xl font-black text-white flex items-center justify-center md:justify-start gap-2">
              👑 Panel Administrativo
            </h1>
            <p className="mt-1 font-body text-[11px] lg:text-xs font-semibold uppercase tracking-[0.2em] text-[#8b8fa5]">
              Gestión de Usuarios y Vouchers
            </p>
          </div>
        </div>

        {/* 👇 FIX: Grid Responsivo para los botones superiores */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-6">
          <GlassCard className="p-4 text-center flex flex-col justify-center">
            <p className="text-[10px] lg:text-[11px] font-bold text-[#8b8fa5] uppercase tracking-widest">
              Total Usuarios
            </p>
            <p className="text-2xl lg:text-3xl font-black text-white mt-1">
              {users.length}
            </p>
          </GlassCard>
          <GlassCard className="p-4 text-center border-[#ff6b35]/20 flex flex-col justify-center">
            <p className="text-[10px] lg:text-[11px] font-bold text-[#ff6b35] uppercase tracking-widest">
              Usuarios VIP
            </p>
            <p className="text-2xl lg:text-3xl font-black text-white mt-1">
              {totalVips}
            </p>
          </GlassCard>
          <button
            onClick={() => generateCodes(5)}
            className="col-span-1 md:col-span-1 rounded-[20px] bg-white/5 border border-white/10 text-[10px] sm:text-[11px] lg:text-xs font-bold text-white uppercase hover:bg-white/10 transition-all active:scale-95 py-3"
          >
            Generar 5 Códigos
          </button>
          <button
            onClick={fetchData}
            className="col-span-1 md:col-span-1 rounded-[20px] bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-[10px] sm:text-[11px] lg:text-xs font-bold text-white uppercase shadow-[0_4px_15px_rgba(255,107,53,0.3)] hover:brightness-110 active:scale-95 transition-all py-3"
          >
            Actualizar Lista
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por correo electrónico..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#141728]/80 border border-white/10 rounded-2xl py-4 px-6 text-white text-base outline-none focus:border-[#ff6b35]/50 transition-all placeholder:text-zinc-500"
          />
          <span className="absolute right-6 top-1/2 -translate-y-1/2 opacity-30 text-lg">
            🔍
          </span>
        </div>

        {/* 👇 FIX: Lista Responsiva en Flexbox (Cero Scroll Horizontal) */}
        <GlassCard className="overflow-hidden p-0">
          <div className="flex flex-col divide-y divide-white/[0.03]">
            {isDataLoading ? (
              <div className="p-10 text-center text-[13px] font-semibold tracking-widest text-zinc-500 uppercase animate-pulse">
                Cargando base de datos...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-10 text-center text-[13px] font-semibold text-zinc-500">
                No se encontraron usuarios.
              </div>
            ) : (
              filteredUsers.map((u) => (
                <div
                  key={u.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 hover:bg-white/[0.02] transition-colors gap-4"
                >
                  <div className="flex flex-col">
                    <p className="text-sm lg:text-base font-bold text-white leading-tight">
                      {u.displayName || "Sin nombre"}
                    </p>
                    <p className="mt-0.5 text-[11px] lg:text-xs text-zinc-400 font-medium tracking-wide">
                      {u.email}
                    </p>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-3">
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[9px] lg:text-[10px] font-black uppercase tracking-wider ${u.activo ? "bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 shadow-[0_0_10px_rgba(37,211,102,0.1)]" : "bg-white/5 text-zinc-400 border border-white/10"}`}
                    >
                      {u.activo ? "💎 VIP Activo" : "Básico"}
                    </span>

                    {u.email === ADMIN_EMAIL ? (
                      <span className="flex items-center justify-center gap-1.5 rounded-xl border border-[#ffd700]/30 bg-[#ffd700]/10 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-[#ffd700]">
                        👑 Intocable
                      </span>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          disabled={actionId === u.id}
                          onClick={() => toggleVip(u.id, u.activo)}
                          className={`px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${u.activo ? "bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white" : "bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white shadow-[0_4px_12px_rgba(255,107,53,0.3)] hover:brightness-110 active:scale-95"}`}
                        >
                          {u.activo ? "Quitar" : "Dar VIP"}
                        </button>
                        <button
                          disabled={actionId === u.id}
                          onClick={() => setUserToDelete(u.id)}
                          className="px-4 py-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-bold uppercase tracking-wider hover:bg-red-500 hover:text-white transition-all active:scale-95"
                        >
                          Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassCard>

        {/* SECCIÓN DE VOUCHERS */}
        <GlassCard className="p-6 lg:p-8 border-[#ffd700]/20">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-xs lg:text-sm font-black text-[#ffd700] uppercase tracking-widest flex items-center gap-2">
              🎟️ Códigos VIP
            </h3>
            <span className="text-[10px] text-zinc-400 font-bold bg-white/5 px-3 py-1 rounded-full uppercase">
              {allCodes.filter((c) => !c.usado).length} Disponibles
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {allCodes.map((codeObj) => (
              <div
                key={codeObj.id}
                className={`flex items-center justify-between p-3 lg:p-4 rounded-xl border shadow-inner transition-all ${codeObj.usado ? "bg-red-500/5 border-red-500/10 opacity-50 grayscale" : "bg-[#141728] border-white/5"}`}
              >
                <div className="flex flex-col">
                  <span
                    className={`font-mono text-sm lg:text-base font-bold tracking-widest ${codeObj.usado ? "text-red-400 line-through" : "text-white"}`}
                  >
                    {codeObj.id}
                  </span>
                  <span className="text-[9px] text-zinc-500 font-bold uppercase mt-1">
                    {codeObj.usado ? "🔴 Ya Canjeado" : "🟢 Listo para vender"}
                  </span>
                </div>
                {!codeObj.usado && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(codeObj.id);
                      showToast("¡Código copiado!", "success");
                    }}
                    className="text-[10px] lg:text-[11px] font-bold text-[#ff6b35] uppercase tracking-wider hover:text-white transition-colors bg-[#ff6b35]/10 px-3 py-1.5 rounded-lg border border-[#ff6b35]/20"
                  >
                    Copiar
                  </button>
                )}
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
