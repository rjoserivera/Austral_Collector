import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './HomePage.css'
import PostModal from '../components/PostModal'
import CreatePostModal from '../components/CreatePostModal'
import { API_URL, BASE_URL } from '../config.js'

/* ─── Sub-components ────────────────────────────────────── */
function FiguraCard({ fig, onToggle, onClick }) {
  return (
    <article className="hp-figura-card card" id={`hp-figura-${fig.id}`} onClick={() => onClick(fig)}>
      <div className="hp-figura-img-wrap">
        <img src={fig.image} alt={fig.name} className="hp-figura-img" loading="lazy" />
        <div className="hp-figura-year">{fig.year}</div>
      </div>
      <div className="hp-figura-body">
        <h3 className="hp-figura-name">{fig.name}</h3>
        <span className="hp-figura-sub">Año: {fig.year}</span>
        <p className="hp-figura-desc">{fig.description}</p>
        <button
          className={`hp-heart-btn ${fig.userLiked ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggle(fig.id);
          }}
          aria-label="Like"
        >
          {fig.userLiked ? '❤' : '♡'} {fig.likes}
        </button>
      </div>
    </article>
  )
}

function PlayIcon() {
  return (
    <svg className="hp-play-icon" viewBox="0 0 50 50" fill="none">
      <circle cx="25" cy="25" r="23" fill="rgba(0,0,0,0.65)" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5"/>
      <polygon points="20,14 38,25 20,36" fill="white"/>
    </svg>
  )
}

/* ─── Page ──────────────────────────────────────────────── */
export default function HomePage() {
  const [data, setData] = useState({
    ultimas: [], votadas: [], eventos: [], videos: [], destacado: null, ultimos_cosplays: []
  })
  const [loading, setLoading] = useState(true)
  const [selectedPost, setSelectedPost] = useState(null)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [cumpleIdx, setCumpleIdx] = useState(0)
  const navigate = useNavigate()
  
  // Upload Modal State
  const [showUpload, setShowUpload] = useState(false)
  const authUserStr = localStorage.getItem('austral_auth_user')
  let currentUser = null
  try { if (authUserStr) currentUser = JSON.parse(authUserStr) } catch(e) { currentUser = null }

  const carouselRef = useRef(null)
  const eventsRef = useRef(null)
  const cosplayCarouselRef = useRef(null)
  const cosplayAutoRef = useRef(null)
  const cumpleAutoRef = useRef(null)

  const loadData = () => {
    const viewerParam = currentUser ? `?viewer_username=${currentUser.username}` : '';
    fetch(`${API_URL}/public/home_data.php${viewerParam}`)
      .then(r => r.json())
      .then(d => {
        if(d.success) setData(d.data)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadData() }, [])

  // Auto-rotar el carrusel de cumpleañeros cada 4 segundos si hay más de 1
  useEffect(() => {
    if (data.cumpleaneros && data.cumpleaneros.length > 1) {
      cumpleAutoRef.current = setInterval(() => {
        setCumpleIdx(p => (p + 1) % data.cumpleaneros.length)
      }, 4000)
    }
    return () => {
      if (cumpleAutoRef.current) clearInterval(cumpleAutoRef.current)
    }
  }, [data.cumpleaneros])

  // Solo duplicamos si hay 3+ publicaciones para que el loop infinito tenga sentido
  const displayFiguras = data.ultimas.length >= 3
    ? [...data.ultimas, ...data.ultimas, ...data.ultimas]
    : data.ultimas;
  const displayEventos = data.eventos.length >= 3
    ? [...data.eventos, ...data.eventos, ...data.eventos]
    : data.eventos;

  const handleLike = (id) => {
    if (!currentUser) {
      alert('Debes iniciar sesión para dar me gusta.')
      return
    }

    fetch(`${API_URL}/auth/toggle_like.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: currentUser.username, post_id: id })
    })
    .then(r => r.json())
    .then(d => {
      if (d.success) {
        setData(prev => {
          const newUltimas = prev.ultimas.map(f => f.id === id ? { ...f, userLiked: d.action === 'liked', total_likes: d.total_likes } : f)
          const newVotadas = prev.votadas.map(v => v.id === id ? { ...v, userLiked: d.action === 'liked', total_likes: d.total_likes } : v)
          // Si el destacado también tiene cards interactivas, podríamos iterarlo, pero en HomePage no parece tenerlas que disparen handleLike
          return { ...prev, ultimas: newUltimas, votadas: newVotadas }
        })
        
        if (selectedPost && selectedPost.id === id) {
          setSelectedPost(prev => ({ ...prev, userLiked: d.action === 'liked', total_likes: d.total_likes }))
        }
      } else {
        alert(d.error || 'Error al procesar el like.')
      }
    })
    .catch(e => console.error("Error toggling like:", e))
  }

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 300
      carouselRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' })
    }
  }

  // Auto-scroll logic (Perfect Infinite Loop trick)
  useEffect(() => {
    if (displayFiguras.length === 0) return;
    const intervalIds = [];

    // Horizontal carousel
    intervalIds.push(setInterval(() => {
      if (carouselRef.current && data.ultimas.length > 0) {
        const wrap = carouselRef.current;
        const itemWidth = 280 + 16;
        const setWidth = data.ultimas.length * itemWidth;

        if (wrap.scrollLeft >= setWidth) {
          wrap.scrollTo({ left: wrap.scrollLeft - setWidth, behavior: 'instant' });
          setTimeout(() => wrap.scrollBy({ left: itemWidth, behavior: 'smooth' }), 20);
        } else {
          wrap.scrollBy({ left: itemWidth, behavior: 'smooth' });
        }
      }
    }, 4500));

    // Vertical events
    intervalIds.push(setInterval(() => {
      if (eventsRef.current && data.eventos.length > 0) {
        const wrap = eventsRef.current;
        const itemHeight = 70 + 12; 
        const setHeight = data.eventos.length * itemHeight;

        if (wrap.scrollTop >= setHeight) {
          wrap.scrollTo({ top: wrap.scrollTop - setHeight, behavior: 'instant' });
          setTimeout(() => wrap.scrollBy({ top: itemHeight, behavior: 'smooth' }), 20);
        } else {
          wrap.scrollBy({ top: itemHeight, behavior: 'smooth' });
        }
      }
    }, 3500));

    return () => intervalIds.forEach(clearInterval);
  }, [data.ultimas, data.eventos]);

  // Auto-scroll cosplay carousel (slides of 2 columns × 2 rows = 4 items per slide)
  useEffect(() => {
    if (!data.ultimos_cosplays || data.ultimos_cosplays.length === 0) return;
    const ITEM_W = 260 + 16; // card width + gap
    const SLIDE_W = ITEM_W * 2;  // 2 columns per slide
    cosplayAutoRef.current = setInterval(() => {
      const el = cosplayCarouselRef.current;
      if (!el) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 4) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: SLIDE_W, behavior: 'smooth' });
      }
    }, 4000);
    return () => clearInterval(cosplayAutoRef.current);
  }, [data.ultimos_cosplays]);

  const scrollCosplay = (dir) => {
    const el = cosplayCarouselRef.current;
    if (!el) return;
    const ITEM_W = 260 + 16;
    const SLIDE_W = ITEM_W * 2;
    el.scrollBy({ left: dir === 'left' ? -SLIDE_W : SLIDE_W, behavior: 'smooth' });
  };

  return (
    <div className="home-page">
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="hp-hero" id="hero">
        <div className="hp-hero-nebula" aria-hidden="true"/>
        <div className="hp-hero-grain"  aria-hidden="true"/>

        <div className="hp-hero-inner section-wrapper">
          <div className="hp-hero-mascot-wrap">
            <div className="hp-mascot-glow" aria-hidden="true"/>
            <img src="/robot_completo_sin_fondo.png" alt="Mascota Robot Austral Collector" className="hp-mascot"/>
          </div>
          <div className="hp-hero-content">
            <h1 className="hp-hero-title">
              <span className="hp-title-austral">AUSTRAL</span><br/>
              <span className="hp-title-collector">COLLECTOR</span>
            </h1>
            <p className="hp-hero-tagline">Juegos, juguetes y coleccionables de ayer y hoy</p>
            <div className="hp-hero-actions" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '16px' }}>
              <Link to="/galeria" id="hp-btn-galeria" className="btn-primary" style={{ fontSize: '1.1rem', padding: '16px 42px', borderRadius: '10px', letterSpacing: '0.1em', boxShadow: '0 8px 32px rgba(139, 32, 32, 0.5)' }}>Ver Galería</Link>
              <Link to="/login?mode=register" id="hp-btn-unirse" className="btn-primary" style={{ fontSize: '1.1rem', padding: '16px 42px', borderRadius: '10px', letterSpacing: '0.1em', background: 'var(--color-steel)', boxShadow: '0 8px 32px rgba(45, 110, 126, 0.5)' }}>Unirse</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN BODY ────────────────────────────────────── */}
      <div className="hp-body section-wrapper" id="galeria">

        {/* LEFT column */}
        <div className="hp-main-col">

          {/* Últimas Figuras Publicadas */}
          <section className="hp-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="hp-section-title">🔥 Últimas Figuras</h2>

            </div>
            
            {!loading && data.ultimas.length === 0 ? (
              <p style={{ color: '#aaa', padding: '20px' }}>No hay publicaciones aún. ¡Sé el primero en subir algo!</p>
            ) : (
              <div className="hp-carrusel-wrap">
                <button className="hp-carrusel-btn left" onClick={() => scrollCarousel('left')}>❮</button>
                <div className="hp-figuras-grid" ref={carouselRef}>
                  {displayFiguras.map((fig, idx) => (
                    <article className="hp-figura-card card" key={`fig-${fig.id}-${idx}`} onClick={() => setSelectedPost(fig)}>
                      <div className="hp-figura-img-wrap">
                        <img src={fig.imagen_url ? `${BASE_URL}/${fig.imagen_url}` : '/figura1.png'} alt={fig.nombre} className="hp-figura-img" loading="lazy" />
                        {fig.anio && <div className="hp-figura-year">{fig.anio}</div>}
                        <div className="hp-figura-year" style={{top: '8px', right: '8px', left: 'auto', background: 'rgba(45,110,126,.9)'}}>{fig.tipo}</div>
                      </div>
                      <div className="hp-figura-body">
                        <h3 className="hp-figura-name">{fig.nombre}</h3>
                        <span className="hp-figura-sub">De: {fig.autor}</span>
                        <p className="hp-figura-desc">{fig.descripcion || 'Sin descripción.'}</p>
                        <button className="hp-heart-btn" onClick={(e) => { e.stopPropagation(); handleLike(fig.id); }}>
                          {fig.userLiked ? '❤' : '♡'} {fig.total_likes || 0}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
                <button className="hp-carrusel-btn right" onClick={() => scrollCarousel('right')}>❯</button>
              </div>
            )}
            
            <div className="hp-cta-simple">
              <p className="hp-cta-text">
                <strong>Austral Collector</strong> es una comunidad chilena de amantes del coleccionismo que reúne a fanáticos de los juegos, juguetes y figuras de todas las épocas. ¡Únete y comparte tu colección!
              </p>
              <Link to="/login?mode=register" className="btn-primary" style={{ background: 'var(--color-sand)', color: 'var(--color-steel-dark)', fontWeight: '700' }}>UNIRSE</Link>
            </div>
          </section>

          {/* Miembro Destacado del Mes / Cumpleañeros */}
          {(() => {
            const hasCumpleaneros = data.cumpleaneros && data.cumpleaneros.length > 0;
            const targetUserObj = hasCumpleaneros ? data.cumpleaneros[cumpleIdx] : data.destacado;

            const nextCumple = () => {
              setCumpleIdx(p => (p + 1) % data.cumpleaneros.length);
              if (cumpleAutoRef.current) clearInterval(cumpleAutoRef.current);
              cumpleAutoRef.current = setInterval(() => setCumpleIdx(p => (p + 1) % data.cumpleaneros.length), 4000);
            };
            const prevCumple = () => {
              setCumpleIdx(p => (p - 1 + data.cumpleaneros.length) % data.cumpleaneros.length);
              if (cumpleAutoRef.current) clearInterval(cumpleAutoRef.current);
              cumpleAutoRef.current = setInterval(() => setCumpleIdx(p => (p + 1) % data.cumpleaneros.length), 4000);
            };

            return (
              <section className="hp-section" id="miembro">
                <h2 className="hp-section-title">
                  {hasCumpleaneros ? '🎉 ¡Coleccionistas de Cumpleaños!' : '🏆 Miembro Destacado del Mes'}
                </h2>
                {targetUserObj && targetUserObj.user ? (
                  <div className="hp-miembro-wrap card" style={{ position: 'relative', overflow: 'hidden' }}>
                    {hasCumpleaneros && (
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, textAlign: 'center', background: 'linear-gradient(90deg, #ff416c, #ff4b2b)', color: '#fff', padding: '6px', fontWeight: 'bold', fontSize: '0.9rem', zIndex: 10, letterSpacing: '1px' }}>
                        🎊 {targetUserObj.user.estado_cumple === 'hoy' ? '¡ESTÁ DE CUMPLEAÑOS HOY!' : '¡MAÑANA ES SU CUMPLEAÑOS!'} 🎊
                      </div>
                    )}
                    <div className="hp-miembro-left" style={{ marginTop: hasCumpleaneros ? '30px' : '0' }}>
                      <div className="hp-miembro-avatar-frame">
                        <div className="hp-miembro-ring"/>
                        <img
                          src={targetUserObj.user.avatar_url ? `${BASE_URL}/${targetUserObj.user.avatar_url}` : '/mock_avatar.png'}
                          alt={targetUserObj.user.username}
                          className="hp-miembro-avatar"
                        />
                      </div>
                      <div className="hp-miembro-likes">❤️ {targetUserObj.stats.likes}</div>
                      <span className="hp-miembro-credit">Publicaciones: {targetUserObj.stats.posts}</span>
                    </div>
                    <div className="hp-miembro-right" style={{ marginTop: hasCumpleaneros ? '30px' : '0' }}>
                      <h3 className="hp-miembro-name">{targetUserObj.user.username}</h3>
                      <div className="hp-miembro-badges-row">
                        {hasCumpleaneros ? (
                          <span className="hp-miembro-badge-tag" style={{background:'#ffd700', color:'#000'}}>🎂 Cumpleañero/a</span>
                        ) : (
                          <span className="hp-miembro-badge-tag">✔ Miembro Destacado</span>
                        )}
                        {targetUserObj.user.role === 'admin' && <span className="hp-miembro-badge-tag" style={{background:'var(--primary-color)', color:'#000'}}>Administrador</span>}
                      </div>
                      <p className="hp-miembro-bio">
                        {targetUserObj.user.biografia || "Por su increíble colección y valiosos aportes a Austral Collector. ¡Te deseamos lo mejor en este gran día!"}
                      </p>
                      <div className="hp-miembro-stats">
                        {hasCumpleaneros ? (
                          <span className="hp-miembro-stat">
                            🎂 { (() => {
                                if (targetUserObj.user.fecha_nacimiento) {
                                  let p = targetUserObj.user.fecha_nacimiento.split('-');
                                  if(p.length === 3) {
                                    const m = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
                                    return `${parseInt(p[2])} de ${m[parseInt(p[1])-1]}`;
                                  }
                                }
                                return 'Cumpleaños';
                            })() }
                          </span>
                        ) : (
                          <span className="hp-miembro-stat">❤️ {targetUserObj.stats.likes} Likes de la comunidad</span>
                        )}
                      </div>
                      <div className="hp-miembro-icons">
                        <span title="Coleccionista">🏅</span>
                        <span title="Festivo">🎉</span>
                        <span title="Verificado">✔</span>
                      </div>
                    </div>

                    {hasCumpleaneros && data.cumpleaneros.length > 1 && (
                      <div style={{ position: 'absolute', bottom: '12px', right: '0', left: '0', display: 'flex', justifyContent: 'center', gap: '6px', zIndex: 10 }}>
                        {data.cumpleaneros.map((_, i) => (
                          <span key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: i === cumpleIdx ? '#ffd700' : 'rgba(255,255,255,0.35)', display: 'inline-block', transition: 'background 0.3s' }} />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="card" style={{padding:'30px', textAlign:'center', color:'#aaa'}}>No hay un miembro destacado asignado actualmente.</div>
                )}
              </section>
            );
          })()}

          {/* Figuras del Mes Más Votadas */}
          <section className="hp-section">
            <h2 className="hp-section-title">Las Figuras de la Comunidad Más Votadas</h2>
            {data.votadas.length > 0 ? (
              <div className="hp-votadas-grid">
                {data.votadas.map(v => (
                  <article key={v.id} className="hp-votada-card card" onClick={() => setSelectedPost(v)} style={{cursor: 'pointer'}}>
                    <div className="hp-votada-img-wrap">
                      <img src={v.imagen_url ? `${BASE_URL}/${v.imagen_url}` : '/mock_fig1.png'} alt={v.nombre} className="hp-votada-img" loading="lazy"/>
                      <div className="hp-votada-overlay">
                        <span className="hp-votada-heart">❤</span>
                        <span className="hp-votada-name-overlay">{v.nombre}</span>
                      </div>
                    </div>
                    <div className="hp-votada-footer">
                      <span className="hp-votada-label">❤ {v.total_likes} · {v.autor}</span>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p style={{ color: '#aaa' }}>En espera de votaciones...</p>
            )}
          </section>

          {/* CTA inferior */}
          {!currentUser && (
            <section className="hp-cta-simple" id="comunidad">
              <p className="hp-cta-text">
                <strong>Austral Collector</strong> es una comunidad chilena de amantes del
                coleccionismo que reúne a fanáticos de los juegos, juguetes y figuras de todas
                las épocas. ¡Únete y comparte tu colección!
              </p>
              <Link to="/login?mode=register" id="hp-btn-cta-final" className="btn-primary" style={{ textAlign: "center", textDecoration: "none", display: "inline-block" }}>Unirse</Link>
            </section>
          )}
        </div>

        {/* RIGHT sidebar */}
        <aside className="hp-sidebar-col" style={{ paddingTop: '24px' }}>

          {/* Botón Subir Publicación — solo logueados */}
          {currentUser && (
            <button
              className="btn-primary"
              onClick={() => setShowUpload(true)}
              style={{ width: '100%', marginBottom: '20px', padding: '10px 16px', fontSize: '0.85rem', borderRadius: '8px', justifyContent: 'center', letterSpacing: '0.05em', height: '44px' }}
            >
              ➕ Subir Publicación
            </button>
          )}

          {/* Noticias & Eventos */}
          <div className="hp-sidebar-panel card" id="noticias">
            <h3 className="hp-sidebar-title">🔔 Noticias &amp; Próximos Eventos</h3>
            <div className="gold-divider"/>
            <ul className="hp-evento-list" ref={eventsRef}>
              {displayEventos.length > 0 ? displayEventos.map((ev, idx) => (
                <li key={`ev-${ev.id}-${idx}`} className="hp-evento-item">
                  <img src={ev.imagen_url ? `${BASE_URL}/${ev.imagen_url}` : '/mock_event1.png'} alt={ev.titulo} className="hp-evento-thumb" loading="lazy"/>
                  <div className="hp-evento-info">
                    <p className="hp-evento-title">{ev.titulo}</p>
                    <span className="hp-evento-date">{ev.fecha_display}</span>
                  </div>
                </li>
              )) : (
                <p style={{color:'#aaa', textAlign:'center', marginTop:'15px', fontSize:'0.9rem'}}>No hay eventos próximos.</p>
              )}
            </ul>
          </div>

          {/* Videos */}
          <div className="hp-sidebar-panel card" id="videos">
            <h3 className="hp-sidebar-title">▶ Videos de interés</h3>
            <div className="gold-divider"/>
            <div className="hp-videos-sidebar-grid">
              {data.videos.length > 0 ? data.videos.slice(0, 4).map(v => {
                // Parse Youtube ID to get thumbnail
                let ytid = v.link_yt;
                const match = v.link_yt.match(/[?&]v=([^&]+)/);
                if (match) ytid = match[1];
                else { const sl = v.link_yt.split('/'); ytid = sl[sl.length-1]; }
                
                return (
                  <div key={v.id} className="hp-video-side-thumb clickable" id={`hp-vid-${v.id}`} onClick={() => setSelectedVideo(ytid)} style={{ cursor: 'pointer' }}>
                    <img src={`https://img.youtube.com/vi/${ytid}/0.jpg`} alt={v.titulo} loading="lazy" onError={(e) => { e.target.src='/mock_community.png' }}/>
                    <PlayIcon/>
                  </div>
                )
              }) : (
                <p style={{color:'#aaa', textAlign:'center', gridColumn:'span 2', fontSize:'0.9rem'}}>No hay videos.</p>
              )}
            </div>
          </div>

          {/* 🎭 Últimos Cosplays */}
          <div className="hp-sidebar-panel card" id="cosplays">
            <h3 className="hp-sidebar-title">🎭 Últimos Cosplays</h3>
            <div className="gold-divider"/>
            {data.ultimos_cosplays && data.ultimos_cosplays.length > 0 ? (
              <div className="hp-cosplay-sidebar-grid">
                {data.ultimos_cosplays.slice(0, 4).map((cos, idx) => (
                  <article
                    key={`sb-cos-${cos.id}-${idx}`}
                    className="hp-cosplay-sb-card"
                    id={`hp-sb-cosplay-${cos.id}`}
                    onClick={() => setSelectedPost({ ...cos, nombre: cos.titulo, tipo: 'cosplay' })}
                  >
                    <img
                      src={cos.imagen_url ? `${BASE_URL}/${cos.imagen_url}` : '/mock_community.png'}
                      alt={cos.titulo}
                      className="hp-cosplay-sb-img"
                      loading="lazy"
                    />
                    <div className="hp-cosplay-sb-overlay">
                      <span className="hp-cosplay-sb-name">{cos.titulo}</span>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p style={{color:'#aaa', textAlign:'center', marginTop:'15px', fontSize:'0.85rem'}}>Aún no hay cosplays publicados.</p>
            )}
            <div style={{textAlign:'center', marginTop:'14px'}}>
              <a href="/galeria" style={{fontSize:'0.78rem', color:'var(--color-gold)', textDecoration:'none', letterSpacing:'.05em'}}>Ver todos los cosplays →</a>
            </div>
          </div>

        </aside>
      </div>


      <PostModal 
        post={selectedPost} 
        isOpen={!!selectedPost} 
        onClose={() => setSelectedPost(null)} 
        onLike={handleLike}
        isHomeMode={true}
        onTagClick={(tag) => {
          setSelectedPost(null);
          navigate(`/galeria?tag=${tag}`);
        }}
      />

      <CreatePostModal 
        isOpen={showUpload} 
        onClose={() => setShowUpload(false)} 
        onSuccess={loadData}
        currentUserId={currentUser?.id}
      />

      {/* MODAL DE VIDEO YOUTUBE INLINE */}
      {selectedVideo && (
        <div className="pm-full-overlay" onClick={() => setSelectedVideo(null)} style={{ zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.65)' }}>
          <button className="pm-close-full-btn" onClick={() => setSelectedVideo(null)} style={{ top: '20px', right: '20px' }}>✕ Cerrar Video</button>
          <div style={{ width: '90%', maxWidth: '1000px', aspectRatio: '16/9', background: '#000', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.7)' }} onClick={e => e.stopPropagation()}>
            <iframe 
              width="100%" 
              height="100%" 
              src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`} 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" 
              allowFullScreen>
            </iframe>
          </div>
        </div>
      )}
    </div>
  )
}
