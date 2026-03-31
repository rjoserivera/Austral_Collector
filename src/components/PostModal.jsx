import './PostModal.css'

export default function PostModal({ post, isOpen, onClose, onLike }) {
  if (!isOpen || !post) return null

  // Prevent closing when clicking the actual modal content
  const handleContentClick = (e) => e.stopPropagation()

  return (
    <div className="pm-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="pm-content" onClick={handleContentClick}>
        
        {/* Left: High-Res Image Side */}
        <div className="pm-image-pane">
           <img src={post.image} alt={post.name} className="pm-main-img" />
        </div>

        {/* Right: Details & Comments Side */}
        <div className="pm-info-pane">
           <header className="pm-header">
             <div className="pm-user-row">
               <img src="/mock_avatar.png" alt="Autor" className="pm-author-avatar" />
               <div className="pm-author-info">
                 <span className="pm-author-name">RetroTech_AR</span>
                 <span className="pm-post-time">Hace 2 horas</span>
               </div>
             </div>
             <button className="pm-close-btn" onClick={onClose} aria-label="Cerrar">✕</button>
           </header>

           <div className="pm-body-scrollable">
             <h2 className="pm-title">{post.name}</h2>
             <span className="pm-year">Año de Edición: <strong>{post.year}</strong></span>
             
             <p className="pm-desc">
               {post.description || 'Una pieza increíble de coleccionista. Perfectamente conservada, con su textura y empaque originales de la época. Indispensable para cualquier verdadero amante del arte retro.'}
             </p>
             
             <div className="gold-divider" style={{ margin: '20px 0' }}/>
             
             <h4 className="pm-comments-title">Comentarios (2)</h4>
             <ul className="pm-comments-list">
               <li className="pm-comment">
                 <img src="/mock_community.png" alt="Avatar" className="pm-comment-avatar"/>
                 <div className="pm-comment-text">
                   <strong>ToyHunterX</strong> ¡Qué joya absoluta! La estuve buscando por años en todas las convenciones. ¿Tiene su pintura original?
                 </div>
               </li>
               <li className="pm-comment">
                 <img src="/mock_fig1.png" alt="Avatar" className="pm-comment-avatar"/>
                 <div className="pm-comment-text">
                   <strong>VintageVibes</strong> Impresionante nivel de detalle. Espero encontrar una en estado Mint pronto.
                 </div>
               </li>
             </ul>
           </div>

           <footer className="pm-actions-bar">
             <div className="pm-buttons-row">
               <button 
                 className={`pm-action-btn ${post.userLiked ? 'liked' : ''}`} 
                 onClick={(e) => {
                   e.stopPropagation();
                   onLike(post.id);
                 }}
               >
                 {post.userLiked ? '❤️' : '♡'} {post.likes}
               </button>
               <button className="pm-action-btn">⭐ Guardar</button>
               <button className="pm-action-btn">🔗 Compartir</button>
             </div>
             
             <div className="pm-add-comment">
                <input type="text" placeholder="Añade un comentario..." className="pm-input-comment" />
                <button className="pm-send-btn">➤</button>
             </div>
           </footer>
        </div>
      </div>
    </div>
  )
}
