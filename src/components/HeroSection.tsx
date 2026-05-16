// src/components/HeroSection.tsx

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[100dvh] bg-[#07080f] overflow-hidden">
      {/* 👇 REGLA 3 & 4 (Padre): Imagen 100% inmersiva. Cero backdrop-blur para la barra superior. */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/hero-bg.webp"
          alt="Background"
          className="w-full h-full object-cover object-center"
          loading="eager"
          decoding="async"
        />
        {/* Degradado inferior opcional para dar contraste al texto, top limpio */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#07080f] to-transparent" />
      </div>

      {/* 👇 REGLA 3 (Hijo): Contenedor empuja el contenido debajo de la cámara con "pt-safe-top" */}
      <div className="relative z-10 w-full h-full flex flex-col justify-end pt-safe-top pb-safe-bottom px-4 sm:px-8 max-w-[1400px] mx-auto min-h-[100dvh]">
        <div className="flex flex-col gap-4 mb-20 sm:mb-24">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#ff6b35] drop-shadow-md">
            SISTEMA MAESTRO
          </span>

          <h1 className="font-display text-5xl sm:text-7xl font-black text-white tracking-tighter leading-none max-w-3xl drop-shadow-lg">
            INMERSIÓN <br /> ABSOLUTA.
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 max-w-xl font-medium mt-2">
            Arquitectura PWA "Edge-to-Edge". Sin franjas, sin difuminados
            estorbando la lectura de hora y batería.
          </p>
        </div>
      </div>
    </section>
  );
}
