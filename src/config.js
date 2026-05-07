// ============================================
// ENTORNO LOCAL (XAMPP)
// ============================================
// export const API_URL  = 'http://localhost/Austral_Collector/api';
// export const BASE_URL = 'http://localhost/Austral_Collector';

// ============================================
// ENTORNO DE PRODUCCIÓN (LANZAMIENTO WEB)
// ============================================
export const API_URL  = `${window.location.origin}/api`;
export const BASE_URL = `${window.location.origin}`;

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
