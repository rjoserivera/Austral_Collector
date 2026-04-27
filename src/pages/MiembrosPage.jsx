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
  const ITEMS_PER_PAGE = 20
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
    return <div className="miembros-page section-wrapper" style={{textAlign: 'center', paddingTop: '100px', color: '#aaa'}}>Cargando directorio de coleccionistas...</div>
  }

  return (
    <div className="miembros-page">
      <section className="mi-hero">
        <div className="mi-hero-inner section-wrapper">
          <div className="hp-hero-mascot-wrap mi-mascot-row">
            <div className="hp-mascot-glow" aria-hidden="true"/>
            <img src="/robot_sin_fondon.png" alt="Mascota Robot Austral Collector" className="hp-mascot"/>
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
      <div className="mi-filters-section section-wrapper">
        <div className="mi-search-container">
          <input
            type="text"
            placeholder="🔍 Buscar por nombre de usuario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mi-search-input"
          />
        </div>

        <div className="mi-sort-container">
          <label htmlFor="sort-select" style={{ marginRight: '8px', color: 'var(--color-cream)' }}>Ordenar por:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="mi-sort-select"
          >
            <option value="likes">👍 Más Me Gusta</option>
            <option value="figuras">📦 Más Figuras</option>
            <option value="nombre">A-Z Nombre</option>
            <option value="fechaReciente">📅 Más Reciente</option>
            <option value="fechaAntigua">📅 Más Antiguo</option>
          </select>
        </div>
      </div>

      <div className="mi-results-info section-wrapper">
        <p style={{ color: 'var(--color-cream)', marginBottom: '0' }}>
          Mostrando <strong>{paginatedMiembros.length}</strong> de <strong>{filteredMiembros.length}</strong> coleccionistas
        </p>
      </div>

      <div className="mi-grid">
        {paginatedMiembros.map(m => (
          <article key={m.id} className="mi-card" onClick={() => navigate(`/perfil/${m.username}`)}>
            <div className="mi-card-banner" style={{ backgroundImage: `url('${m.banner_url ? BASE_URL + '/' + m.banner_url : '/mock_banner.png'}')` }} />
            
            <div className="mi-card-avatar-wrap">
              <img src={m.avatar_url ? `${BASE_URL}/${m.avatar_url}` : '/mock_avatar.png'} alt={m.username} className="mi-card-avatar" loading="lazy" />
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
              <p className="mi-card-headline" title={m.biografia}>{m.biografia || 'Coleccionista'}</p>
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
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#aaa', marginTop: '40px' }}>
            {searchTerm ? 'No se encontraron coleccionistas con ese nombre.' : 'No hay coleccionistas registrados aún.'}
          </p>
        )}
      </div>

      {/* PAGINACIÓN */}
      {totalPages > 1 && (
        <div className="mi-pagination section-wrapper">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="mi-pagination-btn"
          >
            ← Anterior
          </button>

          <div className="mi-pagination-info">
            Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="mi-pagination-btn"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  )
}
