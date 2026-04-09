import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import './NavBar.css'
import './NavBarDropdown.css'
import { useSyncStatus } from '../hooks/useSyncStatus'

export default function NavBar() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const { status, pendingCount } = useSyncStatus()

  const location = useLocation()
  const path = location.pathname

  const authRole = localStorage.getItem('austral_auth_role')   // 'admin' | 'user' | null
  const authUserRaw = localStorage.getItem('austral_auth_user')
  let authUser = null
  try {
    if (authUserRaw) {
      const parsed = JSON.parse(authUserRaw)
      authUser = typeof parsed === 'object' ? parsed.username : parsed
    }
  } catch(e) {
    authUser = authUserRaw // fallback: era un string plano (formato antiguo)
  }

  const isAdmin    = path.startsWith('/admin')
  const isPrivate  = path.startsWith('/dashboard') || path.startsWith('/perfil') || isAdmin
  const isPortafolio = path === '/portafolio'
  const isGaleria    = path === '/galeria'

  // ── Grupos de links ────────────────────────────────────
  const defaultLinks = [
    { to: '/',           label: 'Inicio'    },
    { to: '/portafolio', label: 'Nosotros'  },
    { to: '/galeria',    label: 'Galería'   },
    { to: '/miembros',   label: 'Miembros'  },
    { to: '/contacto',   label: 'Contacto'  },
  ]

  const adminLinks = [
    { to: '/admin',      label: 'Panel de Control'       },
    { to: '/dashboard',  label: 'Mi Dashboard'           },
  ]

  const privateLinks = [
    { to: '/',          label: 'Volver al Inicio'   },
    { to: '/galeria',   label: 'Explorar Galería'   },
    { to: `/perfil/${authUser}`, label: 'Ver Perfil' },
    // Link a admin solo si el usuario tiene rol admin
    ...(authRole === 'admin' ? [{ to: '/admin', label: '⚙️ Admin' }] : []),
  ]

  const portafolioLinks = [
    { to: '/',           label: 'Inicio'   },
    { to: '/portafolio', label: 'Nosotros' },
    { to: '/contacto',   label: 'Contacto' },
  ]

  const galeriaLinks = [
    { to: '/',           label: 'Inicio'   },
    { to: '/galeria',    label: 'Galería'  },
    { to: '/miembros',   label: 'Miembros' },
    { to: '/contacto',   label: 'Contacto' },
  ]

  // ── Selección de links según ruta ──────────────────────
  // El usuario solicitó que la barra de navegación sea la misma en todas las pantallas.
  let links = defaultLinks

  const handleLogout = () => {
    localStorage.removeItem('austral_auth_user')
    localStorage.removeItem('austral_auth_role')
    setDropdownOpen(false)
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
          <img src="/logo_cabeza_sin_fondo.PNG" alt="Austral Collector Logo" className="navbar-logo" />
          <span className="navbar-title">
            {isAdmin
              ? <><span className="title-austral">Admin</span> <span className="title-collector">Collector</span></>
              : <><span className="title-austral">Austral</span> <span className="title-collector">Collector</span></>
            }
          </span>
        </Link>

        {/* Links */}
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

        {/* Actions */}
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
                style={{ padding: '8px 20px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {authRole === 'admin' ? '🛡️' : '👨‍🚀'} {authUser} ▾
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
            <Link to="/login" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.75rem' }}>
              Iniciar Sesión
            </Link>
          )}
        </div>

      </div>
    </nav>
  )
}
