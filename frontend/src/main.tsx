import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Estilos globais primeiro: os estilos dos componentes (importados pelo App) têm precedência.
import './styles/global.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
