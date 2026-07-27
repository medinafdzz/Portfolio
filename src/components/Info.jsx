import perfilSmall from '../assets/perfil-256.webp';
import perfilLarge from '../assets/perfil-480.webp';

const contactHref = 'mailto:amedinaf.it@gmail.com?subject=Consulta&body=Hola%2C%20me%20gustar%C3%ADa%20contactar%20contigo.';

function Info() {
  return (
    <section id="inicio" className="atlas-hero" aria-labelledby="hero-title">
      <div className="atlas-hero__frame">
        <div className="atlas-hero__identity">
          <p className="atlas-kicker">¡Bienvenido a mi portfolio web!</p>
          <h1 id="hero-title" className="atlas-display" aria-label="Alejandro Medina">
            <span aria-hidden="true">Alejandro</span>
            <span aria-hidden="true">Medina</span>
          </h1>
          <p className="atlas-hero__role">Ingeniería de software · Backend y sistemas</p>
          <p className="atlas-copy atlas-hero__intro">
            Me define la curiosidad por entender cómo funcionan las cosas y la constancia
            para seguir aprendiendo cuando aún no tengo todas las respuestas. Esa inquietud
            me llevó a estudiar Ingeniería Informática, vivir un Erasmus en Salerno y
            afrontar cada cambio con una mentalidad abierta.
          </p>
          <p className="atlas-copy atlas-hero__intro">
            Hoy quiero convertir todo ese aprendizaje en una carrera con propósito: crecer
            como ingeniero, aportar valor a un equipo y construir software del que podamos
            sentirnos orgullosos.
          </p>

          <nav className="atlas-actions" aria-label="Acciones principales">
            <a className="atlas-button atlas-button--primary" href="#projects">
              Ver proyectos
              <span aria-hidden="true">↘</span>
            </a>
            <a
              className="atlas-button atlas-button--secondary"
              href="/CV.pdf"
              download="CV_Alejandro_Medina.pdf"
            >
              Descargar CV
              <span aria-hidden="true">↓</span>
            </a>
            <a className="atlas-text-link" href={contactHref}>
              Contactar
              <span aria-hidden="true">→</span>
            </a>
          </nav>
        </div>

        <aside id="route-summary" className="atlas-hero__map" aria-label="Base profesional">
          <div className="atlas-hero__portrait">
            <picture>
              <source media="(max-width: 639px)" srcSet={perfilSmall} />
              <img
                src={perfilLarge}
                srcSet={`${perfilSmall} 256w, ${perfilLarge} 480w`}
                sizes="(min-width: 900px) 190px, 136px"
                alt="Retrato de Alejandro Medina"
                width="480"
                height="480"
                decoding="async"
                fetchPriority="high"
              />
            </picture>
          </div>

          <div className="atlas-hero__professional-base">
            <span>Ubicación</span>
            <strong>Gijón, Asturias</strong>
            <p>Idiomas: español e inglés</p>
            <div className="atlas-hero__manifesto">
              <span>Objetivos</span>
              <p>
                Mi objetivo es especializarme en backend y sistemas, con foco en seguridad,
                automatización y calidad de software. Busco proyectos técnicamente
                exigentes donde pueda asumir responsabilidades progresivas y contribuir a
                soluciones fiables, claras y sostenibles.
              </p>
            </div>
          </div>
        </aside>
      </div>

      <a className="atlas-hero__continue" href="#about">
        Comenzar recorrido
        <span aria-hidden="true">↓</span>
      </a>
    </section>
  );
}

export default Info;
