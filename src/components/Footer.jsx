import StationMarker from './StationMarker';
import usePreferences from '../hooks/usePreferences';

function Footer({ active }) {
  const { copy } = usePreferences();
  const contactHref = `mailto:amedinaf.it@gmail.com?subject=${encodeURIComponent(copy.hero.emailSubject)}&body=${encodeURIComponent(copy.hero.emailBody)}`;

  return (
    <footer id="contact" className="atlas-footer" data-active={active}>
      <StationMarker station="04" />
      <div className="atlas-footer__node" aria-hidden="true"><span /></div>
      <div className="atlas-footer__inner">
        <p className="atlas-footer__station">{copy.footer.station}</p>
        <h2>{copy.footer.title}</h2>
        <p className="atlas-copy">{copy.footer.description}</p>

        <div className="atlas-footer__actions">
          <a className="atlas-button atlas-button--primary" href={contactHref}>
            {copy.footer.contact}
            <span aria-hidden="true">→</span>
          </a>
          <a
            className="atlas-button atlas-button--secondary"
            href="/CV.pdf"
            download="CV_Alejandro_Medina.pdf"
          >
            {copy.footer.downloadCv}
            <span aria-hidden="true">↓</span>
          </a>
        </div>

        <nav className="atlas-footer__links" aria-label={copy.footer.profilesLabel}>
          <a href="https://github.com/medinafdzz" target="_blank" rel="noopener noreferrer">
            GitHub <span aria-hidden="true">↗</span>
          </a>
          <a href="https://linkedin.com/in/medinafdzz" target="_blank" rel="noopener noreferrer">
            LinkedIn <span aria-hidden="true">↗</span>
          </a>
        </nav>

        <p className="atlas-footer__legal">{copy.footer.legal}</p>
      </div>
    </footer>
  );
}

export default Footer;
