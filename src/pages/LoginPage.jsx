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
  const [showPassword, setShowPassword] = useState(false);
  
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

  // ── Lockout persistente (sobrevive recarga de página) ──────
  // Niveles: 3 intentos → 60s | 6 intentos → 5 min | 9 intentos → 30 min
  const LOCKOUT_LEVELS = [
    { threshold: 3, duration: 60,   label: '1 minuto'    },
    { threshold: 6, duration: 300,  label: '5 minutos'   },
    { threshold: 9, duration: 1800, label: '30 minutos'  },
  ];

  const readLockoutStorage = () => {
    try {
      const raw = localStorage.getItem('austral_login_lockout');
      if (!raw) return { attempts: 0, until: 0 };
      return JSON.parse(raw);
    } catch { return { attempts: 0, until: 0 }; }
  };

  const writeLockoutStorage = (attempts, until) => {
    localStorage.setItem('austral_login_lockout', JSON.stringify({ attempts, until }));
  };

  const clearLockoutStorage = () => {
    localStorage.removeItem('austral_login_lockout');
  };

  // Inicializar desde localStorage al montar
  const [failedAttempts, setFailedAttempts] = useState(() => readLockoutStorage().attempts);
  const [lockoutTime, setLockoutTime] = useState(() => {
    const { until } = readLockoutStorage();
    const remaining = Math.max(0, Math.floor((until - Date.now()) / 1000));
    return remaining;
  });

  // Cuenta regresiva en tiempo real
  useEffect(() => {
    if (lockoutTime <= 0) return;
    const timer = setInterval(() => {
      setLockoutTime(prev => {
        if (prev <= 1) {
          setError('');
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutTime]);

  const formatLockout = (seconds) => {
    if (seconds >= 60) {
      const m = Math.ceil(seconds / 60);
      return `${m} minuto${m > 1 ? 's' : ''}`;
    }
    return `${seconds} segundo${seconds !== 1 ? 's' : ''}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (lockoutTime > 0) {
      setError(`Demasiados intentos. Intenta nuevamente en ${formatLockout(lockoutTime)}.`);
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
        // Login exitoso — limpiar todo el historial de bloqueos
        setFailedAttempts(0);
        setLockoutTime(0);
        clearLockoutStorage();

        if (data.alert_destacado) {
          toast.add('Atención: No hay ningún cumpleañero ni destacado configurado. Se mostrará la publicación con más "Me gusta" por el momento.', 'warning', 10000);
        }
        localStorage.setItem('austral_auth_user', JSON.stringify(data.user));
        localStorage.setItem('austral_auth_role', data.user.role);
        const token = data.token || data.jwt;
        if (token) localStorage.setItem('austral_auth_token', token);
        
        if (data.user.require_password_change) {
          localStorage.setItem('austral_auth_require_pass_change', 'true');
          navigate('/');
        } else {
          localStorage.removeItem('austral_auth_require_pass_change');
          navigate(`/perfil/${data.user.id}`);
        }

      } else {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);

        // Determinar qué nivel de bloqueo aplicar
        const level = [...LOCKOUT_LEVELS].reverse().find(l => newAttempts >= l.threshold);

        if (level) {
          const until = Date.now() + level.duration * 1000;
          writeLockoutStorage(newAttempts, until);
          setLockoutTime(level.duration);
          setError(`Demasiados intentos fallidos. Por favor, espera ${level.label}.`);
        } else {
          // Guardar intentos aunque no haya bloqueo aún (para que persista entre recargas)
          writeLockoutStorage(newAttempts, 0);
          const remaining = 3 - newAttempts;
          setError(`${data.error || 'Credenciales incorrectas.'} (${remaining} intento${remaining !== 1 ? 's' : ''} restante${remaining !== 1 ? 's' : ''} antes del bloqueo)`);
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
              <div className="login-input-wrap">
                <input 
                  id="clave"
                  type={showPassword ? 'text' : 'password'}
                  className="login-input" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setShowPassword(p => !p)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary login-submit-btn" disabled={loading || lockoutTime > 0}>
              {lockoutTime > 0
                ? `🔒 Bloqueado (${formatLockout(lockoutTime)})`
                : loading ? 'Verificando...' : 'Ingresar al Gremio'}
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
