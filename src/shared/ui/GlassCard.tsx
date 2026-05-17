"use client";

import { cn } from "@/shared/lib/utils";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        // 👇 FIX: Restaurado el padding interno (p-5 sm:p-6 lg:p-8) para que el contenido respire
        "relative overflow-hidden rounded-[28px] border border-white/[0.06] bg-[#0e1020]/80 p-5 sm:p-6 lg:p-8 shadow-[0_8px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl",
        className,
      )}
    >
      {/* Reflejo de luz superior (Toque Premium) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {children}
    </motion.div>
  );
}
