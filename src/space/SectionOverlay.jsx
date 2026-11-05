import { useEffect, useRef } from 'react';
import Icon from './Icons';
import SectionContent from './SectionContent';
import { sectionIds } from './navigation';

export default function SectionOverlay({ section, labels, onClose, closing }) {
  const panel = useRef(null);
  const index = sectionIds.indexOf(section);
  useEffect(() => {
    const previous = document.activeElement;
    const dialog = panel.current;
    dialog.showModal();
    const focusable = () => [...dialog.querySelectorAll('button, a[href], select, [tabindex="0"]')].filter(node => node.getClientRects().length);
    const trapFocus = (event) => {
      if (event.key !== 'Tab') return;
      const nodes = focusable();
      const first = nodes[0];
      const last = nodes.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    dialog.addEventListener('keydown', trapFocus);
    return () => {
      dialog.removeEventListener('keydown', trapFocus);
      dialog.close();
      previous?.focus?.();
    };
  }, []);
  return <dialog ref={panel} className={`section-panel ${closing ? 'is-closing' : ''}`} aria-labelledby="section-heading" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget && event.clientX < event.currentTarget.getBoundingClientRect().left) onClose(); }}>
    <div className="panel-top"><span className="panel-symbol"><Icon name={section}/></span><span>SPACEFOLIO</span><button type="button" className="close-panel" onClick={onClose} aria-label={labels.close}><span>Esc</span><Icon name="close"/></button></div>
    <div className="panel-body"><h2 id="section-heading">{labels.sections[index]}</h2><SectionContent section={section} labels={labels}/></div>
    <div className="panel-bottom"><span>{labels.objects[index]}</span><button type="button" onClick={onClose}>{labels.close}<Icon name="arrow"/></button></div>
  </dialog>;
}
