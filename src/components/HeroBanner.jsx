import { Link } from 'react-router-dom'
import './HeroBanner.css'

export default function HeroBanner() {
  return (
    <section className="hero" id="hero">
      {/* Nebula overlay layers */}
      <div className="hero-nebula" aria-hidden="true" />
      <div className="hero-grain" aria-hidden="true" />
      <div className="hero-vignette" aria-hidden="true" />

      <div className="hero-inner section-wrapper">
        {/* Left: Text Content */}
        <div className="hero-content">
          <div className="hero-badge">
            <span className="section-label" style={{ justifyContent: 'flex-start', fontSize: '0.6rem' }}>
              Coleccionismo Vintage
            </span>
          </div>

          <div className="hero-logo-wrap">
            <img src="/logov2_sin_fondo.png" alt="Austral Collector Logo" className="hero-logo-img" />
            <div>
              <h1 className="hero-title">Austral<br /><span className="hero-title-accent">Collector</span></h1>
              <div className="gold-divider" style={{ width: '180px', margin: '8px 0' }} />
            </div>
          </div>

          <p className="hero-tagline">
            "Juegos, juguetes y coleccionables<br />de ayer y hoy"
          </p>

          <p className="hero-desc">
            La plataforma definitiva para coleccionistas apasionados.<br />
            Catalogá, compartí y descubrí piezas únicas de la historia.
          </p>

          <div className="hero-actions">
            <Link to="/galeria" id="btn-ver-galeria" className="btn-primary hero-btn">
              🗂️ Ver Galería
            </Link>
            <button onClick={() => alert("Función de registro aún no implementada.")} id="btn-unirse-hero" className="btn-outline hero-btn">
              ✦ Unirse
            </button>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-num">4.2K</span>
              <span className="hero-stat-lbl">Figuras</span>
            </div>
            <div className="hero-stat-sep">✦</div>
            <div className="hero-stat">
              <span className="hero-stat-num">1.8K</span>
              <span className="hero-stat-lbl">Coleccionistas</span>
            </div>
            <div className="hero-stat-sep">✦</div>
            <div className="hero-stat">
              <span className="hero-stat-num">320</span>
              <span className="hero-stat-lbl">Eventos</span>
            </div>
          </div>
        </div>

        {/* Right: Mascot */}
        <div className="hero-mascot-wrap">
          <div className="hero-mascot-glow" aria-hidden="true" />
          <img
            src="/mascota_sin_fondo.png"
            alt="Mascota Robot Retro de Austral Collector"
            className="hero-mascot"
          />
          <div className="hero-mascot-platform" aria-hidden="true" />
        </div>
      </div>

      {/* Bottom wave separator */}
      <div className="hero-separator" aria-hidden="true">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#1A0F0A"/>
        </svg>
      </div>
    </section>
  )
}
