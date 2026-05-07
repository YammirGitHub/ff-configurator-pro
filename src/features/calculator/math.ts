// src/features/calculator/math.ts

export function clamp(value: number, min: number, max: number) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

// Convierte a la escala 0-200 de FF de forma segura
export function scaleToFF(value: number) {
  const clamped = clamp(value, 0, 100);
  return Math.round(clamped * 2);
}

export function getExtraDpiForTier(tier: string) {
  switch (tier) {
    case "high":
      return 100; // Soporta inyección alta de DPI sin calentar el procesador
    case "mid_high":
      return 80;
    case "mid":
      return 60;
    case "low":
      return 30; // Previene el input lag por sobrecarga de renderizado
    default:
      return 60;
  }
}

export function getTierMultiplier(tier: string) {
  switch (tier) {
    case "high":
      return 1.12; // Fricción virtual: frena el deslizamiento en pantallas súper lisas (Anti-Temblor)
    case "mid_high":
      return 1.05;
    case "mid":
      return 0.95;
    case "low":
      return 0.75; // Aceleración virtual: rompe el input lag de pantallas pesadas (Anti-Pecho)
    default:
      return 0.95;
  }
}

export function computeFireButtonSize(
  tier: string,
  hz: number,
  firePreference: string,
  dpi: number,
  dpiEnabled: boolean,
) {
  let base = 50;

  // A mayor densidad de píxeles (DPI nativo), el hit-box táctil es más preciso
  if (dpi <= 320) base = 57;
  else if (dpi <= 400) base = 54;
  else if (dpi <= 460) base = 49;
  else base = 45;

  if (tier === "high" || tier === "mid_high") base -= 2;
  else if (tier === "low") base += 4; // Gamabaja necesita botones más grandes por falta de precisión táctil

  if (hz >= 120) base -= 2;
  else if (hz <= 60) base += 2;

  if (dpiEnabled) base -= 2;

  if (firePreference === "small") base -= 6;
  else if (firePreference === "large") base += 6;

  return clamp(Math.round(base), 35, 65);
}

export function computeProConfig(
  model: any,
  dpiModeOn: boolean,
  firePreference: string,
) {
  // 1. ESPECIFICACIONES FÍSICAS
  const realDpi = model.dpi || 400;
  const tier = model.tier || "mid";
  const hz = model.hz || 60;
  const touchSampling = model.touch_sampling_rate || 240;
  const screenSize = model.screen_size_inches || 6.5;

  // 2. CÁLCULO DE DPI
  const extraDpi = dpiModeOn ? getExtraDpiForTier(tier) : 0;
  const usedDpi = realDpi + extraDpi;

  // 3. MATRIZ DE FRICCIÓN Y RENDIMIENTO
  const tierMultiplier = getTierMultiplier(tier);
  const hzFactor = hz >= 144 ? 1.08 : hz >= 120 ? 1.05 : hz >= 90 ? 1.01 : 0.92;
  const touchFactor = touchSampling >= 480 ? 1.06 : touchSampling >= 360 ? 1.04 : touchSampling >= 240 ? 1.0 : 0.90;
  const screenFactor = screenSize >= 7.5 ? 1.15 : screenSize >= 6.8 ? 1.04 : screenSize <= 6.0 ? 0.85 : 0.98;

  // 4. eDPI (Sensibilidad Efectiva Real)
  const eDpi = usedDpi * tierMultiplier * hzFactor * touchFactor * screenFactor;

  // Constante de calibración (1.75 ajustado para la nueva meta de FF)
  const base = (10000 / eDpi) * 1.75;

  // 5. CÁLCULO DE BOTÓN Y PARADOJA DE PISTA DE ATERRIZAJE
  const optimalButtonSize = computeFireButtonSize(tier, hz, firePreference, usedDpi, dpiModeOn);

  // CORRECCIÓN MAGISTRAL:
  // Botón grande = Poco espacio para alzar mira = Inyectamos más sensibilidad (+5)
  // Botón chico = Mucho espacio para alzar mira = Reducimos sensibilidad (-3) para evitar overshooting
  let buttonAdj = optimalButtonSize >= 56 ? 5 : optimalButtonSize >= 50 ? 2 : optimalButtonSize <= 42 ? -3 : 0;

  // 6. GENERACIÓN DE CURVA BASE
  let sensConfig = {
    general: clamp(scaleToFF(base * 1.35 + buttonAdj), 45, 200),
    redDot: clamp(scaleToFF(base * 1.80 + buttonAdj), 60, 200),
    scope2x: clamp(scaleToFF(base * 1.65 + buttonAdj), 55, 200),
    scope4x: clamp(scaleToFF(base * 1.50 + buttonAdj), 50, 200),
    sniper: clamp(scaleToFF(base * 1.15 + buttonAdj), 20, 120), // Sniper congelado para precisión total
    camera360: clamp(scaleToFF(base * 2.15 + buttonAdj), 70, 200),
  };

  // 7. CORSÉ MATEMÁTICO ANTI-TEMBLOR / ANTI-PECHO
  // Evita que la mira tiemble en Gama Alta y que se pegue al pecho en Gama Baja
  sensConfig.redDot = clamp(
    sensConfig.redDot,
    sensConfig.general + 8,   // Suficiente fuerza para despegar del pecho
    sensConfig.general + 22   // Límite de estabilidad craneal
  );

  // Desaceleración logarítmica para miras telescópicas (Tracking suave)
  sensConfig.scope2x = clamp(
    sensConfig.scope2x,
    sensConfig.redDot - 16,
    sensConfig.redDot - 6
  );

  sensConfig.scope4x = clamp(
    sensConfig.scope4x,
    sensConfig.scope2x - 14,
    sensConfig.scope2x - 4
  );

  return { sensConfig, optimalButtonSize, realDpi, usedDpi, tier };
}
