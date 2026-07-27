import SectionTitle from './SectionTitle';
import usePreferences from '../hooks/usePreferences';

function About() {
  const { copy } = usePreferences();
  const { experience, education } = copy.about;

  return (
    <div className="atlas-section__inner">
      <SectionTitle
        kicker={copy.about.kicker}
        subtitle={copy.about.subtitle}
      >
        {copy.about.title}
      </SectionTitle>

      <div className="crossing-layout">
        <article className="evidence-block evidence-block--experience">
          <div className="evidence-block__label">
            <span>01</span>
            <p>{copy.about.experienceLabel}</p>
          </div>
          <div className="evidence-block__body">
            <p className="evidence-block__date">{experience.years}</p>
            <h3>{experience.title}</h3>
            <p className="evidence-block__place">{experience.center}</p>
            <p className="atlas-copy">{experience.description}</p>
            <ul className="inline-technology-list" aria-label={copy.about.technologiesLabel}>
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
            <p>{copy.about.educationLabel}</p>
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
