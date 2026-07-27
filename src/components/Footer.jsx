import StationMarker from './StationMarker';

const contactHref = 'mailto:amedinaf.it@gmail.com?subject=Consulta&body=Hola%2C%20me%20gustar%C3%ADa%20contactar%20contigo.';

function Footer({ active }) {
  return (
    <footer id="contact" className="atlas-footer" data-active={active}>
      <StationMarker station="05" />
      <div className="atlas-footer__node" aria-hidden="true"><span /></div>
      <div className="atlas-footer__inner">
        <p className="atlas-footer__station">Contáctame</p>
        <h2>Continuemos la conversación.</h2>
        <p className="atlas-copy">
          Puedes revisar mi código, descargar el CV o escribirme directamente.
        </p>

        <div className="atlas-footer__actions">
          <a className="atlas-button atlas-button--primary" href={contactHref}>
            Contactar por correo
            <span aria-hidden="true">→</span>
          </a>
          <a
            className="atlas-button atlas-button--secondary"
            href="/CV.pdf"
            download="CV_Alejandro_Medina.pdf"
          >
            Descargar CV
            <span aria-hidden="true">↓</span>
          </a>
        </div>

        <nav className="atlas-footer__links" aria-label="Perfiles profesionales">
          <a href="https://github.com/medinafdzz" target="_blank" rel="noopener noreferrer">
            GitHub <span aria-hidden="true">↗</span>
          </a>
          <a href="https://linkedin.com/in/medinafdzz" target="_blank" rel="noopener noreferrer">
            LinkedIn <span aria-hidden="true">↗</span>
          </a>
        </nav>

        <p className="atlas-footer__legal">© 2026 Alejandro Medina · Portfolio bajo licencia MIT</p>
      </div>
    </footer>
  );
}

export default Footer;
