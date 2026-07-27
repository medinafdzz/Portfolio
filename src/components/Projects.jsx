import { useState } from 'react';
import SectionTitle from './SectionTitle';

const projects = [
  {
    title: 'RemoteWordle',
    description: 'Juego competitivo de Wordle con arquitectura cliente-servidor en Java que sincroniza partidas en tiempo real, gestiona múltiples conexiones y registra cada intento en logs para análisis. Incluye diccionario propio, control de alias y reinicios coordinados desde el servidor.',
    tags: ['Java', 'Client-Server', 'Game'],
    github: 'https://github.com/medinafdzz/RemoteWordle',
  },
  {
    title: 'QR Generator',
    description: 'Aplicación web responsiva que genera códigos QR tanto desde URLs como a partir de imágenes subidas y alojadas en Imgur. Está construida solo con HTML, CSS y JavaScript, e integra animaciones ligeras y mensajes de estado para una experiencia clara.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    github: 'https://github.com/medinafdzz/QR-generator',
    demo: 'https://medinafdzz.github.io/QR-generator',
  },
  {
    title: 'Cleaning Robot',
    description: 'Robot de limpieza autónomo compatible con Raspberry Pi que modela motores, sensores infrarrojos y sistema de baterías para reaccionar a obstáculos y zonas sucias. El Route Management System coordina la ruta en una cuadrícula y permite simular escenarios con pruebas automatizadas.',
    tags: ['Python', 'Raspberry Pi', 'Robotics'],
    github: 'https://github.com/medinafdzz/cleaningrobotpy',
  },
  {
    title: 'Password Manager',
    description: 'Gestor de contraseñas en Python con interfaz Tkinter que cifra credenciales en tokens JWT y los persiste en PostgreSQL. Incluye carga de consultas SQL externas, máscaras de entrada y utilidades para importar o revelar tokens almacenados.',
    tags: ['Python', 'Security', 'GUI'],
    github: 'https://github.com/medinafdzz/Password-manager',
  },
  {
    title: 'Calculator',
    description: 'Calculadora web con operaciones aritméticas, potencias, raíces y funciones de memoria, pensada para ejecutarse en navegadores sin dependencias. Ofrece cambio a modo oscuro y organización modular del código entre hojas de estilo y scripts reutilizables.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    github: 'https://github.com/medinafdzz/Calculator',
  },
  {
    title: 'Commons DbUtils',
    description: 'Contribución al proyecto Apache Commons DbUtils centrada en mejorar la calidad con pruebas generadas mediante Randoop, análisis de cobertura y benchmarking JMH. El trabajo incluye informes de seguridad, documentación y ajustes en el proceso de build Maven.',
    tags: ['Java', 'Apache', 'Database'],
    github: 'https://github.com/medinafdzz/commons-dbutils',
  },
];

function Projects() {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const activeProject = projects[activeProjectIndex];

  return (
    <div className="atlas-section__inner">
      <SectionTitle
        kicker="Destinos verificables"
        subtitle="Proyectos reales con código y demostraciones accesibles."
      >
        Proyectos destacados
      </SectionTitle>

      <div className="project-junction">
        <div className="project-selector">
          <p className="project-selector__legend">Selecciona un destino</p>
          <label className="project-selector__compact" htmlFor="project-select">
            <span>Proyecto</span>
            <select
              id="project-select"
              value={activeProjectIndex}
              onChange={(event) => setActiveProjectIndex(Number(event.target.value))}
            >
              {projects.map((project, index) => (
                <option key={project.title} value={index}>
                  {String(index + 1).padStart(2, '0')} · {project.title}
                </option>
              ))}
            </select>
          </label>
          <ol>
            {projects.map((project, index) => {
              const active = activeProjectIndex === index;
              return (
                <li key={project.title}>
                  <button
                    type="button"
                    className={active ? 'is-active' : undefined}
                    aria-pressed={active}
                    aria-controls="active-project"
                    onClick={() => setActiveProjectIndex(index)}
                  >
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <strong>{project.title}</strong>
                    <span className="project-selector__arrow" aria-hidden="true">→</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <article
          id="active-project"
          className="project-detail"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="project-detail__station">
            <span>Destino</span>
            <strong>{String(activeProjectIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</strong>
          </div>
          <h3>{activeProject.title}</h3>
          <p className="atlas-copy">{activeProject.description}</p>
          <ul className="project-detail__technologies" aria-label="Tecnologías">
            {activeProject.tags.map((tag) => <li key={tag}>{tag}</li>)}
          </ul>
          <div className="project-detail__actions">
            <a
              className="atlas-button atlas-button--primary"
              href={activeProject.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver código
              <span aria-hidden="true">↗</span>
            </a>
            {activeProject.demo && (
              <a
                className="atlas-button atlas-button--secondary"
                href={activeProject.demo}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver demo
                <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
          <a
            className="atlas-text-link"
            href="https://github.com/medinafdzz?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
          >
            Todos los repositorios
            <span aria-hidden="true">→</span>
          </a>
        </article>
      </div>
    </div>
  );
}

export default Projects;
