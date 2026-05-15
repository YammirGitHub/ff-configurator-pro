"use client";

import { triggerHaptic } from "@/shared/utils/haptics";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Tab = "home" | "admin";

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (pathname === "/admin-yammir") setActiveTab("admin");
    else setActiveTab("home");
  }, [pathname]);

  if (!isMounted || !pathname || pathname.includes("login")) return null;

  const handleTabClick = (tab: Tab, route: string) => {
    if (activeTab === tab) return;
    triggerHaptic("light");
    setActiveTab(tab);
    router.push(route);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#07080f]/90 backdrop-blur-2xl border-t border-white/[0.04] shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
      style={{
        // Protege contra la barra de gestos inferior de iPhone y Android
        paddingBottom: "max(0.5rem, var(--safe-bottom))",
      }}
    >
      <div className="flex justify-around items-center h-16 px-4 max-w-[1400px] mx-auto w-full">
        <button
          onClick={() => handleTabClick("home", "/")}
          className={`flex flex-col items-center justify-center w-20 h-full transition-transform active:scale-90 will-change-transform ${activeTab === "home" ? "text-[#ff6b35]" : "text-zinc-500 hover:text-zinc-300"}`}
        >
          <span className="text-[22px] mb-1 leading-none">🏠</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">
            Inicio
          </span>
        </button>

        <button
          onClick={() => handleTabClick("admin", "/admin-yammir")}
          className={`flex flex-col items-center justify-center w-20 h-full transition-transform active:scale-90 will-change-transform ${activeTab === "admin" ? "text-[#ffd700]" : "text-zinc-500 hover:text-zinc-300"}`}
        >
          <span className="text-[22px] mb-1 leading-none">👑</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">
            Panel VIP
          </span>
        </button>
      </div>
    </nav>
  );
}
