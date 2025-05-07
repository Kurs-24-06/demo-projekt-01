// hauptdatei für das frontend
// hier wird die react app gestartet und in das html eingebunden

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// app in das dom element mit id "root" einbinden
// das ist der einstiegspunkt der react anwendung
const root = ReactDOM.createRoot(document.getElementById('root'));

// strict mode hilft fehler früh zu erkennen
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // React DevTools Benachrichtigung unterdrücken / die nervt
  const __REACT_DEVTOOLS_GLOBAL_HOOK__ = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    __REACT_DEVTOOLS_GLOBAL_HOOK__.inject = function() {};
  }
}