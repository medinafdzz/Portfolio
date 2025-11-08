import Button from './Button';

function Info() {
  return (
    <div className="text-center space-y-8 max-w-4xl mx-auto px-4">
      <div className="flex items-center justify-center gap-3">
        <span className="h-1 w-14 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-400"></span>
        <span className="h-1 w-4 rounded-full bg-white/30"></span>
      </div>

      <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight md:leading-[1.15]">
        <span className="block text-white">¡Hola!</span>
        <span className="mt-2 block pb-2 leading-tight text-gradient animate-gradient">Soy Alejandro Medina</span>
      </h1>

      <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>

      <p className="text-base xs:text-lg sm:text-xl md:text-2xl text-gray-300">Ingeniero Informático en Tecnologías de la Información</p>

      <p className="text-xs xs:text-sm sm:text-base text-gray-400 max-w-xl mx-auto leading-relaxed xs:leading-6 sm:leading-7 md:leading-8 tracking-wide">
        Me considero una persona autodidacta y curiosa, desde pequeño me han apasionado los ordenadores y la tecnología, lo que me llevó a estudiar esta carrera. Disfruto aprendiendo nuevas herramientas y lenguajes.
        <span className="block mt-2">Soy un fiel partidario de que la práctica lleva al saber.</span>
      </p>

      <div className="flex flex-col xs:flex-row flex-wrap gap-3 xs:gap-4 justify-center pt-2">
        <Button
          variant="primary"
          size="lg"
          onClick={() => window.open('https://github.com/medinafdzz?tab=repositories', '_blank')}
          type="button"
          aria-label="Ver proyectos en GitHub en una nueva pestaña"
        >
          <span>Ver Proyectos</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Button>

        <a
          href="/CV.pdf"
          download="CV_Alejandro_Medina.pdf"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:border-white/40"
          aria-label="Descargar CV en PDF"
        >
          <span>Descargar CV</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </a>
      </div>

      <div className="mt-6 flex flex-col items-center gap-3 text-gray-500">
        <p className="text-xs xs:text-sm sm:text-base">Continúa deslizando</p>
        <div className="flex h-12 w-8 items-center justify-center rounded-full border border-white/20">
          <svg className="w-4 h-4 text-gray-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default Info;