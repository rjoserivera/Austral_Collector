import { useState } from 'react'
import './GaleriaPage.css'
import PostModal from '../components/PostModal'

/* ─── Mock Data ─────────────────────────────────────────── */
const GALERIA = [
  { id: 101, name: 'Titan Mach 01', year: 1986, cat: 'Vintage', image: '/mock_fig1.png', likes: 120, userLiked: false, saves: 45, description: "Figura original con textura matizada y empaque casi intacto." },
  { id: 102, name: 'Darth Vader — Kenner', year: 1978, cat: 'Star Wars', image: '/mock_fig2.png', likes: 350, userLiked: false, saves: 110, description: "La clásica figura de 1978 con el sable de luz retráctil. Condición Mint." },
  { id: 103, name: 'RX-78-2 First Grade', year: 1980, cat: 'Gundam Wing', image: '/mock_fig1.png', likes: 210, userLiked: false, saves: 80, description: "Ensamblaje original sin pintura añadida. Las articulaciones están perfectas." },
  { id: 104, name: 'Sailor Moon Proplica', year: 1995, cat: 'Sailor Moon', image: '/mock_fig3.png', likes: 185, userLiked: false, saves: 65, description: "Edición especial con la caja de lujo. Los cromados se mantienen impecables." },
  { id: 105, name: 'Optimus Prime G1', year: 1984, cat: 'Vintage', image: '/mock_fig2.png', likes: 420, userLiked: false, saves: 130, description: "Trailer completo con Roller y los puños enteros. Un tesoro de los 80s." },
  { id: 106, name: 'Boba Fett Action', year: 1980, cat: 'Star Wars', image: '/mock_fig1.png', likes: 290, userLiked: false, saves: 95, description: "Con el clásico mecanismo del proyectil deshabilitado (versión segura). Pieza histórica." },
  { id: 107, name: 'Zaku II MS-06', year: 1981, cat: 'Gundam Wing', image: '/mock_banner.png', likes: 175, userLiked: false, saves: 50, description: "Incluye la metralleta y el hacha térmica. Plástico de la primera corrida original." },
  { id: 108, name: 'Tuxedo Mask', year: 1996, cat: 'Sailor Moon', image: '/mock_fig2.png', likes: 140, userLiked: false, saves: 40, description: "Figura articulada con capa de tela y el icónico sombrero de copa." },
  { id: 109, name: 'He-Man Masters', year: 1982, cat: 'Vintage', image: '/mock_fig3.png', likes: 310, userLiked: false, saves: 85, description: "Músculos impecables, incluye espada de poder y escudo original." },
]

const TABS = ['Todos', 'Star Wars', 'Gundam Wing', 'Sailor Moon', 'Vintage']

export default function GaleriaPage() {
  const [activeTab, setActiveTab] = useState('Todos')
  const [search, setSearch] = useState('')
  const [figuras, setFiguras] = useState(GALERIA)
  const [selectedPost, setSelectedPost] = useState(null)

  const handleLike = (id) => {
    setFiguras(prev => prev.map(f => {
      if (f.id !== id) return f
      return f.userLiked
        ? { ...f, userLiked: false, likes: f.likes - 1 }
        : { ...f, userLiked: true,  likes: f.likes + 1 }
    }))
    
    // Sincronizar modal abierto si es el mismo post
    if (selectedPost && selectedPost.id === id) {
      setSelectedPost(prev => ({
        ...prev,
        userLiked: !prev.userLiked,
        likes: prev.userLiked ? prev.likes - 1 : prev.likes + 1
      }))
    }
  }

  const filtered = figuras.filter(fig => {
    const matchTab = activeTab === 'Todos' || fig.cat === activeTab
    const matchSearch = fig.name.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  return (
    <div className="galeria-page">
      {/* ── HERO INTERNO ──────────────────────────────────────── */}
      <section className="galeria-hero">
        <div className="galeria-hero-bg" aria-hidden="true"/>
        <div className="section-wrapper galeria-hero-inner">
          <div className="galeria-hero-text">
            <h1 className="galeria-title">Galería de Figuras</h1>
            <p className="galeria-subtitle">
              Explora miles de archivos históricos, subidos por coleccionistas de élite.
            </p>
          </div>
          <div className="galeria-mascot-wrap">
            <img src="/mascota_sin_fondo.png" alt="Mascota" className="galeria-mascot"/>
          </div>
        </div>
      </section>

      <div className="section-wrapper galeria-main">
        {/* ── FILTROS Y BUSCADOR ─────────────────────────────────── */}
        <div className="galeria-controls">
          <div className="galeria-tabs">
            {TABS.map(tab => (
              <button
                key={tab}
                className={`galeria-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="galeria-search">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* ── GRILLA 3 COLUMNAS ──────────────────────────────────── */}
        {filtered.length > 0 ? (
          <div className="galeria-grid">
            {filtered.map(fig => (
              <article key={fig.id} className="galeria-card card" onClick={() => setSelectedPost(fig)} style={{ cursor: 'pointer' }}>
                <div className="galeria-img-wrap">
                  <img src={fig.image} alt={fig.name} className="galeria-img" loading="lazy"/>
                  <div className="galeria-cat-badge">{fig.cat}</div>
                </div>
                <div className="galeria-card-body">
                  <div>
                    <h3 className="galeria-name">{fig.name}</h3>
                    <span className="galeria-year">Año: {fig.year}</span>
                  </div>
                  <div className="galeria-counters">
                    <div className="galeria-counter red-heart">
                      <span className="counter-icon">❤</span>
                      <span className="counter-num">{fig.likes}</span>
                    </div>
                    <div className="galeria-counter gray-star">
                      <span className="counter-icon">⭐</span>
                      <span className="counter-num">{fig.saves}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="galeria-empty">
            <p>No se encontraron figuras para "{search}" en esta categoría.</p>
          </div>
        )}
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
