import SectionTitle from './SectionTitle';
import Badge from './Badge';

function Skills() {
  const skillCategories = [
    {
      title: "Frontend",
      color: "purple",
      icon: "🎨",
      skills: ["HTML5", "CSS3","JavaScript","React","Tailwind CSS"]
    },
    {
      title: "Backend",
      color: "blue",
      icon: "⚙️",
      skills: ["Python", "Java", "C++", "Flask", "Node.js"]
    },
    {
      title: "Bases de Datos",
      color: "green",
      icon: "💾",
      skills: ["PostgreSQL", "MySQL", "MariaDB"]
    },
    {
      title: "Herramientas CI/CD y Testing",
      color: "orange",
      icon: "🛠️",
      skills: ["Git", "Docker", "Azure", "FindSecBugs", "SonarCloud", "JaCoCo", "PiTest"]
    }
  ];

  const stats = [
    { number: "0+", label: "Años de experiencia" },
    { number: "6+", label: "Proyectos completados" },
    { number: "15+", label: "Tecnologías dominadas" },
    { number: "100%", label: "Compromiso" }
  ];

  return (
    <div>
      <SectionTitle subtitle="Tecnologías y herramientas que domino">
        Habilidades Técnicas
      </SectionTitle>

      {/* Grid de categorías de habilidades */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {skillCategories.map((category, index) => (
          <div
            key={index}
            className="backdrop-blur-sm bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
          >
            {/* Header de la categoría */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-lg bg-${category.color}-500/20 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <span className="text-2xl">{category.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-white">{category.title}</h3>
            </div>

            {/* Skills badges */}
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill, skillIndex) => (
                <Badge key={skillIndex} color={category.color} size="md">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="text-center p-6 backdrop-blur-sm bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 hover:scale-105 transition-all duration-300"
          >
            <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
              {stat.number}
            </div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Skills;