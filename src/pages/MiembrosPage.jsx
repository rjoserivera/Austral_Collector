import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL, BASE_URL } from '../config.js'
import './MiembrosPage.css'
import VerifiedBadge from '../components/VerifiedBadge'

export default function MiembrosPage() {
  const [miembros, setMiembros] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('likes') // 'likes', 'nombre', 'fechaReciente', 'fechaAntigua', 'figuras'
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 21
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${API_URL}/public/miembros_data.php`)
      .then(r => r.json())
      .then(d => {
        console.log("API Response:", d)
        if (d.success) {
          setMiembros(d.data)
        } else {
          console.error("API error:", d.error)
        }
        setLoading(false)
      })
      .catch(e => {
        console.error("Error cargando miembros:", e)
        setLoading(false)
      })
  }, [])

  // Filtrar y ordenar miembros
  const filteredMiembros = useMemo(() => {
    let result = [...miembros]

    // Filtrar por nombre
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      result = result.filter(m => m.username.toLowerCase().includes(term))
    }

    // Ordenar
    switch (sortBy) {
      case 'nombre':
        result.sort((a, b) => a.username.localeCompare(b.username))
        break
      case 'fechaReciente':
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        break
      case 'fechaAntigua':
        result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        break
      case 'figuras':
        result.sort((a, b) => b.total_posts - a.total_posts)
        break
      case 'likes':
      default:
        result.sort((a, b) => b.total_likes - a.total_likes)
        break
    }

    return result
  }, [miembros, searchTerm, sortBy])

  // Calcular paginación
  const totalPages = Math.ceil(filteredMiembros.length / ITEMS_PER_PAGE)
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE
  const endIdx = startIdx + ITEMS_PER_PAGE
  const paginatedMiembros = filteredMiembros.slice(startIdx, endIdx)

  // Reset página cuando cambia el filtro o búsqueda
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, sortBy])

  if (loading) {
    return <div className="miembros-page section-wrapper" style={{textAlign: 'center', paddingTop: '100px', color: 'var(--color-muted)'}}>Cargando directorio de coleccionistas...</div>
  }

  return (
    <div className="miembros-page">
      <section className="mi-hero">
        <div className="mi-hero-bg" aria-hidden="true"/>
        <div className="mi-hero-inner section-wrapper">
          <div className="mi-hero-mascot-wrap">
            <img src="/robot_sin_fondon.png" alt="Mascota Robot Austral Collector" className="mi-mascot"/>
          </div>
          
          <div className="mi-hero-content">
            <h1 className="mi-hero-title">
              <span className="mi-title-teal">DIRECTORIO DE</span><br/>
              <span className="mi-title-red">COLECCIONISTAS</span>
            </h1>
            <p className="mi-hero-desc">Explora los perfiles de todos los miembros de Austral Collector. ¡Descubre sus figuras, conéctate y comparte tu pasión!</p>
          </div>
        </div>
      </section>

      {/* FILTROS Y BÚSQUEDA */}
      <div className="section-wrapper" style={{ margin: '40px auto' }}>
        <div className="galeria-controls" style={{ justifyContent: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: 0 }}>
          
          <div className="galeria-search-wrap">
            <div className="galeria-search">
              <span className="search-icon">🔍</span>
              <input
                id="miembros-search-input"
                type="text"
                placeholder="Buscar por nombre de usuario..."
                value={searchTerm}
                autoComplete="off"
                className="search-input"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="galeria-search-clear"
                  onClick={() => setSearchTerm('')}
                  aria-label="Limpiar"
                >✕</button>
              )}
            </div>
          </div>

          <div className="galeria-sort-container" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label htmlFor="sort-select" style={{ color: 'rgba(240, 228, 204, 0.75)', fontSize: '0.9rem', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '1px', whiteSpace: 'nowrap' }}>Ordenar por:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="search-input"
              style={{ padding: '8px 30px 8px 16px', borderRadius: '20px', cursor: 'pointer', appearance: 'none', background: 'rgba(10,5,4,.6) url("data:image/svg+xml;utf8,<svg fill=\'%23f0e4cc\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/><path d=\'M0 0h24v24H0z\' fill=\'none\'/></svg>") no-repeat right 8px center' }}
            >
              <option value="likes">👍 Más Me Gusta</option>
              <option value="figuras">📦 Más Figuras</option>
              <option value="nombre">A-Z Nombre</option>
              <option value="fechaReciente">📅 Más Reciente</option>
              <option value="fechaAntigua">📅 Más Antiguo</option>
            </select>
          </div>

        </div>
      </div>



      <div className="mi-grid">
        {paginatedMiembros.map(m => (
          <article key={m.id} className="mi-card" onClick={() => navigate(`/perfil/${m.username}`)}>
            <div className="mi-card-banner" style={{ backgroundImage: `url('${m.banner_url ? BASE_URL + '/' + m.banner_url : '/mock_banner.png'}')` }} />
            
            <div className="mi-card-avatar-wrap">
              <img src={m.avatar_url ? `${BASE_URL}/${m.avatar_url}` : '/mock_avatar.png'} alt={m.username} className="mi-card-avatar" loading="lazy" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/mock_avatar.png'; }} />
            </div>

            <div className="mi-card-body">
              <div className="mi-card-name-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, minWidth: 0 }}>
                  <h3 className="mi-card-name" title={m.username}>{m.username}</h3>
                  <VerifiedBadge type={m.verification_type} badgeUrl={m.verification_badge} size={18} />
                  {m.role === 'admin' && (
                    <span title="Administrador" style={{ fontSize: '1.2rem', filter: 'drop-shadow(0 0 3px rgba(255,215,0,0.5))' }}>👑</span>
                  )}
                </div>
              </div>
              <p className="mi-card-bio">{m.biografia || 'Sin biografía disponible. ¡Un coleccionista misterioso!'}</p>

              <div className="mi-card-stats">
                <div className="mi-card-stat" title="Publicaciones subidas">
                  <span>{m.total_posts}</span> 📦
                </div>
                <div className="mi-card-stat" title="Total de Me Gusta recibidos">
                  <span>{m.total_likes}</span> ❤️
                </div>
                <div className="mi-card-stat" title="Puntuación de la comunidad">
                  <span>{m.total_ratings}</span> ⭐
                </div>
              </div>
            </div>
          </article>
        ))}

        {filteredMiembros.length === 0 && (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--color-muted)', marginTop: '40px' }}>
            {searchTerm ? 'No se encontraron coleccionistas con ese nombre.' : 'No hay coleccionistas registrados aún.'}
          </p>
        )}
      </div>

      {/* PAGINACIÓN */}
      {totalPages > 1 && (
        <div className="galeria-pagination section-wrapper">
          <button 
            disabled={currentPage === 1} 
            onClick={() => { setCurrentPage(prev => Math.max(1, prev - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="pagination-btn"
          >
            Anterior
          </button>
          <div className="pagination-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
              <button
                key={pageNum}
                className={`pagination-num ${currentPage === pageNum ? 'active' : ''}`}
                onClick={() => { setCurrentPage(pageNum); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              >
                {pageNum}
              </button>
            ))}
          </div>
          <button 
            disabled={currentPage === totalPages} 
            onClick={() => { setCurrentPage(prev => Math.min(totalPages, prev + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="pagination-btn"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  )
}
