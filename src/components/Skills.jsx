import SectionTitle from './SectionTitle';

const skillCategories = [
  {
    title: 'Backend y sistemas',
    skills: ['Java', 'C', 'Python', 'Shell', 'Maven'],
  },
  {
    title: 'Calidad y seguridad',
    skills: ['SonarQube', 'JaCoCo', 'PiTest', 'FindSecBugs', 'Software Dependability'],
  },
  {
    title: 'CI/CD y colaboración',
    skills: ['Jenkins', 'GitHub Actions', 'Bitbucket', 'Git', 'Docker'],
  },
  {
    title: 'Bases de datos',
    skills: ['PostgreSQL', 'MySQL', 'MariaDB', 'Modelado relacional'],
  },
  {
    title: 'Sistemas',
    skills: ['Embedded Systems', 'Seguridad IoT', 'Serverless', 'LLMs', 'MCPs'],
  },
  {
    title: 'Frontend',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Tailwind CSS'],
  },
];

function Skills() {
  return (
    <div className="atlas-section__inner">
      <SectionTitle
        kicker="Mapa de útiles"
        subtitle="Tecnologías que he aprendido con el paso del tiempo."
      >
        Habilidades técnicas
      </SectionTitle>

      <div className="dependency-map">
        <div className="dependency-map__origin">
          <span aria-hidden="true" />
          <p>Tech Stack</p>
        </div>

        <div className="dependency-map__routes">
          {skillCategories.map((category, index) => (
            <article key={category.title} className="skill-route">
              <span className="skill-route__index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="skill-route__line" aria-hidden="true">
                <span />
              </div>
              <div className="skill-route__content">
                <h3>{category.title}</h3>
                <ul>
                  {category.skills.map((skill) => <li key={skill}>{skill}</li>)}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Skills;
