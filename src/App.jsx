/*
THESIS: El portfolio es una ruta de evidencias, no una colección de tarjetas.
OWN-WORLD: Papel mineral, tinta grafito, azul estructural y naranja de señal forman una cartografía profesional sin sombras ni gradientes.
STORY: Una lectura rápida identifica Indra, backend, Erasmus y proyectos; el recorrido completo demuestra cómo se conectan.
FIRST VIEWPORT: El nombre ocupa el campo superior y desemboca en cuatro cruces verificables, con CV y contacto siempre claros.
FORM: Espina de evidencias; la ruta vertical alterna contenido a ambos lados y avanza con el scroll.
*/

import { useEffect, useState } from 'react';
import Header from './components/Header';
import Info from './components/Info';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Footer from './components/Footer';
import StationMarker from './components/StationMarker';
import useStationNavigation from './hooks/useStationNavigation';

const routeStations = ['inicio', 'about', 'skills', 'projects', 'contact'];

function App() {
  const initialStation = routeStations.includes(window.location.hash.slice(1))
    ? window.location.hash.slice(1)
    : 'inicio';
  const [activeStation, setActiveStation] = useState(initialStation);
  const scrollToStation = useStationNavigation({
    stationIds: routeStations,
    activeStation,
    onStationChange: setActiveStation,
  });

  useEffect(() => {
    let frameId = 0;

    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0;
      const readingMarker = window.scrollY + window.innerHeight * 0.35;
      const stations = routeStations
        .map((id) => document.getElementById(id))
        .filter(Boolean);
      const currentStation = stations.reduce(
        (current, station) => (station.offsetTop <= readingMarker ? station.id : current),
        stations[0]?.id ?? 'inicio',
      );

      document.documentElement.style.setProperty('--route-progress', `${progress / 100}`);
      setActiveStation((previousStation) => (
        previousStation === currentStation ? previousStation : currentStation
      ));

      document.querySelectorAll('.atlas-section').forEach((section) => {
        const sectionStart = section.offsetTop;
        const sectionProgress = Math.min(
          100,
          Math.max(0, ((readingMarker - sectionStart) / section.offsetHeight) * 100),
        );
        section.style.setProperty('--section-progress', `${sectionProgress}%`);
      });

      frameId = 0;
    };

    const handleScroll = () => {
      if (!frameId) frameId = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (frameId) window.cancelAnimationFrame(frameId);
      document.documentElement.style.removeProperty('--route-progress');
    };
  }, []);

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        Saltar al contenido
      </a>

      <Header activeStation={activeStation} onNavigate={scrollToStation} />

      <main id="main-content" tabIndex="-1">
        <Info />

        <section
          id="about"
          className="atlas-section atlas-section--about"
          data-active={activeStation === 'about'}
        >
          <StationMarker station="01—02" />
          <span className="atlas-section__progress" aria-hidden="true" />
          <About />
        </section>

        <section
          id="skills"
          className="atlas-section atlas-section--skills"
          data-active={activeStation === 'skills'}
        >
          <StationMarker station="03" />
          <span className="atlas-section__progress" aria-hidden="true" />
          <Skills />
        </section>

        <section
          id="projects"
          className="atlas-section atlas-section--projects"
          data-active={activeStation === 'projects'}
        >
          <StationMarker station="04" />
          <span className="atlas-section__progress" aria-hidden="true" />
          <Projects />
        </section>
      </main>

      <Footer active={activeStation === 'contact'} />
    </div>
  );
}

export default App;
