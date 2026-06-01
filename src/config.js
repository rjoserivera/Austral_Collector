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
// Wrapper sobre fetch() que inyecta el token JWT automáticamente.
// Si el servidor responde 401 (token expirado/inválido), limpia la
// sesión y redirige al login de forma automática.
// ============================================
export function authFetch(url, options = {}) {
  const token = localStorage.getItem('austral_auth_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    // Authorization puede ser bloqueado por Apache en algunos hostings.
    // X-Token es un header personalizado que Apache nunca bloquea.
    ...(token ? {
      'Authorization': `Bearer ${token}`,
      'X-Token': token,
    } : {}),
  };
  return fetch(url, { ...options, headers }).then(response => {
    if (response.status === 401) {
      // Token expirado o inválido → limpiar sesión y redirigir
      localStorage.removeItem('austral_auth_token');
      localStorage.removeItem('austral_auth_user');
      localStorage.removeItem('austral_auth_role');
      localStorage.removeItem('austral_auth_require_pass_change');
      window.location.href = '/login';
      // Devolver una promesa que nunca resuelve para cortar la cadena
      return new Promise(() => {});
    }
    return response;
  });
}

// ============================================
// HELPER: Verificar si el token local ha expirado
// Retorna true si no hay token o si expiró
// ============================================
export function isTokenExpired() {
  const token = localStorage.getItem('austral_auth_token');
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload.exp ? payload.exp < Math.floor(Date.now() / 1000) : false;
  } catch {
    return true;
  }
}
