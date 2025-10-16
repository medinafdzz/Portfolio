import Button from './Button';

function Info() {
  return (
    <div className="text-center space-y-8 max-w-4xl mx-auto px-4">
      {/* Título principal */}
      <h1 className="text-5xl md:text-7xl font-bold leading-tight">
        <span className="block text-white mb-2">Hola, soy</span>
        <span className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 animate-gradient">
          Tu Nombre
        </span>
      </h1>

      {/* Subtítulo */}
      <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
        Desarrollador Full Stack especializado en crear experiencias web modernas y escalables
      </p>

      {/* Descripción adicional */}
      <p className="text-gray-500 max-w-xl mx-auto">
        Transformo ideas en productos digitales funcionales y atractivos. 
        Apasionado por el código limpio y las mejores prácticas.
      </p>

      {/* Botones de acción */}
      <div className="flex flex-wrap gap-4 justify-center pt-4">
        <Button variant="primary" size="lg">
          <span>Ver Proyectos</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Button>
        <Button variant="secondary" size="lg">
          <span>Descargar CV</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </Button>
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