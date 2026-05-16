"use client";

import { auth } from "@/shared/config/firebase";
import { triggerHaptic } from "@/shared/utils/haptics";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const ADMIN_EMAIL = "jjhor24@gmail.com";

  useEffect(() => {
    setIsMounted(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAdmin(user?.email === ADMIN_EMAIL);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isMounted || !pathname || pathname.includes("login")) return null;

  return (
    <nav
      // 👇 HUD 100% TRANSPARENTE SIEMPRE: Cero fondos, cero difuminados, cero bordes.
      className="fixed top-0 left-0 right-0 z-50 flex w-full justify-center px-4 pb-4 pointer-events-none bg-transparent"
      style={{
        // Respetamos el notch/isla dinámica
        paddingTop:
          "max(1.2rem, var(--spacing-safe-top, env(safe-area-inset-top)))",
      }}
    >
      <div className="pointer-events-auto relative flex items-center justify-center w-full max-w-[1400px] mx-auto">
        {/* PÍLDORA CENTRAL (Logo) */}
        <div className="relative overflow-hidden rounded-full border border-white/[0.08] bg-[#0d0f1a]/80 px-8 py-3 sm:py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl flex flex-col items-center justify-center text-center">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <h1 className="font-display text-lg sm:text-xl lg:text-2xl font-black tracking-tighter leading-none">
            <span className="bg-gradient-to-r from-[#ff6b35] via-[#f7931e] to-[#ffd700] bg-clip-text text-transparent drop-shadow-md">
              EA YAMMIR FF
            </span>
          </h1>
          <div className="mt-1 flex items-center gap-1.5 sm:gap-2">
            <span className="h-1 w-1 rounded-full bg-[#ff6b35] animate-pulse" />
            <p className="font-body text-[6px] sm:text-[7px] lg:text-[8px] font-bold uppercase tracking-[0.4em] text-[#8b8fa5] whitespace-nowrap">
              Configurador PRO · V2.0
            </p>
            <span className="h-1 w-1 rounded-full bg-[#ff6b35] animate-pulse" />
          </div>
        </div>

        {/* BOTÓN DERECHO (La Tuerca) */}
        <div className="absolute right-0 sm:right-4" ref={menuRef}>
          {isAdmin ? (
            <>
              <button
                onClick={() => {
                  triggerHaptic("light");
                  setMenuOpen(!menuOpen);
                }}
                className={`flex h-11 w-11 sm:h-[52px] sm:w-[52px] items-center justify-center rounded-full border bg-[#0d0f1a]/80 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all active:scale-95 ${
                  menuOpen
                    ? "border-[#ff6b35]/50 text-[#ff6b35]"
                    : "border-white/[0.08] text-zinc-400 hover:text-white"
                }`}
              >
                {/* ÍCONO DE TUERCA */}
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className="absolute right-0 top-[calc(100%+12px)] w-56 overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#0d0f1a]/95 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-3xl"
                  >
                    <div className="flex flex-col gap-1">
                      {pathname !== "/admin-yammir" ? (
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            router.push("/admin-yammir");
                          }}
                          className="flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold text-white hover:bg-white/5"
                        >
                          <span className="text-lg">👑</span> Panel Maestro
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            router.push("/");
                          }}
                          className="flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold text-white hover:bg-white/5"
                        >
                          <span className="text-lg">🏠</span> Configurador
                        </button>
                      )}
                      <div className="my-1 h-px w-full bg-white/5" />
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          signOut(auth);
                        }}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold text-red-400 hover:bg-red-500/10 active:scale-95 transition-all"
                      >
                        <svg
                          className="w-5 h-5 opacity-80"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Cerrar Sesión
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <button
              onClick={() => {
                triggerHaptic("medium");
                signOut(auth);
              }}
              className="flex h-11 w-11 sm:h-[52px] sm:w-[52px] items-center justify-center rounded-full border border-white/[0.08] bg-[#0d0f1a]/80 text-zinc-400 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all hover:text-red-400 hover:bg-red-500/10 active:scale-90"
              title="Cerrar Sesión"
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
                  strokeWidth="2.5"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
