import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './PostModal.css'
import { API_URL, BASE_URL } from '../config.js'

// Formatea la fecha en español: ej. "1 abr 2026 · 13:16"
function formatDate(dateStr) {
  const date = dateStr ? new Date(dateStr) : new Date()
  return date.toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }) + ' · ' + date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
}

export default function PostModal({ post, isOpen, onClose, onLike, onTagClick, isHomeMode = false }) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [imgIndex, setImgIndex] = useState(0)
  const navigate = useNavigate()

  if (!isOpen || !post) return null

  const handleContentClick = (e) => e.stopPropagation()

  const handleAuthorClick = (e) => {
    e.stopPropagation()
    const username = post.autor_username || post.autor
    if (username && username !== 'Unknown' && username !== 'Coleccionista') {
      onClose() // Cierra el modal primero
      navigate(`/perfil/${username}`)
    }
  }

  // Carrusel logic
  const allImages = []
  if (post.imagen_url) allImages.push(post.imagen_url)
  if (post.imagenes_extra && Array.isArray(post.imagenes_extra)) {
    post.imagenes_extra.forEach(url => allImages.push(url))
  }
  
  // Si no hay imágenes en la BD por algún motivo, usar mock
  if (allImages.length === 0) allImages.push(post.imagen_url || post.image || 'figura1.png')

  const nextImg = (e) => {
    e.stopPropagation()
    setIsZoomed(false) // Reset zoom on navigate
    setImgIndex((prev) => (prev + 1) % allImages.length)
  }
  const prevImg = (e) => {
    e.stopPropagation()
    setIsZoomed(false) // Reset zoom on navigate
    setImgIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
  }

  return (
    <div className="pm-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }} role="dialog" aria-modal="true">
      <div className="pm-content" onClick={handleContentClick}>

        {/* Panel izquierdo: imagen con overlays si es isHomeMode */}
        <div className={`pm-image-pane ${isHomeMode ? 'pm-image-pane-home' : ''}`}>
          <img 
            src={`${BASE_URL}/${allImages[imgIndex]}`} 
            alt={post.nombre || post.titulo} 
            className="pm-main-img" 
            style={{ cursor: 'zoom-in' }}
            onClick={(e) => { e.stopPropagation(); setIsFullscreen(true); }}
          />
          
          {allImages.length > 1 && (
            <>
              <button className="pm-nav-btn pm-prev" onClick={prevImg} aria-label="Anterior">‹</button>
              <button className="pm-nav-btn pm-next" onClick={nextImg} aria-label="Siguiente">›</button>
              
              <div className="pm-img-indicators">
                {allImages.map((_, i) => (
                  <span 
                    key={i} 
                    className={`pm-dot ${i === imgIndex ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); setImgIndex(i); }}
                  />
                ))}
              </div>
            </>
          )}

          {!isHomeMode && (
            <button 
              className="pm-fullscreen-btn" 
              onClick={(e) => { e.stopPropagation(); setIsFullscreen(true); }}
              title="Ver a pantalla completa"
            >
              ⛶
            </button>
          )}

          {isHomeMode && (
            <>
              {/* Botón de cierre en HomeMode flotando arriba */}
              <button className="pm-close-btn-home" onClick={onClose} aria-label="Cerrar">✕</button>

              {/* Controles flotantes abajo */}
              <div className="pm-home-overlays">
                {/* Perfil del Autor */}
                <div className="pm-home-autor" title="Ir al perfil" style={{ cursor: 'pointer' }} onClick={handleAuthorClick}>
                  <img src={post.autor_avatar ? `${BASE_URL}/${post.autor_avatar}` : '/mock_avatar.png'} alt="Autor" className="pm-author-avatar-home" />
                  <span className="pm-author-name-home">{post.autor_username || post.autor || 'Coleccionista'}</span>
                </div>

                {/* Me gusta */}
                <button
                  className={`pm-action-btn heart-btn pm-home-heart ${post.userLiked ? 'liked' : ''}`}
                  onClick={(e) => { e.stopPropagation(); onLike(post.id); }}
                  title="Me gusta esta publicación"
                >
                  {post.userLiked ? '❤️' : '🤍'} {post.total_likes !== undefined ? post.total_likes : (post.likes || 0)}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Panel derecho (Solo visible si NO es HomeMode) */}
        {!isHomeMode && (
          <div className="pm-info-pane">
            {/* Header */}
            <header className="pm-header">
              <div className="pm-user-row" style={{ cursor: 'pointer' }} onClick={handleAuthorClick}>
                <img src={post.autor_avatar ? `${BASE_URL}/${post.autor_avatar}` : '/mock_avatar.png'} alt="Autor" className="pm-author-avatar" />
                <div className="pm-author-info">
                  <span className="pm-author-name">{post.autor_username || post.autor || 'Coleccionista'}</span>
                  <span className="pm-post-time">{formatDate(post.created_at || post.createdAt)}</span>
                </div>
              </div>
              <button className="pm-close-btn" onClick={onClose} aria-label="Cerrar">✕</button>
            </header>

            {/* Cuerpo scrollable */}
            <div className="pm-body-scrollable">
              <h2 className="pm-title">{post.nombre || post.titulo}</h2>
              {(post.anio || post.year) && <span className="pm-year">Año de Edición: <strong>{post.anio || post.year}</strong></span>}
              <p className="pm-desc">
                {post.descripcion || post.description || 'Una pieza increíble de la comunidad. Sin descripción detallada.'}
              </p>
              
              {post.categorias && post.categorias.length > 0 && (
                <div className="pm-tags">
                  {post.categorias.map(cat => (
                    <span 
                      key={cat} 
                      className="pm-tag clickable" 
                      onClick={(e) => { e.stopPropagation(); if(onTagClick) onTagClick(cat); }}
                    >
                      #{cat}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Footer: botones de acción */}
            <footer className="pm-actions-bar">
              <div className="pm-buttons-row">
                <button
                  className={`pm-action-btn heart-btn ${post.userLiked ? 'liked' : ''}`}
                  onClick={(e) => { e.stopPropagation(); onLike(post.id); }}
                  title="Me gusta esta publicación"
                  style={{ width: '100%', flex: 'none' }}
                >
                  {post.userLiked ? '❤️' : '🤍'} {post.total_likes !== undefined ? post.total_likes : (post.likes || 0)}
                </button>
              </div>
            </footer>
          </div>
        )}
      </div>

      {/* OVERLAY PANTALLA COMPLETA */}
      {isFullscreen && (
        <div className="pm-full-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) { setIsFullscreen(false); setIsZoomed(false); } }}>
          <button className="pm-close-full-btn" onClick={() => { setIsFullscreen(false); setIsZoomed(false); }}>✕ Cerrar</button>
          
          <div 
            className={`pm-full-carousel ${isZoomed ? 'zoomed-scroll' : ''}`} 
            onClick={() => { setIsFullscreen(false); setIsZoomed(false); }} /* Click en el fondo oscuro CIERRA */
            style={{ cursor: isZoomed ? 'zoom-out' : 'default' }}
          >
            <img 
              src={`${BASE_URL}/${allImages[imgIndex]}`} 
              alt="Completa" 
              className={`pm-full-img ${isZoomed ? 'zoomed' : ''}`} 
              onClick={(e) => { e.stopPropagation(); setIsZoomed(!isZoomed); }} /* Solo la imagen hace ZOOM */
              title={isZoomed ? "Alejar" : "Acercar (Zoom)"}
              style={{ cursor: isZoomed ? 'zoom-out' : 'zoom-in' }}
            />
            
            {allImages.length > 1 && (
              <>
                <button className="pm-nav-btn-full pm-prev" onClick={(e) => { e.stopPropagation(); prevImg(e); }}>‹</button>
                <button className="pm-nav-btn-full pm-next" onClick={(e) => { e.stopPropagation(); nextImg(e); }}>›</button>
                <div className="pm-full-count" onClick={(e) => e.stopPropagation()}>{imgIndex + 1} / {allImages.length}</div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  )
}
