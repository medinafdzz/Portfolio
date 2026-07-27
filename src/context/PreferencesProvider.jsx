import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import PreferencesContext from './preferences-context';
import { translations } from '../i18n/translations';

const LANGUAGE_KEY = 'portfolio-language';
const VALID_LANGUAGES = new Set(['es', 'en']);

const readStorage = (key) => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeStorage = (key, value) => {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Preferences remain available for the current session.
  }
};

const getInitialLanguage = () => {
  const storedLanguage = readStorage(LANGUAGE_KEY);
  if (VALID_LANGUAGES.has(storedLanguage)) return storedLanguage;

  const documentLanguage = document.documentElement.lang;
  return VALID_LANGUAGES.has(documentLanguage) ? documentLanguage : 'es';
};

function updateMetaContent(selector, content) {
  document.querySelector(selector)?.setAttribute('content', content);
}

function PreferencesProvider({ children }) {
  const [language, setLanguageState] = useState(getInitialLanguage);
  const copy = translations[language];

  useEffect(() => {
    const root = document.documentElement;
    root.lang = language;
    document.title = copy.meta.title;
    updateMetaContent('meta[name="description"]', copy.meta.description);
    updateMetaContent('meta[property="og:locale"]', copy.meta.locale);
    updateMetaContent('meta[property="og:title"]', copy.meta.title);
    updateMetaContent('meta[property="og:description"]', copy.meta.description);
    writeStorage(LANGUAGE_KEY, language);

    const contentChangeFrame = window.requestAnimationFrame(() => {
      window.dispatchEvent(new Event('portfolio:contentchange'));
    });

    return () => window.cancelAnimationFrame(contentChangeFrame);
  }, [copy, language]);

  const setLanguage = useCallback((nextLanguage) => {
    if (!VALID_LANGUAGES.has(nextLanguage)) return;
    setLanguageState(nextLanguage);
  }, []);

  const value = useMemo(() => ({
    copy,
    language,
    setLanguage,
  }), [copy, language, setLanguage]);

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export default PreferencesProvider;
