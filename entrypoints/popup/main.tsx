import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.tsx';
import '@/assets/tailwind.css';

const root = document.getElementById('root');
if (!root) {
  throw new Error('Nookmark popup root is missing');
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
