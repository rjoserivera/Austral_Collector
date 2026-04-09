import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer" id="footer">
      <div className="footer-inner section-wrapper">
        {/* Links — IZQUIERDA */}
        <nav className="footer-nav" aria-label="Footer navigation">
          <div className="footer-nav-col">
            <h4 className="footer-nav-title">Acceso Directo</h4>
            <div className="footer-quick-links-horizontal">
              <a href="/galeria" className="footer-quick-link">Galería</a>
              <a href="/miembros" className="footer-quick-link">Miembros</a>
              <a href="/login" className="footer-quick-link">Unirse</a>
              <a href="/contacto" className="footer-quick-link">Contacto</a>
            </div>
          </div>
        </nav>

        {/* Contacto — CENTRO */}
        <div className="footer-contact-col" style={{ alignItems: 'center', textAlign: 'center' }}>
          <h4 className="footer-nav-title">Contacto</h4>
          <div className="footer-contact-box" style={{ marginBottom: 0 }}>
            <p className="footer-info-text">Escríbenos ante dudas o sugerencias</p>
            <a href="mailto:austral.cadmin@gmail.com" className="footer-email">austral.cadmin@gmail.com</a>
          </div>
        </div>

        {/* Redes — DERECHA */}
        <div className="footer-social-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h4 className="footer-nav-title">Redes Sociales</h4>
          <div className="footer-social-group" style={{ justifyContent: 'center' }}>
            <a href="#" className="social-item social-ig">
              <span className="social-icon-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </span>
              <span className="social-label">Instagram</span>
            </a>
            <a href="#" className="social-item social-fb">
              <span className="social-icon-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </span>
              <span className="social-label">Facebook</span>
            </a>
            <a href="#" className="social-item social-yt">
              <span className="social-icon-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </span>
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
