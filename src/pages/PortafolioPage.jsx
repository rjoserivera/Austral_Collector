import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './PortafolioPage.css'
import { API_URL, BASE_URL } from '../config.js'

/* ─── Mock Data ─────────────────────────────────────────── */
const GALERIA = [
  { id: 1, img: '/mock_fig1.png', alt: 'Galería figura 1' },
  { id: 2, img: '/mock_fig2.png', alt: 'Galería figura 2' },
  { id: 3, img: '/mock_fig3.png', alt: 'Galería figura 3' },
  { id: 4, img: '/mock_fig1.png', alt: 'Galería figura 4' },
]

const VIDEOS_PORTA = [
  { id: 1, thumb: '/mock_community.png', title: 'Unboxing colección 2024' },
  { id: 2, thumb: '/mock_community.png', title: 'Restauración de figuras vintage' },
]

function PlayIcon() {
  return (
    <svg className="pp-play-icon" viewBox="0 0 56 56" fill="none">
      <circle cx="28" cy="28" r="26" fill="rgba(0,0,0,0.6)" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5"/>
      <polygon points="22,16 42,28 22,40" fill="white"/>
    </svg>
  )
}

export default function PortafolioPage() {
  const [galeriaReal, setGaleriaReal] = useState(GALERIA);
  const [videosReal, setVideosReal] = useState(VIDEOS_PORTA);
  const [identidadReal, setIdentidadReal] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/public/home_data.php`)
      .then(r => r.json())
      .then(d => {
        if(d.success) {
          if (d.data.ultimas && d.data.ultimas.length > 0) {
            setGaleriaReal(d.data.ultimas.slice(0, 4));
          }
          if (d.data.videos && d.data.videos.length > 0) {
            setVideosReal(d.data.videos.slice(0, 2));
          }
        }
      })
      .catch(e => console.error("Error loading portafolio data:", e))

    fetch(`${API_URL}/public/identidad.php`)
      .then(r => r.json())
      .then(d => {
        if(d.success) {
          setIdentidadReal(d.data);
        }
      })
      .catch(e => console.error("Error loading identidad data:", e))
  }, []);

  return (
    <div className="portafolio-page">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="pp-hero" id="pp-hero">
        <div className="pp-hero-nebula"  aria-hidden="true"/>
        <div className="pp-hero-grain"   aria-hidden="true"/>
        <div className="pp-hero-vignette" aria-hidden="true"/>

        <div className="pp-hero-inner section-wrapper">
          <div className="pp-hero-mascot-wrap">
            <div className="pp-mascot-glow" aria-hidden="true"/>
            <img src="/robot_sin_fondo.png" alt="Mascota Robot Austral Collector" className="pp-mascot"/>
          </div>
          <div className="pp-hero-content">
            <h1 className="pp-hero-title">
              <span className="pp-title-austral">AUSTRAL</span><br/>
              <span className="pp-title-collector">COLLECTOR</span>
            </h1>
            <p className="pp-hero-subtitle">Portafolio Austral Collector</p>
            <div className="gold-divider" style={{ width: '220px', margin: '14px 0 22px' }}/>
            <button onClick={() => alert("Función de registro aún no implementada.")} id="pp-btn-unirse" className="btn-primary pp-hero-btn">Unirse</button>
          </div>
        </div>
      </section>

      {/* ── NUESTRA IDENTIDAD ─────────────────────────────── */}
      <section className="pp-identidad section-wrapper" id="pp-identidad">
        <h2 className="pp-section-title">⭐ Nuestra Identidad</h2>
        <div className="pp-identidad-grid">
          {identidadReal.map(item => (
            <article key={item.id} className="pp-identidad-card card" id={`pp-${item.id}`}>
              <div className="pp-identidad-icon">{item.icon}</div>
              <h3 className="pp-identidad-name">{item.title}</h3>
              <div className="gold-divider" style={{ margin: '10px auto' }}/>
              <p className="pp-identidad-desc">{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── GALERÍA + VIDEOS SPLIT ────────────────────────── */}
      <section className="pp-media section-wrapper" id="pp-galeria">
        {/* Galería */}
        <div className="pp-media-block">
          <h2 className="pp-section-title">⚜️ Galería</h2>
          <div className="pp-galeria-grid">
            {galeriaReal.map((g, idx) => (
              <div key={g.id || idx} className="pp-galeria-item card" id={`pp-gal-${g.id || idx}`}>
                <img src={g.imagen_url ? `${BASE_URL}/${g.imagen_url}` : g.img} alt={g.nombre || g.alt} className="pp-galeria-img" loading="lazy"/>
              </div>
            ))}
          </div>
          <div className="pp-media-footer">
            <Link to="/galeria" id="pp-btn-galeria" className="btn-primary">Ver Galería Completa</Link>
          </div>
        </div>

        {/* Videos */}
        <div className="pp-media-block" id="pp-videos">
          <h2 className="pp-section-title">▶ Videos</h2>
          <div className="pp-videos-list">
            {videosReal.map((v, idx) => {
              let ytid = v.link_yt;
              if (ytid) {
                const match = ytid.match(/[?&]v=([^&]+)/);
                if (match) ytid = match[1];
                else { const sl = ytid.split('/'); ytid = sl[sl.length-1]; }
              }
              const thumbUrl = ytid ? `https://img.youtube.com/vi/${ytid}/0.jpg` : v.thumb;
              
              return (
                <div key={v.id || idx} className="pp-video-thumb card" id={`pp-vid-${v.id || idx}`} onClick={() => v.link_yt ? window.open(v.link_yt, '_blank') : null}>
                  <img src={thumbUrl} alt={v.titulo || v.title} className="pp-video-img" loading="lazy" onError={(e) => { e.target.src='/mock_community.png' }}/>
                  <div className="pp-video-overlay">
                    <PlayIcon/>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="pp-media-footer">
            <Link to="/" id="pp-btn-videos" className="btn-outline">Ver Más Videos</Link>
          </div>
        </div>
      </section>

      {/* ── ÚNETE A LA COMUNIDAD ──────────────────────────── */}
      <section className="pp-comunidad" id="pp-comunidad">
        <div className="pp-comunidad-inner section-wrapper">
          <div className="pp-comunidad-content">
            <h2 className="pp-comunidad-title">Únete a la Comunidad</h2>
            <p className="pp-comunidad-desc">Comparte tu colección con otros apasionados.</p>
            <button onClick={() => alert("Función de registro aún no implementada.")} id="pp-btn-comunidad" className="btn-primary pp-comunidad-btn">Unirse</button>
          </div>
          <div className="pp-comunidad-image" aria-hidden="true">
            <img
              src="/mock_community.png"
              alt="Comunidad de coleccionistas"
              className="pp-comunidad-img"
            />
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="pp-footer">
        <div className="gold-divider"/>
        <p className="pp-footer-copy">© 2024 Austral Collector — Comunidad de coleccionistas.</p>
      </footer>
    </div>
  )
}
