import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer" id="footer">
      <div className="footer-inner section-wrapper">
        {/* Logo & Brand */}
        <div className="footer-brand">
          <img src="/logov2_sin_fondo.png" alt="Logo" className="footer-logo" />
          <div>
            <span className="footer-brand-name">Austral Collector</span>
            <p className="footer-brand-tagline">Plataforma de coleccionismo vintage</p>
          </div>
        </div>

        {/* Links */}
        <nav className="footer-nav" aria-label="Footer navigation">
          <div className="footer-nav-col">
            <h4 className="footer-nav-title">Plataforma</h4>
            <ul>
              <li><a href="#galeria">Galería</a></li>
              <li><a href="#videos">Videos</a></li>
              <li><a href="#noticias">Eventos</a></li>
              <li><a href="#comunidad">Comunidad</a></li>
            </ul>
          </div>
          <div className="footer-nav-col">
            <h4 className="footer-nav-title">Cuenta</h4>
            <ul>
              <li><a href="#">Iniciar Sesión</a></li>
              <li><a href="#">Registrarse</a></li>
              <li><a href="#">Mi Perfil</a></li>
              <li><a href="#">Mi Colección</a></li>
            </ul>
          </div>
          <div className="footer-nav-col">
            <h4 className="footer-nav-title">Legal</h4>
            <ul>
              <li><a href="#">Privacidad</a></li>
              <li><a href="#">Términos</a></li>
              <li><a href="#">Contacto</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="gold-divider" style={{ marginBottom: '16px' }} />
        <p className="footer-copyright">
          © {year} <strong>Austral Collector</strong>. Todos los derechos reservados.
          &nbsp;·&nbsp; Hecho con ❤️ por coleccionistas, para coleccionistas.
        </p>
      </div>
    </footer>
  )
}
