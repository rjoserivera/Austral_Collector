import { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import './AdminPage.css'
import { BASE_URL } from '../config.js'

// URL base para la API
const API_URL = 'http://localhost/Austral%20Collector/api/admin'

const NAV = [
  { id: 'inicio',     icon: '📊', label: 'Inicio' },
  { id: 'usuarios',   icon: '👥', label: 'Gestión de Usuarios' },
  { id: 'videos',     icon: '🎬', label: 'Gestión de Videos' },
  { id: 'eventos',    icon: '📢', label: 'Noticias y Eventos' },
  { id: 'destacados', icon: '🏆', label: 'Contenido Destacado' },
  { id: 'actividad',  icon: '📋', label: 'Log de Actividad' },
  { id: 'moderacion', icon: '🛡️', label: 'Moderación de Contenido' },
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('inicio')
  const userRole = localStorage.getItem('austral_auth_role')
  const userNameRaw = localStorage.getItem('austral_auth_user');
  let userName = 'Administrador';
  try { if (userNameRaw) userName = JSON.parse(userNameRaw).username || userNameRaw; } catch(e) { userName = userNameRaw; }

  if (userRole !== 'admin') {
    return <Navigate to="/login" replace />
  }

  const current = NAV.find(n => n.id === activeTab)

  return (
    <div className="admin-page">
      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <span className="asl-icon">⚙️</span>
          <div>
            <span className="asl-title">Admin Panel</span>
            <span className="asl-sub">Austral Collector</span>
          </div>
        </div>

        <nav className="admin-nav">
          {NAV.map(item => (
            <button
              key={item.id}
              className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="ani-icon">{item.icon}</span>
              <span className="ani-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <img src="/logo_cabeza_sin_fondo.PNG" alt="Admin" className="asf-avatar" />
          <div>
            <strong className="asf-name">{userName}</strong>
            <span className="asf-role">🛡️ Admin</span>
          </div>
        </div>
      </aside>

      {/* ── Main Area ─────────────────────────────────────── */}
      <main className="admin-main">
        <header className="admin-main-header">
          <div>
            <h1 className="amh-title">{current?.icon} {current?.label}</h1>
            <span className="amh-sub">Panel de Control · Austral Collector</span>
          </div>
          <div className="admin-status">
            <span className="status-dot" /> Sistemas Operativos
          </div>
        </header>

        <div className="admin-main-body">
          {activeTab === 'inicio' && <AdminInicio />}
          {activeTab === 'usuarios' && <AdminUsuarios />}
          {activeTab === 'videos' && <AdminVideos />}
          {activeTab === 'eventos' && <AdminEventos />}
          {activeTab === 'destacados' && <AdminDestacados />}
          {activeTab === 'actividad' && <AdminActividad />}
          {activeTab === 'moderacion' && <AdminModeracion />}
        </div>
      </main>
    </div>
  )
}

// ── COMPONENTES REUSABLES ─────────────────────────────────
function Loading() {
  return <div style={{ padding: '20px', color: '#fff' }}>Cargando datos...</div>
}

function ErrorMsg({ msg }) {
  return <div style={{ padding: '20px', color: '#ff6b6b' }}>Error: {msg}</div>
}

// ── SECCIÓN: Inicio ────────────────────────────────────────
function AdminInicio() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`${API_URL}/get_stats.php`)
      .then(r => r.json())
      .then(d => {
        if(d.error) setError(d.error)
        else setData(d)
      })
      .catch(e => setError(e.message))
  }, [])

  if (error) return <ErrorMsg msg={error} />
  if (!data) return <Loading />

  const { stats, logs } = data

  const statCards = [
    { icon: '👥', label: 'Total Usuarios', value: stats.usuarios,  color: 'teal' },
    { icon: '🪪', label: 'Total Perfiles', value: stats.perfiles,  color: 'teal' },
    { icon: '🗿', label: 'Figuras',        value: stats.figuras,   color: 'rust' },
    { icon: '🎭', label: 'Cosplays',       value: stats.cosplays,  color: 'rust' },
    { icon: '🎬', label: 'Videos',         value: stats.videos,    color: 'gold' },
    { icon: '⭐', label: 'Destacado Actual', value: stats.destacado, color: 'gold' },
  ]

  return (
    <div className="admin-section">
      <div className="admin-stats-grid">
        {statCards.map((s, i) => (
          <div className={`asc-card asc-${s.color}`} key={i}>
            <span className="asc-icon">{s.icon}</span>
            <span className="asc-value">{s.value}</span>
            <span className="asc-label">{s.label}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '32px' }}>
        <h2 className="admin-sec-title">⏳ Actividad Reciente</h2>
        <div className="admin-log-preview">
          {logs.length === 0 ? <p style={{ color: '#aaa' }}>No hay actividad reciente.</p> : null}
          {logs.map((log) => (
            <div className="alp-row" key={log.id}>
              <span className="alp-time">{log.time}</span>
              <span className={`badge tipo-${log.tipo}`}>{log.tipo}</span>
              <strong className="alp-user">{log.user}</strong>
              <span className="alp-accion">{log.accion}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── SECCIÓN: Usuarios ────────────────────────────────────────
function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [keyResult, setKeyResult] = useState(null) // { username, temp_pass, email, mail_sent }
  
  // Form handling (Create / Edit)
  const [formMode, setFormMode] = useState(null) // null | 'create' | 'edit'
  const [editingId, setEditingId] = useState(null)
  
  const initialForm = {
    username: '', email: '', password: '', role: 'user',
    nombre: '', apellido: '', fecha_nacimiento: '', is_active: 1
  }
  const [formData, setFormData] = useState(initialForm)
  const [isSaving, setIsSaving] = useState(false)

  const loadData = () => {
    setLoading(true)
    fetch(`${API_URL}/usuarios.php`)
      .then(r => r.json())
      .then(d => setUsuarios(d.usuarios || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadData() }, [])

  const openForm = (mode, user = null) => {
    setFormMode(mode)
    if (mode === 'edit' && user) {
      setEditingId(user.id)
      setFormData({
        username: user.username,
        email: user.email,
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        fecha_nacimiento: user.fecha_nacimiento || '',
        role: user.role,
        is_active: user.is_active,
        password: '' // empty so we don't overwrite if not typed
      })
    } else {
      setEditingId(null)
      setFormData(initialForm)
    }
  }

  const generatePassword = () => {
    const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%&*";
    let pass = "";
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, password: pass }));
  }

  const copyToClipboard = () => {
    if (!formData.password) return;
    navigator.clipboard.writeText(formData.password)
      .then(() => alert('Contraseña copiada al portapapeles 📋'))
      .catch(err => console.error('Error al copiar:', err));
  }

  const submitForm = (e) => {
    e.preventDefault()
    if (!formData.username || !formData.email || (formMode === 'create' && !formData.password)) {
      alert('Usuario, email y contraseña (en creación) son obligatorios.')
      return
    }
    if (formMode === 'create' && formData.password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    
    setIsSaving(true)
    const payload = formMode === 'create' ? { ...formData } : { id: editingId, action: 'update_user', ...formData }
    const method = formMode === 'create' ? 'POST' : 'PUT'
    
    fetch(`${API_URL}/usuarios.php`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(r => r.json())
    .then(d => {
      if(d.success) {
        if(formMode === 'create') {
          // Si es creación, mostrar modal de éxito con la clave
          setKeyResult(d)
        } else {
          alert('Usuario actualizado correctamente.')
        }
        setFormMode(null)
        loadData()
      } else {
        alert(d.error)
      }
    })
    .finally(() => setIsSaving(false))
  }

  const updateFieldInline = (id, field, value) => {
    fetch(`${API_URL}/usuarios.php`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'update_field', field, value })
    })
    .then(r => r.json())
    .then(d => {
      if(d.success) loadData()
      else alert(d.error)
    })
  }
  
  const toggleStatus = (id, action) => {
    if(!window.confirm(`¿Seguro que deseas aplicar esta acción?`)) return
    fetch(`${API_URL}/usuarios.php`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action })
    })
    .then(r => r.json())
    .then(d => {
      if(d.success) loadData()
      else alert(d.error)
    })
  }

  const sendTempKey = (user) => {
    if (!window.confirm(`¿Generar y enviar clave temporal a ${user.email || 'sin email'}?`)) return
    fetch(`http://localhost/Austral%20Collector/api/auth/enviar_clave_temporal.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id })
    })
    .then(r => r.json())
    .then(d => {
      if (d.success) {
        setKeyResult(d)
      } else {
        alert('Error: ' + d.error)
      }
    })
    .catch(e => alert('Error de conexión: ' + e.message))
  }

  const filteredUsers = usuarios.filter(u => {
    const q = searchTerm.toLowerCase()
    return u.username.toLowerCase().includes(q) || 
           (u.nombre && u.nombre.toLowerCase().includes(q)) || 
           (u.apellido && u.apellido.toLowerCase().includes(q))
  })

  if (loading && usuarios.length === 0) return <Loading />

  return (
    <div className="admin-section">
      {/* Modal de clave generada */}
      {keyResult && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#0d2830', border: '1px solid var(--color-gold)', borderRadius: '12px', padding: '2rem', maxWidth: '440px', width: '90%', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{keyResult.mail_sent ? '📧' : '⚠️'}</div>
            <h3 style={{ color: '#ffd700', marginBottom: '0.5rem' }}>Clave Temporal Generada</h3>
            <p style={{ color: '#f0e4cc', marginBottom: '0.5rem' }}>Usuario: <strong>{keyResult.username}</strong></p>
            <p style={{ color: keyResult.mail_sent ? '#7fff99' : '#ffb5b5', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              {keyResult.mail_sent ? `✅ Correo enviado a: ${keyResult.email}` : `⚠️ El correo no pudo enviarse. Copia la clave manualmente.`}
            </p>
            <div style={{ background: 'rgba(0,0,0,0.5)', border: '1px dashed var(--color-gold)', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' }}>
              <p style={{ color: 'rgba(240,228,204,0.6)', fontSize: '0.8rem', margin: '0 0 6px' }}>Clave Temporal</p>
              <p style={{ color: '#ffd700', fontFamily: 'monospace', fontSize: '1.5rem', letterSpacing: '3px', margin: 0 }}>{keyResult.temp_pass}</p>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button className="btn-outline btn-sm" style={{ borderColor: 'var(--color-gold)', color: '#ffd700' }}
                onClick={() => { navigator.clipboard.writeText(keyResult.temp_pass); alert('Copiado al portapapeles 📋'); }}>
                📋 Copiar Clave
              </button>
              <button className="btn-primary btn-sm" onClick={() => setKeyResult(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-sec-header" style={{ marginBottom: formMode ? '0' : '0' }}>
        <h2 className="admin-sec-title">👥 Listado de Usuarios</h2>
        {!formMode && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              className="admin-input" 
              placeholder="Buscar por usuario o nombre..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ padding: '6px 12px', width: '220px' }}
            />
            <button className="btn-primary btn-sm" onClick={() => openForm('create')}>
              ➕ Crear Usuario
            </button>
          </div>
        )}
      </div>
      
      {formMode && (
        <div className="admin-form-card">
          <h3 className="admin-form-title">{formMode === 'create' ? 'Registrar Nuevo Usuario' : 'Editar Usuario'}</h3>
          <form onSubmit={submitForm}>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Nombre de Usuario *</label>
                <input type="text" className="admin-input" placeholder="Ej: CollectorMaster"
                  value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
              </div>
              <div className="admin-form-group">
                <label>Correo Electrónico *</label>
                <input type="email" className="admin-input" placeholder="Ej: collector@correo.com"
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Nombre real</label>
                <input type="text" className="admin-input" placeholder="Opcional"
                  value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} />
              </div>
              <div className="admin-form-group">
                <label>Apellido</label>
                <input type="text" className="admin-input" placeholder="Opcional"
                  value={formData.apellido} onChange={e => setFormData({...formData, apellido: e.target.value})} />
              </div>
            </div>
            
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>{formMode === 'create' ? 'Contraseña Provisional *' : 'Nueva Contraseña (vacío para no cambiar)'}</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="text" className="admin-input" placeholder="Mínimo 6 caracteres"
                    value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} 
                    style={{ flex: 1 }} />
                  <button type="button" className="btn-primary" onClick={generatePassword} title="Generar clave aleatoria" style={{ padding: '8px 12px' }}>
                    ✨
                  </button>
                  {formData.password && (
                    <button type="button" className="btn-outline" onClick={copyToClipboard} title="Copiar al portapapeles" style={{ padding: '8px 12px', borderColor: 'var(--color-gold)' }}>
                      📋
                    </button>
                  )}
                </div>
              </div>
              <div className="admin-form-group">
                <label>Fecha de Nacimiento</label>
                <input type="date" className="admin-input" 
                  value={formData.fecha_nacimiento} onChange={e => setFormData({...formData, fecha_nacimiento: e.target.value})} />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Rol del Sistema</label>
                <select className="admin-select" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                  <option value="user">Coleccionista (Estándar)</option>
                  <option value="admin">Administrador (Acceso Total)</option>
                </select>
              </div>
              {formMode === 'edit' && (
                <div className="admin-form-group">
                  <label>Estado de Cuenta</label>
                  <select className="admin-select" value={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.value})}>
                    <option value="1">Activa</option>
                    <option value="0">Baneada/Inactiva</option>
                  </select>
                </div>
              )}
            </div>
            
            <div className="admin-form-actions">
              <button type="button" className="btn-outline btn-sm" onClick={() => setFormMode(null)} disabled={isSaving} style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#fff' }}>
                Cancelar
              </button>
              <button type="submit" className="btn-primary btn-sm" disabled={isSaving}>
                {isSaving ? 'Guardando...' : '💾 Confirmar'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Registro</th>
            <th style={{ textAlign: 'center' }}>Acciones</th>
          </tr></thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u.id}>
                <td className="td-id">#{u.id}</td>
                <td>
                  <Link to={`/perfil/${u.id}`} className="admin-user-link" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <strong>{u.username}</strong>
                    {(u.nombre || u.apellido) && <div className="td-muted" style={{ fontSize: '0.7rem' }}>{u.nombre} {u.apellido}</div>}
                  </Link>
                </td>
                <td className="td-muted">{u.email}</td>
                <td>
                  <select 
                    className={`badge-select ${u.role === 'admin' ? 'bs-admin' : 'bs-user'}`}
                    value={u.role}
                    onChange={(e) => updateFieldInline(u.id, 'role', e.target.value)}
                  >
                    <option value="user">USER</option>
                    <option value="admin">ADMIN</option>
                  </select>
                </td>
                <td>
                  <select
                    className={`badge-select ${Number(u.is_active) ? 'bs-active' : 'bs-inactive'}`}
                    value={u.is_active}
                    onChange={(e) => updateFieldInline(u.id, 'is_active', e.target.value)}
                  >
                    <option value="1">ACTIVO</option>
                    <option value="0">BANEADO</option>
                  </select>
                </td>
                <td className="td-muted">{u.created_at.split(' ')[0]}</td>
                <td>
                  <div className="action-row centered">
                    <button className="act-btn act-gold" title="Editar Usuario" onClick={() => openForm('edit', u)}>
                      ✏️
                    </button>
                    <button 
                      className="act-btn" 
                      title="Enviar clave temporal por email"
                      style={{ background: 'rgba(45,110,126,0.3)', border: '1px solid rgba(45,110,126,0.6)' }}
                      onClick={() => sendTempKey(u)}
                    >
                      📧
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>No hay usuarios que coincidan con la búsqueda.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}


// ── SECCIÓN: Videos ────────────────────────────────────────
function AdminVideos() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  const loadData = () => {
    setLoading(true)
    fetch(`${API_URL}/videos.php`)
      .then(r => r.json())
      .then(d => setVideos(d.videos || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadData() }, [])

  const handleAdd = () => {
    const titulo = prompt('Título del video:')
    if (!titulo) return
    const link = prompt('Link de YouTube:')
    if (!link) return
    
    fetch(`${API_URL}/videos.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo, link })
    }).then(() => loadData())
  }

  const handleDelete = (id) => {
    if(!window.confirm(`¿Eliminar video?`)) return
    fetch(`${API_URL}/videos.php`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    }).then(() => loadData())
  }

  const toggleDest = (id) => {
    fetch(`${API_URL}/videos.php`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    }).then(() => loadData())
  }

  if (loading) return <Loading />

  return (
    <div className="admin-section">
      <div className="admin-sec-header">
        <h2 className="admin-sec-title">🎬 Gestión de Videos</h2>
        <button className="btn-primary btn-sm" onClick={handleAdd}>➕ Agregar Link</button>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr>
            <th>Título</th><th>Link YouTube</th><th>Destacado</th><th>Acciones</th>
          </tr></thead>
          <tbody>
            {videos.map(v => (
              <tr key={v.id}>
                <td><strong>{v.titulo}</strong></td>
                <td><a href={v.link} target="_blank" rel="noreferrer" className="link-yt">🔗 Ver video</a></td>
                <td>
                  <button className={`act-btn ${parseInt(v.destacado)===1 ? 'act-gold' : ''}`} onClick={() => toggleDest(v.id)}>
                    {parseInt(v.destacado)===1 ? '⭐' : '☆'}
                  </button>
                </td>
                <td>
                  <div className="action-row">
                    <button className="act-btn act-red" onClick={() => handleDelete(v.id)} title="Eliminar">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
            {videos.length === 0 && <tr><td colSpan="4" style={{textAlign:'center', padding:'20px'}}>No hay videos.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── SECCIÓN: Eventos ──────────────────────────────────────
function AdminEventos() {
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Form state
  const [id, setId] = useState(null)
  const [titulo, setTitulo] = useState('')
  const [fecha_display, setFechaDisplay] = useState('')
  const [imagen, setImagen] = useState(null)
  const [preview, setPreview] = useState(null)

  const loadData = () => {
    setLoading(true)
    fetch(`${API_URL}/eventos.php`)
      .then(r => r.json())
      .then(d => { if(d.success) setEventos(d.eventos || []) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadData() }, [])

  const resetForm = () => {
    setId(null); setTitulo(''); setFechaDisplay(''); setImagen(null); setPreview(null);
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSaving(true)
    const fd = new FormData()
    if (id) fd.append('id', id)
    fd.append('titulo', titulo)
    fd.append('fecha_display', fecha_display)
    if (imagen) fd.append('imagen', imagen)

    fetch(`${API_URL}/eventos.php`, {
      method: 'POST',
      body: fd
    })
    .then(r => r.json())
    .then(d => {
      if(d.success) {
        resetForm()
        loadData()
      } else {
        alert(d.error)
      }
    })
    .catch(error => alert("Error al guardar: " + error.message))
    .finally(() => setSaving(false))
  }

  const handleDelete = (evtId) => {
    if(!window.confirm('¿Eliminar esta noticia/evento?')) return
    fetch(`${API_URL}/eventos.php`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: evtId })
    })
    .then(r => r.json())
    .then(d => {
      if(d.success) loadData()
      else alert(d.error)
    })
    .catch(error => alert("Error al eliminar: " + error.message))
  }

  const handleEdit = (ev) => {
    setId(ev.id);
    setTitulo(ev.titulo);
    setFechaDisplay(ev.fecha_display || '');
    setPreview(ev.imagen_url ? `${BASE_URL}/${ev.imagen_url}` : null);
    // Scroll to form
    const formEl = document.querySelector('.admin-form-card');
    if(formEl) formEl.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="admin-section">
      <div className="admin-sec-header">
        <h2 className="admin-sec-title">📢 Gestión de Noticias y Eventos</h2>
      </div>

      <div className="admin-form-card">
        <h3 className="admin-form-title">{id ? '✏️ Editar Noticia' : '🆕 Nueva Noticia / Evento'}</h3>
        <form onSubmit={handleSubmit} id="event-form">
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Título / Nombre de la Noticia *</label>
              <input 
                type="text" 
                className="admin-input" 
                value={titulo} 
                onChange={e => setTitulo(e.target.value)} 
                required 
                placeholder="Ej: ComicCon 2026 / Lanzamiento..." 
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Fecha / Texto Informativo *</label>
              <input 
                type="text" 
                className="admin-input" 
                value={fecha_display} 
                onChange={e => setFechaDisplay(e.target.value)}
                placeholder="Ej: Sábado 15 de Mayo / 3 al 5 de Julio..."
                required
              />
            </div>
          </div>

          <div className="admin-form-group" style={{ marginTop: '10px' }}>
            <label>Imagen / Foto representativa</label>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
               <input 
                 type="file" 
                 accept="image/*"
                 onChange={e => {
                   const file = e.target.files[0];
                   setImagen(file);
                   if(file) setPreview(URL.createObjectURL(file));
                 }} 
               />
               {preview && (
                 <div style={{ position: 'relative' }}>
                   <img 
                     src={preview} 
                     alt="Preview" 
                     style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '6px', border: '2px solid var(--color-gold)' }} 
                   />
                   <button 
                     type="button" 
                     onClick={() => { setImagen(null); setPreview(null); }}
                     style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#d9534f', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px' }}
                   >
                     &times;
                   </button>
                 </div>
               )}
            </div>
          </div>

          <div className="admin-form-actions">
            {id && (
              <button type="button" className="btn-outline" style={{ borderColor: '#aaa', color: '#aaa' }} onClick={resetForm}>
                Cancelar Edición
              </button>
            )}
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Guardando...' : id ? '💾 Actualizar Noticia' : '🚀 Publicar Noticia'}
            </button>
          </div>
        </form>
      </div>

      <h3 className="admin-sub-title" style={{ marginTop: '30px', color: '#1a3d4a' }}>Noticias Publicadas Actuales</h3>
      
      {loading ? <Loading /> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Miniatura</th>
                <th>Evento / Noticia</th>
                <th>Día / Descripción</th>
                <th style={{ textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {eventos.map(ev => (
                <tr key={ev.id}>
                  <td>
                    <img 
                      src={ev.imagen_url ? `${BASE_URL}/${ev.imagen_url}` : '/mock_event1.png'} 
                      alt="Mini" 
                      style={{ width: '60px', height: '45px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)' }} 
                    />
                  </td>
                  <td>
                    <div style={{ fontWeight: '700', color: '#1a3d4a' }}>{ev.titulo}</div>
                  </td>
                  <td>
                    <span className="td-muted">{ev.fecha_display || 'Sin texto'}</span>
                  </td>
                  <td>
                    <div className="action-row centered">
                      <button className="act-btn act-gold" title="Editar" onClick={() => handleEdit(ev)}>✏️</button>
                      <button className="act-btn act-red" title="Eliminar" onClick={() => handleDelete(ev.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
              {eventos.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    No hay noticias o eventos publicados. Utiliza el formulario de arriba para añadir uno.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ── SECCIÓN: Destacados ────────────────────────────────────
function AdminDestacados() {
  const [data, setData]         = useState(null)
  const [error, setError]       = useState(null)
  const [saving, setSaving]     = useState(false)
  // ← All hooks at top level, before any conditional return
  const [miembroId, setMiembroId] = useState('')
  const [searchUser, setSearchUser] = useState('')
  const [noticiasTexto, setNoticiasTexto] = useState('')
  const [videoId1, setVideoId1] = useState('')
  const [videoId2, setVideoId2] = useState('')
  const [videoId3, setVideoId3] = useState('')
  const [videoId4, setVideoId4] = useState('')

  useEffect(() => {
    fetch(`${API_URL}/destacados.php`)
      .then(r => r.json())
      .then(d => {
        if (d.error) { setError(d.error); return; }
        setData(d)
        // Initialise selects once data arrives
        setMiembroId(d.config?.miembro_destacado || '')
        setNoticiasTexto(d.config?.noticias_texto || '')
        setVideoId1(d.config?.video_destacado_1 || '')
        setVideoId2(d.config?.video_destacado_2 || '')
        setVideoId3(d.config?.video_destacado_3 || '')
        setVideoId4(d.config?.video_destacado_4 || '')
      })
      .catch(e => setError(e.message))
  }, [])

  const handleSave = (clave, valor) => {
    setSaving(true)
    fetch(`${API_URL}/destacados.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clave, valor })
    })
      .then(r => r.json())
      .then(d => {
        if (d.success) alert('✅ Guardado correctamente.')
        else alert('❌ Error al guardar.')
      })
      .catch(e => alert('❌ ' + e.message))
      .finally(() => setSaving(false))
  }

  if (error) return <ErrorMsg msg={error} />
  if (!data)  return <Loading />

  const { listas } = data

  return (
    <div className="admin-section">
      <h2 className="admin-sec-title">🏆 Destacados de la Home</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* --- MIEMBRO DESTACADO --- */}
        <div className="dest-card">
          <h3 className="dest-card-title">⭐ Miembro Destacado del Mes</h3>
          <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '16px' }}>
            Selecciona el usuario que aparecerá como miembro destacado en la página principal.
          </p>
          
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
            <input 
              type="text" 
              placeholder="Buscar usuario..." 
              className="admin-input" 
              style={{ width: '200px', padding: '8px 12px' }}
              value={searchUser}
              onChange={e => setSearchUser(e.target.value)}
            />
          </div>

          <select className="admin-select" value={miembroId} onChange={e => setMiembroId(e.target.value)} style={{ width: '100%', maxWidth: '400px' }}>
            <option value="">– Sin destacado –</option>
            {(listas?.usuarios || [])
              .filter(u => u.nombre.toLowerCase().includes(searchUser.toLowerCase()))
              .map(u => (
                <option key={u.id} value={u.id}>{u.nombre}</option>
            ))}
          </select>
          
          <div style={{ marginTop: '16px' }}>
            <button
              className="btn-primary"
              disabled={saving}
              onClick={() => handleSave('miembro_destacado', miembroId)}
            >
              {saving ? 'Guardando...' : 'Guardar Miembro'}
            </button>
          </div>
        </div>

        {/* --- VIDEOS PRINCIPALES --- */}
        <div className="dest-card">
          <h3 className="dest-card-title">🎬 Videos Principales</h3>
          <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '16px' }}>
            Selecciona hasta 4 videos que se mostrarán en formato de carrusel en la portada principal.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {[
              { label: 'Video Slot 1', state: videoId1, setter: setVideoId1, key: 'video_destacado_1' },
              { label: 'Video Slot 2', state: videoId2, setter: setVideoId2, key: 'video_destacado_2' },
              { label: 'Video Slot 3', state: videoId3, setter: setVideoId3, key: 'video_destacado_3' },
              { label: 'Video Slot 4', state: videoId4, setter: setVideoId4, key: 'video_destacado_4' }
            ].map((slot, idx) => (
              <div key={idx} style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h4 style={{ color: '#ddd', marginBottom: '8px', fontSize: '0.9rem' }}>{slot.label}</h4>
                <select className="admin-select" value={slot.state} onChange={e => slot.setter(e.target.value)} style={{ width: '100%', marginBottom: '12px' }}>
                  <option value="">– Sin video –</option>
                  {(listas?.videos || []).map(v => (
                    <option key={v.id} value={v.id}>{v.nombre}</option>
                  ))}
                </select>
                <button
                  className="btn-outline btn-sm"
                  disabled={saving}
                  onClick={() => handleSave(slot.key, slot.state)}
                  style={{ width: '100%' }}
                >
                  Guardar Slot {idx + 1}
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

// ── SECCIÓN: Actividad ─────────────────────────────────────
function AdminActividad() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [fUsuario, setFUsuario] = useState('')
  const [fTipo, setFTipo] = useState('')
  const [fFechaDesde, setFFechaDesde] = useState('')
  const [fFechaHasta, setFFechaHasta] = useState('')

  const loadData = () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (fUsuario) params.append('usuario', fUsuario)
    if (fTipo) params.append('tipo', fTipo)
    if (fFechaDesde) params.append('fecha_desde', fFechaDesde)
    if (fFechaHasta) params.append('fecha_hasta', fFechaHasta)

    fetch(`${API_URL}/get_activity_log.php?${params.toString()}`)
      .then(r => r.json())
      .then(d => setLogs(d.logs || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <div className="admin-section">
      <div className="admin-sec-header" style={{ display: 'block', marginBottom: '24px' }}>
        <h2 className="admin-sec-title">📋 Log Completo de Actividad</h2>
        
        {/* Barra de Filtros */}
        <div style={{ 
          display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap', 
          background: 'rgba(0,0,0,0.2)', padding: '12px 16px', borderRadius: '8px', marginTop: '16px',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', color: '#111', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Usuario</label>
            <input 
              type="text" 
              placeholder="Ej: CollectorMaster" 
              className="admin-input" 
              style={{ width: '180px', padding: '8px 12px' }}
              value={fUsuario}
              onChange={e => setFUsuario(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', color: '#111', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Tipo</label>
            <select 
              className="admin-select"
              style={{ width: '150px', padding: '8px 12px', height: '37px', fontSize: '0.9rem' }}
              value={fTipo}
              onChange={e => setFTipo(e.target.value)}
            >
              <option value="">⚪ Todos</option>
              <option value="login">🟢 Login</option>
              <option value="alerta">🔴 Alerta</option>
              <option value="figura">🗿 Figura</option>
              <option value="cosplay">🎭 Cosplay</option>
              <option value="admin">🛡️ Admin</option>
              <option value="usuario">👤 Usuario</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', color: '#111', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Desde (Fecha)</label>
            <input 
              type="date" 
              className="admin-input" 
              style={{ padding: '8px 12px', height: '37px' }}
              value={fFechaDesde}
              onChange={e => setFFechaDesde(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', color: '#111', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Hasta (Fecha)</label>
            <input 
              type="date" 
              className="admin-input" 
              style={{ padding: '8px 12px', height: '37px' }}
              value={fFechaHasta}
              onChange={e => setFFechaHasta(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '100%', alignSelf: 'flex-end', paddingBottom: '2px' }}>
            <button className="btn-primary" onClick={loadData} style={{ padding: '8px 16px', height: '37px' }}>Filtrar</button>
            <button className="btn-outline" onClick={() => { setFUsuario(''); setFTipo(''); setFFechaDesde(''); setFFechaHasta(''); setTimeout(loadData, 50) }} style={{ padding: '8px 16px', height: '37px' }}>Limpiar</button>
          </div>
        </div>
      </div>

      
      {loading ? <Loading /> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Fecha y Hora</th><th>Acción</th><th>Usuario Responsable</th><th>Tipo</th></tr></thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id}>
                  <td style={{ color: 'var(--color-cream)', fontSize: '0.90rem' }}>{log.time}</td>
                  <td>{log.accion}</td>
                  <td>
                    {log.user_id ? (
                      <Link to={`/perfil/${log.user_id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        <strong>{log.user}</strong>
                      </Link>
                    ) : (
                      <strong>{log.user}</strong>
                    )}
                  </td>
                  <td>
                    <span 
                      className="badge"
                      style={{
                        padding: '4px 8px',
                        fontWeight: 'bold',
                        borderRadius: '12px',
                        display: 'inline-block',
                        background: log.tipo === 'login' ? '#2e7d32' : 
                                    log.tipo === 'alerta' ? '#d32f2f' : 
                                    log.tipo === 'figura' ? '#7b1fa2' : 
                                    log.tipo === 'cosplay' ? '#00838f' : 
                                    log.tipo === 'admin' ? '#f57c00' : 
                                    '#4a6b7c', // Steel blue for 'usuario' and others
                        color: '#ffffff',
                        border: 'none',
                        textTransform: 'uppercase',
                        fontSize: '0.75rem',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {log.tipo}
                    </span>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>No hay registros para estos filtros.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ── SECCIÓN: Moderación ─────────────────────────────────────
function AdminModeracion() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTipo, setFilterTipo] = useState('all') // all | figura | cosplay
  
  // Modal de eliminación con advertencia
  const [postToRemove, setPostToRemove] = useState(null) // { id, tipo, nombre }
  const [deleteReason, setDeleteReason] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const loadData = () => {
    setLoading(true)
    fetch(`${API_URL}/publicaciones.php`)
      .then(r => r.json())
      .then(d => setPosts(d.data || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadData() }, [])

  const handleDelete = (e) => {
    e.preventDefault()
    if (!postToRemove || !deleteReason) return
    
    setIsDeleting(true)
    fetch(`${API_URL}/publicaciones.php`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: postToRemove.id,
        tipo: postToRemove.tipo,
        motivo: deleteReason
      })
    })
    .then(r => r.json())
    .then(d => {
      if (d.success) {
        alert('Publicación eliminada correctamente. Correo de advertencia enviado.')
        setPostToRemove(null)
        setDeleteReason('')
        loadData()
      } else {
        alert('Error: ' + d.error)
      }
    })
    .catch(e => alert(e.message))
    .finally(() => setIsDeleting(false))
  }

  const filteredPosts = posts.filter(p => {
    const q = searchTerm.toLowerCase()
    const matchesSearch = p.nombre.toLowerCase().includes(q) || p.autor.toLowerCase().includes(q)
    const matchesTipo = filterTipo === 'all' || p.tipo === filterTipo
    return matchesSearch && matchesTipo
  })

  if (loading && posts.length === 0) return <Loading />

  return (
    <div className="admin-section">
      {/* Modal de eliminación con motivo */}
      {postToRemove && (
        <div 
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setPostToRemove(null)}
        >
          <div 
            style={{ background: '#121212', border: '1px solid #d9534f', borderRadius: '12px', padding: '2rem', maxWidth: '440px', width: '90%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ color: '#d9534f', marginBottom: '1rem' }}>⚠️ Eliminar Publicación</h3>
            <p style={{ color: '#fff', marginBottom: '0.5rem' }}>Estás por eliminar: <strong>{postToRemove.nombre}</strong></p>
            <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Escribe el motivo de la eliminación. Este mensaje se le enviará por correo electrónico al autor para advertirle.
            </p>
            
            <form onSubmit={handleDelete}>
              <textarea
                className="admin-input"
                style={{ width: '100%', minHeight: '100px', background: '#000', marginBottom: '1.5rem' }}
                placeholder="Ej: La imagen subida no cumple con nuestras normas de comunidad / Contenido inapropiado..."
                value={deleteReason}
                onChange={e => setDeleteReason(e.target.value)}
                required
              ></textarea>
              
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-outline btn-sm" onClick={() => setPostToRemove(null)} disabled={isDeleting}>Cancelar</button>
                <button type="submit" className="btn-primary btn-sm" style={{ background: '#d9534f' }} disabled={isDeleting}>
                  {isDeleting ? 'Eliminando...' : 'Eliminar y Enviar Aviso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-sec-header">
        <h2 className="admin-sec-title">🛡️ Moderación de Publicaciones</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select className="admin-select" style={{ width: 'auto' }} value={filterTipo} onChange={e => setFilterTipo(e.target.value)}>
            <option value="all">Todos los tipos</option>
            <option value="figura">Sólo Figuras</option>
            <option value="cosplay">Sólo Cosplays</option>
          </select>
          <input 
            type="text" 
            className="admin-input" 
            placeholder="Buscar por nombre o autor..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '220px' }}
          />
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr>
            <th>Vista</th>
            <th>Nombre / Título</th>
            <th>Tipo</th>
            <th>Autor</th>
            <th>Fecha</th>
            <th style={{ textAlign: 'center' }}>Acciones</th>
          </tr></thead>
          <tbody>
            {filteredPosts.map(p => (
              <tr key={`${p.tipo}-${p.id}`}>
                <td>
                  <img 
                    src={`${API_URL}/../${p.imagen_url}`} 
                    alt="Mini" 
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </td>
                <td>
                  <strong>{p.nombre}</strong>
                </td>
                <td>
                  <span className={`badge tipo-${p.tipo}`}>{p.tipo.toUpperCase()}</span>
                </td>
                <td>
                  <span className="td-muted">{p.autor}</span>
                </td>
                <td className="td-muted">{p.created_at.split(' ')[0]}</td>
                <td>
                  <div className="action-row centered">
                    <button className="act-btn act-red" title="Eliminar Publicación" onClick={() => setPostToRemove(p)}>
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredPosts.length === 0 && (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#666' }}>No hay publicaciones para moderar.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
