"use client";

import { auth } from "@/shared/config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Verificamos si es el admin
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAdmin(user?.email === "jjhor24@gmail.com");
    });
    return () => unsubscribe();
  }, []);

  // Lógica para cerrar el menú si tocas afuera de él (UX Nativa)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (pathname === "/login") return null;

  return (
    <nav className="fixed top-0 z-50 flex w-full justify-center px-4 pt-[max(1.5rem,env(safe-area-inset-top))] pb-4 pointer-events-none">
      {/* Contenedor que agrupa la Marca y el Botón, permitiendo clics */}
      <div className="pointer-events-auto relative flex items-center gap-3">
        {/* 1. LA PÍLDORA DE LA MARCA (Totalmente limpia) */}
        <div className="relative overflow-hidden rounded-full border border-white/[0.08] bg-[#0d0f1a]/80 px-8 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl flex flex-col items-center justify-center text-center">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <h1 className="font-display text-xl lg:text-2xl font-black tracking-tighter leading-none">
            <span className="bg-gradient-to-r from-[#ff6b35] via-[#f7931e] to-[#ffd700] bg-clip-text text-transparent drop-shadow-md">
              EA YAMMIR FF
            </span>
          </h1>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-[#ff6b35] animate-pulse" />
            <p className="font-body text-[7px] lg:text-[8px] font-bold uppercase tracking-[0.4em] text-[#8b8fa5] whitespace-nowrap">
              Configurador PRO · V2.0
            </p>
            <span className="h-1 w-1 rounded-full bg-[#ff6b35] animate-pulse" />
          </div>
        </div>

        {/* 2. EL MENÚ DE USUARIO DESPLEGABLE (Aislado a la derecha) */}
        <div className="relative" ref={menuRef}>
          {/* Botón Circular */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`flex h-[52px] w-[52px] items-center justify-center rounded-full border bg-[#0d0f1a]/80 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all active:scale-95 ${menuOpen ? "border-[#ff6b35]/50 text-[#ff6b35]" : "border-white/[0.08] text-zinc-400 hover:text-white hover:bg-white/5"}`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>

          {/* Menú Desplegable Flotante */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.9, y: 10, filter: "blur(4px)" }}
                transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
                className="absolute right-0 top-[calc(100%+12px)] w-56 overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#0d0f1a]/95 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-3xl"
              >
                <div className="flex flex-col gap-1">
                  {/* Opción Admin (Solo visible para ti) */}
                  {isAdmin && pathname !== "/admin-yammir" && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        router.push("/admin-yammir");
                      }}
                      className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-xs font-bold text-white transition-all hover:bg-white/5 active:bg-white/10"
                    >
                      <span className="text-lg">👑</span> Panel Maestro
                    </button>
                  )}

                  {/* Opción Volver (Solo visible en el Admin) */}
                  {isAdmin && pathname === "/admin-yammir" && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        router.push("/");
                      }}
                      className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-xs font-bold text-white transition-all hover:bg-white/5 active:bg-white/10"
                    >
                      <span className="text-lg">🏠</span> Configurador
                    </button>
                  )}

                  {isAdmin && <div className="my-1 h-px w-full bg-white/5" />}

                  {/* Opción Cerrar Sesión (Destructiva, en color rojo sutil) */}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      signOut(auth);
                    }}
                    className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-xs font-bold text-red-400 transition-all hover:bg-red-500/10 active:bg-red-500/20"
                  >
                    <span className="text-lg opacity-80">🚪</span> Cerrar Sesión
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
