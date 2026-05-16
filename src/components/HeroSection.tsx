export function HeroSection() {
  return (
    // CONTENEDOR PADRE: Edge-to-Edge total.
    <section className="relative w-full min-h-[100dvh] bg-black overflow-hidden">
      {/* 👇 REGLA 4 (ESTRICTA):
        Cero blur, cero franjas. La imagen ocupa el 100% físico.
        La hora de iOS/Android se verá perfectamente sobre este <img />.
      */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/hero-bg.webp"
          alt="Fondo Inmersivo"
          className="h-full w-full object-cover object-center"
          loading="eager"
          decoding="async"
        />
      </div>

      {/* 👇 REGLA 3 (CONTENEDOR HIJO):
        Usa 'pt-safe-top' (inyectado por Tailwind v4) para que el texto baje
        dinámicamente dependiendo de si es un iPhone 15 con Isla Dinámica
        o un Android con Notch de gota.
      */}
      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[1400px] flex-col justify-end px-6 pb-safe-bottom pt-safe-top sm:px-8">
        <div className="mb-16 flex flex-col gap-3 sm:mb-24">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-[#ff6b35] drop-shadow-md">
            Sistema VIP Activado
          </span>

          <h1 className="max-w-3xl font-display text-5xl font-black leading-[0.95] tracking-tighter text-white drop-shadow-lg sm:text-7xl lg:text-8xl">
            INMERSIÓN <br /> ABSOLUTA.
          </h1>

          <p className="mt-2 max-w-xl text-base font-medium text-white/90 drop-shadow sm:text-lg">
            Esta aplicación respira. Ni un solo recuadro difuminado ensucia tu
            status bar. Arquitectura nativa perfecta.
          </p>

          <div className="mt-6">
            <button className="will-change-transform rounded-full bg-white px-8 py-4 text-xs font-black uppercase tracking-[0.15em] text-black shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-transform active:scale-95 sm:text-sm">
              Ingresar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
