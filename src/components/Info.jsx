import perfilSmall from '../assets/perfil-256.webp';
import perfilLarge from '../assets/perfil-480.webp';
import usePreferences from '../hooks/usePreferences';

function Info() {
  const { copy } = usePreferences();
  const contactHref = `mailto:amedinaf.it@gmail.com?subject=${encodeURIComponent(copy.hero.emailSubject)}&body=${encodeURIComponent(copy.hero.emailBody)}`;

  return (
    <section id="inicio" className="atlas-hero" aria-labelledby="hero-title">
      <div className="atlas-hero__frame">
        <div className="atlas-hero__identity">
          <p className="atlas-kicker">{copy.hero.kicker}</p>
          <h1 id="hero-title" className="atlas-display" aria-label="Alejandro Medina">
            <span aria-hidden="true">Alejandro</span>
            <span aria-hidden="true">Medina</span>
          </h1>
          <p className="atlas-hero__role">{copy.hero.role}</p>
          {copy.hero.intro.map((paragraph) => (
            <p key={paragraph} className="atlas-copy atlas-hero__intro">
              {paragraph}
            </p>
          ))}

          <nav className="atlas-actions" aria-label={copy.hero.actionsLabel}>
            <a className="atlas-button atlas-button--primary" href="#projects">
              {copy.hero.projects}
              <span aria-hidden="true">↘</span>
            </a>
            <a
              className="atlas-button atlas-button--secondary"
              href="/CV.pdf"
              download="CV_Alejandro_Medina.pdf"
            >
              {copy.hero.downloadCv}
              <span aria-hidden="true">↓</span>
            </a>
            <a className="atlas-text-link" href={contactHref}>
              {copy.hero.contact}
              <span aria-hidden="true">→</span>
            </a>
          </nav>
        </div>

        <aside id="route-summary" className="atlas-hero__map" aria-label={copy.hero.summaryLabel}>
          <div className="atlas-hero__portrait">
            <picture>
              <source media="(max-width: 639px)" srcSet={perfilSmall} />
              <img
                src={perfilLarge}
                srcSet={`${perfilSmall} 256w, ${perfilLarge} 480w`}
                sizes="(min-width: 900px) 190px, 136px"
                alt={copy.hero.portraitAlt}
                width="480"
                height="600"
                decoding="async"
                fetchPriority="high"
              />
            </picture>
          </div>

          <div className="atlas-hero__professional-base">
            <div className="atlas-hero__location">
              <span>{copy.hero.locationLabel}</span>
              <strong>{copy.hero.location}</strong>
              <p>{copy.hero.languages}</p>
            </div>
            <div className="atlas-hero__manifesto">
              <span>{copy.hero.objectivesLabel}</span>
              <p>{copy.hero.objectives}</p>
            </div>
          </div>
        </aside>
      </div>

      <a className="atlas-hero__continue" href="#about">
        {copy.hero.continue}
        <span aria-hidden="true">↓</span>
      </a>
    </section>
  );
}

export default Info;
