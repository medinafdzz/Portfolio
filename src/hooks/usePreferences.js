import { useContext } from 'react';
import PreferencesContext from '../context/preferences-context';

function usePreferences() {
  const preferences = useContext(PreferencesContext);

  if (!preferences) {
    throw new Error('usePreferences must be used within PreferencesProvider');
  }

  return preferences;
}

export default usePreferences;
