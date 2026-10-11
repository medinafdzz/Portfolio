import { useState } from 'react';
import SectionTitle from './SectionTitle';
import usePreferences from '../hooks/usePreferences';

const featuredProjects = [
  {
    key: 'codeGuardian',
    title: 'CodeGuardian',
    tags: ['Python', 'Pydantic', 'Jenkins'],
    github: 'https://github.com/medinafdzz/CodeGuardian',
  },
  {
    key: 'commonsDbUtils',
    title: 'Commons DbUtils',
    tags: ['Java', 'JaCoCo', 'PiTest'],
    github: 'https://github.com/medinafdzz/commons-dbutils',
  },
  {
    key: 'remoteWordle',
    title: 'RemoteWordle',
    tags: ['Java'],
    github: 'https://github.com/medinafdzz/RemoteWordle',
  },
];

const secondaryProjects = [
  {
    title: 'QR Generator',
    github: 'https://github.com/medinafdzz/QR-generator',
  },
  {
    title: 'Cleaning Robot',
    github: 'https://github.com/medinafdzz/cleaningrobotpy',
  },
  {
    title: 'Password Manager',
    github: 'https://github.com/medinafdzz/Password-manager',
  },
];

function Projects() {
  const { copy } = usePreferences();
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const activeProject = featuredProjects[activeProjectIndex];

  return (
    <div className="atlas-section__inner">
      <SectionTitle
        kicker={copy.projects.kicker}
        subtitle={copy.projects.subtitle}
      >
        {copy.projects.title}
      </SectionTitle>

      <div className="project-junction">
        <div className="project-selector">
          <p className="project-selector__legend">{copy.projects.selectorLegend}</p>
          <label className="project-selector__compact" htmlFor="project-select">
            <span>{copy.projects.selectorLabel}</span>
            <select
              id="project-select"
              value={activeProjectIndex}
              onChange={(event) => setActiveProjectIndex(Number(event.target.value))}
            >
              {featuredProjects.map((project, index) => (
                <option key={project.title} value={index}>
                  {String(index + 1).padStart(2, '0')} · {project.title}
                </option>
              ))}
            </select>
          </label>
          <ol>
            {featuredProjects.map((project, index) => {
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

          <aside className="project-secondary" aria-labelledby="secondary-projects-title">
            <div>
              <h3 id="secondary-projects-title">{copy.projects.secondaryTitle}</h3>
              <p className="atlas-copy">{copy.projects.secondaryDescription}</p>
            </div>
            <ul className="project-secondary__list">
              {secondaryProjects.map((project, index) => (
                <li key={project.title}>
                  <a href={project.github} target="_blank" rel="noopener noreferrer">
                    <span className="project-secondary__index">{String(index + 1).padStart(2, '0')}</span>
                    <strong>{project.title}</strong>
                    <span aria-hidden="true">→</span>
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        </div>

        <article
          id="active-project"
          className="project-detail"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="project-detail__station">
            <span>{copy.projects.destination}</span>
            <strong>{String(activeProjectIndex + 1).padStart(2, '0')} / {String(featuredProjects.length).padStart(2, '0')}</strong>
          </div>
          <h3>{activeProject.title}</h3>
          <p className="atlas-copy">
            {copy.projects.descriptions[activeProject.key]}
          </p>
          <ul className="project-detail__technologies" aria-label={copy.projects.technologiesLabel}>
            {activeProject.tags.map((tag) => <li key={tag}>{tag}</li>)}
          </ul>
          <div className="project-detail__actions">
            <a
              className="atlas-button atlas-button--primary"
              href={activeProject.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              {copy.projects.viewCode}
              <span aria-hidden="true">↗</span>
            </a>
            {activeProject.demo && (
              <a
                className="atlas-button atlas-button--secondary"
                href={activeProject.demo}
                target="_blank"
                rel="noopener noreferrer"
              >
                {copy.projects.viewDemo}
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
            {copy.projects.allRepositories}
            <span aria-hidden="true">→</span>
          </a>
        </article>
      </div>

    </div>
  );
}

export default Projects;
