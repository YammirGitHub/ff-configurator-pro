// src/components/HeroSection.tsx

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[100dvh] bg-black overflow-hidden">
      {/* 👇 REGLA 3 & 4 (Contenedor Padre):
          Imagen de fondo al 100% (Edge-to-Edge).
          CERO backdrop-blur o recuadros en la parte superior. La hora y la batería flotan limpiamente sobre la imagen.
      */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/hero-bg.webp"
          alt="Hero Background"
          className="w-full h-full object-cover object-center"
          loading="eager"
          decoding="async"
        />
        {/* Degradado inferior opcional únicamente para dar contraste al texto, dejando el top 100% intacto y transparente */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      {/* 👇 REGLA 3 (Contenedor Hijo):
          "Single Source of Truth". Usa "pt-safe-top" para proteger el contenido de la cámara.
          El contenedor empuja la UI hacia el área segura sin ensuciar el background.
      */}
      <div className="relative z-10 w-full h-full flex flex-col justify-end pt-safe-top pb-safe-bottom px-6 sm:px-8 max-w-[1400px] mx-auto min-h-[100dvh]">
        <div className="flex flex-col gap-4 mb-12 sm:mb-16 md:mb-24">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-white/80 drop-shadow-md">
            Experiencia Nivel Dios
          </span>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.95] max-w-3xl drop-shadow-lg">
            INMERSIÓN <br /> ABSOLUTA.
          </h1>

          <p className="text-base sm:text-lg text-white/90 max-w-xl font-medium mt-4 drop-shadow">
            Arquitectura PWA "Edge-to-Edge" en estado puro. Sin franjas, sin
            difuminados estorbando el hardware. Exactamente como SwiftUI.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <button className="bg-white text-black px-8 py-4 rounded-full font-bold text-xs sm:text-sm uppercase tracking-[0.15em] transition-transform active:scale-95 will-change-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]">
              Entrar a la Bóveda
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
