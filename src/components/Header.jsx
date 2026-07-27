import { useEffect, useRef, useState } from 'react';
import PreferencesControls from './PreferencesControls';
import usePreferences from '../hooks/usePreferences';

function Header({ activeStation, onNavigate }) {
  const { copy } = usePreferences();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const navItems = [
    { station: '00', name: copy.header.stations.inicio, href: '#inicio', id: 'inicio' },
    { station: '01', name: copy.header.stations.about, href: '#about', id: 'about' },
    { station: '02', name: copy.header.stations.skills, href: '#skills', id: 'skills' },
    { station: '03', name: copy.header.stations.projects, href: '#projects', id: 'projects' },
    { station: '04', name: copy.header.stations.contact, href: '#contact', id: 'contact' },
  ];
  const activeStationIndex = Math.max(
    0,
    navItems.findIndex((item) => item.id === activeStation),
  );
  const routeProgress = activeStationIndex / (navItems.length - 1);

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
        aria-label={copy.header.brandLabel}
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
        aria-label={mobileMenuOpen ? copy.header.menuClose : copy.header.menuOpen}
        onClick={() => setMobileMenuOpen((open) => !open)}
      >
        <span aria-hidden="true">
          {mobileMenuOpen ? copy.header.menuCloseVisible : copy.header.menuOpenVisible}
        </span>
      </button>

      <nav
        id="route-navigation"
        className={`route-navigation ${mobileMenuOpen ? 'is-open' : ''}`}
        aria-label={copy.header.navigationLabel}
        style={{ '--route-progress': routeProgress }}
      >
        <div className="route-navigation__rail">
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
        </div>

        <PreferencesControls />
      </nav>
    </header>
  );
}

export default Header;
