import SectionTitle from './SectionTitle';
import perfilImg from '../assets/perfil.png'; 

function About() {
  const features = [
    {
      icon: "💡",
      title: "Pensamiento Creativo",
      description: "Soluciones innovadoras para problemas complejos"
    },
    {
      icon: "🚀",
      title: "Desarrollo Ágil",
      description: "Metodologías modernas para entregas rápidas"
    },
    {
      icon: "🎯",
      title: "Orientado a Resultados",
      description: "Enfocado en objetivos medibles y KPIs"
    },
    {
      icon: "🤝",
      title: "Trabajo en Equipo",
      description: "Colaboración efectiva y comunicación clara"
    }
  ];

  return (
    <div>
      <SectionTitle subtitle="Conoce más sobre mi trayectoria y experiencia">
        Sobre Mí
      </SectionTitle>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Imagen/Avatar */}
        <div className="relative group flex justify-center">
          {/* Glow effect de fondo */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Contenedor de la imagen */}
          <div className="relative">
            {/* Anillo animado exterior */}
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full opacity-75 blur-sm group-hover:opacity-100 animate-pulse"></div>
            
            {/* Círculo con imagen */}
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden border-2 border-purple-400/50 shadow-2xl shadow-purple-500/20 group-hover:scale-105 transition-all duration-500">
              <img 
                src={perfilImg} 
                alt="Alejandro Medina - Foto de perfil" 
                className="w-full h-full object-cover object-center scale-110"
              />
              {/* Overlay sutil para mejorar contraste */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-purple-900/20"></div>
            </div>

            {/* Decoración: puntos alrededor*/}
            <div className="absolute -top-6 -right-6 w-4 h-4 bg-pink-500 rounded-full animate-ping"></div>
            <div className="absolute -bottom-6 -left-6 w-3 h-3 bg-purple-500 rounded-full animate-ping"></div>
            <div className="absolute top-4 -right-8 w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
            <div className="absolute -top-8 left-16 w-2 h-2 bg-pink-400 rounded-full animate-ping"></div>
            <div className="absolute bottom-2 -left-8 w-4 h-4 bg-purple-400 rounded-full animate-ping"></div>
            <div className="absolute -bottom-7 right-20 w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
            <div className="absolute top-24 -left-7 w-2 h-2 bg-pink-500 rounded-full animate-ping"></div>
            <div className="absolute -top-7 right-24 w-3 h-3 bg-purple-500 rounded-full animate-ping"></div>
            <div className="absolute bottom-20 -right-7 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Contenido */}
        <div className="space-y-6">
          <div className="space-y-4">
            <p className="text-gray-300 text-lg leading-relaxed">
              Soy un <span className="text-purple-400 font-semibold">estudiante de Ingeniería en Informática</span> en Tecnologías de la Información, 
              apasionado por crear aplicaciones web modernas y funcionales.
            </p>
            <p className="text-gray-400 leading-relaxed">
              A lo largo de mi formación he desarrollado proyectos en diversos lenguajes de programación, así como diseño web. 
              Soy una persona curiosa, con ganas de aprender y aportar en entornos grupales.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all duration-300 group/card"
              >
                <div className="text-3xl mb-2 group-hover/card:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="font-semibold text-white mb-1 text-sm">{feature.title}</h3>
                <p className="text-xs text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;