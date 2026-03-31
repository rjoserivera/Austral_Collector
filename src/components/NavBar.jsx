import { Link, NavLink, useLocation } from 'react-router-dom'
import './NavBar.css'

export default function NavBar() {
  const location = useLocation()
  const path = location.pathname

  const isPortafolio = path === '/portafolio'
  const isGaleria = path === '/galeria'
  const isAdmin = path.startsWith('/admin')
  const isPrivate = path.startsWith('/dashboard') || path.startsWith('/perfil') || isAdmin

  // Shared base navigation
  const defaultLinks = [
    { to: '/',           label: 'Inicio' },
    { to: '/portafolio', label: 'Nosotros' },
    { to: '/galeria',    label: 'Galería' },
    { to: '/#comunidad', label: 'Miembros' },
    { to: '/#noticias',  label: 'Eventos' },
    { to: '/contacto',   label: 'Contacto' },
  ]

  // Admin navigation
  const adminLinks = [
    { to: '/admin',       label: 'Panel de Control' },
    { to: '#contenidos',  label: 'Administrar Contenidos' },
    { to: '#usuarios',    label: 'Gestionar Usuarios' },
    { to: '#actividad',   label: 'Ver Actividad' },
    { to: '#config',      label: 'Configuración' },
  ]

  // Private navigation (Dashboard / Perfil)
  const privateLinks = [
    { to: '/',           label: 'Volver al Inicio' },
    { to: '/galeria',    label: 'Explorar Galería' },
    { to: '/dashboard',  label: 'Mi Panel' },
    { to: '/perfil/me',  label: 'Ver Perfil Público' },
  ]

  let links = defaultLinks
  if (isAdmin) {
    links = adminLinks
  } else if (isPrivate) {
    links = privateLinks
  } else if (isPortafolio) {
    links = [
      { to: '/',           label: 'Inicio' },
      { to: '/portafolio', label: 'Nosotros' },
      { to: '/#noticias',  label: 'Eventos' },
      { to: '/#noticias',  label: 'Noticias' },
      { to: '/contacto',   label: 'Contacto' },
    ]
  } else if (isGaleria) {
    links = [
      { to: '/',           label: 'Inicio' },
      { to: '/galeria',    label: 'Galería' },
      { to: '/#comunidad', label: 'Miembros' },
      { to: '/contacto',   label: 'Contacto' },
    ]
  }

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-inner section-wrapper">
        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <img src="/logov2_sin_fondo.png" alt="Austral Collector Logo" className="navbar-logo" />
          <span className="navbar-title">
            {isAdmin ? 'Admin Collector' : 'Austral Collector'}
          </span>
        </Link>

        {/* Nav links */}
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
          {isPrivate ? (
            <Link to="/" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.75rem', background: '#8B1A0F' }}>
              Salir
            </Link>
          ) : (
            <Link to="/dashboard" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.75rem' }}>
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
