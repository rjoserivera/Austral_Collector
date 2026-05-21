import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import './NavBar.css'
import './NavBarDropdown.css'
import { useSyncStatus } from '../hooks/useSyncStatus'
import { API_URL, BASE_URL } from '../config'

export default function NavBar() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const dropdownRef = useRef(null)

  const { status, pendingCount } = useSyncStatus()

  const location = useLocation()
  const path = location.pathname

  // Cerrar el menú móvil al cambiar de ruta
  useEffect(() => {
    setMobileMenuOpen(false)
    setDropdownOpen(false)
  }, [location.pathname])

  const [siteLogo, setSiteLogo] = useState('/logo_sin_fondo2.png')

  useEffect(() => {
    fetch(`${API_URL}/get_site_config.php`)
      .then(r => r.json())
      .then(d => {
        if (d.success && d.config && d.config.logo_sitio) {
          setSiteLogo(d.config.logo_sitio.startsWith('uploads/') ? `${BASE_URL}/${d.config.logo_sitio}` : d.config.logo_sitio)
        }
      })
      .catch(e => console.error('Error loading logo:', e))
  }, [])

  const authRole = localStorage.getItem('austral_auth_role')
  const authUserRaw = localStorage.getItem('austral_auth_user')
  let authUser = null
  try {
    if (authUserRaw) {
      const parsed = JSON.parse(authUserRaw)
      authUser = typeof parsed === 'object' ? parsed.username : parsed
    }
  } catch(e) {
    authUser = authUserRaw
  }

  const isAdmin = path.startsWith('/admin')

  const defaultLinks = [
    { to: '/',           label: 'Inicio'    },
    { to: '/portafolio', label: 'Nosotros'  },
    { to: '/galeria',    label: 'Galería'   },
    { to: '/miembros',   label: 'Miembros'  },
    { to: '/contacto',   label: 'Contacto'  },
  ]

  let links = defaultLinks

  const handleLogout = () => {
    localStorage.removeItem('austral_auth_user')
    localStorage.removeItem('austral_auth_role')
    setDropdownOpen(false)
    setMobileMenuOpen(false)
  }

  // Cerrar dropdown al hacer click afuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef])

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-inner section-wrapper">

        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <img src={siteLogo} alt="Austral Collector Logo" className="navbar-logo" />
          <span className="navbar-title">
            {isAdmin
              ? <><span className="title-austral">Admin</span> <span className="title-collector">Collector</span></>
              : <><span className="title-austral">Austral</span> <span className="title-collector">Collector</span></>
            }
          </span>
        </Link>

        {/* Links — Desktop */}
        <ul className="navbar-links">
          {links.map(({ to, label }) => (
            <li key={label}>
              {to.startsWith('/') && !to.includes('#') ? (
                <NavLink to={to} className={({ isActive }) => isActive ? 'nav-active' : ''}>
                  {label}
                </NavLink>
              ) : (
                <a href={to}>{label}</a>
              )}
            </li>
          ))}
        </ul>

        {/* Actions (Sync + Usuario/Login) */}
        <div className="navbar-actions">
          
          {/* Indicador Global de Red/Sync */}
          <div className={`sync-indicator status-${status}`} title={
            status === 'online' ? 'Conectado a la base de datos' :
            status === 'offline' ? 'Sin conexión (Modo Local)' :
            status === 'pending' ? `Sincronizando... (${pendingCount} pendiente/s)` :
            'Error de Sincronización'
          }>
            {status === 'online' && '🟢'}
            {status === 'offline' && '🔴'}
            {status === 'pending' && '⏳'}
            {status === 'error' && '🟠'}
          </div>

          {authUser ? (
            <div className="nav-user-menu" ref={dropdownRef}>
              <button 
                className={`btn-primary ${authRole === 'admin' ? 'btn-admin-nav' : ''}`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {authRole === 'admin' ? '👑' : '👤'} <span className="nav-username">{authUser}</span> ▾
              </button>
              
              {dropdownOpen && (
                <div className="nav-dropdown">
                  <div className="nav-dropdown-header">
                    <strong>{authUser}</strong>
                    <span>{authRole === 'admin' ? 'Administrador' : 'Coleccionista'}</span>
                  </div>
                  
                  <Link to={`/perfil/${authUser}`} onClick={() => setDropdownOpen(false)}>
                    🪪 Perfil
                  </Link>
                  
                  {authRole === 'admin' && (
                    <Link to="/admin" onClick={() => setDropdownOpen(false)} style={{ color: '#a8d4e0' }}>
                      ⚙️ Panel Admin
                    </Link>
                  )}
                  
                  <div className="nav-dropdown-divider"></div>
                  
                  <Link to="/" onClick={handleLogout} className="logout-link">
                    🚪 Cerrar Sesión
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.75rem' }}>
              Iniciar Sesión
            </Link>
          )}

        </div>

        {/* Botón Hamburguesa — solo en móvil */}
        <button
          className="navbar-hamburger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menú de navegación"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

      </div>

      {/* Menú desplegable móvil */}
      {mobileMenuOpen && (
        <div className="navbar-mobile-menu">
          {links.map(({ to, label }) => (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'mobile-nav-active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  )
}
