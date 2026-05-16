"use client";

export function ProgressiveBlur() {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-40 pointer-events-none"
      style={{
        // Altura exacta: El notch del iPhone + 60px para que el difuminado caiga suavemente
        height: "calc(max(env(safe-area-inset-top), 24px) + 60px)",

        // 1. EL CRISTAL: Desenfoque nativo puro
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",

        // 2. EL CONTRASTE: Un gradiente sutil oscuro que protege la hora y batería (Evita que fondos blancos las oculten)
        background: "linear-gradient(to bottom, rgba(7, 8, 15, 0.7) 0%, rgba(7, 8, 15, 0) 100%)",

        // 3. LA MAGIA DE D'IRMA: La máscara que derrite el cristal hacia la nada
        WebkitMaskImage: "-webkit-linear-gradient(top, black 20%, transparent 100%)",
        maskImage: "linear-gradient(to bottom, black 20%, transparent 100%)",

        // 4. RENDIMIENTO EXTREMO: Obliga a Safari a renderizar esto en la GPU (Cero Bugs de scroll)
        transform: "translateZ(0)",
        WebkitTransform: "translateZ(0)",
      }}
    />
  );
}
