import { useState, useEffect, useRef } from 'react'
import { toast, confirmDialog } from '../contexts/NotificationContext.jsx'
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
  const [activeTab, setActiveTab] = useState('figura')
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 12
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

  const loadData = async () => {
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
          toast.success('Perfil actualizado correctamente.')
          setAvatarFile(null)
          setBannerFile(null)
          if (d.avatar_url) setAvatar(`${BASE_URL}/${d.avatar_url}`)
          if (d.banner_url) setBanner(`${BASE_URL}/${d.banner_url}`)
        } else {
          toast.error('Error: ' + (d.error || 'No se pudo guardar.'))
        }
      })
      .catch(e => toast.error('Error: ' + e.message))
      .finally(() => setSaving(false))
  }

  const handleDelete = async (fig) => {
    if (!await confirmDialog(`¿Eliminar "${fig.nombre}"? Esta acción no se puede deshacer.`)) return
    fetch(`${API_URL}/auth/eliminar_post.php`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: fig.id, tipo: fig.tipo || 'figura' })
    })
      .then(r => r.json())
      .then(d => {
        if (d.success) loadData()
        else toast.error('Error: ' + (d.error || 'No se pudo eliminar.'))
      })
      .catch(e => toast.error('Error: ' + e.message))
  }

  // --- Drag & Drop variables para reordenar la colección ---
  const [draggedIndex, setDraggedIndex] = useState(null)

  const handleDragStart = (e, index) => {
    const actualIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
    setDraggedIndex(actualIndex)
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
    const actualIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
    if (draggedIndex === null || draggedIndex === actualIndex) return

    setFiguras(prev => {
      const currentFilteredList = prev.filter(f => (f.tipo || 'figura') === activeTab);
      const draggedItem = currentFilteredList[draggedIndex];

      const newFilteredList = [...currentFilteredList];
      newFilteredList.splice(draggedIndex, 1);
      newFilteredList.splice(actualIndex, 0, draggedItem);

      let filteredCounter = 0;
      return prev.map(f => {
        if ((f.tipo || 'figura') === activeTab) {
          return newFilteredList[filteredCounter++];
        }
        return f;
      });
    })
    setDraggedIndex(actualIndex)
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

  const handleManualReorder = (currentIndexOnPage, newPositionStr) => {
    const currentFilteredList = figuras.filter(f => (f.tipo || 'figura') === activeTab);
    const actualCurrentIndex = (currentPage - 1) * ITEMS_PER_PAGE + currentIndexOnPage;

    let newPos = parseInt(newPositionStr, 10);
    if (isNaN(newPos) || newPos < 1) newPos = 1;
    if (newPos > currentFilteredList.length) newPos = currentFilteredList.length;

    const actualNewIndex = newPos - 1;
    if (actualCurrentIndex === actualNewIndex) return;

    const newFilteredList = [...currentFilteredList];
    const itemToMove = newFilteredList.splice(actualCurrentIndex, 1)[0];
    newFilteredList.splice(actualNewIndex, 0, itemToMove);

    let filteredCounter = 0;
    const newList = figuras.map(f => {
      if ((f.tipo || 'figura') === activeTab) {
        return newFilteredList[filteredCounter++];
      }
      return f;
    });

    setFiguras(newList);

    const ordenData = newList.map((fig) => ({ id: fig.id, tipo: fig.tipo }));
    fetch(`${API_URL}/auth/reordenar_posts.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orden: ordenData })
    }).catch(e => console.error("Error guardando reorden manual: ", e));
  }

  const handleTogglePin = (fig) => {
    const isPinned = fig.is_pinned == 1;
    const newStatus = isPinned ? 0 : 1;
    fetch(`${API_URL}/auth/toggle_pin.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ post_id: fig.id, is_pinned: newStatus })
    }).then(r => r.json()).then(d => {
      if(d.success) loadData();
      else toast.error('Error al fijar publicación.');
    }).catch(e => console.error(e));
  };

  const currentFilteredFiguras = figuras.filter(f => (f.tipo || 'figura') === activeTab);
  const totalPages = Math.ceil(currentFilteredFiguras.length / ITEMS_PER_PAGE);
  const currentItems = currentFilteredFiguras.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="dashboard-page section-wrapper">

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="db-title">Bienvenido, {userName}</h1>
          <p className="db-subtitle">Administra tu perfil público y tu inventario de figuras.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link to={`/perfil/${userName}`} className="btn-primary" style={{ background: 'var(--color-gold)', color: '#1e4d5a', padding: '12px 24px', fontWeight: 'bold' }}>
            🔙 Volver al Perfil
          </Link>
          {userRole === 'admin' && (
            <Link to="/admin" className="btn-primary" style={{ background: '#1e4d5a', color: '#fff', padding: '12px 24px' }}>
              ⚙️ Panel Admin
            </Link>
          )}
        </div>
      </div>
      <div className="gold-divider" style={{ margin: '16px 0 32px' }} />

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
            <span style={{ fontSize: '0.75rem', color: '#aaa', display: 'block', marginBottom: '8px' }}>Te recomendamos que ocupes una imagen de estas dimensiones: 400x400 px (1:1).</span>
            <div className="db-media-preview">
              <img src={avatar} alt="Mi Avatar" className="db-avatar-img" />
              <div className="db-media-actions">
                <button className="btn-outline db-btn-sm" onClick={() => avatarInputRef.current.click()}>✏️ Editar</button>
                <button className="btn-outline db-btn-sm btn-danger" onClick={() => { setAvatar('/mock_avatar.png'); setAvatarFile(null); }}>🗑️ Eliminar</button>
              </div>
              <input ref={avatarInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
              {avatarFile && <small style={{ color: '#8cf08c', marginTop: '4px' }}>✅ Nueva foto lista para guardar</small>}
            </div>
          </div>

          <div className="db-field">
            <label className="db-label">Fondo de Cabecera (Banner)</label>
            <span style={{ fontSize: '0.75rem', color: '#aaa', display: 'block', marginBottom: '8px' }}>Te recomendamos que ocupes una imagen de estas dimensiones: 1200x400 px (horizontal 3:1).</span>
            <div className="db-media-preview">
              <div className="db-banner-img-wrap">
                <img src={banner} alt="Fondo Cabecera" className="db-banner-img" />
              </div>
              <div className="db-media-actions">
                <button className="btn-outline db-btn-sm" onClick={() => bannerInputRef.current.click()}>✏️ Editar</button>
                <button className="btn-outline db-btn-sm btn-danger" onClick={() => { setBanner('/mock_banner.png'); setBannerFile(null); }}>🗑️ Eliminar</button>
              </div>
              <input ref={bannerInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleBannerChange} />
              {bannerFile && <small style={{ color: '#8cf08c', marginTop: '4px' }}>✅ Nuevo banner listo para guardar</small>}
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
          <div className="db-inventory-header" style={{ marginBottom: '16px' }}>
            <div>
              <h2 className="db-section-title">📦 Tus Publicaciones</h2>
              <span className="db-inventory-count">{figuras.length} piezas en total</span>
            </div>
            <button className="btn-primary db-add-btn" onClick={() => setShowUpload(true)}>
              <span className="db-add-icon">＋</span> Subir Nueva
            </button>
          </div>

          <div className="db-tabs-container" style={{ marginBottom: '24px', borderBottom: '1px solid rgba(201,168,76,0.2)' }}>
            <button
              className={`db-tab-btn ${activeTab === 'figura' ? 'active' : ''}`}
              onClick={() => { setActiveTab('figura'); setCurrentPage(1); }}
            >
              Figuras ({figuras.filter(f => (f.tipo || 'figura') === 'figura').length})
            </button>
            <button
              className={`db-tab-btn ${activeTab === 'cosplay' ? 'active' : ''}`}
              onClick={() => { setActiveTab('cosplay'); setCurrentPage(1); }}
            >
              Cosplays ({figuras.filter(f => f.tipo === 'cosplay').length})
            </button>
          </div>

          <div className="db-grid-4 cpm-reorderable-grid">
            {currentItems.map((fig, index) => (
              <article
                key={`${fig.id}-${fig.tipo}`}
                className={`db-card card ${draggedIndex === ((currentPage - 1) * ITEMS_PER_PAGE + index) ? 'dragging' : ''} ${fig.is_pinned == 1 ? 'pinned-card' : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                style={{ cursor: 'grab' }}
              >
                <div className="db-card-img-wrap" style={{ pointerEvents: 'none' }}>
                  <img src={fig.imagen_url ? `${BASE_URL}/${fig.imagen_url}` : '/mock_fig1.png'} alt={fig.nombre} className="db-card-img" loading="lazy" />
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
                  <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(0,0,0,0.85)', padding: '6px', borderRadius: '6px', border: '1px solid var(--color-gold)', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'default' }} onClick={e => e.stopPropagation()} onDragStart={e => e.preventDefault()}>
                    <span style={{ fontSize: '0.75rem', color: '#dfc08a', fontWeight: 'bold' }}>Nº</span>
                    <input
                      key={`pos-${fig.id}-${(currentPage - 1) * ITEMS_PER_PAGE + index}`}
                      type="number"
                      min="1"
                      max={currentFilteredFiguras.length}
                      defaultValue={((currentPage - 1) * ITEMS_PER_PAGE + index) + 1}
                      onBlur={(e) => handleManualReorder(index, e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
                      style={{ width: '42px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', textAlign: 'center', fontSize: '0.9rem', fontWeight: 'bold', padding: '2px' }}
                      title="Escribe la posición y presiona Enter"
                    />
                  </div>
                  <button className="db-action-btn pin-btn" title={fig.is_pinned == 1 ? "Desfijar" : "Fijar en esta posición"} onClick={() => handleTogglePin(fig)} style={{ background: fig.is_pinned == 1 ? '#dfc08a' : '', color: fig.is_pinned == 1 ? '#000' : '', fontSize: '1.2rem' }}>{fig.is_pinned == 1 ? '📌' : '📍'}</button>
                  <button className="db-action-btn edit" title="Editar" onClick={() => setEditingPost(fig)}>✏️</button>
                  <button className="db-action-btn delete" title="Eliminar" onClick={() => handleDelete(fig)}>🗑️</button>
                </div>
              </article>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="db-pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => { setCurrentPage(prev => prev - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="db-pagination-btn"
              >
                Anterior
              </button>
              <div className="db-pagination-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                  <button
                    key={pageNum}
                    className={`db-pagination-num ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => { setCurrentPage(pageNum); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
              <button
                disabled={currentPage === totalPages}
                onClick={() => { setCurrentPage(prev => prev + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="db-pagination-btn"
              >
                Siguiente
              </button>
            </div>
          )}
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
