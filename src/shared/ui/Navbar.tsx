"use client";

import { auth } from "@/shared/config/firebase";
import { signOut } from "firebase/auth";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();

  if (pathname === "/login") return null;

  return (
    // 👇 FÍJATE EN ESTA LÍNEA: top-0 y pt-[max(1.5rem,env(safe-area-inset-top))]
    <nav className="fixed top-0 z-50 flex w-full justify-center px-4 pt-[max(1.5rem,env(safe-area-inset-top))] pb-4 pointer-events-none">
      <div className="pointer-events-auto relative overflow-hidden rounded-full border border-white/[0.08] bg-[#0d0f1a]/80 px-6 py-3 lg:px-8 lg:py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl flex items-center gap-4 lg:gap-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="flex flex-col items-center justify-center text-center">
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

        <button
          onClick={() => signOut(auth)}
          className="ml-2 rounded-full bg-white/5 p-2 text-zinc-400 transition-all hover:bg-red-500/20 hover:text-red-400 active:scale-95"
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
      </div>
    </nav>
  );
}
