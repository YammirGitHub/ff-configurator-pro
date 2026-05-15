type HapticFeedbackType = 'light' | 'medium' | 'heavy' | 'success' | 'error';

export const triggerHaptic = (type: HapticFeedbackType): void => {
  // Evitamos errores en SSR (Next.js) y verificamos soporte en el dispositivo
  if (typeof window === 'undefined' || !navigator.vibrate) return;

  const patterns: Record<HapticFeedbackType, number | number[]> = {
    light: 50,
    medium: 100,
    heavy: 150,
    success: [50, 50, 100],
    error: [50, 50, 50, 50, 50]
  };

  navigator.vibrate(patterns[type]);
};
