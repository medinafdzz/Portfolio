import SectionTitle from './SectionTitle';
import usePreferences from '../hooks/usePreferences';

function Skills() {
  const { copy } = usePreferences();

  return (
    <div className="atlas-section__inner">
      <SectionTitle
        kicker={copy.skills.kicker}
        subtitle={copy.skills.subtitle}
      >
        {copy.skills.title}
      </SectionTitle>

      <div className="dependency-map">
        <div className="dependency-map__origin">
          <span aria-hidden="true" />
          <p>{copy.skills.origin}</p>
        </div>

        <div className="dependency-map__routes">
          {copy.skills.categories.map((category, index) => (
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
