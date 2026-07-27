import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource/barlow-condensed/700.css'
import '@fontsource/barlow-condensed/800.css'
import App from './App.jsx'
import PreferencesProvider from './context/PreferencesProvider.jsx'
import './input.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PreferencesProvider>
      <App />
    </PreferencesProvider>
  </React.StrictMode>,
)
