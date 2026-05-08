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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ADMIN_EMAIL = "jjhor24@gmail.com";

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [allCodes, setAllCodes] = useState<any[]>([]);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user || user.email !== ADMIN_EMAIL) {
        router.push("/");
      } else {
        setIsAuthorized(true);
        fetchData();
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Traer Usuarios
      const snapUsers = await getDocs(collection(db, "users"));
      const listUsers = snapUsers.docs.map((d) => ({ id: d.id, ...d.data() }));
      listUsers.sort(
        (a: any, b: any) =>
          (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0),
      );
      setUsers(listUsers);

      // 2. Traer Códigos VIP (NUEVO)
      const snapCodes = await getDocs(collection(db, "vip_codes"));
      const listCodes = snapCodes.docs.map((d) => ({ id: d.id, ...d.data() }));
      // Ordenar códigos del más nuevo al más viejo
      listCodes.sort(
        (a: any, b: any) =>
          new Date(b.creadoEl).getTime() - new Date(a.creadoEl).getTime(),
      );
      setAllCodes(listCodes);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

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
    } catch (e) {
      alert("Error al actualizar");
    } finally {
      setActionId(null);
    }
  };

  const deleteUser = async (userId: string) => {
    if (
      !confirm(
        "¿Seguro que quieres eliminar a este usuario de la base de datos?",
      )
    )
      return;
    setActionId(userId);
    try {
      await deleteDoc(doc(db, "users", userId));
      setUsers(users.filter((u) => u.id !== userId));
    } catch (e) {
      alert("Error al borrar");
    } finally {
      setActionId(null);
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
    alert(`Éxito: ${cantidad} códigos generados.`);
    fetchData(); // 👈 LÓGICA SENIOR: Recargar todo desde la base de datos real
  };

  const filteredUsers = users.filter((u) => {
    if (!search.trim()) return true;
    const correoSeguro = u.email || "";
    return correoSeguro.toLowerCase().includes(search.toLowerCase());
  });

  const totalVips = users.filter((u) => u.activo).length;

  if (!isAuthorized) return <div className="min-h-screen bg-[#07080f]" />;

  return (
    // 👇 SOLUCIÓN DE ESPACIADO: pt-28 lg:pt-36 para alinear perfecto con el Navbar
    <div className="relative flex min-h-screen w-full flex-col items-center px-4 pt-28 pb-12 sm:px-8 lg:px-12 lg:pt-36 font-body bg-[#07080f]">
      <Particles />

      <div className="relative z-10 w-full max-w-[1200px] space-y-6 lg:space-y-8">
        {/* 👇 TÍTULO RECUPERADO: Le da jerarquía y empuja el contenido hacia abajo */}
        <div className="flex flex-col items-center md:items-start md:flex-row md:justify-between md:mb-2">
          <div>
            <h1 className="font-display text-2xl lg:text-3xl font-black text-white flex items-center gap-2">
              👑 Panel Administrativo
            </h1>
            <p className="mt-1 font-body text-[11px] lg:text-xs font-semibold uppercase tracking-[0.2em] text-[#8b8fa5]">
              Gestión de Usuarios y Vouchers
            </p>
          </div>
        </div>

        {/* CABECERA DE ESTADÍSTICAS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
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
            className="md:col-span-1 rounded-[24px] bg-white/5 border border-white/10 text-[11px] lg:text-xs font-bold text-white uppercase hover:bg-white/10 transition-all active:scale-95"
          >
            Generar 5 Códigos
          </button>
          <button
            onClick={fetchData}
            className="md:col-span-1 rounded-[24px] bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-[11px] lg:text-xs font-bold text-white uppercase shadow-[0_4px_15px_rgba(255,107,53,0.3)] hover:brightness-110 active:scale-95 transition-all"
          >
            Actualizar Lista
          </button>
        </div>

        {/* BUSCADOR */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por correo electrónico..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#141728]/80 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm lg:text-base outline-none focus:border-[#ff6b35]/50 transition-all placeholder:text-zinc-500"
          />
          <span className="absolute right-6 top-1/2 -translate-y-1/2 opacity-30 text-lg">
            🔍
          </span>
        </div>

        {/* LISTA DE USUARIOS */}
        <GlassCard className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="p-5 text-[10px] lg:text-[11px] font-black text-[#8b8fa5] uppercase tracking-[0.15em]">
                    Usuario
                  </th>
                  <th className="p-5 text-[10px] lg:text-[11px] font-black text-[#8b8fa5] uppercase tracking-[0.15em]">
                    Estado
                  </th>
                  <th className="p-5 text-[10px] lg:text-[11px] font-black text-[#8b8fa5] uppercase tracking-[0.15em]">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {loading ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="p-10 text-center text-[13px] font-semibold tracking-widest text-zinc-500 uppercase animate-pulse"
                    >
                      Cargando base de datos...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="p-10 text-center text-[13px] font-semibold text-zinc-500"
                    >
                      No se encontraron usuarios.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="p-5">
                        <p className="text-sm lg:text-base font-bold text-white leading-tight">
                          {u.displayName || "Sin nombre"}
                        </p>
                        <p className="mt-0.5 text-[11px] lg:text-xs text-zinc-400 font-medium tracking-wide">
                          {u.email}
                        </p>
                      </td>
                      <td className="p-5">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[9px] lg:text-[10px] font-black uppercase tracking-wider ${u.activo ? "bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 shadow-[0_0_10px_rgba(37,211,102,0.1)]" : "bg-white/5 text-zinc-400 border border-white/10"}`}
                        >
                          {u.activo ? "💎 VIP Activo" : "Básico"}
                        </span>
                      </td>
                      <td className="p-5">
                        {u.email === ADMIN_EMAIL ? (
                          <div className="flex w-[208px]">
                            <span className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#ffd700]/30 bg-[#ffd700]/10 px-3 py-2.5 text-[10px] font-black uppercase tracking-widest text-[#ffd700]">
                              👑 Intocable
                            </span>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            {/* 👇 BOTÓN VIP: Cambiamos px-4 por w-[100px] para fijar el ancho */}
                            <button
                              disabled={actionId === u.id}
                              onClick={() => toggleVip(u.id, u.activo)}
                              className={`w-[100px] py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${u.activo ? "bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white" : "bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white shadow-[0_4px_12px_rgba(255,107,53,0.3)] hover:brightness-110 active:scale-95"}`}
                            >
                              {u.activo ? "Quitar VIP" : "Hacer VIP"}
                            </button>

                            {/* 👇 BOTÓN ELIMINAR: También le ponemos w-[100px] para que sean gemelos */}
                            <button
                              disabled={actionId === u.id}
                              onClick={() => deleteUser(u.id)}
                              className="w-[100px] py-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-bold uppercase tracking-wider hover:bg-red-500 hover:text-white transition-all active:scale-95"
                            >
                              Eliminar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* LISTA DE CÓDIGOS RECIÉN GENERADOS */}
        {/* SECCIÓN DE VOUCHERS (LEYENDO DE FIREBASE) */}
        <GlassCard className="p-6 lg:p-8 border-[#ffd700]/20">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-xs lg:text-sm font-black text-[#ffd700] uppercase tracking-widest flex items-center gap-2">
              🎟️ Códigos VIP (Base de Datos)
            </h3>
            <span className="text-[10px] text-zinc-400 font-bold bg-white/5 px-3 py-1 rounded-full uppercase">
              {allCodes.filter((c) => !c.usado).length} Disponibles
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {allCodes.map((codeObj) => (
              <div
                key={codeObj.id}
                className={`flex items-center justify-between p-3 lg:p-4 rounded-xl border shadow-inner transition-all ${
                  codeObj.usado
                    ? "bg-red-500/5 border-red-500/10 opacity-50 grayscale"
                    : "bg-[#141728] border-white/5"
                }`}
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
                      alert("¡Código copiado!");
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
