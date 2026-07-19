import './index.css'
import App from './App.jsx'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { NotificationProvider } from './contexts/NotificationContext.jsx'

// ============================================================
// LIMPIEZA DE CACHÉ SENSIBLE AL INICIAR LA APP
// Borra del Cache Storage del browser cualquier respuesta
// guardada de /api/admin/* y /api/auth/* (incluyendo 401s).
// Esto corre en el contexto del browser, NO del Service Worker,
// así funciona aunque el SW viejo siga activo.
// ============================================================
if ('caches' in window) {
  // Lista de cachés donde pueden estar guardadas estas rutas
  const cacheNames = ['api-cache', 'api-cache-v2'];
  cacheNames.forEach(cacheName => {
    caches.open(cacheName).then(cache => {
      cache.keys().then(requests => {
        requests.forEach(req => {
          if (/\/api\/(admin|auth)\//i.test(req.url)) {
            cache.delete(req);
          }
        });
      });
    }).catch(() => {});
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </BrowserRouter>
  </StrictMode>,
)
