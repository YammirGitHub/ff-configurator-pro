import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Esta función es el "pegamento" de tus estilos Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
