import { useState, useEffect } from 'react'
import './PortafolioPage.css'
import { API_URL, BASE_URL } from '../config.js'

function PlayIcon() {
  return (
    <svg className="pp-play-icon" viewBox="0 0 56 56" fill="none">
      <circle cx="28" cy="28" r="26" fill="rgba(0,0,0,0.6)" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5"/>
      <polygon points="22,16 42,28 22,40" fill="white"/>
    </svg>
  )
}

function getYtId(url) {
  if (!url) return null
  const m = url.match(/[?&]v=([^&]+)/)
  if (m) return m[1]
  const sl = url.split('/')
  return sl[sl.length - 1] || null
}

export default function PortafolioPage() {
  const [galeria, setGaleria]       = useState([])
  const [videos, setVideos]         = useState([])
  const [identidad, setIdentidad]   = useState([])
  const [comunidadImg, setComunidad] = useState('')
  const [loading, setLoading]        = useState(true)

  useEffect(() => {
    // Galería, videos y comunidad desde el nuevo endpoint
    fetch(`${API_URL}/public/portafolio_data.php`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setGaleria(d.galeria || [])
          setVideos(d.videos || [])
          setComunidad(d.comunidad_img || '')
        }
      })
      .catch(e => console.error('Error portafolio_data:', e))
      .finally(() => setLoading(false))

    // Identidad (sin cambios)
    fetch(`${API_URL}/public/identidad.php`)
      .then(r => r.json())
      .then(d => { if(d.success) setIdentidad(d.data) })
      .catch(e => console.error('Error identidad:', e))
  }, [])

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
            <img src="/austral_brazos_cruzados.png" alt="Mascota Robot Austral Collector" className="pp-mascot"/>
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
          {identidad.map(item => (
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
          {loading ? (
            <div className="pp-empty-state">Cargando galería...</div>
          ) : galeria.length === 0 ? (
            <div className="pp-empty-state">
              <span className="pp-empty-icon">📷</span>
              <p>La galería estará disponible pronto.</p>
            </div>
          ) : (
            <div className="pp-galeria-grid" style={{ gridTemplateColumns: galeria.length === 1 ? '1fr' : galeria.length <= 3 ? 'repeat(auto-fill, minmax(200px, 1fr))' : '1fr 1fr' }}>
              {galeria.map((g, idx) => (
                <div key={g.id || idx} className="pp-galeria-item card" id={`pp-gal-${g.id || idx}`}>
                  <img
                    src={`http://localhost/Austral%20Collector/${g.imagen_url}`}
                    alt={g.descripcion || `Galería ${idx + 1}`}
                    className="pp-galeria-img"
                    loading="lazy"
                    onError={e => { e.target.src = '/mock_fig1.png' }}
                  />
                  {g.descripcion && (
                    <div className="pp-galeria-desc">{g.descripcion}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Videos */}
        <div className="pp-media-block" id="pp-videos">
          <h2 className="pp-section-title">▶ Videos</h2>
          {loading ? (
            <div className="pp-empty-state">Cargando videos...</div>
          ) : videos.length === 0 ? (
            <div className="pp-empty-state">
              <span className="pp-empty-icon">🎬</span>
              <p>Los videos estarán disponibles pronto.</p>
            </div>
          ) : (
            <div className="pp-videos-list">
              {videos.map((v, idx) => {
                const ytId = getYtId(v.link_yt)
                const thumbUrl = ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : '/mock_community.png'
                return (
                  <div key={v.id || idx} className="pp-video-thumb card" id={`pp-vid-${v.id || idx}`}
                    onClick={() => v.link_yt ? window.open(v.link_yt, '_blank') : null}>
                    <img src={thumbUrl} alt={v.titulo || `Video ${idx + 1}`} className="pp-video-img" loading="lazy"
                      onError={e => { e.target.src = '/mock_community.png' }}/>
                    <div className="pp-video-overlay"><PlayIcon/></div>
                  </div>
                )
              })}
            </div>
          )}
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
            {comunidadImg ? (
              <img
                src={comunidadImg.startsWith('uploads/') ? `http://localhost/Austral%20Collector/${comunidadImg}` : comunidadImg}
                alt="Comunidad de coleccionistas"
                className="pp-comunidad-img"
                onError={e => e.target.style.display='none'}
              />
            ) : null}
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
