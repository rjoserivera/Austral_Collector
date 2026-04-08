import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './DashboardPage.css'
import CreatePostModal from '../components/CreatePostModal'
import PasswordChangeForm from '../components/PasswordChangeForm'
import { API_URL, BASE_URL } from '../config.js'

export default function DashboardPage() {
  const [bio, setBio] = useState('')
  const [avatar, setAvatar] = useState('/mock_avatar.png')
  const [banner, setBanner] = useState('/mock_banner.png')
  const [avatarFile, setAvatarFile] = useState(null)
  const [bannerFile, setBannerFile] = useState(null)
  const [figuras, setFiguras] = useState([])
  const [showUpload, setShowUpload] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [userId, setUserId] = useState(null)
  const [saving, setSaving] = useState(false)

  const avatarInputRef = useRef(null)
  const bannerInputRef = useRef(null)

  const userNameRaw = localStorage.getItem('austral_auth_user');
  let userName = 'Coleccionista';
  let userIdObj = null;
  try {
    if (userNameRaw) {
      const parsed = JSON.parse(userNameRaw);
      userName = parsed.username || userNameRaw;
      userIdObj = parsed.id || null;
    }
  } catch (e) {
    userName = userNameRaw || 'Coleccionista';
  }

  const userRole = localStorage.getItem('austral_auth_role')
  const navigate = useNavigate()

  const loadData = () => {
    if (!localStorage.getItem('austral_auth_user')) { navigate('/login'); return; }
    fetch(`${API_URL}/public/perfil_data.php?username=${userName}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setBio(d.data.biografia || '')
          setAvatar(d.data.avatar_url ? `${BASE_URL}/${d.data.avatar_url}` : '/mock_avatar.png')
          setBanner(d.data.banner_url ? `${BASE_URL}/${d.data.banner_url}` : '/mock_banner.png')
          setFiguras(d.data.collection || [])
          setUserId(d.data.id)
        }
      })
      .catch(e => console.error(e))
  }

  useEffect(() => { loadData() }, [userName])

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setAvatarFile(file)
    setAvatar(URL.createObjectURL(file))
  }

  const handleBannerChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setBannerFile(file)
    setBanner(URL.createObjectURL(file))
  }

  const handleSave = () => {
    setSaving(true)
    const formData = new FormData()
    formData.append('user_id', userId)
    formData.append('biografia', bio)
    if (avatarFile) formData.append('avatar', avatarFile)
    if (bannerFile) formData.append('banner', bannerFile)

    fetch(`${API_URL}/auth/update_profile.php`, { method: 'POST', body: formData })
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          alert('Perfil actualizado correctamente.')
          setAvatarFile(null)
          setBannerFile(null)
          if (d.avatar_url) setAvatar(`${BASE_URL}/${d.avatar_url}`)
          if (d.banner_url) setBanner(`${BASE_URL}/${d.banner_url}`)
        } else {
          alert('Error: ' + (d.error || 'No se pudo guardar.'))
        }
      })
      .catch(e => alert('Error: ' + e.message))
      .finally(() => setSaving(false))
  }

  const handleDelete = (fig) => {
    if (!window.confirm(`¿Eliminar "${fig.nombre}"? Esta acción no se puede deshacer.`)) return
    fetch(`${API_URL}/auth/eliminar_post.php`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: fig.id, tipo: fig.tipo || 'figura' })
    })
      .then(r => r.json())
      .then(d => {
        if (d.success) loadData()
        else alert('Error: ' + (d.error || 'No se pudo eliminar.'))
      })
      .catch(e => alert('Error: ' + e.message))
  }

  // --- Drag & Drop variables para reordenar la colección ---
  const [draggedIndex, setDraggedIndex] = useState(null)

  const handleDragStart = (e, index) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    // Firefox necesita esto
    e.dataTransfer.setData('text/html', e.target)
    
    // Dejar una clase arrastrando para bajar opacidad visualmente origin
    setTimeout(() => {
      e.target.classList.add('db-dragging')
    }, 0)
  }

  const handleDragEnter = (e, index) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    setFiguras(prev => {
      const newList = [...prev]
      const draggedItem = newList.splice(draggedIndex, 1)[0]
      newList.splice(index, 0, draggedItem)
      return newList
    })
    setDraggedIndex(index)
  }

  const handleDragEnd = (e) => {
    e.target.classList.remove('db-dragging')
    setDraggedIndex(null)
    saveNewOrder()
  }

  const saveNewOrder = () => {
    // Al finalizar de arrastrar, mandamos al backend el nuevo orden
    // figuras local state ya está reordenado
    const ordenData = figuras.map((fig) => ({
      id: fig.id,
      tipo: fig.tipo
    }))

    fetch(`${API_URL}/auth/reordenar_posts.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orden: ordenData })
    })
    .catch(e => console.error("Error guardando reorden: ", e))
  }

  return (
    <div className="dashboard-page section-wrapper">

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="db-title">Bienvenido, {userName}</h1>
          <p className="db-subtitle">Administra tu perfil público y tu inventario de figuras.</p>
        </div>
        {userRole === 'admin' && (
          <Link to="/admin" className="btn-primary" style={{ background: '#1e4d5a', padding: '12px 24px' }}>
            ⚙️ Ir al Panel de Control
          </Link>
        )}
      </div>
      <div className="gold-divider" style={{ margin: '16px 0 32px' }}/>

      <div className="db-layout">

        {/* ── SIDEBAR: EDITAR PERFIL ─────────────────────────── */}
        <aside className="db-sidebar card">
          <h2 className="db-section-title">⚙️ Editar Perfil</h2>

          <div className="db-field">
            <label className="db-label">Biografía</label>
            <textarea className="db-textarea" rows={4} value={bio} onChange={e => setBio(e.target.value)} />
          </div>

          <div className="db-field">
            <label className="db-label">Avatar (Foto Circular)</label>
            <div className="db-media-preview">
              <img src={avatar} alt="Mi Avatar" className="db-avatar-img"/>
              <div className="db-media-actions">
                <button className="btn-outline db-btn-sm" onClick={() => avatarInputRef.current.click()}>✏️ Editar</button>
                <button className="btn-outline db-btn-sm btn-danger" onClick={() => { setAvatar('/mock_avatar.png'); setAvatarFile(null); }}>🗑️ Eliminar</button>
              </div>
              <input ref={avatarInputRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleAvatarChange}/>
              {avatarFile && <small style={{color:'#8cf08c',marginTop:'4px'}}>✅ Nueva foto lista para guardar</small>}
            </div>
          </div>

          <div className="db-field">
            <label className="db-label">Fondo de Cabecera (Banner)</label>
            <div className="db-media-preview">
              <div className="db-banner-img-wrap">
                <img src={banner} alt="Fondo Cabecera" className="db-banner-img"/>
              </div>
              <div className="db-media-actions">
                <button className="btn-outline db-btn-sm" onClick={() => bannerInputRef.current.click()}>✏️ Editar</button>
                <button className="btn-outline db-btn-sm btn-danger" onClick={() => { setBanner('/mock_banner.png'); setBannerFile(null); }}>🗑️ Eliminar</button>
              </div>
              <input ref={bannerInputRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleBannerChange}/>
              {bannerFile && <small style={{color:'#8cf08c',marginTop:'4px'}}>✅ Nuevo banner listo para guardar</small>}
            </div>
          </div>

          <div className="db-save-block">
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleSave} disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>

          {/* ── CAMBIAR CONTRASEÑA ── */}
          <div className="db-password-section">
            <h3 className="db-section-subtitle">🔑 Cambiar Contraseña</h3>
            <PasswordChangeForm 
              username={userName} 
              apiUrl={API_URL}
              onSuccess={() => {
                localStorage.removeItem('austral_auth_require_pass_change')
                // Opcional: mostrar confimación visual si se requiere
              }}
            />
          </div>
        </aside>

        {/* ── MAIN: INVENTARIO ──────────────────────────────── */}
        <main className="db-main">
          <div className="db-inventory-header">
            <div>
              <h2 className="db-section-title">📦 Tus Publicaciones</h2>
              <span className="db-inventory-count">{figuras.length} piezas en tu colección publicadas</span>
            </div>
            <button className="btn-primary db-add-btn" onClick={() => setShowUpload(true)}>
              <span className="db-add-icon">＋</span> Subir Nueva
            </button>
          </div>

          <div className="db-grid-4 cpm-reorderable-grid">
            {figuras.map((fig, index) => (
              <article 
                key={`${fig.id}-${fig.tipo}`} 
                className={`db-card card ${draggedIndex === index ? 'dragging' : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                style={{ cursor: 'grab' }}
              >
                <div className="db-card-img-wrap" style={{ pointerEvents: 'none' }}>
                  <img src={fig.imagen_url ? `${BASE_URL}/${fig.imagen_url}` : '/mock_fig1.png'} alt={fig.nombre} className="db-card-img" loading="lazy"/>
                  <span style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    {fig.tipo === 'figura' ? '🗿 Figura' : '🎭 Cosplay'}
                  </span>
                </div>
                <div className="db-card-body" style={{ pointerEvents: 'none' }}>
                  <h4 className="db-card-name" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fig.nombre}</h4>
                  <span className="db-card-year">{fig.anio || '-'}</span>
                  <div className="db-card-meta">
                    <span className="db-counter red-heart">❤ {fig.total_likes}</span>
                    <span className="db-counter gray-star">⭐ {fig.total_guardados}</span>
                  </div>
                </div>
                <div className="db-card-overlay">
                  <button className="db-action-btn edit" title="Editar" onClick={() => setEditingPost(fig)}>✏️</button>
                  <button className="db-action-btn delete" title="Eliminar" onClick={() => handleDelete(fig)}>🗑️</button>
                </div>
              </article>
            ))}

            <div className="db-card card db-card-empty" onClick={() => setShowUpload(true)} style={{cursor:'pointer'}}>
              <button className="db-empty-add-btn">
                <span className="db-empty-plus">＋</span>
                <span>Subir Nueva</span>
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Modal: Nueva publicación */}
      <CreatePostModal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onSuccess={loadData}
        currentUserId={userId}
      />

      {/* Modal: Editar publicación */}
      {editingPost && (
        <CreatePostModal
          isOpen={true}
          editingPost={editingPost}
          onClose={() => setEditingPost(null)}
          onSuccess={() => { setEditingPost(null); loadData(); }}
          currentUserId={userId}
        />
      )}
    </div>
  )
}
