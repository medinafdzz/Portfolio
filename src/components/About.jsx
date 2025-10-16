import SectionTitle from './SectionTitle';
import Card from './Card';

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

      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Imagen/Avatar */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <Card className="relative h-96 flex items-center justify-center">
            <div className="w-48 h-48 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-6xl">
              👨‍💻
            </div>
          </Card>
        </div>

        {/* Contenido */}
        <div className="space-y-6">
          <p className="text-gray-300 text-lg leading-relaxed">
            Soy un desarrollador apasionado con más de <span className="text-purple-400 font-semibold">X años de experiencia</span> creando 
            aplicaciones web modernas. Me especializo en tecnologías como React, Node.js y bases de datos SQL/NoSQL.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Mi objetivo es construir productos que no solo cumplan con los requisitos técnicos, 
            sino que también ofrezcan experiencias excepcionales a los usuarios.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
              >
                <div className="text-3xl mb-2">{feature.icon}</div>
                <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;