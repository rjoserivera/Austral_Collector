// ============================================
// ENTORNO DE DESARROLLO LOCAL
// ============================================
// Ruta para desarrollo en esta PC (localhost)
export const API_URL  = 'http://localhost/Austral%20Collector/api';
export const BASE_URL = 'http://localhost/Austral%20Collector';

// Si necesitas acceso desde otros dispositivos en la red local, usa tu IP:
// export const API_URL  = 'http://192.168.18.100/Austral%20Collector/api';
// export const BASE_URL = 'http://192.168.18.100/Austral%20Collector';

// ============================================
// ENTORNO DE PRODUCCIÓN (LANZAMIENTO WEB)
// Descomentar lo de abajo y comentar lo de arriba cuando se suba al servidor real
// ============================================
// export const API_URL  = 'https://www.australcollector.com/api';
// export const BASE_URL = 'https://www.australcollector.com';

// ============================================
// HELPER DE PETICIONES AUTENTICADAS
// Wrapper sobre fetch() que inyecta el token JWT automáticamente
// ============================================
export function authFetch(url, options = {}) {
  const token = localStorage.getItem('austral_auth_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
  return fetch(url, { ...options, headers });
}
