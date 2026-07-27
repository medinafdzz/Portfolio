import { useState } from 'react';
import SectionTitle from './SectionTitle';
import Badge from './Badge';

function Projects() {
  const projects = [
    {
      title: "RemoteWordle",
      description: "Juego competitivo de Wordle con arquitectura cliente-servidor en Java que sincroniza partidas en tiempo real, gestiona múltiples conexiones y registra cada intento en logs para análisis. Incluye diccionario propio, control de alias y reinicios coordinados desde el servidor.",
      tags: ["Java", "Client-Server", "Game"],
      github: "https://github.com/medinafdzz/RemoteWordle"
    },
    {
      title: "QR Generator",
      description: "Aplicación web responsiva que genera códigos QR tanto desde URLs como a partir de imágenes subidas y alojadas en Imgur. Está construida solo con HTML, CSS y JavaScript, e integra animaciones ligeras y mensajes de estado para una experiencia clara.",
      tags: ["HTML", "CSS", "JavaScript"],
      github: "https://github.com/medinafdzz/QR-generator",
      demo: "https://medinafdzz.github.io/QR-generator"
    },
    {
      title: "Cleaning Robot",
      description: "Robot de limpieza autónomo compatible con Raspberry Pi que modela motores, sensores infrarrojos y sistema de baterías para reaccionar a obstáculos y zonas sucias. El Route Management System coordina la ruta en una cuadrícula y permite simular escenarios con pruebas automatizadas.",
      tags: ["Python", "Raspberry Pi", "Robotics"],
      github: "https://github.com/medinafdzz/cleaningrobotpy"
    },
    {
      title: "Password Manager",
      description: "Gestor de contraseñas en Python con interfaz Tkinter que cifra credenciales en tokens JWT y los persiste en PostgreSQL. Incluye carga de consultas SQL externas, máscaras de entrada y utilidades para importar o revelar tokens almacenados.",
      tags: ["Python", "Security", "GUI"],
      github: "https://github.com/medinafdzz/Password-manager"
    },
    {
      title: "Calculator",
      description: "Calculadora web con operaciones aritméticas, potencias, raíces y funciones de memoria, pensada para ejecutarse en navegadores sin dependencias. Ofrece cambio a modo oscuro y organización modular del código entre hojas de estilo y scripts reutilizables.",
      tags: ["HTML", "CSS", "JavaScript"],
      github: "https://github.com/medinafdzz/Calculator"
    },
    {
      title: "Commons DbUtils",
      description: "Contribución al proyecto Apache Commons DbUtils centrada en mejorar la calidad con pruebas generadas mediante Randoop, análisis de cobertura y benchmarking JMH. El trabajo incluye informes de seguridad, documentación y ajustes en el proceso de build Maven.",
      tags: ["Java", "Apache", "Database"],
      github: "https://github.com/medinafdzz/commons-dbutils"
    }
  ];

  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const activeProject = projects[activeProjectIndex];

  return (
    <div>
      <SectionTitle subtitle="Explora mis proyectos más recientes y destacados">
        Proyectos Destacados
      </SectionTitle>

      <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <div className="min-w-0 flex flex-col justify-between gap-10">
            <div
              id="active-project-details"
              className="min-w-0 space-y-4 break-words"
              aria-live="polite"
              aria-atomic="true"
            >
              <p className="type-label text-pink-300">
                Proyecto <span className="type-numeric">{activeProjectIndex + 1} de {projects.length}</span>
              </p>

              <h3 className="type-feature text-white">{activeProject.title}</h3>
              <p className="type-body max-w-[68ch] text-gray-300">
                {activeProject.description}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {activeProject.tags.map((tag) => (
                  <Badge key={`${activeProject.title}-${tag}`}>
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <a
                  href={activeProject.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Ver el código de ${activeProject.title} en GitHub`}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white shadow-lg shadow-black/20 transition-colors duration-300 hover:from-purple-700 hover:to-pink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 focus-visible:ring-offset-4 focus-visible:ring-offset-gray-950 sm:w-auto"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  <span>Ver código</span>
                </a>

                {activeProject.demo && (
                  <a
                    href={activeProject.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Abrir la demo de ${activeProject.title}`}
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-6 py-3 font-semibold text-white transition-colors duration-300 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 focus-visible:ring-offset-4 focus-visible:ring-offset-gray-950 sm:w-auto"
                  >
                    <span>Ver demo</span>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>

              <a
                href="https://github.com/medinafdzz?tab=repositories"
                target="_blank"
                rel="noopener noreferrer"
                className="type-label inline-flex min-h-11 items-center gap-2 rounded-sm text-white/80 hover:text-purple-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 focus-visible:ring-offset-4 focus-visible:ring-offset-gray-950"
              >
                Todos los repositorios
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          <div className="flex min-w-0 flex-col">
            <p className="type-label text-gray-300">Selecciona un proyecto</p>

            <div className="mt-4 flex-1 border-y border-white/10">
              <ul className="divide-y divide-white/10">
                {projects.map((project, index) => {
                  const isActive = index === activeProjectIndex;
                  return (
                    <li key={project.title}>
                      <button
                        type="button"
                        onClick={() => setActiveProjectIndex(index)}
                        className={`flex min-h-11 w-full min-w-0 items-center px-3 py-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-pink-400 ${isActive ? 'bg-white/10 text-white' : 'text-white/75 hover:bg-white/5 hover:text-white'}`}
                        aria-pressed={isActive}
                        aria-controls="active-project-details"
                      >
                        <div className="min-w-0">
                            <p className="type-compact break-words font-semibold">{project.title}</p>
                            <div className="type-compact mt-1 flex flex-wrap gap-1 uppercase tracking-[0.08em] text-white/70">
                              {project.tags.slice(0, 3).map((tag) => (
                                <span key={`${project.title}-${tag}`}>{tag}</span>
                              ))}
                            </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
      </div>
    </div>
  );
}

export default Projects;
