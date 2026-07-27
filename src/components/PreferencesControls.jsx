import { languageOptions } from '../i18n/translations';
import usePreferences from '../hooks/usePreferences';

function PreferencesControls() {
  const { copy, language, setLanguage } = usePreferences();

  return (
    <div
      className="route-preferences"
      role="group"
      aria-label={copy.header.preferencesLabel}
    >
      <label className="route-preferences__language" htmlFor="portfolio-language">
        <span>{copy.header.languageLabel}</span>
        <select
          id="portfolio-language"
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
        >
          {languageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default PreferencesControls;
