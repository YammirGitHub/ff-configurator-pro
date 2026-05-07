// src/entities/device/types.ts

// Diccionario oficial de TODAS tus marcas
export type DeviceBrand = "apple" | "samsung" | "xiaomi" | "poco" | "huawei" | "honor" | "motorola" | "oppo" | "realme" | "oneplus" | "vivo" | "asus" | "google" | "sony" | "nothing" | "tecno" | "infinix" | "zte" | "lg" | "nokia" | "lenovo" | "otros";

// Estructura exacta de tus celulares
export interface Device {
  name: string;
  dpi: number;
  tier: string; // low, mid, mid_high, high
  hz: number;
  touch_sampling_rate: number;
  display_type: string;
  ui: string;
  screen_size_inches: number;
}
