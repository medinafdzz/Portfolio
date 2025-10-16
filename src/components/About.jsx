import SectionTitle from './SectionTitle';
import perfilImg from '../assets/perfil.png'; 

function About() {
  const education = [
    {
      icon: "🎓",
      title: "Bachiller científico",
      center: "Instituto Santa Bárbara (Langreo)",
      years: "2019 - 2021"
    },
        {
      icon: "🌍",
      title: "Ingegneria Informatica ",
      center: "Università degli Studi di Salerno",
      years: "2024 - 2025",
      note: "Año Erasmus"
    },
    {
      icon: "💻",
      title: "Ingeniería Informática en Tecnologías de la Información",
      center: "EPI Gijón",
      years: "2021 - 2025"
    },
  ];

  return (
    <div className="pt-[clamp(5rem,6vw,6rem)] pb-[clamp(2rem,3vw,3rem)]">
      <SectionTitle subtitle="Conoce más sobre mi trayectoria y experiencia">
        Sobre Mí
      </SectionTitle>

      <div className="grid md:grid-cols-2 gap-[clamp(2rem,3vw,3rem)] items-center">
        {/* Imagen/Avatar */}
        <div className="relative group flex justify-center">
          {/* Glow effect de fondo */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Contenedor de la imagen */}
          <div className="relative">
            {/* Anillo animado exterior */}
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full opacity-75 blur-sm group-hover:opacity-100 animate-pulse"></div>
            
            {/* Círculo con imagen */}
            <div className="relative w-[clamp(10rem,16vw,14rem)] h-[clamp(10rem,16vw,14rem)] rounded-full overflow-hidden border-2 border-purple-400/50 shadow-2xl shadow-purple-500/20 group-hover:scale-105 transition-all duration-500">
              <img 
                src={perfilImg} 
                alt="Alejandro Medina - Foto de perfil" 
                className="w-full h-full object-cover object-center scale-110"
              />
              {/* Overlay sutil para mejorar contraste */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-purple-900/20"></div>
            </div>

            {/* Decoración: puntos alrededor*/}
            <div className="absolute -top-[clamp(1rem,1.5vw,1.5rem)] -right-[clamp(1rem,1.5vw,1.5rem)] w-[clamp(0.625rem,0.8vw,0.75rem)] h-[clamp(0.625rem,0.8vw,0.75rem)] bg-pink-500 rounded-full animate-ping"></div>
            <div className="absolute -bottom-[clamp(1rem,1.5vw,1.5rem)] -left-[clamp(1rem,1.5vw,1.5rem)] w-[clamp(0.5rem,0.7vw,0.625rem)] h-[clamp(0.5rem,0.7vw,0.625rem)] bg-purple-500 rounded-full animate-ping"></div>
            <div className="absolute top-[clamp(0.75rem,1vw,1rem)] -right-[clamp(1.5rem,2vw,2rem)] w-[clamp(0.5rem,0.7vw,0.625rem)] h-[clamp(0.5rem,0.7vw,0.625rem)] bg-blue-400 rounded-full animate-ping"></div>
            <div className="absolute -top-[clamp(1.5rem,2vw,2rem)] left-[clamp(3rem,4vw,4rem)] w-[clamp(0.375rem,0.5vw,0.5rem)] h-[clamp(0.375rem,0.5vw,0.5rem)] bg-pink-400 rounded-full animate-ping"></div>
            <div className="absolute bottom-[clamp(0.375rem,0.5vw,0.5rem)] -left-[clamp(1.5rem,2vw,2rem)] w-[clamp(0.625rem,0.8vw,0.75rem)] h-[clamp(0.625rem,0.8vw,0.75rem)] bg-purple-400 rounded-full animate-ping"></div>
            <div className="absolute -bottom-[clamp(1.25rem,1.75vw,1.75rem)] right-[clamp(4rem,5vw,5rem)] w-[clamp(0.5rem,0.7vw,0.625rem)] h-[clamp(0.5rem,0.7vw,0.625rem)] bg-blue-500 rounded-full animate-ping"></div>
            <div className="absolute top-[clamp(5rem,6vw,6rem)] -left-[clamp(1.25rem,1.75vw,1.75rem)] w-[clamp(0.375rem,0.5vw,0.5rem)] h-[clamp(0.375rem,0.5vw,0.5rem)] bg-pink-500 rounded-full animate-ping"></div>
            <div className="absolute -top-[clamp(1.25rem,1.75vw,1.75rem)] right-[clamp(5rem,6vw,6rem)] w-[clamp(0.5rem,0.7vw,0.625rem)] h-[clamp(0.5rem,0.7vw,0.625rem)] bg-purple-500 rounded-full animate-ping"></div>
            <div className="absolute bottom-[clamp(4rem,5vw,5rem)] -right-[clamp(1.25rem,1.75vw,1.75rem)] w-[clamp(0.375rem,0.5vw,0.5rem)] h-[clamp(0.375rem,0.5vw,0.5rem)] bg-blue-400 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Contenido */}
        <div className="space-y-[clamp(0.75rem,1.5vw,1.5rem)]">
          <div className="space-y-[clamp(0.5rem,1vw,1rem)]">
            <p className="text-gray-300 text-[clamp(0.875rem,1.5vw,1.125rem)] leading-relaxed">
              Soy un <span className="text-purple-400 font-semibold">Estudiante de Ingeniería en Informática</span> en Tecnologías de la Información, 
              me gustaría especializarme en ciberseguridad y ciberinteligencia.
            </p>
            <p className="text-gray-400 text-[clamp(0.75rem,1.2vw,0.875rem)] leading-relaxed">
              Durante mi formación he trabajado con diversos lenguajes de programación y tecnologías que me han
              ayudado a aumentar mi Tech Stack. Además, he desarrollado habilidades en gestión de proyectos y trabajo en equipo,
              lo que me permite adaptarme rápidamente a los diferentes entornos laborales. 
            </p>
          </div>

          {/* Lista de centros de estudio */}
          <div className="relative flex flex-col items-start pt-[clamp(0.75rem,1vw,1rem)] pl-[clamp(1.5rem,2vw,2rem)]">
            {/* Línea vertical a la izquierda */}
            <div className="absolute left-0 top-[clamp(1.5rem,2vw,2rem)] bottom-[clamp(1.5rem,2vw,2rem)] w-[clamp(0.125rem,0.15vw,0.25rem)] bg-gradient-to-b from-purple-500 via-pink-500 to-blue-400 opacity-40 z-0"></div>
            {education.map((edu, index) => (
              <div
                key={index}
                className="relative z-10 w-full mb-[clamp(1rem,2vw,2rem)] last:mb-0"
                style={{ marginLeft: '0.5rem' }} // separa la tarjeta de la línea
              >
                <div className="bg-white/5 border border-white/10 rounded-xl p-[clamp(0.75rem,1vw,1rem)] flex-1 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all duration-300">
                  <h3 className="font-semibold text-white mb-[clamp(0.125rem,0.25vw,0.25rem)] text-[clamp(0.75rem,1.2vw,0.875rem)]">{edu.title}</h3>
                  <p className="text-[clamp(0.625rem,1vw,0.75rem)] text-gray-400 mb-[clamp(0.125rem,0.25vw,0.25rem)]">{edu.center}</p>
                  <p className="text-[clamp(0.5rem,0.9vw,0.625rem)] text-gray-400">{edu.years}</p>
                  {edu.note && (
                    <p className="text-[clamp(0.5rem,0.9vw,0.625rem)] text-pink-400 mt-[clamp(0.125rem,0.25vw,0.25rem)]">{edu.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;