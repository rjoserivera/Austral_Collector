import { useState, useEffect } from 'react'
import { toast, confirmDialog } from '../contexts/NotificationContext.jsx'
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
  const [selectedImg, setSelectedImg] = useState(null)
  const [selectedVideo, setSelectedVideo] = useState(null)

  const authUserStr = localStorage.getItem('austral_auth_user')
  let currentUser = null
  try { if (authUserStr) currentUser = JSON.parse(authUserStr) } catch(e) { currentUser = null }

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
            <button onClick={(e) => { if (currentUser) { e.preventDefault(); toast.info('Usted ya ha iniciado sesión'); } else { window.location.href='/login?mode=register'; } }} id="pp-btn-unirse" className="btn-primary pp-hero-btn" style={{ padding: "12px 32px", fontSize: "0.95rem", fontWeight: "800", letterSpacing: "0.1em", background: "var(--color-red)", boxShadow: "0 8px 32px rgba(139, 32, 32, 0.5)", color: "#ffffff" }}>Unirse</button>
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

      {/* ── MEDIA: GALERÍA + VIDEOS ───────────────────────── */}
      <section className="pp-media section-wrapper" id="pp-galeria">
        {/* Galería de Fotografías */}
        <div className="pp-media-block">
          <h2 className="pp-section-title">⚜️ Galería de Fotografías</h2>
          {loading ? (
            <div className="pp-empty-state">Cargando galería...</div>
          ) : galeria.length === 0 ? (
            <div className="pp-empty-state">
              <span className="pp-empty-icon">📷</span>
              <p>La galería estará disponible pronto.</p>
            </div>
          ) : (
            <div className="pp-galeria-grid" style={{ gridTemplateColumns: galeria.length === 1 ? '1fr' : galeria.length <= 3 ? 'repeat(auto-fill, minmax(200px, 1fr))' : 'repeat(auto-fill, minmax(220px, 1fr))' }}>
              {galeria.map((g, idx) => (
                <div 
                  key={g.id || idx} 
                  className="pp-galeria-item card" 
                  id={`pp-gal-${g.id || idx}`}
                  onClick={() => setSelectedImg(g)}
                  style={{ cursor: 'zoom-in' }}
                >
                  <img
                    src={`http://localhost/Austral_Collector/${g.imagen_url}`}
                    alt={g.descripcion || `Galería ${idx + 1}`}
                    className="pp-galeria-img"
                    loading="lazy"
                    onError={e => { e.target.src = '/mock_fig1.png' }}
                  />
                  <div className="pp-galeria-desc">
                    {g.descripcion || '\u00A0'}
                  </div>
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
            <div className="pp-videos-grid">
              {videos.map((v, idx) => {
                const ytId = getYtId(v.link_yt)
                const thumbUrl = ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : '/mock_community.png'
                return (
                  <div key={v.id || idx} className="pp-video-card card" id={`pp-vid-${v.id || idx}`}>
                    <div className="pp-video-thumb" onClick={() => setSelectedVideo(ytId)}>
                      <img src={thumbUrl} alt={v.titulo || `Video ${idx + 1}`} className="pp-video-img" loading="lazy"
                        onError={e => { e.target.src = '/mock_community.png' }}/>
                      <div className="pp-video-overlay"><PlayIcon/></div>
                    </div>
                    <div className="pp-video-info">
                      <p className="pp-v-info-desc">{v.descripcion || '\u00A0'}</p>
                    </div>
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
            <button onClick={(e) => { if (currentUser) { e.preventDefault(); toast.info('Usted ya ha iniciado sesión'); } else { window.location.href='/login?mode=register'; } }} id="pp-btn-comunidad" className="btn-primary pp-comunidad-btn" style={{ textAlign: "center", textDecoration: "none", display: "inline-block", padding: "14px 40px", fontSize: "1.1rem", fontWeight: "800", letterSpacing: "0.05em", background: "var(--color-red)", boxShadow: "0 8px 30px rgba(139, 32, 32, 0.5)", color: "#ffffff" }}>Unirse a la Comunidad</button>
          </div>
          <div className="pp-comunidad-image" aria-hidden="true">
            {comunidadImg ? (
              <img
                src={comunidadImg.startsWith('uploads/') ? `${BASE_URL}/${comunidadImg}` : comunidadImg}
                alt="Comunidad de coleccionistas"
                className="pp-comunidad-img"
                onError={e => e.target.style.display='none'}
              />
            ) : null}
          </div>
        </div>
      </section>

      {/* ── LIGHTBOX MODAL (IMAGEN) ───────────────────────── */}
      {selectedImg && (
        <div className="pp-modal-overlay" onClick={() => setSelectedImg(null)}>
          <div className="pp-modal-content" onClick={e => e.stopPropagation()}>
            <button className="pp-modal-close" onClick={() => setSelectedImg(null)}>×</button>
            <img 
              src={`http://localhost/Austral_Collector/${selectedImg.imagen_url}`} 
              alt="Zoom imagen" 
              className="pp-modal-img" 
            />
            {selectedImg.descripcion && (
              <div className="pp-modal-info">
                <p className="pp-modal-desc">{selectedImg.descripcion}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── VIDEO MODAL (YOUTUBE) ─────────────────────────── */}
      {selectedVideo && (
        <div className="pp-modal-overlay" onClick={() => setSelectedVideo(null)} style={{ background: 'rgba(5, 1, 1, 0.94)' }}>
          <div className="pp-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '1000px' }}>
            <button className="pp-modal-close" onClick={() => setSelectedVideo(null)} style={{ top: '-45px' }}>✕</button>
            <div style={{ width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: '8px 8px 0 0', overflow: 'hidden', border: '1.5px solid rgba(201, 168, 76, 0.4)', borderBottom: 'none', boxShadow: '0 15px 50px rgba(0,0,0,0.8)' }}>
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`} 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" 
                allowFullScreen>
              </iframe>
            </div>
            {/* Descripción del video con el mismo estilo que las fotos */}
            {(() => {
              const vObj = videos.find(v => getYtId(v.link_yt) === selectedVideo);
              return vObj && vObj.descripcion ? (
                <div className="pp-modal-info">
                  <p className="pp-modal-desc">{vObj.descripcion}</p>
                </div>
              ) : null;
            })()}
          </div>
        </div>
      )}

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="pp-footer">
        <div className="gold-divider"/>
        <p className="pp-footer-copy">© 2024 Austral Collector — Comunidad de coleccionistas.</p>
      </footer>
    </div>
  )
}
