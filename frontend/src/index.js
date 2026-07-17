import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Pour mesurer les performances de l’application, transmettez une fonction
// qui enregistre les résultats (par exemple : reportWebVitals(console.log))
// ou les envoie vers un service d’analyse : https://bit.ly/CRA-vitals
reportWebVitals();
