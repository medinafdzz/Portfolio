import Button from './Button';

function Info() {
  const text1 = "¡Hola!";
  const text2 = "Soy Alejandro Medina";
  
  return (
    <div className="text-center space-y-8 max-w-4xl mx-auto px-4">
      {/* Título principal con efecto hover letra por letra */}
      <h1 className="text-5xl md:text-7xl font-bold leading-tight pb-2">
        <span className="block text-white mb-2 hover-text">
          {text1.split('').map((char, index) => (
            <span 
              key={index} 
              className="hover-letter inline-block transition-all duration-300"
              style={{ transitionDelay: `${index * 20}ms` }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </span>
        <span className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 hover-text pb-2">
          {text2.split('').map((char, index) => (
            <span 
              key={index} 
              className="hover-letter inline-block transition-all duration-300"
              style={{ transitionDelay: `${index * 20}ms` }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </span>
      </h1>

      {/* Subtítulo */}
      <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
        Ingeniero Informático en Tecnologías de la Información
      </p>

      {/* Descripción adicional */}
      <p className="text-gray-500 max-w-xl mx-auto">
          Me considero una persona autodidacta y curiosa, desde pequeño me han apasionado los ordenadores
          y la tecnología, lo que me llevó a estudiar esta carrera. Disfruto aprendiendo
          nuevas herramientas y lenguajes. Soy un fiel partidario de que la práctica lleva al conocimiento.

      </p>

      {/* Botones de acción */}
      <div className="flex flex-wrap gap-4 justify-center pt-4">
        <Button 
          variant="primary" 
          size="lg"
          onClick={() => window.open('https://github.com/medinafdzz?tab=repositories', '_blank')}
        >
          <span>Ver Proyectos</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Button>
        
        {/* Enlace directo como <a> */}
        <a 
          href="/CV.pdf" 
          download="CV_Alejandro_Medina.pdf"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm font-semibold transition-all duration-300 rounded-lg"
        >
          <span>Descargar CV</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </a>
      </div>

      {/* Indicador de scroll */}
      <div className="pt-12 animate-bounce">
        <svg className="w-6 h-6 mx-auto text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  );
}

export default Info;