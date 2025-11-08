import SectionTitle from './SectionTitle';
import perfilImg from '../assets/perfil.png'; 

function About() {
  const education = [
    { icon: '🎓', title: 'Bachiller científico', center: 'Instituto Santa Bárbara (Langreo)', years: '2019 - 2021' },
    { icon: '🌍', title: 'Ingegneria Informatica ', center: 'Università degli Studi di Salerno', years: '2024 - 2025', note: 'Año Erasmus' },
    { icon: '💻', title: 'Ingeniería Informática en Tecnologías de la Información', center: 'EPI Gijón', years: '2021 - 2025' },
  ];

  return (
    <div className="mt-6 md:mt-10">
      <SectionTitle subtitle="Conoce más sobre mi trayectoria y experiencia">
        Sobre mí
      </SectionTitle>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
        {/* Contenedor de imagen (responsive) */}
        <div className="relative group flex justify-center mb-6 md:mb-0 px-6 sm:px-10">
          {/* Brillo de fondo */}
          <div className="absolute inset-6 sm:inset-8 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Contenedor de la imagen */}
          <div className="relative">
            {/* Anillo animado exterior */}
            <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full opacity-60 sm:opacity-75 blur-sm transform transition-transform duration-500 group-hover:opacity-100 group-hover:scale-105 animate-pulse"></div>
            
            {/* Círculo con imagen */}
            <div className="relative w-32 h-32 xs:w-40 xs:h-40 sm:w-52 sm:h-52 md:w-60 md:h-60 rounded-full overflow-hidden border-2 border-purple-400/50 shadow-2xl shadow-purple-500/20 group-hover:scale-105 transition-all duration-500">
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
        
          {/* Texto y línea temporal */}
        <div className="space-y-3 md:space-y-5 px-1 xs:px-4">
          <div className="space-y-3">
            <p className="text-center md:text-left text-gray-400 text-sm xs:text-base md:text-lg leading-relaxed xs:leading-6 md:leading-7 tracking-wide">
              <span className="font-bold block">
                Soy un Estudiante de Ingeniería en Informática en Tecnologías de la Información, me gustaría especializarme en ciberseguridad y ciberinteligencia.
              </span>

              <span className="block mt-3">
                He trabajado con distintos lenguajes y tecnologías que han fortalecido mi Tech Stack, además de desarrollar habilidades en gestión de proyectos y trabajo en equipo que me permiten adaptarme con rapidez a nuevos entornos. </span>
            </p>
          </div>

          {/* Línea temporal de estudios */}
          <div className="relative flex flex-col items-start pt-3 pl-7">
            {/* Línea vertical a la izquierda */}
            <div className="absolute left-0 top-8 bottom-8 w-1 bg-gradient-to-b from-purple-500 via-pink-500 to-blue-400 opacity-40 z-0"></div>
            {education.map((edu) => (
              <div key={edu.title} className="relative z-10 w-full mb-6 last:mb-0 ml-2">
                <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex-1 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all duration-300">
                  <h3 className="font-semibold text-white mb-1 text-base">{edu.title}</h3>
                  <p className="text-sm text-gray-400 mb-1">{edu.center}</p>
                  <p className="text-xs text-gray-400">{edu.years}</p>
                  {edu.note && <p className="text-xs text-pink-400 mt-1">{edu.note}</p>}
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