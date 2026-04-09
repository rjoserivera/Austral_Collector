import { useState, useEffect, useRef } from 'react'
import './GaleriaPage.css'
import PostModal from '../components/PostModal'
import { API_URL, BASE_URL } from '../config.js'

export default function GaleriaPage() {
  const [search, setSearch]             = useState('')
  const [activeTab, setActiveTab]       = useState('figura')
  const [filterCat, setFilterCat]       = useState('Todas')
  const [figuras, setFiguras]           = useState([])
  const [selectedPost, setSelectedPost] = useState(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef(null)

  useEffect(() => {
    const viewerParam = currentUser ? `?viewer_username=${currentUser.username}` : '';
    fetch(`${API_URL}/public/galeria_data.php${viewerParam}`)
      .then(r => r.json())
      .then(d => { 
        if (d.success) setFiguras(d.posts || []);
        
        // Cargar filtro desde URL si existe
        const params = new URLSearchParams(window.location.search);
        const tag = params.get('tag');
        if (tag) {
          setFilterCat(tag);
        }
      })
      .catch(e => console.error('Error fetching galeria:', e))
  }, [])

  // Cierra el dropdown al hacer clic fuera
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target))
        setShowSuggestions(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])
  const authUserStr = localStorage.getItem('austral_auth_user')
  let currentUser = null
  try { if (authUserStr) currentUser = JSON.parse(authUserStr) } catch(e) { currentUser = null }

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
        setFiguras(prev => prev.map(f => {
          if (f.id !== id) return f
          return { ...f, userLiked: d.action === 'liked', total_likes: d.total_likes }
        }))
        if (selectedPost && selectedPost.id === id) {
          setSelectedPost(prev => ({
            ...prev,
            userLiked: d.action === 'liked',
            total_likes: d.total_likes
          }))
        }
      } else {
        alert(d.error || 'Error al procesar el like.')
      }
    })
    .catch(e => console.error("Error toggling like:", e))
  }

  const currentTabFiguras = figuras.filter(f => (f.tipo || 'figura') === activeTab)

  // Frecuencia de categorías en el tab activo (usando la propiedad 'hashtags' del servidor)
  const catFreq = currentTabFiguras
    .flatMap(f => f.hashtags || [])
    .reduce((acc, cat) => { acc[cat] = (acc[cat] || 0) + 1; return acc }, {})

  // Ordenadas por uso
  const allCats = Object.entries(catFreq)
    .sort((a, b) => b[1] - a[1])
    .map(([cat]) => cat)

  // Si hay texto → muestra solo hashtags que coincidan; si no → los más usados
  const visibleCats = search.trim()
    ? allCats.filter(cat => cat.toLowerCase().includes(search.toLowerCase()))
    : allCats

  // Sugerencias de categorías ( hashtags) en lugar de nombres
  const categorySuggestions = search.trim().length >= 1
    ? allCats.filter(cat => cat.toLowerCase().includes(search.toLowerCase())).slice(0, 8)
    : []

  const filtered = currentTabFiguras.filter(fig => {
    const matchName = fig.nombre.toLowerCase().includes(search.toLowerCase())
    const matchCat  = filterCat === 'Todas' || (fig.hashtags && fig.hashtags.includes(filterCat))
    return matchName && matchCat
  })

  const applyCategorySuggestion = (cat) => {
    // Si la categoría ya está seleccionada, al volver a darle se desmarca (vuelve a Todas)
    if (filterCat === cat) {
      setFilterCat('Todas')
    } else {
      setFilterCat(cat)
    }
    setSearch('')
    setShowSuggestions(false)
  }

  return (
    <div className="galeria-page">

      {/* ── HERO ─────────────────────────────────────────────── */}
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
            <img src="/robot_completo_sin_fondo.png" alt="Mascota" className="galeria-mascot"/>
          </div>
        </div>
      </section>

      <div className="section-wrapper galeria-main">

        {/* ── TABS PRINCIPALES ─────────────────────────────── */}
        <div className="galeria-primary-tabs">
          <button
            className={`galeria-primary-tab-btn ${activeTab === 'figura' ? 'active' : ''}`}
            onClick={() => { setActiveTab('figura'); setFilterCat('Todas'); setSearch('') }}
          >Figuras</button>
          <button
            className={`galeria-primary-tab-btn ${activeTab === 'cosplay' ? 'active' : ''}`}
            onClick={() => { setActiveTab('cosplay'); setFilterCat('Todas'); setSearch('') }}
          >Cosplay</button>
        </div>

        {/* ── CONTROLES: BUSCADOR + HASHTAGS ───────────────── */}
        <div className="galeria-controls" style={{ justifyContent: 'center', flexWrap: 'wrap', gap: '20px' }}>

          {/* Buscador con autocomplete */}
          <div className="galeria-search-wrap" ref={searchRef}>
            <div className="galeria-search">
              <span className="search-icon">🔍</span>
              <input
                id="galeria-search-input"
                type="text"
                placeholder="Buscar por nombre..."
                value={search}
                autoComplete="off"
                className="search-input"
                onChange={(e) => {
                  setSearch(e.target.value)
                  setShowSuggestions(true)
                  setFilterCat('Todas')
                }}
                onFocus={() => setShowSuggestions(true)}
              />
              {search && (
                <button
                  className="galeria-search-clear"
                  onClick={() => { setSearch(''); setFilterCat('Todas'); setShowSuggestions(false) }}
                  aria-label="Limpiar"
                >✕</button>
              )}
            </div>

            {/* Dropdown de sugerencias de CATEGORÍAS */}
            {showSuggestions && categorySuggestions.length > 0 && (
              <ul className="galeria-suggestions-list">
                {categorySuggestions.map(cat => (
                  <li
                    key={`sug-${cat}`}
                    className="galeria-suggestion-item"
                    onMouseDown={() => applyCategorySuggestion(cat)}
                    style={{ padding: '12px 16px' }}
                  >
                    <span style={{ color: 'var(--color-gold)', marginRight: '8px', fontSize: '1.1rem' }}>#</span>
                    <span className="galeria-sug-name" style={{ fontSize: '1rem' }}>{cat}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Mostrar Categoría Activa (Badge Desmarcable) */}
          {filterCat !== 'Todas' && (
            <div className="galeria-active-filter">
              <span className="gaf-label">Filtrando por:</span>
              <button 
                className="gaf-tag" 
                onClick={() => setFilterCat('Todas')}
                title="Quitar filtro"
              >
                #{filterCat} <span className="gaf-close">✕</span>
              </button>
            </div>
          )}
        </div>

        {/* ── GRID ─────────────────────────────────────────── */}
        {filtered.length > 0 ? (
          <div className="galeria-grid">
            {filtered.map(fig => (
              <article
                key={`${fig.id}-${fig.tipo}`}
                className="galeria-card card"
                onClick={() => setSelectedPost(fig)}
                style={{ cursor: 'pointer' }}
              >
                <div className="galeria-img-wrap">
                  <img src={fig.imagen_url ? `${BASE_URL}/${fig.imagen_url}` : '/mock_fig1.png'} alt={fig.nombre} className="galeria-img" loading="lazy"/>
                  <div className="galeria-cat-badge">{fig.tipo.toUpperCase()}</div>
                </div>
                <div className="galeria-card-body">
                  <div>
                    <h3 className="galeria-name">{fig.nombre}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span className="galeria-year">Año: {fig.anio || '-'}</span>
                      <span className="galeria-author">por <strong>{fig.autor || 'Coleccionista'}</strong></span>
                    </div>
                  </div>
                  <div className="galeria-counters">
                    <div className="galeria-counter red-heart">
                      <span className="counter-icon">❤</span>
                      <span className="counter-num">{fig.total_likes || 0}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="galeria-empty">
            <p>No se encontraron resultados para "{search || filterCat}".</p>
          </div>
        )}
      </div>

      <PostModal
        post={selectedPost}
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        onLike={handleLike}
        onTagClick={(tag) => {
          setFilterCat(tag);
          setSearch('');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setSelectedPost(null);
        }}
      />
    </div>
  )
}
