import SectionTitle from './SectionTitle';

const experience = {
  title: 'Junior Software Engineer',
  center: 'Indra Sistemas',
  years: 'Enero - julio de 2026',
  description: 'Desarrollo de herramientas para sistemas ATM.',
  tools: ['Java', 'C', 'Python', 'shell', 'Jenkins', 'SonarQube', 'Bitbucket', 'MCPs', 'LLMs'],
};

const education = [
  {
    title: 'Ingegneria Informatica (Erasmus)',
    center: 'Università degli Studi di Salerno',
    years: '2024 - 2025',
    note: 'Embedded Systems · Software Dependability · Seguridad IoT · Serverless Computing',
  },
  {
    title: 'Ingeniería Informática en Tecnologías de la Información',
    center: 'Escuela Politécnica de Ingeniería de Gijón',
    years: '2021 - 2026',
  },
  {
    title: 'Máster en Inteligencia Artificial',
    center: 'Universidad Alfonso X el Sabio',
    years: '2026 - Actualidad',
  },
];

function About() {
  return (
    <div className="atlas-section__inner">
      <SectionTitle
        kicker="Sobre mí"
        subtitle="Trayectoria: educación y evolución profesional."
      >
        Experiencia y formación
      </SectionTitle>

      <div className="crossing-layout">
        <article className="evidence-block evidence-block--experience">
          <div className="evidence-block__label">
            <span>01</span>
            <p>Experiencia</p>
          </div>
          <div className="evidence-block__body">
            <p className="evidence-block__date">{experience.years}</p>
            <h3>{experience.title}</h3>
            <p className="evidence-block__place">{experience.center}</p>
            <p className="atlas-copy">{experience.description}</p>
            <ul className="inline-technology-list" aria-label="Tecnologías utilizadas">
              {experience.tools.map((tool) => <li key={tool}>{tool}</li>)}
            </ul>
          </div>
        </article>

        <div className="crossing-layout__junction" aria-hidden="true">
          <span />
        </div>

        <div className="education-route">
          <div className="evidence-block__label">
            <span>02</span>
            <p>Formación</p>
          </div>
          <ol>
            {education.map((item) => (
              <li key={item.title}>
                <span className="education-route__node" aria-hidden="true" />
                <p className="evidence-block__date">{item.years}</p>
                <h3>{item.title}</h3>
                <p className="evidence-block__place">{item.center}</p>
                {item.note && <p className="education-route__note">{item.note}</p>}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default About;
