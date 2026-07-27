function Info() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 text-center break-words">
      <h1>
        <span className="type-feature block text-white">¡Hola!</span>
        <span className="type-display mt-3 block pb-2 text-pink-300">Soy Alejandro Medina</span>
      </h1>

      <p className="text-lg font-medium leading-snug tracking-[-0.01em] text-gray-200 sm:text-xl md:text-2xl">
        Ingeniería de software · Backend y sistemas
      </p>

      <p className="type-body mx-auto max-w-[65ch] text-gray-300">
        Desarrollo software con especial interés en backend, sistemas y automatización.
        Trabajo con Java, C, Python y shell, cuidando especialmente la seguridad y la
        calidad del código.
        <span className="block mt-2">
          En 2026 trabajé como becario de Ingeniería de Software en Indra Sistemas,
          desarrollando herramientas para sistemas ATM.
        </span>
      </p>

      <div className="flex flex-col xs:flex-row flex-wrap gap-3 xs:gap-4 justify-center pt-2">
        <a
          href="#projects"
          aria-label="Ir a proyectos destacados"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-black/20 transition-colors duration-300 hover:from-purple-700 hover:to-pink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 focus-visible:ring-offset-4 focus-visible:ring-offset-gray-950"
        >
          <span>Ver Proyectos</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </a>

        <a
          href="/CV.pdf"
          download="CV_Alejandro_Medina.pdf"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-8 py-4 text-base font-semibold text-white transition-colors duration-300 hover:border-white/40 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 focus-visible:ring-offset-4 focus-visible:ring-offset-gray-950"
          aria-label="Descargar CV en PDF"
        >
          <span>Descargar CV</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </a>
      </div>

    </div>
  );
}

export default Info;
