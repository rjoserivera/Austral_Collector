import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './HomePage.css'
import PostModal from '../components/PostModal'

/* ─── Mock Data ─────────────────────────────────────────── */
const ULTIMAS = [
  {
    id: 1,
    name: 'Baron Samedi',
    year: 1986,
    image: '/figura1.png',
    description: 'Figura detallada de un esqueleto con atuendo de gala, sombrero de copa y bastón. Representa la elegancia macabra del guardián de los cementerios.',
    likes: 79,
    userLiked: false,
  },
  {
    id: 2,
    name: 'Rorschach',
    year: 1983,
    image: '/figura2.png',
    description: 'El icónico antihéroe con su gabardina marrón y máscara de manchas de tinta cambiantes. Empuña sus revólveres en una pose de acción clásica.',
    likes: 76,
    userLiked: false,
  },
  {
    id: 3,
    name: 'Sonic the Hedgehog',
    year: 1983,
    image: '/figura3.png',
    description: 'Estatua de gran formato del erizo más rápido del mundo, posando junto a un Giant Ring dorado. Imprescindible para fans de SEGA.',
    likes: 78,
    userLiked: false,
  },
  {
    id: 4,
    name: 'Goku Super Saiyan',
    year: 1980,
    image: '/figura4.png',
    description: 'El legendario guerrero en su transformación de cabello dorado, con la ropa rasgada tras una batalla épica. Una pieza de alto detalle en musculatura y expresión.',
    likes: 42,
    userLiked: false,
  },
  {
    id: 5,
    name: 'Naruto Uzumaki',
    year: 1978,
    image: '/figura5.png',
    description: 'Figura dinámica que muestra a Naruto sobre sus invocaciones de sapos (Gamakichi/Gamatatsu) con el gran pergamino a la espalda. Representa su dominio del Senjutsu.',
    likes: 120,
    userLiked: false,
  },
  {
    id: 6,
    name: 'Monkey D. Luffy',
    year: 1991,
    image: '/figura6.png',
    description: 'El futuro Rey de los Piratas con su capa de capitán roja y un aura de energía morada (Haki). Captura la determinación de Luffy en el arco de Wano.',
    likes: 83,
    userLiked: false,
  },
  {
    id: 7,
    name: 'Yukino Yukinoshita',
    year: 1985,
    image: '/figura7.png',
    description: 'Figura estilo "slice of life" que muestra a Yukino sentada en una silla escolar, pensativa, acompañada de su pequeño panda (Pan-san).',
    likes: 54,
    userLiked: false,
  },
]

const EVENTOS = [
  {
    id: 1,
    image: '/mock_event1.png',
    title: '¡Vuelve la Comic Con Chile 2026!',
    date: '3 JULIO de 2026',
  },
  {
    id: 2,
    image: '/mock_event2.png',
    title: 'Lanzamiento: Son Goku "Trail of Battles"',
    date: '14 MARZO de 2026',
  },
  {
    id: 3,
    image: '/mock_event3.png',
    title: 'Expansión del Universo Persona 5 Royal',
    date: '1 SEPTIEMBRE de 2026',
  },
  {
    id: 4,
    image: '/mock_event4.png',
    title: 'Tendencia: El auge de las figuras "Retro-Bootleg"',
    date: 'TENDENCIA ACTUAL',
  },
  {
    id: 5,
    image: '/mock_event5.png',
    title: 'Próxima Reventa: S.H.Figuarts Legendary Super Saiyan',
    date: '20 MARZO de 2026',
  },
]

const VOTADAS = [
  {
    id: 1,
    name: 'Mach 01',
    image: '/mock_fig1.png',
    likes: 79,
    label: '❤ 79 · Mach 01',
  },
  {
    id: 2,
    name: 'Dark Marauder',
    image: '/mock_fig2.png',
    likes: 27,
    label: '❤ 27 · Tacho BOS',
  },
  {
    id: 3,
    name: 'Robo Prime V',
    image: '/mock_fig2.png',
    likes: 19,
    label: '❤ 19 · Machi 1983',
  },
]

const VIDEOS = [
  { id: 1, thumb: '/mock_community.png', title: 'Unboxing colección 2024' },
  { id: 2, thumb: '/mock_community.png', title: 'Restauración de figuras' },
  { id: 3, thumb: '/mock_community.png', title: 'Top 10 Transformers G1' },
  { id: 4, thumb: '/mock_community.png', title: 'Feria BA 2024 — Recorrido' },
]

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
  const [figuras, setFiguras] = useState(ULTIMAS)
  const [selectedPost, setSelectedPost] = useState(null)
  const carouselRef = useRef(null)
  const eventsRef = useRef(null)

  // Duplicamos 3 veces los arreglos para permitir el loop infinito invisible
  const displayFiguras = [...figuras, ...figuras, ...figuras];
  const displayEventos = [...EVENTOS, ...EVENTOS, ...EVENTOS];

  const handleLike = (id) => {
    setFiguras(prev => prev.map(f => {
      if (f.id !== id) return f
      return f.userLiked
        ? { ...f, userLiked: false, likes: f.likes - 1 }
        : { ...f, userLiked: true,  likes: f.likes + 1 }
    }))
    
    // Si el modal está abierto y es la misma publicación, actualizar dinámicamente
    if (selectedPost && selectedPost.id === id) {
      setSelectedPost(prev => ({
        ...prev,
        userLiked: !prev.userLiked,
        likes: prev.userLiked ? prev.likes - 1 : prev.likes + 1
      }))
    }
  }

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 300 // Ancho aprox de una tarjeta
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  // Auto-scroll logic (Perfect Infinite Loop trick)
  useEffect(() => {
    const intervalIds = [];

    // Horizontal carousel
    intervalIds.push(setInterval(() => {
      if (carouselRef.current) {
        const wrap = carouselRef.current;
        const itemWidth = 280 + 16; // ancho tarjeta + gap de la grilla
        const setWidth = figuras.length * itemWidth;

        // Si superamos un set entero (el inicio duplicado), nos teletransportamos al origen 
        // de forma instantánea (invisible) para mantener el loop eterno.
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
      if (eventsRef.current) {
        const wrap = eventsRef.current;
        // Altura de elemento (.hp-evento-thumb es 70px) + gap (12px) = 82px
        const itemHeight = 70 + 12; 
        const setHeight = EVENTOS.length * itemHeight;

        if (wrap.scrollTop >= setHeight) {
          wrap.scrollTo({ top: wrap.scrollTop - setHeight, behavior: 'instant' });
          setTimeout(() => wrap.scrollBy({ top: itemHeight, behavior: 'smooth' }), 20);
        } else {
          wrap.scrollBy({ top: itemHeight, behavior: 'smooth' });
        }
      }
    }, 3500));

    return () => intervalIds.forEach(clearInterval);
  }, [figuras]);

  return (
    <div className="home-page">
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="hp-hero" id="hero">
        <div className="hp-hero-nebula" aria-hidden="true"/>
        <div className="hp-hero-grain"  aria-hidden="true"/>

        <div className="hp-hero-inner section-wrapper">
          <div className="hp-hero-mascot-wrap">
            <div className="hp-mascot-glow" aria-hidden="true"/>
            <img src="/mascota_sin_fondo.png" alt="Mascota Robot Austral Collector" className="hp-mascot"/>
          </div>
          <div className="hp-hero-content">
            <h1 className="hp-hero-title">
              <span className="hp-title-austral">AUSTRAL</span><br/>
              <span className="hp-title-collector">COLLECTOR</span>
            </h1>
            <p className="hp-hero-tagline">Juegos, juguetes y coleccionables de ayer y hoy</p>
            <div className="hp-hero-actions">
              <Link to="/galeria" id="hp-btn-galeria" className="btn-primary">Ver Galería</Link>
              <button onClick={() => alert("Función de registro aún no implementada.")} id="hp-btn-unirse" className="btn-outline">Unirse</button>
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
            <h2 className="hp-section-title">🔥 Últimas Figuras Publicadas</h2>
            <div className="hp-carrusel-wrap">
              <button 
                className="hp-carrusel-btn left" 
                onClick={() => scrollCarousel('left')}
                aria-label="Anterior"
              >❮</button>
              
              <div className="hp-figuras-grid" ref={carouselRef}>
                {displayFiguras.map((fig, idx) => (
                  <FiguraCard 
                    key={`fig-${fig.id}-${idx}`} 
                    fig={fig} 
                    onToggle={handleLike} 
                    onClick={setSelectedPost}
                  />
                ))}
              </div>

              <button 
                className="hp-carrusel-btn right" 
                onClick={() => scrollCarousel('right')}
                aria-label="Siguiente"
              >❯</button>
            </div>
            
            <div className="hp-section-footer">
              <Link to="/galeria" id="hp-btn-explorar" className="btn-primary">Explorar Galería</Link>
            </div>
          </section>

          {/* Miembro Destacado del Mes */}
          <section className="hp-section" id="miembro">
            <h2 className="hp-section-title">🏆 Miembro Destacado del Mes</h2>
            <div className="hp-miembro-wrap card">
              <div className="hp-miembro-left">
                <div className="hp-miembro-avatar-frame">
                  <div className="hp-miembro-ring"/>
                  <img
                    src="/mock_avatar.png"
                    alt="Rodrigo Araya"
                    className="hp-miembro-avatar"
                  />
                </div>
                <div className="hp-miembro-likes">❤️ 84</div>
                <span className="hp-miembro-credit">Pie Faschionan poc Rodrigo Aava</span>
              </div>
              <div className="hp-miembro-right">
                <h3 className="hp-miembro-name">Rodrigo Araya</h3>
                <div className="hp-miembro-badges-row">
                  <span className="hp-miembro-badge-tag">✔ Miembro Destacado</span>
                  <span className="hp-miembro-stars">⭐⭐⭐</span>
                </div>
                <p className="hp-miembro-bio">
                  Por su incréible colección y valioyos aporte a Austral Collector. Rodrigo es el fanfaction
                  pectanpañio del stem, brasa.actomét.mos.!
                </p>
                <div className="hp-miembro-stats">
                  <span className="hp-miembro-stat">❤️ 84</span>
                  <span className="hp-miembro-stat">📎 2</span>
                </div>
                <div className="hp-miembro-icons">
                  <span title="Coleccionista">🏅</span>
                  <span title="Ganador">🏆</span>
                  <span title="Verificado">✔</span>
                  <span title="Estrella">⭐</span>
                </div>
              </div>
            </div>
          </section>

          {/* Figuras del Mes Más Votadas */}
          <section className="hp-section">
            <h2 className="hp-section-title">Las Figuras del Mes Más Votadas</h2>
            <div className="hp-votadas-grid">
              {VOTADAS.map(v => (
                <article key={v.id} className="hp-votada-card card" id={`hp-votada-${v.id}`}>
                  <div className="hp-votada-img-wrap">
                    <img src={v.image} alt={v.name} className="hp-votada-img" loading="lazy"/>
                    <div className="hp-votada-overlay">
                      <span className="hp-votada-heart">❤</span>
                      <span className="hp-votada-name-overlay">{v.name}</span>
                    </div>
                  </div>
                  <div className="hp-votada-footer">
                    <span className="hp-votada-label">{v.label}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* CTA inferior */}
          <section className="hp-cta-simple" id="comunidad">
            <p className="hp-cta-text">
              <strong>Austral Collector</strong> es una comunidad chilena de amantes del
              coleccionismo que reúne a fanáticos de los juegos, juguetes y figuras de todas
              las épocas. ¡Únete y comparte tu colección!
            </p>
            <button onClick={() => alert("Función de registro aún no implementada.")} id="hp-btn-cta-final" className="btn-primary">Unirse</button>
          </section>
        </div>

        {/* RIGHT sidebar */}
        <aside className="hp-sidebar-col">

          {/* Noticias & Eventos */}
          <div className="hp-sidebar-panel card" id="noticias">
            <h3 className="hp-sidebar-title">🔔 Noticias &amp; Próximos Eventos</h3>
            <div className="gold-divider"/>
            <ul className="hp-evento-list" ref={eventsRef}>
              {displayEventos.map((ev, idx) => (
                <li key={`ev-${ev.id}-${idx}`} className="hp-evento-item">
                  <img src={ev.image} alt={ev.title} className="hp-evento-thumb" loading="lazy"/>
                  <div>
                    <p className="hp-evento-title">{ev.title}</p>
                    <span className="hp-evento-date">{ev.date}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Videos */}
          <div className="hp-sidebar-panel card" id="videos">
            <h3 className="hp-sidebar-title">▶ Videos con destacados de nuestras galerías</h3>
            <div className="gold-divider"/>
            <div className="hp-videos-sidebar-grid">
              {VIDEOS.map(v => (
                <div key={v.id} className="hp-video-side-thumb" id={`hp-vid-${v.id}`}>
                  <img src={v.thumb} alt={v.title} loading="lazy"/>
                  <PlayIcon/>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <PostModal 
        post={selectedPost} 
        isOpen={!!selectedPost} 
        onClose={() => setSelectedPost(null)} 
        onLike={handleLike} 
      />
    </div>
  )
}
