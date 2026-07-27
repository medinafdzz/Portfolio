import { useEffect, useRef, useState } from 'react';

const navItems = [
  { station: '00', name: 'Inicio', href: '#inicio', id: 'inicio' },
  { station: '01—02', name: 'Trayectoria', href: '#about', id: 'about' },
  { station: '03', name: 'Habilidades', href: '#skills', id: 'skills' },
  { station: '04', name: 'Proyectos', href: '#projects', id: 'projects' },
  { station: '05', name: 'Contacto', href: '#contact', id: 'contact' },
];

function Header({ activeStation, onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    const handleResize = () => {
      if (window.matchMedia('(min-width: 900px)').matches) setMobileMenuOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileMenuOpen]);

  const closeMenu = () => setMobileMenuOpen(false);
  const navigateTo = (event, stationId) => {
    event.preventDefault();
    closeMenu();
    onNavigate(stationId);
  };

  return (
    <header className="route-header">
      <a
        className="route-brand"
        href="#inicio"
        onClick={(event) => navigateTo(event, 'inicio')}
        aria-label="Alejandro Medina, ir al inicio"
      >
        <span className="route-brand__name" aria-hidden="true">
          <span>Alejandro</span>
          <span>Medina</span>
        </span>
      </a>

      <button
        ref={menuButtonRef}
        className="route-menu-button"
        type="button"
        aria-expanded={mobileMenuOpen}
        aria-controls="route-navigation"
        aria-label={mobileMenuOpen ? 'Cerrar navegación' : 'Abrir navegación'}
        onClick={() => setMobileMenuOpen((open) => !open)}
      >
        <span aria-hidden="true">{mobileMenuOpen ? 'Cerrar' : 'Ruta'}</span>
      </button>

      <nav
        id="route-navigation"
        className={`route-navigation ${mobileMenuOpen ? 'is-open' : ''}`}
        aria-label="Navegación principal"
      >
        <div className="route-navigation__track" aria-hidden="true">
          <span className="route-navigation__progress" />
        </div>

        <ol className="route-navigation__list">
          {navItems.map((item) => {
            const active = activeStation === item.id;
            return (
              <li key={item.id}>
                <a
                  href={item.href}
                  className={active ? 'is-active' : undefined}
                  aria-current={active ? 'location' : undefined}
                  onClick={(event) => navigateTo(event, item.id)}
                >
                  <span className="route-navigation__node" aria-hidden="true" />
                  <span className="route-navigation__station">{item.station}</span>
                  <span className="route-navigation__label">{item.name}</span>
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </header>
  );
}

export default Header;
