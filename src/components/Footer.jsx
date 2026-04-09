import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer" id="footer">
      <div className="footer-inner section-wrapper">
        {/* Logo & Brand — A la IZQUIERDA */}
        <div className="footer-brand">
          <img src="/logo_cabeza_sin_fondo.PNG" alt="Logo" className="footer-logo" />
          <div className="footer-brand-text">
            <span className="footer-brand-name">Austral Collector</span>
            <p className="footer-brand-tagline">Plataforma de coleccionismo vintage</p>
          </div>
        </div>

        {/* Links — AL CENTRO */}
        <nav className="footer-nav" aria-label="Footer navigation">
          <div className="footer-nav-col">
            <h4 className="footer-nav-title">Acceso Directo</h4>
            <div className="footer-quick-links-vertical">
              <a href="/galeria" className="footer-quick-link">Galería</a>
              <a href="/miembros" className="footer-quick-link">Miembros</a>
              <a href="/login" className="footer-quick-link">Unirse</a>
              <a href="/contacto" className="footer-quick-link">Contacto</a>
            </div>
          </div>
        </nav>

        {/* Contacto & Socials — A la DERECHA */}
        <div className="footer-contact-col">
          <h4 className="footer-nav-title">Contacto</h4>
          <div className="footer-contact-box">
            <p className="footer-info-text">Escríbenos ante dudas o sugerencias</p>
            <a href="mailto:admin@australcollector.cl" className="footer-email">admin@australcollector.cl</a>
          </div>
          <div className="footer-social-group">
            <a href="#" className="social-item">
              <span className="social-icon-box">📸</span>
              <span className="social-label">Instagram</span>
            </a>
            <a href="#" className="social-item">
              <span className="social-icon-box">👥</span>
              <span className="social-label">Facebook</span>
            </a>
            <a href="#" className="social-item">
              <span className="social-icon-box">📽️</span>
              <span className="social-label">YouTube</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="gold-divider" style={{ marginBottom: '16px' }} />
        <p className="footer-copyright">
          © {year} <strong>Austral Collector</strong>. Todos los derechos reservados.
          &nbsp;·&nbsp; Hecho con ❤️ para coleccionistas.
        </p>
      </div>
    </footer>
  )
}
