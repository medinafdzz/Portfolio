import { Component, lazy, Suspense, useCallback, useEffect, useReducer, useRef, useState, useSyncExternalStore } from 'react';
import usePreferences from '../hooks/usePreferences';
import { initialNavigation, navigationReducer, sectionIds } from './navigation';
import { spaceCopy } from './copy';
import SectionOverlay from './SectionOverlay';
import Icon from './Icons';
import './spacefolio.css';
import {detectGraphics} from './graphics-profile';

const Scene = lazy(() => import('./Scene'));
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const subscribeMotion = callback => { motionQuery.addEventListener('change', callback); return () => motionQuery.removeEventListener('change', callback); };

class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function Spacefolio() {
  const { copy, language, setLanguage } = usePreferences();
  const labels = spaceCopy[language];
  const [navigation, dispatch] = useReducer(navigationReducer, initialNavigation);
  const [graphics] = useState(detectGraphics);
  const [webgl, setWebgl] = useState(graphics.supported);
  const [light, setLight] = useState(()=>{
    try {return localStorage.getItem('spacefolio-view') ? localStorage.getItem('spacefolio-view')==='light' : graphics.constrained;}
    catch {return graphics.constrained;}
  });
  const toggleView=()=>setLight(value=>{
    try {localStorage.setItem('spacefolio-view',value?'3d':'light');} catch { /* Storage is optional. */ }
    return !value;
  });
  const [loaded, setLoaded] = useState(false);
  const [resetView, setResetView] = useState(0);
  const dialogRef = useRef(null);
  const systemMotion = useSyncExternalStore(subscribeMotion, () => motionQuery.matches);
  const [quiet, setQuiet] = useState(false);
  const reducedMotion = systemMotion || quiet;
  const fallback = !webgl || light;
  const { phase, section } = navigation;
  const [opener, setOpener] = useState(null);
  const select = useCallback(id => {
    setOpener(document.activeElement?.matches('button, a, select') ? document.activeElement : document.querySelector('.flight-tools button'));
    dispatch({ type: 'SELECT', section: id });
  }, []);
  const start = useCallback(() => dispatch({ type: 'START' }), []);
  const failure = useCallback(() => setWebgl(false), []);
  const ready = useCallback(() => setLoaded(true), []);
  const entered = useCallback(() => dispatch({ type: 'ENTERED' }), []);
  const hostToggle = useCallback(() => dispatch({type:'HOST_TOGGLE'}), []);
  const hostReady = useCallback(() => dispatch({type:'HOST_READY'}), []);
  const close = useCallback(() => dispatch({ type: 'CLOSE' }), []);
  const blocked = ['ENTERING', 'OPENING_SECTION', 'SECTION_OPEN', 'CLOSING_SECTION','HOST_RISING','HOST_SITTING','HOST_GREETING'].includes(phase);
  const greeting = phase === 'HOST_GREETING';

  useEffect(() => {
    const durations = { OPENING_SECTION: reducedMotion ? 0 : 500, CLOSING_SECTION: reducedMotion ? 0 : 420 };
    const events = { OPENING_SECTION: 'OPENED', CLOSING_SECTION: 'CLOSED' };
    if (!events[phase]) return;
    const timer = setTimeout(() => dispatch({ type: events[phase] }), durations[phase]);
    return () => clearTimeout(timer);
  }, [phase, reducedMotion]);
  useEffect(() => {
    if (!['INTRO','HOST_GREETING'].includes(phase) || fallback || !loaded) return;
    const handleKey = event => {
      if (event.key === 'Enter' && !event.repeat && !['BUTTON', 'A', 'SELECT'].includes(event.target.tagName)) { event.preventDefault(); if (phase === 'INTRO') start(); else hostToggle(); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [phase, start, hostToggle, fallback, loaded]);
  useEffect(() => {
    if (!fallback) return;
    const timer = setTimeout(() => { if (phase === 'ENTERING') entered(); else dispatch({type:'HOST_ABORT'}); }, 0);
    return () => clearTimeout(timer);
  }, [phase, fallback, entered]);

  return <div className="spacefolio" data-phase={phase} data-motion={reducedMotion ? 'reduced' : 'full'}>
    <a className="skip-link" href={fallback ? '#section-navigation' : '#main-content'}>{copy.skipLink}</a>
    <header className="flight-header">
      <a href="#" className="brand" onClick={event => { event.preventDefault(); if (!blocked) select('about'); }}><span className="brand-mark" aria-hidden="true"><span/></span><span>Alejandro Medina Fernandez<small>SOFTWARE AI ENGINEER</small></span></a>
      <div className="flight-identity"><span className="status-dot"/>SPACEFOLIO<span className="identity-divider"/>{language === 'es' ? 'UNIVERSO PERSONAL' : 'PERSONAL UNIVERSE'}</div>
      <div className="header-actions"><a className="header-profile" href="https://github.com/medinafdzz" target="_blank" rel="noopener noreferrer">GitHub</a><a className="header-profile" href="https://linkedin.com/in/medinafdzz" target="_blank" rel="noopener noreferrer">LinkedIn</a><a className="cv-link" href="/CV.pdf" download="CV_Alejandro_Medina.pdf">CV<Icon name="download"/></a><div className="language-switch" role="group" aria-label={copy.header.languageLabel}>{['es', 'en'].map(value => <button key={value} onClick={() => setLanguage(value)} aria-pressed={language === value} aria-label={value === 'es' ? 'ES — Español' : 'EN — English'}>{value.toUpperCase()}</button>)}</div></div>
    </header>
    <main id="main-content" className="flight-main" tabIndex={-1}>
      <h1 className="sr-only">Alejandro Medina — {copy.hero.kicker}</h1>
      <div className="scene-stage" aria-label={language === 'es' ? 'Cabina espacial interactiva' : 'Interactive spacecraft cabin'}>
        {!fallback && <SceneBoundary onFailure={failure}><Suspense fallback={<div className="scene-loading"><span/>{labels.loading}</div>}><Scene lowPower={graphics.constrained} phase={phase} section={section} onSelect={select} onEntered={entered} onHostToggle={hostToggle} onHostReady={hostReady} resetView={resetView} onReady={ready} onFailure={failure} reducedMotion={reducedMotion} labels={labels} dialogRef={dialogRef}/></Suspense></SceneBoundary>}
        {fallback && <div className="flat-view"><div className="flat-orbit" aria-hidden="true"/><span className="flat-monogram" aria-hidden="true">AM</span><h2>{labels.fallback}</h2><p>{labels.fallbackBody}</p><p className="flat-role">{copy.hero.kicker}</p></div>}
        <div className="scene-caption" aria-hidden="true"><span className="status-dot"/>{labels.ready}<span className="scene-coordinate">43.5322° N · 5.6611° W</span></div>
        {(phase === 'INTRO' || greeting) && !fallback && <div ref={dialogRef} className="intro-card"><p className="intro-hello">{labels.hello}</p><h2>{greeting ? labels.hostGreeting : labels.greeting}</h2><p className="intro-description">{labels.invitation}</p><button className="start-button" onClick={greeting ? hostToggle : start} disabled={!loaded}>{labels.start}<Icon name="arrow"/></button><span className="enter-hint"><kbd aria-hidden="true"><Icon name="enter" width="12" height="12"/></kbd>{labels.enter}</span></div>}
        <div className="flight-tools">{!fallback && <><button className="tool-icon" onClick={()=>setResetView(value=>value+1)} disabled={!loaded||blocked} aria-label={labels.resetView} title={labels.resetView}><Icon name="reset"/></button><button className="tool-icon" onClick={hostToggle} disabled={!loaded||!['EXPLORE','HOST_GREETING'].includes(phase)} aria-label={labels.replay} title={labels.replay}><Icon name="robot"/></button></>}<button onClick={toggleView} disabled={!webgl} aria-pressed={light}>{fallback ? labels.spatial : labels.light}</button><span/><button onClick={() => setQuiet(value => !value)} aria-pressed={reducedMotion} disabled={systemMotion}>{reducedMotion ? labels.resumeMotion : labels.motion}</button></div>
      </div>
      {fallback && <div className="navigation-deck"><div className="deck-message" aria-live="polite"><p>{phase === 'ENTERING' ? labels.entering : labels.explore}</p><span>{labels.hint}</span></div><nav id="section-navigation" className="section-navigation" aria-label={labels.nav} tabIndex={-1}>{sectionIds.map((id, index) => <button key={id} type="button" className="nav-station" data-section={id} aria-haspopup="dialog" aria-current={section === id ? 'true' : undefined} disabled={blocked} onClick={() => select(id)}><Icon name={id}/><span>{labels.sections[index]}<small>{labels.objects[index]}</small></span></button>)}</nav></div>}
    </main>
    <footer className="flight-footer"><span>{copy.hero.role}</span><span>{labels.location}<span className="footer-separator">/</span>© 2026</span></footer>
    {section && <SectionOverlay section={section} labels={labels} onClose={close} closing={phase === 'CLOSING_SECTION'} opener={opener}/>}
  </div>;
}
