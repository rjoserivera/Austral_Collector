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
  if (!url) return null;
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([^&?]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

export default function PortafolioPage() {
  const [grupos, setGrupos]         = useState([])
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
          setGrupos(d.grupos || [])
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
            <h1 className="global-hero-title" style={{ textAlign: 'center', margin: 0 }}>
              <span className="global-title-teal">AUSTRAL</span><br/>
              <span className="global-title-red">COLLECTOR</span>
            </h1>
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

      {/* ── MEDIA: SECCIONES (GRUPOS) ───────────────────────── */}
      <section className="pp-media section-wrapper" id="pp-galeria">
        {loading ? (
          <div className="pp-empty-state">Cargando portafolio...</div>
        ) : grupos.length === 0 ? (
          <div className="pp-empty-state">
            <span className="pp-empty-icon">📂</span>
            <p>El portafolio estará disponible pronto.</p>
          </div>
        ) : (
          grupos.map(grupo => (
            <div className="pp-media-block" key={grupo.id} style={{ marginBottom: '60px' }}>
              <h2 className="pp-section-title">⚜️ {grupo.titulo}</h2>
              {(!grupo.items || grupo.items.length === 0) ? (
                <div className="pp-empty-state" style={{ padding: '20px', minHeight: 'auto' }}>
                  <p>Aún no hay fotos o videos en esta sección.</p>
                </div>
              ) : (
                <div className="pp-galeria-grid" style={{ gridTemplateColumns: grupo.items.length === 1 ? 'minmax(auto, 380px)' : grupo.items.length <= 3 ? 'repeat(auto-fill, minmax(200px, 1fr))' : 'repeat(auto-fill, minmax(220px, 1fr))' }}>
                  {grupo.items.map((item, idx) => {
                    if (item.tipo === 'foto') {
                      return (
                        <div key={item.id} className="pp-galeria-item card" onClick={() => setSelectedImg(item)} style={{ cursor: 'zoom-in' }}>
                          <img src={`${BASE_URL}/${item.url}`} alt={item.titulo || item.descripcion || `Foto ${idx}`} className="pp-galeria-img" loading="lazy" onError={e => { e.target.src = '/mock_fig1.png' }} />
                          {(item.titulo || item.descripcion) && (
                            <div className="pp-galeria-desc">
                              {item.titulo ? <strong style={{ display: 'block', color: '#f0e4cc' }}>{item.titulo}</strong> : null}
                              {item.descripcion || '\u00A0'}
                            </div>
                          )}
                        </div>
                      )
                    } else {
                      const ytId = getYtId(item.url)
                      const thumbUrl = ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : '/mock_community.png'
                      return (
                        <div key={item.id} className="pp-video-card card" onClick={() => setSelectedVideo(item)}>
                          <div className="pp-video-thumb">
                            <img src={thumbUrl} alt={item.titulo || `Video ${idx}`} className="pp-video-img" loading="lazy" onError={e => { e.target.src = '/mock_community.png' }}/>
                            <div className="pp-video-overlay"><PlayIcon/></div>
                          </div>
                          <div className="pp-video-info">
                            {item.titulo ? <strong style={{ display: 'block', color: '#f0e4cc', marginBottom: '4px' }}>{item.titulo}</strong> : null}
                            <p className="pp-v-info-desc">{item.descripcion || '\u00A0'}</p>
                          </div>
                        </div>
                      )
                    }
                  })}
                </div>
              )}
            </div>
          ))
        )}
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
                src={`${BASE_URL}/${selectedImg.url}`} 
                alt="Zoom imagen" 
                className="pp-modal-img" 
              />
            {(selectedImg.titulo || selectedImg.descripcion) && (
              <div className="pp-modal-info">
                {selectedImg.titulo && <strong style={{ display: 'block', marginBottom: '4px', fontSize: '1.1rem' }}>{selectedImg.titulo}</strong>}
                <p className="pp-modal-desc">{selectedImg.descripcion}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── VIDEO MODAL (YOUTUBE) ─────────────────────────── */}
      {selectedVideo && (() => {
        const ytId = getYtId(selectedVideo.url);
        return (
          <div className="pp-modal-overlay" onClick={() => setSelectedVideo(null)} style={{ background: 'rgba(5, 1, 1, 0.94)' }}>
            <div className="pp-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '1000px' }}>
              <button className="pp-modal-close" onClick={() => setSelectedVideo(null)} style={{ top: '-45px' }}>✕</button>
              <div style={{ width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: '8px 8px 0 0', overflow: 'hidden', border: '1.5px solid rgba(201, 168, 76, 0.4)', borderBottom: 'none', boxShadow: '0 15px 50px rgba(0,0,0,0.8)' }}>
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={`https://www.youtube.com/embed/${ytId}?autoplay=1`} 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" 
                  allowFullScreen>
                </iframe>
              </div>
              {(selectedVideo.titulo || selectedVideo.descripcion) && (
                <div className="pp-modal-info">
                  {selectedVideo.titulo && <strong style={{ display: 'block', marginBottom: '4px', fontSize: '1.1rem' }}>{selectedVideo.titulo}</strong>}
                  <p className="pp-modal-desc">{selectedVideo.descripcion}</p>
                </div>
              )}
            </div>
          </div>
        )
      })()}


    </div>
  )
}
