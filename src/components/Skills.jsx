import Badge from './Badge';
import SectionTitle from './SectionTitle';

function Skills() {
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
      title: 'Sistemas emergentes',
      skills: ['Embedded Systems', 'Seguridad IoT', 'Serverless', 'LLMs', 'MCPs'],
    },
    {
      title: 'Frontend',
      skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Tailwind CSS'],
    },
  ];

  return (
    <div>
      <SectionTitle subtitle="Tecnologías que utilizo para desarrollar, asegurar y desplegar software">
        Habilidades Técnicas
      </SectionTitle>

      <div className="grid gap-x-10 sm:grid-cols-2 xl:grid-cols-3">
        {skillCategories.map((category) => (
          <article key={category.title} className="min-w-0 border-t border-white/10 py-6">
            <h3 className="type-title text-white">{category.title}</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <Badge key={skill}>{skill}</Badge>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Skills;
