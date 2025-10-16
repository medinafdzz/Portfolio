import SectionTitle from './SectionTitle';
import ProjectCard from './ProjectCard';

function Projects() {
  const projects = [
    {
      title: "E-commerce Platform",
      description: "Plataforma de comercio electrónico completa con carrito de compras, pasarela de pagos y panel de administración.",
      tags: ["React", "Node.js", "MongoDB", "Stripe"],
      github: "https://github.com/tuusuario/proyecto1",
      demo: "https://demo.ejemplo.com"
    },
    {
      title: "Task Manager App",
      description: "Aplicación de gestión de tareas con funcionalidades de colaboración en tiempo real y notificaciones.",
      tags: ["Next.js", "Firebase", "Tailwind"],
      github: "https://github.com/tuusuario/proyecto2",
      demo: "https://demo.ejemplo.com"
    },
    {
      title: "Portfolio Generator",
      description: "Herramienta para crear portfolios personalizados con plantillas prediseñadas y exportación a PDF.",
      tags: ["React", "TypeScript", "Vite"],
      github: "https://github.com/tuusuario/proyecto3"
    },
    {
      title: "Weather Dashboard",
      description: "Dashboard meteorológico interactivo con gráficos, pronósticos y alertas personalizadas.",
      tags: ["Vue.js", "Chart.js", "API REST"],
      demo: "https://demo.ejemplo.com"
    },
    {
      title: "Social Media Analytics",
      description: "Herramienta de análisis de redes sociales con métricas en tiempo real y reportes personalizados.",
      tags: ["Python", "Django", "PostgreSQL"],
      github: "https://github.com/tuusuario/proyecto5"
    },
    {
      title: "Chat Application",
      description: "Aplicación de mensajería instantánea con videollamadas, compartir archivos y grupos.",
      tags: ["Socket.io", "WebRTC", "Express"],
      github: "https://github.com/tuusuario/proyecto6",
      demo: "https://demo.ejemplo.com"
    }
  ];

  return (
    <div>
      <SectionTitle subtitle="Explora mis proyectos más recientes y destacados">
        Proyectos Destacados
      </SectionTitle>

      {/* Grid de proyectos */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </div>

      {/* Call to action */}
      <div className="mt-12 text-center">
        <p className="text-gray-400 mb-6">¿Quieres ver más proyectos?</p>
        <a
          href="https://github.com/tuusuario"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-all duration-300 border border-white/20"
        >
          <span>Ver GitHub</span>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
        </a>
      </div>
    </div>
  );
}

export default Projects;