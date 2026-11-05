import React from 'react'
import ReactDOM from 'react-dom/client'
import './space/fonts.css'
import App from './App.jsx'
import PreferencesProvider from './context/PreferencesProvider.jsx'
import './space/base.css'

async function mount() {
  // Load the supplied family before rendering HTML or generating Canvas text.
  await Promise.all([
    document.fonts.load('400 16px "Satoshi"'),
    document.fonts.load('italic 400 16px "Satoshi"'),
  ]);
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <PreferencesProvider>
        <App />
      </PreferencesProvider>
    </React.StrictMode>,
  )
}

mount().catch(error => console.error('Unable to load the required Satoshi fonts.', error));
