import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from '../contexts/NotificationContext.jsx';
import './LoginPage.css';

import { API_URL } from '../config.js';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  
  const navigate = useNavigate();

  useEffect(() => {
    // Prevent logged-in users from accessing the login page
    const token = localStorage.getItem('austral_auth_token');
    const userRaw = localStorage.getItem('austral_auth_user');
    if (token && userRaw) {
      try {
        const userObj = JSON.parse(userRaw);
        navigate(`/perfil/${userObj.id}`, { replace: true });
      } catch (e) {
        navigate('/', { replace: true });
      }
    }
  }, [navigate]);

  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0);

  useEffect(() => {
    let timer;
    if (lockoutTime > 0) {
      timer = setInterval(() => {
        setLockoutTime(prev => prev - 1);
      }, 1000);
    } else if (lockoutTime === 0 && failedAttempts >= 3) {
      setFailedAttempts(0);
      setError('');
    }
    return () => clearInterval(timer);
  }, [lockoutTime, failedAttempts]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (lockoutTime > 0) {
      setError(`Demasiados intentos. Intenta nuevamente en ${lockoutTime} segundos.`);
      return;
    }
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
        setFailedAttempts(0);
        if (data.alert_destacado) {
          toast.add('Atención: No hay ningún cumpleañero ni destacado configurado. Se mostrará la publicación con más "Me gusta" por el momento.', 'warning', 10000);
        }
        localStorage.setItem('austral_auth_user', JSON.stringify(data.user));
        localStorage.setItem('austral_auth_role', data.user.role);
        // Save JWT token for authenticated API requests
        const token = data.token || data.jwt;
        if (token) localStorage.setItem('austral_auth_token', token);
        
        if (data.user.require_password_change) {
          localStorage.setItem('austral_auth_require_pass_change', 'true');
          navigate('/');
        } else {
          localStorage.removeItem('austral_auth_require_pass_change');
          // Navigate to the user's public profile page instead of the admin dashboard
          navigate(`/perfil/${data.user.id}`);
        }

      } else {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        if (newAttempts >= 3) {
          setLockoutTime(60);
          setError('Demasiados intentos fallidos. Por favor, espera 1 minuto.');
        } else {
          setError(data.error || 'Credenciales incorrectas.');
        }
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
        <Link to="/" className="login-brand">
          <img src="/logo_sin_fondo2.png" alt="Austral Collector Logo" className="login-logo" />
        </Link>
        <h1 className="login-title" style={{ marginTop: '0.5rem' }}>Acceso al Códice</h1>
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

            <button type="submit" className="btn-primary login-submit-btn" disabled={loading || lockoutTime > 0}>
              {lockoutTime > 0 ? `Bloqueado (${lockoutTime}s)` : loading ? 'Verificando...' : 'Ingresar al Gremio'}
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
            <a href="mailto:administracion@australcollector.cl" className="notice-email">
              administracion@australcollector.cl
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
