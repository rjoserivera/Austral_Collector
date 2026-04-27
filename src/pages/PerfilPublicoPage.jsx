import { useState, useEffect } from 'react'
import { toast, confirmDialog } from '../contexts/NotificationContext.jsx'
import { useParams, Link } from 'react-router-dom'
import './PerfilPublicoPage.css'
import { API_URL, BASE_URL } from '../config.js'
import CreatePostModal from '../components/CreatePostModal'
import PostModal from '../components/PostModal'
import { getOfflinePosts } from '../utils/offlineSync'
import VerifiedBadge from '../components/VerifiedBadge'

export default function PerfilPublicoPage() {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [offlineError, setOfflineError] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [activeTab, setActiveTab] = useState('figura')
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  
  const authUserStr = localStorage.getItem('austral_auth_user')
  let loggedUserName = null;
  try { if (authUserStr) loggedUserName = JSON.parse(authUserStr).username; } catch(e) {}

  const loadData = async () => {
    const viewerParam = loggedUserName ? `&viewer_username=${loggedUserName}` : ''
    let fetchedUser = null;
    let fallbackUser = {
      username: id || 'Desconocido',
      headline: 'Modo Offline (Sin Conexión)',
      biografia: 'No hay conexión a internet para descargar este perfil. Usando modo de emergencia.',
      collection: [],
      joined: 'Desconocida'
    };

    try {
      const r = await fetch(`${API_URL}/public/perfil_data.php?username=${id}${viewerParam}`);
      const d = await r.json();
      if(d.success) {
        fetchedUser = d.data;
        localStorage.setItem(`austral_perfil_cache_${id}`, JSON.stringify(d.data));
      }
    } catch(e) {
      console.error("Error fetching profile, attempting to load cache:", e);
      if (!navigator.onLine) {
        setOfflineError(true);
      }
      const cached = localStorage.getItem(`austral_perfil_cache_${id}`);
      if (cached) {
        try {
          fetchedUser = JSON.parse(cached);
        } catch(err) {
          console.error("Cache parsing failed:", err);
        }
      }
    }

    let finalUser = fetchedUser || fallbackUser;

    try {
      if (finalUser.username === loggedUserName && loggedUserName) {
        const offlinePosts = await getOfflinePosts();
        if (offlinePosts && offlinePosts.length > 0) {
          const offlineFormatted = offlinePosts.map(p => ({
            id: p.id,
            nombre: p.nombre,
            descripcion: p.descripcion,
            anio: p.anio,
            tipo: p.tipo,
            total_likes: 0,
            userLiked: false,
            local_image: p.imagesBase64?.[0]?.base64,
            isOfflineSync: true,
            id_original: p.id_original
          }));
          const newOffline = offlineFormatted.filter(p => !p.id_original);
          finalUser.collection = [...newOffline, ...(finalUser.collection || [])];
        }
      }
    } catch (e) {
      console.warn('Error loading offline posts:', e);
    }
    
    setUser(finalUser);
  }

  useEffect(() => {
    loadData()
  }, [id])

  const handleLike = (postId, tipo) => {
    if (!loggedUserName) {
      toast.info('Debes iniciar sesión para dar me gusta.')
      return
    }

    fetch(`${API_URL}/auth/toggle_like.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: loggedUserName, post_id: postId, tipo: tipo || 'figura' })
    })
    .then(r => r.json())
    .then(d => {
      if (d.success) {
        setUser(prev => {
           const newCollection = prev.collection.map(fig => 
             fig.id === postId && (fig.tipo || 'figura') === (tipo || 'figura')
               ? { ...fig, total_likes: d.total_likes, userLiked: d.action === 'liked' }
               : fig
           )
           return { ...prev, collection: newCollection }
        })
      } else {
        toast.error(d.error || 'Error al procesar el like.')
      }
    })
    .catch(e => console.error("Error toggling like:", e))
  }

  const handleRateProfile = (score) => {
    if (!loggedUserName) return;
    fetch(`${API_URL}/auth/rate_profile.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ viewer_username: loggedUserName, rated_user_id: user.id, score })
    })
    .then(r => r.json())
    .then(d => {
      if (d.success) {
        loadData(); // reload stats and user info dynamically
      } else {
        toast.error(d.error || 'Error al calificar perfil.');
      }
    })
    .catch(e => console.error("Error rating profile:", e))
  }

  const handleDeleteRating = () => {
    if (!loggedUserName) return;
    fetch(`${API_URL}/auth/delete_rating.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ viewer_username: loggedUserName, rated_user_id: user.id })
    })
    .then(r => r.json())
    .then(d => {
      if (d.success) {
        loadData(); // reload stats
      } else {
        toast.error(d.error || 'Error al remover calificación.');
      }
    })
    .catch(e => console.error("Error deleting rating:", e))
  }

  if (!user) {
    return <div className="perfil-page" style={{padding: '100px', textAlign: 'center', color: '#aaa'}}>
      Cargando perfil o el usuario no existe...
    </div>
  }

  const isOwner = loggedUserName && loggedUserName === user.username;
  const figurasCount = user.collection ? user.collection.filter(f => (f.tipo || 'figura') === 'figura').length : 0;
  const cosplayCount = user.collection ? user.collection.filter(f => f.tipo === 'cosplay').length : 0;

  return (
    <div className="perfil-page">
      {/* ── BANNER PANORÁMICO ──────────────────────────────────── */}
      <section className="perfil-header" style={{ backgroundImage: `url('${user.banner_url ? BASE_URL + '/' + user.banner_url : '/mock_banner.png'}')` }}>
        <div className="perfil-overlay" aria-hidden="true"/>
      </section>

      {offlineError && (
        <div style={{ background: '#c0392b', color: 'white', textAlign: 'center', padding: '8px', fontSize: '0.85rem' }}>
          Visualizando perfil en memoria local. No hay red activa.
        </div>
      )}

      <div className="section-wrapper perfil-content-wrapper">
        {/* ── CABECERA / INFO USUARIO ────────────────────────────── */}
        <section className="perfil-info-card">
          <div className="perfil-avatar-wrap">
            <div className="perfil-avatar-ring"/>
            <img src={user.avatar_url ? `${BASE_URL}/${user.avatar_url}` : '/mock_avatar.png'} alt={user.username} className="perfil-avatar"/>
          </div>
          <div className="perfil-user-details">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <h1 className="perfil-name" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                {user.username}
                <VerifiedBadge type={user.verification_type} badgeUrl={user.verification_badge} size={26} />
                {user.role === 'admin' && <span title="Administrador" style={{ fontSize: '1.3rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>👑</span>}
              </h1>
              
              <div 
                className="perfil-global-rating" 
                style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: (!isOwner && loggedUserName) ? 'pointer' : 'default' }}
                onClick={() => { if (!isOwner && loggedUserName) setShowRatingModal(true); }}
                title={(!isOwner && loggedUserName) ? 'Pulsa para calificar' : ''}
              >
                <span style={{ color: '#f1c40f', fontSize: '1.2rem', lineHeight: 1 }}>⭐</span>
                <strong style={{ fontSize: '1.1rem', color: '#f0e4cc', lineHeight: 1 }}>
                  {parseFloat(user.stats?.average_rating || 0).toFixed(1)}
                </strong>
                <span style={{ fontSize: '0.85rem', color: 'rgba(240, 228, 204, 0.6)'}}>({user.stats?.total_ratings || 0})</span>
                {!isOwner && loggedUserName && (
                   <span style={{ fontSize: '0.85rem', marginLeft: '4px', filter: 'grayscale(0.2)' }}>
                     {user.stats?.viewer_rating ? '✏️' : '📝'}
                   </span>
                )}
              </div>
            </div>
            <p className="perfil-headline">{user.headline || 'Coleccionista'}</p>
            <div className="perfil-meta">
              <span>🗓️ Se unió en {user.joined}</span>
              <span className="perfil-stat-sep">✦</span>
              <span>📦 {user.collection ? user.collection.length : 0} Publicaciones</span>
              {user.cumpleanios && (
                <>
                  <span className="perfil-stat-sep">✦</span>
                  <span>🎂 Cumpleaños: {user.cumpleanios}</span>
                </>
              )}
            </div>
            
            {/* Rating widget moved next to username header */}

            <p className="perfil-bio">{user.biografia || 'Sin biografía disponible.'}</p>
            
            {isOwner && (
              <div className="perfil-owner-actions">
                <Link to="/dashboard" className="perfil-btn-outline">✏️ Editar Perfil</Link>
                <button className="perfil-btn-primary" onClick={() => setShowUpload(true)}>➕ Subir Publicación</button>
              </div>
            )}

            {/* Old inline rating widget removed */}
          </div>
        </section>

        <div className="gold-divider" style={{ margin: '40px 0 32px' }}/>

        {/* ── GALERÍA DE PORTAFOLIO ──────────────────────────────── */}
        <section className="perfil-portafolio">
          <div className="perfil-portafolio-header">
            <h2 className="perfil-section-title">⚜️ Portafolio de Colección</h2>
            <div className="perfil-tabs-container">
              <button 
                className={`perfil-tab-btn ${activeTab === 'figura' ? 'active' : ''}`} 
                onClick={() => setActiveTab('figura')}
              >
                Figuras ({figurasCount})
              </button>
              <button 
                className={`perfil-tab-btn ${activeTab === 'cosplay' ? 'active' : ''}`} 
                onClick={() => setActiveTab('cosplay')}
              >
                Cosplay ({cosplayCount})
              </button>
            </div>
          </div>
          
          <div className="perfil-grid-4">
            {user.collection && user.collection.filter(fig => (fig.tipo || 'figura') === activeTab).map(fig => (
              <article key={fig.id} className="hp-figura-card card" onClick={() => setSelectedPost(fig)}>
                <div className="hp-figura-img-wrap" style={{ position: 'relative' }}>
                  <img src={fig.local_image || (fig.imagen_url ? `${BASE_URL}/${fig.imagen_url}` : '/mock_fig1.png')} alt={fig.nombre} className="hp-figura-img" loading="lazy"/>
                  {fig.anio && <div className="hp-figura-year">{fig.anio}</div>}
                  <div className="hp-figura-year" style={{top: '8px', right: '8px', left: 'auto', background: 'rgba(45,110,126,.9)'}}>{fig.tipo || 'figura'}</div>
                  {fig.isOfflineSync && <div style={{position:'absolute', top:'10px', left:'10px', background:'#d35400', color:'white', fontSize:'0.75rem', padding:'4px 8px', borderRadius:'12px', zIndex:10}} title="Pendiente de subida">⏳ Pendiente</div>}
                </div>
                <div className="hp-figura-body">
                  <h3 className="hp-figura-name">{fig.nombre}</h3>
                  <span className="hp-figura-sub">De: {user.username}</span>
                  <p className="hp-figura-desc">{fig.descripcion || 'Sin descripción.'}</p>
                  <div>
                    <button className="hp-heart-btn" onClick={(e) => { e.stopPropagation(); handleLike(fig.id, fig.tipo); }}>
                       {fig.userLiked ? '❤' : '♡'} {fig.total_likes || 0}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {showUpload && <CreatePostModal isOpen={showUpload} onClose={() => setShowUpload(false)} onSuccess={loadData} currentUserId={user.id} />}

      {/* RATING MODAL POPUP */}
      {showRatingModal && (
        <div className="prw-modal-overlay" onClick={() => setShowRatingModal(false)} style={{ zIndex: 9999 }}>
          <div className="prw-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '350px', textAlign: 'center', background: 'radial-gradient(ellipse at center, #2e1a1a 0%, #170d0d 100%)', border: '1px solid var(--color-gold-light)' }}>
            <button className="prw-modal-close" onClick={() => setShowRatingModal(false)}>✕</button>
            <h2 style={{ fontFamily: 'var(--font-title)', color: 'var(--color-gold)', marginBottom: '16px', fontSize: '1.8rem' }}>
               Calificar Perfil
            </h2>
            <p style={{ color: 'rgba(240, 228, 204, 0.8)', fontSize: '0.9rem', marginBottom: '24px' }}>
               {user.stats?.viewer_rating ? `Actualmente calificaste a ${user.username} con ${user.stats.viewer_rating} estrellas. ¿Deseas modificarlo?` : `¿Cuántas estrellas de reputación le darías a la colección de ${user.username}?`}
            </p>

            <div className="prw-stars" style={{ justifyContent: 'center', marginBottom: '32px' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  className={`rating-star ${user.stats?.viewer_rating >= star ? 'filled' : ''}`}
                  onClick={() => { handleRateProfile(star); setShowRatingModal(false); }}
                  title={`Dar ${star} estrellas`}
                  style={{ fontSize: '2.5rem' }}
                >
                  ★
                </button>
              ))}
            </div>

            {user.stats?.viewer_rating && (
              <button 
                 className="prw-remove-btn" 
                 style={{ display: 'block', margin: '0 auto', fontSize: '0.85rem' }}
                 onClick={() => { handleDeleteRating(); setShowRatingModal(false); }}
              >
                 Remover mi calificación
              </button>
            )}
          </div>
        </div>
      )}

      {selectedPost && (
        <PostModal
          post={selectedPost}
          isOpen={!!selectedPost}
          onClose={() => setSelectedPost(null)}
          onLike={(id) => handleLike(id, selectedPost.tipo)}
        />
      )}
    </div>
  )
}

