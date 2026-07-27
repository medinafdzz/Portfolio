import SectionTitle from './SectionTitle';
import perfilSmall from '../assets/perfil-256.webp';
import perfilLarge from '../assets/perfil-480.webp';

function About() {
  const experience = {
    title: 'Becario de Ingeniería de Software',
    center: 'Indra Sistemas',
    years: 'Enero - julio de 2026',
    description: 'Desarrollo de herramientas para sistemas ATM.',
    tools: 'Java · C · Python · shell · Jenkins · SonarQube · Bitbucket · MCPs · LLMs',
  };

  const education = [
    { title: 'Bachiller científico', center: 'Instituto Santa Bárbara (Langreo)', years: '2019 - 2021' },
    {
      title: 'Ingegneria Informatica',
      center: 'Università degli Studi di Salerno',
      years: '2024 - 2025',
      note: 'Erasmus · Embedded Systems · Software Dependability · Seguridad IoT · Serverless Computing',
    },
    { title: 'Ingeniería Informática en Tecnologías de la Información', center: 'EPI Gijón', years: '2021 - 2025' },
  ];

  return (
    <div className="mt-6 md:mt-10">
      <SectionTitle subtitle="Conoce más sobre mi trayectoria y experiencia">
        Sobre mí
      </SectionTitle>

      <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-12">
        <div className="group flex justify-center px-6 sm:px-10">
          <div>
            <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-purple-400/50 shadow-2xl shadow-black/30 transition-transform duration-500 group-hover:scale-105 xs:h-40 xs:w-40 sm:h-52 sm:w-52 md:h-60 md:w-60">
              <img 
                src={perfilLarge}
                srcSet={`${perfilSmall} 256w, ${perfilLarge} 480w`}
                sizes="(min-width: 768px) 240px, (min-width: 640px) 208px, (min-width: 475px) 160px, 128px"
                alt="Retrato de Alejandro Medina"
                width="480"
                height="480"
                className="w-full h-full object-cover object-center scale-110"
                loading="lazy"
                decoding="async"
                fetchPriority="low"
              />
            </div>
          </div>
        </div>
        
        <div className="min-w-0 space-y-8 px-1 break-words xs:px-4">
          <article className="border-y border-white/10 py-5">
            <p className="type-label text-pink-300">
              Experiencia
            </p>
            <h3 className="type-title mt-2 text-white">{experience.title}</h3>
            <p className="type-compact type-numeric mt-1 text-gray-300">
              {experience.center} · {experience.years}
            </p>
            <p className="type-compact mt-2 text-gray-300">{experience.description}</p>
            <p className="type-compact mt-2 text-purple-200">{experience.tools}</p>
          </article>

          <div>
            <p className="type-label mb-3 text-gray-300">Formación</p>
            <div className="divide-y divide-white/10 border-y border-white/10">
              {education.map((edu) => (
                <article key={edu.title} className="py-4">
                  <h3 className="type-title mb-1 text-white">{edu.title}</h3>
                  <p className="type-compact mb-1 text-gray-300">{edu.center}</p>
                  <p className="type-compact type-numeric text-gray-300">{edu.years}</p>
                  {edu.note && <p className="type-compact mt-1 text-pink-300">{edu.note}</p>}
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
