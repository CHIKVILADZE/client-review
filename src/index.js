import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from './context/authContext';
import global_en from './translations/en/global.json';
import global_ge from './translations/ge/global.json';
import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';

i18next.init({
  interpolation: { escapeValue: false },
  lng: 'en',
  resources: {
    en: {
      global: global_en,
    },
    ge: {
      global: global_ge,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18next}>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </I18nextProvider>
  </React.StrictMode>
);
