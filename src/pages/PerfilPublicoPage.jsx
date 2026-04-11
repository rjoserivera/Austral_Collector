import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import './PerfilPublicoPage.css'
import { API_URL, BASE_URL } from '../config.js'
import CreatePostModal from '../components/CreatePostModal'
import { getOfflinePosts } from '../utils/offlineSync'

export default function PerfilPublicoPage() {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [offlineError, setOfflineError] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [activeTab, setActiveTab] = useState('figura')
  
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
      alert('Debes iniciar sesión para dar me gusta.')
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
        alert(d.error || 'Error al procesar el like.')
      }
    })
    .catch(e => console.error("Error toggling like:", e))
  }

  if (!user) {
    return <div className="perfil-page" style={{padding: '100px', textAlign: 'center', color: '#aaa'}}>
      Cargando perfil o el usuario no existe...
    </div>
  }

  const isOwner = loggedUserName && loggedUserName === user.username;

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
            <h1 className="perfil-name">{user.username}</h1>
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
            <p className="perfil-bio">{user.biografia || 'Sin biografía disponible.'}</p>
            {isOwner && (
              <div className="perfil-owner-actions">
                <Link to="/dashboard" className="perfil-btn-outline">✏️ Editar Perfil</Link>
                <button className="perfil-btn-primary" onClick={() => setShowUpload(true)}>➕ Subir Publicación</button>
              </div>
            )}
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
                Figuras
              </button>
              <button 
                className={`perfil-tab-btn ${activeTab === 'cosplay' ? 'active' : ''}`} 
                onClick={() => setActiveTab('cosplay')}
              >
                Cosplay
              </button>
            </div>
          </div>
          
          <div className="perfil-grid-4">
            {user.collection && user.collection.filter(fig => (fig.tipo || 'figura') === activeTab).map(fig => (
              <article key={fig.id} className="hp-figura-card card">
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
                    <button className="hp-heart-btn" onClick={() => handleLike(fig.id, fig.tipo)}>
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
    </div>
  )
}
