import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/style.css';

// Mount the React app into <div id="root"></div> from index.html.
createRoot(document.getElementById('root')).render(
  // StrictMode helps catch unsafe patterns during development.
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
