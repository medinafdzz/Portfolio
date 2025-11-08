import { useState } from 'react';
import SectionTitle from './SectionTitle';
import Badge from './Badge';
import Button from './Button';

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

  const tagPalette = ['purple', 'pink', 'blue', 'green', 'orange'];

  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const activeProject = projects[activeProjectIndex];

  return (
    <div>
      <SectionTitle subtitle="Explora mis proyectos más recientes y destacados">
        Proyectos Destacados
      </SectionTitle>

      <div className="rounded-3xl border border-white/10 bg-white/5 px-5 xs:px-6 md:px-8 lg:px-10 py-6 md:py-10">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-12">
          <div className="flex flex-col justify-between gap-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-200">
                Proyecto actual
                <span className="text-white/60">{activeProjectIndex + 1}/{projects.length}</span>
              </div>

              <h3 className="text-3xl md:text-4xl font-bold text-white">{activeProject.title}</h3>
              <p className="text-sm md:text-base leading-relaxed text-gray-300">
                {activeProject.description}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {activeProject.tags.map((tag, index) => (
                  <Badge key={`${activeProject.title}-${tag}`} color={tagPalette[index % tagPalette.length]} size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  className="sm:w-auto w-full"
                  onClick={() => window.open(activeProject.github, '_blank', 'noopener,noreferrer')}
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  <span>Ver código</span>
                </Button>

                {activeProject.demo && (
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    className="sm:w-auto w-full"
                    onClick={() => window.open(activeProject.demo, '_blank', 'noopener,noreferrer')}
                  >
                    <span>Ver demo</span>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Button>
                )}
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-gray-300">
                <p>
                  ¿Quieres ver más proyectos? Encuentra todos los repositorios en mi perfil de GitHub.
                </p>
                <a
                  href="https://github.com/medinafdzz?tab=repositories"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 hover:text-purple-300"
                >
                  <span>Visitar GitHub</span>
                  <svg className="w-4 h-4 transition-colors group-hover:text-purple-300" fill="currentColor" viewBox="0 0 24 24"> 
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">Explora proyectos</p>
              <span className="text-xs text-gray-500">Selecciona para ver detalles</span>
            </div>

            <div className="mt-4 flex-1 overflow-hidden rounded-2xl border border-white/10">
              <ul className="divide-y divide-white/5">
                {projects.map((project, index) => {
                  const isActive = index === activeProjectIndex;
                  return (
                    <li key={project.title}>
                      <button
                        type="button"
                        onClick={() => setActiveProjectIndex(index)}
                        className={`flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors ${isActive ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-purple-500/15 hover:text-white'}`}
                        aria-pressed={isActive}
                      >
                        <div className="flex items-center gap-4">
                          <span className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold ${isActive ? 'border-purple-400 text-white' : 'border-white/10 text-white/60'}`}>
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <div>
                            <p className="text-sm font-semibold">{project.title}</p>
                            <div className="mt-1 flex flex-wrap gap-1 text-[11px] uppercase tracking-widest text-white/50">
                              {project.tags.slice(0, 3).map((tag) => (
                                <span key={`${project.title}-${tag}`}>{tag}</span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <svg className={`h-4 w-4 transition-transform ${isActive ? 'rotate-0 text-white' : 'rotate-45 text-white/40'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Projects;