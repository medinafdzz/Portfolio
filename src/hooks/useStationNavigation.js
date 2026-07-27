import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';

const POINTER_QUERY = '(pointer: fine)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const WHEEL_THRESHOLD = 48;
const SCROLL_LOCK_MS = 680;
const EDGE_TOLERANCE = 8;
const OVERFLOW_TOLERANCE = 2;
const FREE_SCROLL_CLASS = 'is-free-scroll';

const getHeaderOffset = () => 0;

const getStationElements = (stationIds) => (
  stationIds
    .map((id) => document.getElementById(id))
    .filter(Boolean)
);

const getStationIndex = (stations) => {
  const marker = window.scrollY + getHeaderOffset() + EDGE_TOLERANCE;
  let currentIndex = 0;

  stations.forEach((station, index) => {
    if (station.offsetTop <= marker) currentIndex = index;
  });

  return currentIndex;
};

const isInteractiveTarget = (target) => (
  target instanceof HTMLElement
  && Boolean(target.closest([
    'a',
    'button',
    'input',
    'textarea',
    'select',
    'summary',
    '[contenteditable="true"]',
    '[role="button"]',
    '[role="link"]',
    '[role="menuitem"]',
    '[role="option"]',
    '[role="slider"]',
  ].join(', ')))
);

function useStationNavigation({ stationIds, activeStation, onStationChange }) {
  const initialHashStation = window.location.hash.slice(1);
  const initialStation = stationIds.includes(initialHashStation)
    ? initialHashStation
    : null;
  const initialStationRef = useRef(initialStation);
  const initializingRef = useRef(Boolean(initialStation));
  const wheelAccumulatorRef = useRef(0);
  const scrollLockUntilRef = useRef(0);
  const snapReleaseTimerRef = useRef(0);
  const stationModeRef = useRef(true);

  const scrollToPosition = useCallback((top, behavior) => {
    document.documentElement.classList.add('is-station-jumping');
    if (snapReleaseTimerRef.current) window.clearTimeout(snapReleaseTimerRef.current);

    window.scrollTo({ top, behavior });

    snapReleaseTimerRef.current = window.setTimeout(() => {
      document.documentElement.classList.remove('is-station-jumping');
      snapReleaseTimerRef.current = 0;
    }, behavior === 'smooth' ? SCROLL_LOCK_MS : 50);
  }, []);

  useLayoutEffect(() => {
    const root = document.documentElement;
    let measureFrame = 0;
    let resizeObserver;
    let cancelled = false;

    const measureStationFit = () => {
      if (cancelled) return;

      const stations = getStationElements(stationIds);
      const wasFreeScrolling = root.classList.contains(FREE_SCROLL_CLASS);

      // Measure against the strict 100svh station contract. Restoring the
      // class before the next paint keeps this check invisible to visitors.
      root.classList.remove(FREE_SCROLL_CLASS);
      const hasOverflow = stations.some(
        (station) => station.scrollHeight > station.clientHeight + OVERFLOW_TOLERANCE,
      );

      root.classList.toggle(FREE_SCROLL_CLASS, hasOverflow);
      stationModeRef.current = !hasOverflow;

      if (hasOverflow) {
        root.classList.remove('is-station-jumping');
        scrollLockUntilRef.current = 0;
        wheelAccumulatorRef.current = 0;
      } else if (wasFreeScrolling) {
        const currentIndex = getStationIndex(stations);
        const currentStation = stations[currentIndex];
        if (currentStation) {
          scrollToPosition(
            Math.max(0, currentStation.offsetTop - getHeaderOffset()),
            'auto',
          );
        }
      }

      measureFrame = 0;
    };

    const scheduleMeasurement = () => {
      if (cancelled) return;
      if (measureFrame) window.cancelAnimationFrame(measureFrame);
      measureFrame = window.requestAnimationFrame(measureStationFit);
    };

    measureStationFit();
    window.addEventListener('resize', scheduleMeasurement);
    window.addEventListener('orientationchange', scheduleMeasurement);
    window.addEventListener('load', scheduleMeasurement);

    if (document.fonts?.ready) {
      document.fonts.ready.then(scheduleMeasurement);
    }

    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(scheduleMeasurement);
      document
        .querySelectorAll('.atlas-hero__frame, .atlas-section__inner, .atlas-footer__inner')
        .forEach((content) => resizeObserver.observe(content));
    }

    return () => {
      cancelled = true;
      window.removeEventListener('resize', scheduleMeasurement);
      window.removeEventListener('orientationchange', scheduleMeasurement);
      window.removeEventListener('load', scheduleMeasurement);
      resizeObserver?.disconnect();
      if (measureFrame) window.cancelAnimationFrame(measureFrame);
      root.classList.remove(FREE_SCROLL_CLASS);
    };
  }, [scrollToPosition, stationIds]);

  useLayoutEffect(() => {
    const hashStation = initialStationRef.current;
    if (!stationIds.includes(hashStation)) return;

    const station = document.getElementById(hashStation);
    if (!station) return;

    scrollToPosition(
      Math.max(0, station.offsetTop - getHeaderOffset()),
      'auto',
    );
    onStationChange(hashStation);
  }, [onStationChange, scrollToPosition, stationIds]);

  useEffect(() => {
    const hashStation = initialStationRef.current;
    if (!hashStation) return undefined;

    let cancelled = false;
    let firstFrame = 0;
    let secondFrame = 0;

    const alignInitialStation = () => {
      if (cancelled) return;

      firstFrame = window.requestAnimationFrame(() => {
        secondFrame = window.requestAnimationFrame(() => {
          const station = document.getElementById(hashStation);
          if (!station || cancelled) return;

          scrollToPosition(
            Math.max(0, station.offsetTop - getHeaderOffset()),
            'auto',
          );
          onStationChange(hashStation);
          initializingRef.current = false;
        });
      });
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(alignInitialStation);
    } else {
      alignInitialStation();
    }

    window.addEventListener('load', alignInitialStation, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener('load', alignInitialStation);
      if (firstFrame) window.cancelAnimationFrame(firstFrame);
      if (secondFrame) window.cancelAnimationFrame(secondFrame);
    };
  }, [onStationChange, scrollToPosition]);

  const scrollToStation = useCallback((stationId) => {
    const station = document.getElementById(stationId);
    if (!station) return;

    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    const top = Math.max(0, station.offsetTop - getHeaderOffset());

    scrollLockUntilRef.current = reducedMotion ? 0 : Date.now() + SCROLL_LOCK_MS;
    wheelAccumulatorRef.current = 0;
    onStationChange(stationId);

    if (window.location.hash !== `#${stationId}`) {
      window.history.replaceState(window.history.state, '', `#${stationId}`);
    }

    scrollToPosition(top, reducedMotion ? 'auto' : 'smooth');
  }, [onStationChange, scrollToPosition]);

  useEffect(() => {
    if (initializingRef.current) {
      const initialStation = initialStationRef.current;
      if (initialStation && window.location.hash !== `#${initialStation}`) {
        window.history.replaceState(window.history.state, '', `#${initialStation}`);
      }
      return;
    }

    if (!activeStation || window.location.hash === `#${activeStation}`) return;
    window.history.replaceState(window.history.state, '', `#${activeStation}`);
  }, [activeStation]);

  useEffect(() => {
    const pointerQuery = window.matchMedia(POINTER_QUERY);

    const handleWheel = (event) => {
      if (
        !stationModeRef.current
        || !pointerQuery.matches
        || event.ctrlKey
        || Math.abs(event.deltaX) > Math.abs(event.deltaY)
      ) {
        return;
      }

      const direction = Math.sign(event.deltaY);
      if (!direction) return;

      const stations = getStationElements(stationIds);
      const currentIndex = getStationIndex(stations);
      const targetIndex = currentIndex + direction;

      event.preventDefault();

      if (targetIndex < 0 || targetIndex >= stations.length) return;

      if (Date.now() < scrollLockUntilRef.current) {
        return;
      }

      const deltaMultiplier = event.deltaMode === 1
        ? 16
        : event.deltaMode === 2
          ? window.innerHeight
          : 1;

      wheelAccumulatorRef.current += event.deltaY * deltaMultiplier;

      if (Math.abs(wheelAccumulatorRef.current) < WHEEL_THRESHOLD) return;
      scrollToStation(stations[targetIndex].id);
    };

    const handleKeyDown = (event) => {
      if (
        !stationModeRef.current
        ||
        event.defaultPrevented
        || event.altKey
        || event.ctrlKey
        || event.metaKey
        || isInteractiveTarget(event.target)
      ) {
        return;
      }

      const stations = getStationElements(stationIds);
      const currentIndex = getStationIndex(stations);
      let targetIndex;

      if (event.key === 'Home') {
        targetIndex = 0;
      } else if (event.key === 'End') {
        targetIndex = stations.length - 1;
      } else if (
        event.key === 'ArrowDown'
        || event.key === 'PageDown'
        || (event.key === ' ' && !event.shiftKey)
      ) {
        targetIndex = currentIndex + 1;
      } else if (
        event.key === 'ArrowUp'
        || event.key === 'PageUp'
        || (event.key === ' ' && event.shiftKey)
      ) {
        targetIndex = currentIndex - 1;
      } else {
        return;
      }

      event.preventDefault();

      if (targetIndex >= 0 && targetIndex < stations.length) {
        scrollToStation(stations[targetIndex].id);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [scrollToStation, stationIds]);

  useEffect(() => {
    let resizeFrame = 0;

    const alignActiveStation = () => {
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => {
        if (!stationModeRef.current) return;
        const station = document.getElementById(activeStation);
        if (!station) return;
        scrollToPosition(Math.max(0, station.offsetTop - getHeaderOffset()), 'auto');
      });
    };

    const handleHashChange = () => {
      const stationId = window.location.hash.slice(1);
      if (stationIds.includes(stationId)) scrollToStation(stationId);
    };

    window.addEventListener('resize', alignActiveStation);
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('resize', alignActiveStation);
      window.removeEventListener('hashchange', handleHashChange);
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
    };
  }, [activeStation, scrollToPosition, scrollToStation, stationIds]);

  useEffect(() => () => {
    if (snapReleaseTimerRef.current) window.clearTimeout(snapReleaseTimerRef.current);
    document.documentElement.classList.remove('is-station-jumping');
    document.documentElement.classList.remove(FREE_SCROLL_CLASS);
  }, []);

  return scrollToStation;
}

export default useStationNavigation;
