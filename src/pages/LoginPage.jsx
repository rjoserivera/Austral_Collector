import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';

import { API_URL } from '../config.js';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    setLoading(true);

    fetch(`${API_URL}/auth/login.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    .then(r => r.json())
    .then(data => {
      if (data.success && data.user) {
        localStorage.setItem('austral_auth_user', JSON.stringify(data.user));
        localStorage.setItem('austral_auth_role', data.user.role);
        
        if (data.user.require_password_change) {
          localStorage.setItem('austral_auth_require_pass_change', 'true');
          navigate('/'); // Si necesita cambiar contraseña, lo tiramos a inicio para mostrar el modal
        } else {
          localStorage.removeItem('austral_auth_require_pass_change');
          // Sin restricciones de contraseña: Admin va al panel, resto al dashboard u home según su uso habitual
          navigate(data.user.role === 'admin' ? '/admin' : '/');
        }
      } else {
        setError(data.error || 'Credenciales incorrectas.');
      }
    })
    .catch(err => {
      setError('Ocurrió un error en la conexión.');
      console.error(err);
    })
    .finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <img src="/logo_cabeza_sin_fondo.PNG" alt="Logo" className="login-logo" />
        <h1 className="login-title">Acceso al Códice</h1>
        <p className="login-subtitle" style={{ color: '#f0e4cc !important' }}>Ingresa tus credenciales para continuar tu travesía.</p>


        <div className="login-tabs">
          <button 
            className={`login-tab-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
          >
            Ingresar
          </button>
          <button 
            className={`login-tab-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => setMode('register')}
          >
            Solicitar acceso
          </button>
        </div>

        {error && <div className="login-error">{error}</div>}

        {mode === 'login' ? (
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-form-group">
              <label htmlFor="usuario">Usuario ID</label>
              <input 
                id="usuario"
                type="text" 
                className="login-input" 
                placeholder="e.g. Imagine" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div className="login-form-group">
              <label htmlFor="clave">Clave de Acceso</label>
              <input 
                id="clave"
                type="password" 
                className="login-input" 
                placeholder="••••••••" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn-primary login-submit-btn" disabled={loading}>
              {loading ? 'Verificando...' : 'Ingresar al Gremio'}
            </button>
          </form>
        ) : (
          <div className="registration-disabled-notice">
            <div className="notice-icon">⚠️</div>
            <h3>Registro por Invitación</h3>
            <p>
              Como somos una comunidad privada, el registro de nuevas cuentas está habilitado únicamente por la administración.
            </p>
            <p className="notice-footer">
              Para solicitar tu acceso o recibir más información, por favor comunícate con nosotros:
            </p>
            <a href="mailto:contacto@australcollector.com" className="notice-email">
              contacto@australcollector.com
            </a>
          </div>
        )}
        
        <div className="login-footer-links">
          {mode === 'login' ? (
            <p>¿No tienes cuenta? <span onClick={() => setMode('register')} className="footer-link-highlight">Solicita acceso</span></p>
          ) : (
            <p>¿Ya eres parte del gremio? <span onClick={() => setMode('login')} className="footer-link-highlight">Inicia sesión</span></p>
          )}
        </div>
      </div>
    </div>
  );
}
