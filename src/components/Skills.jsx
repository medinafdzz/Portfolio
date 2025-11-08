import SectionTitle from './SectionTitle';
import Badge from './Badge';

function Skills() {
  const skillCategories = [
    {
      title: "Frontend",
      color: "purple",
      icon: "🎨",
      skills: ["HTML5", "CSS3", "JavaScript", "React", "Tailwind CSS"]
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
      title: "DevOps & Cloud",
      color: "cyan",
      icon: "☁️",
      skills: ["Docker", "Azure", "GitHub Actions", "CI/CD"]
    },
    {
      title: "Testing & QA",
      color: "orange",
      icon: "🧪",
      skills: ["FindSecBugs", "SonarCloud", "JaCoCo", "PiTest"]
    },
    {
      title: "Control de Versiones",
      color: "pink",
      icon: "🔀",
      skills: ["Git", "GitHub", "Bitbucket"]
    }
  ];

  const stats = [
    { number: "0+", label: "Años de experiencia" },
    { number: "6+", label: "Proyectos completados" },
    { number: "15+", label: "Tecnologías dominadas" },
    { number: "100%", label: "Compromiso" }
  ];

  const bgColors = {
    purple: "bg-purple-500/15 border-purple-500/30",
    blue: "bg-blue-500/15 border-blue-500/30",
    green: "bg-green-500/15 border-green-500/30",
    cyan: "bg-cyan-500/15 border-cyan-500/30",
    orange: "bg-orange-500/15 border-orange-500/30",
    pink: "bg-pink-500/15 border-pink-500/30"
  };

  return (
    <div>
      <SectionTitle subtitle="Tecnologías y herramientas que domino">
        Habilidades Técnicas
      </SectionTitle>

      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm px-5 xs:px-6 md:px-8 lg:px-10 py-6 md:py-10">
        <div className="pointer-events-none absolute -bottom-36 left-10 h-64 w-64 rounded-full bg-gradient-to-tr from-blue-500/40 via-cyan-500/30 to-transparent blur-3xl opacity-70"></div>

        <div className="relative flex flex-col gap-10 lg:flex-row lg:items-stretch lg:min-h-[420px]">
          <div className="flex-1 lg:max-w-sm flex flex-col justify-between gap-8">
            <div className="space-y-4">
              <div className="flex flex-col items-center text-center w-full">
                <h3 className="text-5xl md:text-6xl font-black tracking-tight text-white">Tech Stack</h3>
                <div className="mt-2 h-1 w-32 md:w-40 rounded-full gradient-primary"></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 auto-rows-fr">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-6"
                >
                  <div className="text-3xl md:text-4xl font-bold text-white">{stat.number}</div>
                  <p className="mt-2 text-xs font-medium uppercase tracking-[0.25em] text-gray-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 xl:grid-cols-3 h-full">
              {skillCategories.map((category) => (
                <div
                  key={category.title}
                  className={`group relative flex h-full flex-col rounded-2xl border px-5 py-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/10 cursor-pointer ${bgColors[category.color]}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-gray-400">Área</p>
                      <h4 className="mt-2 text-lg font-semibold text-white">{category.title}</h4>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-2xl">
                      <span>{category.icon}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <Badge key={skill} color={category.color} size="sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Skills;