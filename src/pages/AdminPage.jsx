import { useState, useEffect } from 'react'
import { toast, confirmDialog } from '../contexts/NotificationContext.jsx'
import { Link, Navigate } from 'react-router-dom'
import './AdminPage.css'
import { BASE_URL, authFetch } from '../config.js'
import PostModal from '../components/PostModal'

// URL base para la API (a través del proxy de Vite)
const API_URL = '/api/admin'

const getLogConfig = (tipo) => {
  const t = (tipo || '').toLowerCase();
  const config = {
    'login':   { label: 'LOGIN',   icon: '🟢', class: 'tipo-login' },
    'auth':    { label: 'LOGIN',   icon: '🟢', class: 'tipo-login' },
    'alerta':  { label: 'ALERTA',  icon: '🔴', class: 'tipo-alerta' },
    'event':   { label: 'ALERTA',  icon: '🔴', class: 'tipo-alerta' },
    'figura':  { label: 'FIGURA',  icon: '🗿', class: 'tipo-figura' },
    'cosplay': { label: 'COSPLAY', icon: '🎭', class: 'tipo-cosplay' },
    'admin':   { label: 'ADMIN',   icon: '🛡️', class: 'tipo-admin' },
    'usuario': { label: 'USUARIO', icon: '👤', class: 'tipo-usuario' },
    'identidad':{ label: 'IDENTIDAD', icon: '⭐', class: 'tipo-identidad' },
  };
  return config[t] || { label: t.toUpperCase(), icon: '⚪', class: '' };
};

const NAV = [
  { id: 'inicio',     icon: '📊', label: 'Inicio' },
  { id: 'usuarios',   icon: '👥', label: 'Gestión de Usuarios' },
  { id: 'moderacion', icon: '⚖️', label: 'Moderación de Contenido' },
  { id: 'videos',     icon: '🎬', label: 'Gestión de Videos' },
  { id: 'destacados', icon: '🏆', label: 'Contenido Destacado' },
  { id: 'eventos',    icon: '📢', label: 'Noticias y Eventos' },
  { id: 'identidad',  icon: '⭐', label: 'Identidad y Nosotros' },
  { id: 'hp_promos',  icon: '🌟', label: 'Promociones Home' },
  { id: 'mascota',    icon: '🤖', label: 'Asistente Virtual' },
  { id: 'actividad',  icon: '📋', label: 'Log de Actividad' },
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('inicio')
  const userRole = localStorage.getItem('austral_auth_role')
  const userNameRaw = localStorage.getItem('austral_auth_user');
  let adminId = null;
  let userName = 'Administrador';
  let adminAvatar = null;
  try { 
    if (userNameRaw) {
      const uObj = JSON.parse(userNameRaw);
      userName = uObj.username || userNameRaw;
      adminId = uObj.id;
      adminAvatar = uObj.avatar_url || null;
    }
  } catch(e) { userName = userNameRaw; }

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
          <img
            src={adminAvatar ? `${BASE_URL}/${adminAvatar}` : '/logo_sin_fondo.png'}
            alt={userName}
            className="asf-avatar"
            onError={e => { e.currentTarget.src = '/logo_sin_fondo.png' }}
          />
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
          {activeTab === 'inicio'     && <AdminInicio />}
          {activeTab === 'usuarios'   && <AdminUsuarios adminId={adminId} />}
          {activeTab === 'videos'     && <AdminVideos adminId={adminId} />}
          {activeTab === 'eventos'    && <AdminEventos adminId={adminId} />}
          {activeTab === 'destacados' && <AdminDestacados adminId={adminId} />}
          {activeTab === 'identidad'  && <AdminIdentidad adminId={adminId} />}
          {activeTab === 'actividad'  && <AdminActividad adminId={adminId} />}
          {activeTab === 'moderacion' && <AdminModeracion adminId={adminId} />}
          {activeTab === 'hp_promos'  && <AdminPromos adminId={adminId} />}
          {activeTab === 'mascota'    && <AdminMascota adminId={adminId} />}
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
    authFetch(`${API_URL}/get_stats.php`)
      .then(r => r.json())
      .then(d => {
        if(d.error) setError(d.error)
        else setData(d)
      })
      .catch(e => setError(e.message))
  }, [])

  if (error) return <ErrorMsg msg={error} />
  if (!data) return <Loading />

  const { stats, logs, birthdays, newest_user } = data

  const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
  const currentMonth = monthNames[new Date().getMonth()]

  const statCards = [
    { icon: '👥', label: 'Usuarios',     value: stats.usuarios,    color: 'teal' },
    { icon: '🪪', label: 'Perfiles',     value: stats.perfiles,    color: 'teal' },
    { icon: '🗿', label: 'Figuras',      value: stats.figuras,     color: 'rust' },
    { icon: '🎭', label: 'Cosplays',     value: stats.cosplays,    color: 'rust' },
    { icon: '🎬', label: 'Videos',       value: stats.videos,      color: 'gold' },
    { icon: '📝', label: 'Publicaciones',value: stats.total_posts,  color: 'gold' },
    { icon: '❤️', label: 'Total Likes',  value: stats.total_likes,  color: 'teal' },
    { icon: '📢', label: 'Noticias',     value: stats.eventos,      color: 'rust' },
  ]

  return (
    <div className="admin-section">
      {data.alert_destacado && (
        <div style={{ background: 'linear-gradient(135deg, #8b1111 0%, #aa2525 100%)', color: '#fff', padding: '14px 18px', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', border: '1px solid #ff4b2b' }}>
          <span style={{ fontSize: '1.3rem' }}>⚠️</span>
          <div>
            <strong style={{ display: 'block', fontSize: '0.95rem', marginBottom: '2px' }}>¡No hay cumpleañeros este mes!</strong>
            <span style={{ fontSize: '0.8rem', color: '#f0e4cc' }}>Se ha asignado temporalmente al usuario con más likes. Ve a <strong>Contenido Destacado</strong> para elegir manualmente.</span>
          </div>
        </div>
      )}

      {/* ── Stat Cards Grid (compactas) ── */}
      <div className="admin-stats-grid-compact">
        {statCards.map((s, i) => (
          <div className={`asc-card-compact asc-${s.color}`} key={i}>
            <div className="asc-card-top">
              <span className="asc-icon-sm">{s.icon}</span>
              <span className="asc-value-sm">{s.value}</span>
            </div>
            <span className="asc-label-sm">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Dos columnas: Cumpleaños + Resumen ── */}
      <div className="admin-dashboard-row">
        {/* Cumpleaños del mes */}
        <div className="admin-dashboard-card">
          <div className="adc-header">
            <span>🎂</span>
            <h3 className="adc-title">Cumpleaños de {currentMonth}</h3>
            <span className="adc-count">{birthdays?.count || 0}</span>
          </div>
          <div className="adc-body">
            {(!birthdays || birthdays.count === 0) ? (
              <p className="adc-empty">No hay cumpleaños registrados este mes.</p>
            ) : (
              <div className="birthday-list">
                {birthdays.users.map(u => (
                  <div className="birthday-item" key={u.id}>
                    <img 
                      src={u.avatar_url ? `${BASE_URL}/${u.avatar_url}` : '/logo_sin_fondo.png'} 
                      alt={u.username} 
                      className="birthday-avatar"
                      onError={e => { e.currentTarget.src = '/logo_sin_fondo.png' }}
                    />
                    <div className="birthday-info">
                      <strong>{u.username}</strong>
                      {(u.nombre || u.apellido) && <span className="birthday-name">{u.nombre} {u.apellido}</span>}
                    </div>
                    <span className="birthday-date">📅 {u.fecha_cumple}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Resumen del sitio */}
        <div className="admin-dashboard-card">
          <div className="adc-header">
            <span>📊</span>
            <h3 className="adc-title">Resumen del Sitio</h3>
          </div>
          <div className="adc-body">
            <div className="summary-list">
              <div className="summary-item">
                <span className="summary-icon">⭐</span>
                <span className="summary-label">Destacado Actual</span>
                <span className="summary-value">{stats.destacado > 0 ? 'Configurado' : 'Sin asignar'}</span>
              </div>
              <div className="summary-item">
                <span className="summary-icon">📝</span>
                <span className="summary-label">Total Publicaciones</span>
                <span className="summary-value">{stats.total_posts}</span>
              </div>
              <div className="summary-item">
                <span className="summary-icon">❤️</span>
                <span className="summary-label">Interacciones (Likes)</span>
                <span className="summary-value">{stats.total_likes}</span>
              </div>
              <div className="summary-item">
                <span className="summary-icon">🎂</span>
                <span className="summary-label">Cumpleaños este mes</span>
                <span className="summary-value">{birthdays?.count || 0}</span>
              </div>
              {newest_user && (
                <div className="summary-item">
                  <span className="summary-icon">🆕</span>
                  <span className="summary-label">Último registro</span>
                  <span className="summary-value">{newest_user.username} ({newest_user.fecha})</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Log de Actividad ── */}
      <div style={{ marginTop: '8px' }}>
        <h2 className="admin-sec-title">⏳ Actividad Reciente</h2>
        <div className="admin-log-preview" style={{ marginTop: '12px' }}>
          {logs.length === 0 ? <p style={{ color: '#aaa' }}>No hay actividad reciente.</p> : null}
          {logs.slice(0, 6).map((log) => (
            <div className="alp-row" key={log.id}>
              <span className="alp-time">{log.time}</span>
              <span className={`badge ${getLogConfig(log.tipo).class}`}>{getLogConfig(log.tipo).label}</span>
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
function AdminUsuarios({ adminId }) {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [keyResult, setKeyResult] = useState(null)
  const [messageModal, setMessageModal] = useState(null)
  const [messageForm, setMessageForm] = useState({ asunto: '', mensaje: '' })
  const [isSendingMsg, setIsSendingMsg] = useState(false)

  // Form handling (Create / Edit)
  const [formMode, setFormMode] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [badgeFile, setBadgeFile] = useState(null)     // File object for external badge
  const [badgePreview, setBadgePreview] = useState(null) // object URL preview

  const initialForm = {
    username: '', email: '', password: '', role: 'user',
    nombre: '', apellido: '', fecha_nacimiento: '', is_active: 1,
    verification_type: 'none', verification_badge: null
  }
  const [formData, setFormData] = useState(initialForm)
  const [isSaving, setIsSaving] = useState(false)

  const loadData = () => {
    setLoading(true)
    authFetch(`${API_URL}/usuarios.php`)
      .then(r => r.json())
      .then(d => setUsuarios(d.usuarios || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadData() }, [])

  const openForm = (mode, user = null) => {
    setFormMode(mode)
    setBadgeFile(null)
    setBadgePreview(null)
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
        password: '',
        verification_type: user.verification_type || 'none',
        verification_badge: user.verification_badge || null
      })
      if (user.verification_badge) setBadgePreview(`http://localhost/Austral_Collector/${user.verification_badge}`)
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
      .then(() => toast.info('Contraseña copiada al portapapeles 📋'))
      .catch(err => console.error('Error al copiar:', err));
  }

  const uploadBadge = async (userId, file) => {
    const token = localStorage.getItem('austral_auth_token')
    const fd = new FormData()
    fd.append('badge', file)
    fd.append('user_id', userId)
    const res = await fetch(`${API_URL}/verificacion_badge.php`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: fd
    })
    return res.json()
  }

  const submitForm = async (e) => {
    e.preventDefault()
    if (!formData.username || !formData.email || (formMode === 'create' && !formData.password)) {
      toast.info('Usuario, email y contraseña (en creación) son obligatorios.')
      return
    }
    if (formMode === 'create' && formData.password.length < 6) {
      toast.info('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    setIsSaving(true)
    const payload = formMode === 'create'
      ? { ...formData, adminId }
      : { id: editingId, action: 'update_user', ...formData, adminId }
    const method = formMode === 'create' ? 'POST' : 'PUT'

    try {
      const res = await authFetch(`${API_URL}/usuarios.php`, { method, body: JSON.stringify(payload) })
      const d = await res.json()
      if (d.success) {
        // Upload badge if external type + file selected
        const targetId = formMode === 'create' ? d.id : editingId
        if (formData.verification_type === 'external' && badgeFile && targetId) {
          const bRes = await uploadBadge(targetId, badgeFile)
          if (!bRes.success) toast.error('Usuario guardado, pero error al subir el badge: ' + bRes.error)
          setBadgeFile(null)
          setBadgePreview(null)
        }
        if (formMode === 'create') {
          setKeyResult(d)
        } else {
          toast.success('Usuario actualizado correctamente.')
        }
        setFormMode(null)
        loadData()
      } else {
        toast.error(d.error)
      }
    } catch(err) {
      toast.error('Error de conexión: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const updateFieldInline = (id, field, value) => {
    authFetch(`${API_URL}/usuarios.php`, {
      method: 'PUT',
      body: JSON.stringify({ id, action: 'update_field', field, value })
    })
    .then(r => r.json())
    .then(d => {
      if(d.success) loadData()
      else toast.error(d.error)
    })
  }
  
  const toggleStatus = async (id, action) => {
    if(!await confirmDialog(`¿Seguro que deseas aplicar esta acción?`)) return
    authFetch(`${API_URL}/usuarios.php`, {
      method: 'PUT',
      body: JSON.stringify({ id, action, adminId })
    })
    .then(r => r.json())
    .then(d => {
      if(d.success) loadData()
      else toast.error(d.error)
    })
  }

  const sendTempKey = async (user) => {
    if (!await confirmDialog(`¿Generar y enviar clave temporal a ${user.email || 'sin email'}?`)) return
    fetch(`${BASE_URL}/api/auth/enviar_clave_temporal.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id })
    })
    .then(r => r.json())
    .then(d => {
      if (d.success) {
        setKeyResult(d)
      } else {
        toast.error('Error: ' + d.error)
      }
    })
    .catch(e => toast.error('Error de conexión: ' + e.message))
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!messageForm.asunto || !messageForm.mensaje) return toast.info('Por favor llena todos los campos.')
    
    setIsSendingMsg(true)
    authFetch(`${API_URL}/enviar_mensaje.php`, {
      method: 'POST',
      body: JSON.stringify({
        user_id: messageModal.mass ? null : messageModal.user_id,
        mass_send: messageModal.mass,
        asunto: messageForm.asunto,
        mensaje: messageForm.mensaje
      })
    })
    .then(r => r.json())
    .then(d => {
      if (d.success) {
        toast.success(d.message || 'Mensaje enviado con éxito.')
        setMessageModal(null)
        setMessageForm({ asunto: '', mensaje: '' })
      } else {
        toast.error('Error: ' + d.error)
      }
    })
    .catch(e => toast.error('Error: ' + e.message))
    .finally(() => setIsSendingMsg(false))
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
      {/* Modal de Mensaje */}
      {messageModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1001, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <form className="admin-modal-form" style={{ width: '500px' }} onSubmit={handleSendMessage}>
            <h3 style={{ borderBottom: '1px solid var(--color-gold)', paddingBottom: '10px', marginBottom: '20px' }}>
              {messageModal.mass ? '📢 Publicar Anuncio General' : `✉️ Enviar Mensaje a ${messageModal.username}`}
            </h3>
            <div className="admin-form-group">
              <label>Asunto</label>
              <input 
                type="text" className="admin-input" required 
                value={messageForm.asunto} 
                onChange={e => setMessageForm({...messageForm, asunto: e.target.value})}
                placeholder="Ej: Mantenimiento programado"
              />
            </div>
            <div className="admin-form-group">
              <label>Mensaje</label>
              <textarea 
                className="admin-input" required rows="6"
                value={messageForm.mensaje}
                onChange={e => setMessageForm({...messageForm, mensaje: e.target.value})}
                placeholder="Escribe el contenido del correo aquí..."
                style={{ resize: 'vertical' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button type="submit" className="btn-primary" disabled={isSendingMsg} style={{ flex: 1 }}>
                {isSendingMsg ? 'Enviando...' : 'Enviar Ahora'}
              </button>
              <button type="button" className="btn-outline" onClick={() => setMessageModal(null)} disabled={isSendingMsg}>
                Cancelar
              </button>
            </div>
          </form>
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
            <button className="btn-primary btn-sm" style={{ background: '#2d6e7e', borderColor: 'var(--color-gold)', color: '#fff' }}
              onClick={() => setMessageModal({ mass: true })}>
              📢 Anuncio General
            </button>
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

            {/* ── Verificación ── */}
            <div className="admin-form-row" style={{ alignItems: 'flex-start' }}>
              <div className="admin-form-group">
                <label>✅ Tipo de Verificación</label>
                <select
                  className="admin-select"
                  value={formData.verification_type}
                  onChange={e => {
                    const vt = e.target.value
                    setFormData({...formData, verification_type: vt, verification_badge: vt !== 'external' ? null : formData.verification_badge})
                    if (vt !== 'external') { setBadgeFile(null); setBadgePreview(null) }
                  }}
                >
                  <option value="none">Sin verificación</option>
                  <option value="austral">⭐ Austral Collection (oficial)</option>
                  <option value="external">🔗 Colaborador Externo</option>
                </select>
              </div>
              {formData.verification_type === 'external' && (
                <div className="admin-form-group">
                  <label>🖼️ Badge del Colaborador (PNG/JPG, máx 2MB)</label>
                  <span style={{ fontSize: '0.75rem', color: '#aaa', display: 'block', marginBottom: '8px' }}>Te recomendamos que ocupes una imagen de estas dimensiones: 128x128 px (1:1).</span>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {badgePreview && (
                      <img
                        src={badgePreview}
                        alt="Badge preview"
                        style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: '50%', border: '2px solid var(--color-gold)', background: '#0d2830' }}
                      />
                    )}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      className="admin-input"
                      style={{ flex: 1 }}
                      onChange={e => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setBadgeFile(file)
                          setBadgePreview(URL.createObjectURL(file))
                        }
                      }}
                    />
                  </div>
                  {formData.verification_badge && !badgeFile && (
                    <span style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '4px', display: 'block' }}>Badge actual guardado ✓</span>
                  )}
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
            <th style={{ textAlign: 'center' }}>Mensaje</th>
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
                  <Link to={`/perfil/${u.username}`} className="admin-user-link" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <strong style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {u.username}
                      {u.verification_type === 'austral' && (
                        <img src="/logo_head.png" alt="Verificado" title="Verificado por Austral Collector" style={{ width: 16, height: 16, objectFit: 'contain', filter: 'drop-shadow(0 0 3px gold)' }} />
                      )}
                      {u.verification_type === 'external' && u.verification_badge && (
                        <img src={`http://localhost/Austral_Collector/${u.verification_badge}`} alt="Externo" title="Colaborador Externo" style={{ width: 16, height: 16, objectFit: 'contain', borderRadius: '50%' }} />
                      )}
                    </strong>
                    {(u.nombre || u.apellido) && <div className="td-muted" style={{ fontSize: '0.7rem' }}>{u.nombre} {u.apellido}</div>}
                  </Link>
                </td>
                <td className="td-muted">{u.email}</td>
                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                  <button 
                    className="act-btn" 
                    title="Enviar mensaje personalizado"
                    style={{ 
                      background: 'var(--color-gold)', 
                      border: '1px solid #000', 
                      color: '#000',
                      width: '32px',
                      height: '32px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                    onClick={() => setMessageModal({ user_id: u.id, username: u.username, email: u.email, mass: false })}
                  >
                    ✉️
                  </button>
                </td>
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
function AdminVideos({ adminId }) {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [videoModal, setVideoModal] = useState(false)
  const [videoForm, setVideoForm] = useState({ titulo: '', link: '' })
  const [saving, setSaving] = useState(false)

  const loadData = () => {
    setLoading(true)
    authFetch(`${API_URL}/videos.php`)
      .then(r => r.json())
      .then(d => setVideos(d.videos || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadData() }, [])

  const handleVideoSubmit = (e) => {
    e.preventDefault()
    if (!videoForm.titulo || !videoForm.link) return toast.info('Campos obligatorios')
    
    setSaving(true)
    authFetch(`${API_URL}/videos.php`, {
      method: 'POST',
      body: JSON.stringify({ ...videoForm, adminId })
    })
    .then(() => {
      setVideoModal(false)
      setVideoForm({ titulo: '', link: '' })
      loadData()
    })
    .finally(() => setSaving(false))
  }

  const handleDelete = async (id) => {
    if(!await confirmDialog(`¿Eliminar video?`)) return
    authFetch(`${API_URL}/videos.php`, {
      method: 'DELETE',
      body: JSON.stringify({ id, adminId })
    }).then(() => loadData())
  }

  const toggleDest = async (id) => {
    authFetch(`${API_URL}/videos.php`, {
      method: 'PUT',
      body: JSON.stringify({ id })
    }).then(() => loadData())
  }

  if (loading) return <Loading />

  return (
    <div className="admin-section">
      {/* Modal de Video Personalizado */}
      {videoModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1001, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <form 
            onSubmit={handleVideoSubmit}
            style={{ 
              width: '450px', 
              background: '#0d2830', 
              border: '1px solid var(--color-gold)', 
              borderRadius: '12px', 
              padding: '2rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              position: 'relative'
            }}
          >
            <h3 style={{ borderBottom: '1px solid rgba(255,215,0,0.3)', paddingBottom: '12px', marginBottom: '20px', color: '#ffd700', fontSize: '1.4rem' }}>
              🎬 Nuevo video de YouTube
            </h3>
            <div className="admin-form-group">
              <label>Título del Video</label>
              <input 
                type="text" className="admin-input" required autoFocus
                value={videoForm.titulo} 
                onChange={e => setVideoForm({...videoForm, titulo: e.target.value})}
                placeholder="Ej: Review de Figura XYZ"
              />
            </div>
            <div className="admin-form-group">
              <label>Link de YouTube</label>
              <input 
                type="url" className="admin-input" required 
                value={videoForm.link} 
                onChange={e => setVideoForm({...videoForm, link: e.target.value})}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button type="submit" className="btn-primary" disabled={saving} style={{ flex: 1 }}>
                {saving ? 'Guardando...' : '💾 Guardar Link'}
              </button>
              <button type="button" className="btn-outline" onClick={() => setVideoModal(false)} disabled={saving}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-sec-header">
        <h2 className="admin-sec-title">🎬 Gestión de Videos</h2>
        <button className="btn-primary btn-sm" onClick={() => setVideoModal(true)}>➕ Agregar Link</button>
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
                <td>
                  <a href={v.link_yt} target="_blank" rel="noreferrer" 
                    style={{ 
                      color: '#0d2830', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      textDecoration: 'underline',
                      fontWeight: '800',
                      fontSize: '0.9rem'
                    }}
                  >
                    <span style={{ fontSize: '1.2rem', filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.1))' }}>📺</span> Ver video
                  </a>
                </td>
                <td>
                  <button 
                    className={`act-btn ${parseInt(v.destacado)===1 ? 'act-gold' : ''}`} 
                    onClick={() => toggleDest(v.id)}
                    style={{
                      width: '38px',
                      height: '38px',
                      fontSize: '1.3rem',
                      background: parseInt(v.destacado)===1 ? '#ffd700' : '#f0e4cc',
                      border: '2px solid #0d2830',
                      borderRadius: '8px',
                      color: '#000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    {parseInt(v.destacado)===1 ? '⭐' : '☆'}
                  </button>
                </td>
                <td>
                  <div className="action-row">
                    <button 
                      className="act-btn act-red" 
                      onClick={() => handleDelete(v.id)} 
                      title="Eliminar"
                      style={{
                        width: '38px',
                        height: '38px',
                        fontSize: '1.2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#ff4444',
                        border: '2px solid #000',
                        color: '#fff',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    >
                      🗑️
                    </button>
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
function AdminEventos({ adminId }) {
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
    authFetch(`${API_URL}/eventos.php`)
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
    fd.append('adminId', adminId)
    fd.append('titulo', titulo)
    fd.append('fecha_display', fecha_display)
    if (imagen) fd.append('imagen', imagen)

    // FormData upload: inject Authorization header manually (no Content-Type to allow multipart/form-data boundary)
    const token = localStorage.getItem('austral_auth_token')
    fetch(`${API_URL}/eventos.php`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: fd
    })
    .then(r => r.json())
    .then(d => {
      if(d.success) {
        resetForm()
        loadData()
      } else {
        toast.error(d.error)
      }
    })
    .catch(error => toast.error("Error al guardar: " + error.message))
    .finally(() => setSaving(false))
  }

  const handleDelete = async (evtId) => {
    if(!await confirmDialog('¿Eliminar esta noticia/evento?')) return
    authFetch(`${API_URL}/eventos.php`, {
      method: 'DELETE',
      body: JSON.stringify({ id: evtId, adminId })
    })
    .then(r => r.json())
    .then(d => {
      if(d.success) loadData()
      else toast.error(d.error)
    })
    .catch(error => toast.error("Error al eliminar: " + error.message))
  }

  const handleEdit = async (ev) => {
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
            <span style={{ fontSize: '0.75rem', color: '#aaa', display: 'block', marginBottom: '8px' }}>Te recomendamos que ocupes una imagen de estas dimensiones: 800x600 px (horizontal 4:3).</span>
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

// ── SECCIÓN: Identidad ────────────────────────────────────
function AdminIdentidad({ adminId }) {
  const [identidades, setIdentidades] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState(null)

  // Galería
  const [galeriaItems, setGaleriaItems] = useState([])
  const [showGalModal, setShowGalModal] = useState(false)
  const [galFile, setGalFile] = useState(null)
  const [galPreview, setGalPreview] = useState(null)
  const [galDesc, setGalDesc] = useState('')
  const [uploadingGal, setUploadingGal] = useState(false)

  // Videos
  const [videos, setVideos] = useState([])
  const [savingVidId, setSavingVidId] = useState(null)
  const [addingVid, setAddingVid] = useState(false)
  const [draggedVidIndex, setDraggedVidIndex] = useState(null)

  // Comunidad
  const [comunidadFile, setComunidadFile] = useState(null)
  const [comunidadPreview, setComunidadPreview] = useState('')
  const [comunidadUrl, setComunidadUrl] = useState('')
  const [savingCom, setSavingCom] = useState(false)

  // Arrastre
  const [draggedIndex, setDraggedIndex] = useState(null)

  let userId = null
  try {
    const user = JSON.parse(localStorage.getItem('austral_auth_user') || '{}')
    userId = user.id
  } catch(e) {}

  const loadAll = () => {
    setLoading(true)
    // Identidad cards
    authFetch(`${API_URL}/identidad_admin.php?user_id=${userId}`)
      .then(r => r.json()).then(d => { if(d.success) setIdentidades(d.data || []) })
      .catch(e => console.error(e))

    // Galería
    authFetch(`${API_URL}/galeria_portafolio.php`)
      .then(r => r.json()).then(d => { if(d.success) setGaleriaItems(d.items || []) })
      .catch(e => console.error(e))

    // Videos dinámicos
    authFetch(`${API_URL}/videos_portafolio.php`)
      .then(r => r.json()).then(d => { if(d.success) setVideos(d.videos || []) })
      .catch(e => console.error(e))

    // Config (comunidad)
    authFetch(`${API_URL}/destacados.php`)
      .then(r => r.json()).then(d => {
        if(d.config) {
          setComunidadUrl(d.config.portafolio_comunidad || '')
          setComunidadPreview(d.config.portafolio_comunidad || '')
        }
      })
      .catch(e => console.error(e))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadAll() }, [])

  // ── Identidad helpers ──
  const handleChange = (index, field, value) => {
    const updated = [...identidades]
    updated[index][field] = value
    setIdentidades(updated)
  }
  const handleSaveSingle = (index) => {
    const item = identidades[index]
    setSavingId(item.id)
    authFetch(`${API_URL}/identidad_admin.php`, {
      method: 'PUT',
      body: JSON.stringify({ user_id: userId, identidades: [item] })
    }).then(r => r.json()).then(d => {
      if(d.success) toast.success(`✅ ${item.title} actualizado!`)
      else toast.error('Error: ' + d.error)
    }).finally(() => setSavingId(null))
  }

  // ── Galería helpers ──
  const openGalModal = () => { setGalFile(null); setGalPreview(null); setGalDesc(''); setShowGalModal(true) }
  const handleGalFile = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setGalFile(f)
    setGalPreview(URL.createObjectURL(f))
  }
  const handleGalUpload = (e) => {
    e.preventDefault()
    if (!galFile) return toast.info('Selecciona una imagen.')
    setUploadingGal(true)
    const token = localStorage.getItem('austral_auth_token')
    const fd = new FormData()
    fd.append('imagen', galFile)
    fd.append('descripcion', galDesc)
    fd.append('orden', galeriaItems.length)
    fetch(`${API_URL}/galeria_portafolio.php`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: fd
    }).then(r => r.json()).then(d => {
      if(d.success) { setShowGalModal(false); loadAll() }
      else toast.error('Error: ' + d.error)
    }).catch(e => toast.error('Error: ' + e.message)).finally(() => setUploadingGal(false))
  }
  const handleGalDelete = async (id) => {
    if(!await confirmDialog('¿Eliminar esta foto de la galería?')) return
    authFetch(`${API_URL}/galeria_portafolio.php`, {
      method: 'DELETE',
      body: JSON.stringify({ id })
    }).then(r => r.json()).then(d => {
      if(d.success) loadAll()
      else toast.error('Error: ' + d.error)
    })
  }
  const handleGalDescUpdate = async (item) => {
    authFetch(`${API_URL}/galeria_portafolio.php`, {
      method: 'PUT',
      body: JSON.stringify({ id: item.id, descripcion: item.descripcion, orden: item.orden })
    }).then(r => r.json()).then(d => {
      if(!d.success) toast.error('Error al guardar descripción.')
    })
  }

  // --- Reordenar (Drag & Drop) ---
  const handleDragStart = (e, index) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }
  const handleDragEnd = () => {
    setDraggedIndex(null)
    saveGalleryOrder()
  }
  const handleDragEnter = (index) => {
    if (draggedIndex === null || draggedIndex === index) return
    const newItems = [...galeriaItems]
    const draggedItem = newItems[draggedIndex]
    newItems.splice(draggedIndex, 1)
    newItems.splice(index, 0, draggedItem)
    setDraggedIndex(index)
    setGaleriaItems(newItems)
  }
  const saveGalleryOrder = () => {
    const itemsOrder = galeriaItems.map((item, idx) => ({ id: item.id, orden: idx }))
    authFetch(`${API_URL}/galeria_portafolio.php`, {
      method: 'PUT',
      body: JSON.stringify({ action: 'reorder', items: itemsOrder })
    }).then(r => r.json()).then(d => {
      if(!d.success) console.error("Error reordering:", d.error)
    }).catch(e => console.error(e))
  }

  // ── Video helpers ──
  const addNewVideo = () => {
    setAddingVid(true)
    authFetch(`${API_URL}/videos_portafolio.php`, {
      method: 'POST',
      body: JSON.stringify({ titulo: 'Nuevo Video', link_yt: '', descripcion: '', orden: videos.length })
    }).then(r => r.json()).then(d => {
      if(d.success) loadAll()
      else toast.error('Error al añadir video.')
    }).finally(() => setAddingVid(false))
  }
  const deleteVideo = async (id) => {
    if(!await confirmDialog('¿Eliminar este video del portafolio?')) return
    authFetch(`${API_URL}/videos_portafolio.php`, {
      method: 'DELETE',
      body: JSON.stringify({ id })
    }).then(r => r.json()).then(d => {
      if(d.success) loadAll()
      else toast.error('Error al eliminar.')
    })
  }
  const saveVideoData = (vid) => {
    setSavingVidId(vid.id)
    authFetch(`${API_URL}/videos_portafolio.php`, {
      method: 'PUT',
      body: JSON.stringify(vid)
    }).then(r => r.json()).then(d => {
      if(d.success) toast.success(`✅ ${vid.titulo} guardado!`)
      else toast.error('❌ Error al guardar.')
    }).catch(e => toast.error('❌ ' + e.message)).finally(() => setSavingVidId(null))
  }
  const handleVideoChange = (id, field, value) => {
    setVideos(prev => prev.map(v => v.id === id ? {...v, [field]: value} : v))
  }
  
  // Reordenar Videos
  const handleVidDragStart = (e, index) => {
    setDraggedVidIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }
  const handleVidDragEnd = () => {
    setDraggedVidIndex(null)
    const itemsOrder = videos.map((v, idx) => ({ id: v.id, orden: idx }))
    authFetch(`${API_URL}/videos_portafolio.php`, {
      method: 'PUT',
      body: JSON.stringify({ action: 'reorder', items: itemsOrder })
    })
  }
  const handleVidDragEnter = (index) => {
    if (draggedVidIndex === null || draggedVidIndex === index) return
    const newItems = [...videos]
    const draggedItem = newItems[draggedVidIndex]
    newItems.splice(draggedVidIndex, 1)
    newItems.splice(index, 0, draggedItem)
    setDraggedVidIndex(index)
    setVideos(newItems)
  }

  const getYtId = (url) => {
    if (!url) return null
    const m = url.match(/[?&]v=([^&]+)/)
    if (m) return m[1]
    const sl = url.split('/')
    return sl[sl.length - 1] || null
  }

  // ── Comunidad helpers ──
  const handleComunidadFile = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setComunidadFile(f)
    setComunidadPreview(URL.createObjectURL(f))
  }
  const saveComunidad = () => {
    setSavingCom(true)
    if (comunidadFile) {
      // Usamos el nuevo servicio subir_general.php para que NO se guarde en la galería
      const token = localStorage.getItem('austral_auth_token')
      const fd = new FormData()
      fd.append('imagen', comunidadFile)

      fetch(`${API_URL}/subir_general.php`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: fd
      }).then(r => r.json()).then(d => {
        if(d.success) {
          // Guardar la URL resultante en la configuración (destacados.php)
          return authFetch(`${API_URL}/destacados.php`, {
            method: 'POST',
            body: JSON.stringify({ clave: 'portafolio_comunidad', valor: d.imagen_url, adminId })
          }).then(r => r.json()).then(() => {
            setComunidadUrl(d.imagen_url)
            setComunidadFile(null)
            toast.success('✅ Imagen de comunidad guardada (Banner actualizado).')
          })
        } else {
          toast.error('Error: ' + d.error)
        }
      }).catch(e => toast.error('Error: ' + e.message)).finally(() => setSavingCom(false))
    } else {
      // Si el usuario pegó una URL directamente
      authFetch(`${API_URL}/destacados.php`, {
        method: 'POST',
        body: JSON.stringify({ clave: 'portafolio_comunidad', valor: comunidadUrl, adminId })
      }).then(r => r.json()).then(d => {
        if(d.success) { setComunidadPreview(comunidadUrl); toast.success('✅ URL de Banner guardada.') }
        else toast.error('❌ Error al guardar.')
      }).catch(e => toast.error('❌ ' + e.message)).finally(() => setSavingCom(false))
    }
  }

  if (loading) return <Loading />

  return (
    <div className="admin-section">
      {/* ── MODAL AGREGAR FOTO ─────────────────────── */}
      {showGalModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.88)', zIndex:1001, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <form onSubmit={handleGalUpload} style={{ width:'460px', background:'#0d2830', border:'1px solid var(--color-gold)', borderRadius:'14px', padding:'2rem', position:'relative' }}>
            <button type="button" onClick={() => setShowGalModal(false)} style={{ position:'absolute', top:'12px', right:'14px', background:'none', border:'none', color:'#aaa', fontSize:'1.4rem', cursor:'pointer' }}>✕</button>
            <h3 style={{ color:'var(--color-gold)', marginBottom:'20px', fontSize:'1.2rem' }}>📷 Agregar Foto a la Galería</h3>

            <div className="admin-form-group" style={{ marginBottom:'16px' }}>
              <label>Imagen *</label>
              <input type="file" accept="image/*" required onChange={handleGalFile}
                style={{ display:'block', marginTop:'6px', color:'#f0e4cc' }} />
              {galPreview && (
                <img src={galPreview} alt="Preview" style={{ marginTop:'12px', width:'100%', height:'180px', objectFit:'cover', borderRadius:'8px', border:'1px solid rgba(255,215,0,0.3)' }} />
              )}
            </div>

            <div className="admin-form-group" style={{ marginBottom:'20px' }}>
              <label>Descripción (opcional)</label>
              <textarea className="admin-input" rows="3" value={galDesc}
                onChange={e => setGalDesc(e.target.value)}
                placeholder="Ej: Exhibición de figuras de la colección 2024..."
                style={{ resize:'none', marginTop:'6px' }} />
            </div>

            <div style={{ display:'flex', gap:'10px' }}>
              <button type="submit" className="btn-primary" disabled={uploadingGal} style={{ flex:1 }}>
                {uploadingGal ? 'Subiendo...' : '☁️ Subir Foto'}
              </button>
              <button type="button" className="btn-outline" onClick={() => setShowGalModal(false)} disabled={uploadingGal}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── A: NUESTRA IDENTIDAD ──────────────────── */}
      <div className="admin-sec-header">
        <h2 className="admin-sec-title">⭐ Nuestra Identidad</h2>
        <button className="btn-outline btn-sm" onClick={loadAll} style={{ borderColor:'rgba(0,0,0,0.2)', color:'#1a3d4a' }}>🔄 Recargar</button>
      </div>
      <div className="admin-identidad-grid" style={{ marginBottom:'48px' }}>
        {identidades.map((item, index) => (
          <div key={item.id} className="admin-identidad-card">
            <div className="aic-header">
              <span className="aic-icon-view">{item.icon}</span>
              <h3 className="aic-id-label">{item.id}</h3>
            </div>
            <div className="admin-form-group">
              <label>Título</label>
              <input type="text" className="admin-input" value={item.title}
                onChange={e => handleChange(index, 'title', e.target.value)} />
            </div>
            <div className="admin-form-group" style={{ marginTop:'10px' }}>
              <label>Ícono (Emoji)</label>
              <input type="text" className="admin-input" value={item.icon}
                onChange={e => handleChange(index, 'icon', e.target.value)} />
            </div>
            <div className="admin-form-group" style={{ marginTop:'10px', flex:1 }}>
              <label>Descripción</label>
              <textarea className="admin-input" rows="4" value={item.desc}
                onChange={e => handleChange(index, 'desc', e.target.value)}
                style={{ resize:'none' }} />
            </div>
            <div className="aic-footer" style={{ marginTop:'16px' }}>
              <button className="btn-primary" style={{ width:'100%' }}
                onClick={() => handleSaveSingle(index)} disabled={savingId === item.id}>
                {savingId === item.id ? 'Guardando...' : '💾 Guardar'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── B: GALERÍA DE FOTOS ───────────────────── */}
      <div style={{ borderTop:'2px solid rgba(200,169,110,0.35)', paddingTop:'32px', marginBottom:'40px' }}>
        <div className="admin-sec-header" style={{ marginBottom:'20px' }}>
          <div>
            <h2 className="admin-sec-title">⚜️ Galería de Fotos</h2>
            <p style={{ color:'#4a3520', fontSize:'0.85rem', marginTop:'4px' }}>
              Sube las fotos que aparecerán en la sección Galería del Portafolio. Puedes agregar cualquier cantidad.
            </p>
          </div>
          <button className="btn-primary btn-sm" onClick={openGalModal}>➕ Agregar Foto</button>
        </div>

        {galeriaItems.length === 0 ? (
          <div style={{ textAlign:'center', padding:'40px 20px', background:'rgba(0,0,0,0.06)', borderRadius:'10px', border:'1px dashed rgba(139,90,43,0.35)', color:'#3a2a0f' }}>
            <div style={{ fontSize:'2.5rem', marginBottom:'8px' }}>📷</div>
            <p style={{ fontWeight:500 }}>No hay fotos en la galería aún.</p>
            <button className="btn-outline btn-sm" style={{ marginTop:'12px' }} onClick={openGalModal}>
              ➕ Agregar primera foto
            </button>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:'16px' }}>
            {galeriaItems.map((item, idx) => (
              <div 
                key={item.id} 
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragEnter={() => handleDragEnter(idx)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                style={{ 
                  background:'rgba(255,255,255,0.6)', 
                  borderRadius:'10px', 
                  overflow:'hidden', 
                  border:'1px solid rgba(139,90,43,0.25)', 
                  position:'relative', 
                  boxShadow:'0 2px 8px rgba(0,0,0,0.1)',
                  cursor: 'grab',
                  opacity: draggedIndex === idx ? 0.3 : 1,
                  transform: draggedIndex === idx ? 'scale(0.95)' : 'none',
                  transition: 'all 0.2s ease',
                  userSelect: 'none'
                }}
              >
                <img
                  src={`${window.location.origin.includes('5173') ? 'http://localhost' : ''}/Austral_Collector/${item.imagen_url}`}
                  alt={item.descripcion || 'Galería'}
                  style={{ width:'100%', height:'160px', objectFit:'cover', display:'block', pointerEvents:'none' }}
                  onError={e => { e.target.style.background='#1a3d4a'; e.target.src=''; }}
                />
                <div style={{ padding:'12px' }} onMouseDown={e => e.stopPropagation()}>
                  <textarea
                    className="admin-input"
                    rows="2"
                    value={item.descripcion || ''}
                    onChange={e => {
                      const upd = galeriaItems.map(g => g.id === item.id ? {...g, descripcion: e.target.value} : g)
                      setGaleriaItems(upd)
                    }}
                    onBlur={() => handleGalDescUpdate(item)}
                    placeholder="Descripción de la foto..."
                    style={{ resize:'none', fontSize:'0.78rem', marginBottom:'8px' }}
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); handleGalDelete(item.id); }}
                    style={{ width:'100%', background:'rgba(217,83,79,0.15)', border:'1px solid #d9534f', color:'#d9534f', borderRadius:'6px', padding:'6px', cursor:'pointer', fontSize:'0.82rem' }}>
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── C: VIDEOS DE YOUTUBE ──────────────────── */}
      <div style={{ borderTop:'2px solid rgba(200,169,110,0.35)', paddingTop:'32px', marginBottom:'40px' }}>
        <div className="admin-sec-header" style={{ marginBottom:'20px' }}>
          <div>
            <h2 className="admin-sec-title">▶ Videos del Portafolio</h2>
            <p style={{ color:'#4a3520', fontSize:'0.85rem', marginTop:'4px' }}>
              Gestiona los videos de la página de Nosotros. Puedes añadir títulos y descripciones.
            </p>
          </div>
          <button className="btn-primary btn-sm" onClick={addNewVideo} disabled={addingVid}>
            {addingVid ? 'Añadiendo...' : '➕ Añadir Video'}
          </button>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))', gap:'20px' }}>
          {videos.map((v, idx) => {
            const ytId = getYtId(v.link_yt)
            return (
              <div 
                key={v.id} 
                draggable
                onDragStart={(e) => handleVidDragStart(e, idx)}
                onDragEnter={() => handleVidDragEnter(idx)}
                onDragEnd={handleVidDragEnd}
                onDragOver={(e) => e.preventDefault()}
                style={{ 
                  background:'rgba(255,255,255,0.7)', 
                  borderRadius:'12px', 
                  overflow:'hidden', 
                  border:'1px solid rgba(139,90,43,0.35)', 
                  boxShadow: draggedVidIndex === idx ? '0 10px 25px rgba(0,0,0,0.2)' : '0 2px 10px rgba(0,0,0,0.1)',
                  cursor: 'grab',
                  opacity: draggedVidIndex === idx ? 0.4 : 1,
                  transform: draggedVidIndex === idx ? 'scale(1.02)' : 'scale(1)',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
              >
                {/* Drag Handle Indicator */}
                <div style={{ 
                  position:'absolute', 
                  top:'10px', 
                  left:'10px', 
                  background:'rgba(255,255,255,0.85)', 
                  borderRadius:'4px', 
                  padding:'4px 8px', 
                  zIndex:10, 
                  fontSize:'0.9rem',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  pointerEvents: 'none'
                }}>
                  ⠿
                </div>
                {ytId ? (
                  <img src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`} alt={v.titulo}
                    style={{ width:'100%', height:'180px', objectFit:'cover', display:'block', pointerEvents: 'none' }} />
                ) : (
                  <div style={{ width:'100%', height:'180px', background:'rgba(0,0,0,0.12)', display:'flex', alignItems:'center', justifyContent:'center', color:'#4a3520', fontSize:'2.5rem' }}>🎬</div>
                )}
                <div style={{ padding:'16px' }} onMouseDown={e => e.stopPropagation()}>
                  <div className="admin-form-group">
                    <label style={{ color: '#2e1f0f', fontWeight: '800', marginBottom: '8px', display: 'block' }}>URL de YouTube</label>
                    <input type="url" className="admin-input"
                      value={v.link_yt}
                      onChange={e => handleVideoChange(v.id, 'link_yt', e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      style={{ marginBottom:'10px', fontSize:'0.82rem' }} />
                  </div>

                  <div className="admin-form-group">
                    <label style={{ color: '#2e1f0f', fontWeight: '800', marginBottom: '8px', display: 'block' }}>Descripción del Video</label>
                    <textarea className="admin-input" rows="3"
                      value={v.descripcion || ''}
                      onChange={e => handleVideoChange(v.id, 'descripcion', e.target.value)}
                      placeholder="Explica qué se muestra en este video..."
                      style={{ resize:'none', marginBottom:'14px', fontSize:'0.82rem' }} />
                  </div>

                  <div style={{ display:'flex', gap:'8px' }}>
                    <button
                      onClick={() => saveVideoData(v)}
                      disabled={savingVidId === v.id}
                      style={{ flex:1, background:'var(--color-gold)', border:'none', color:'#1a3d4a', borderRadius:'6px', padding:'8px', cursor:'pointer', fontSize:'0.82rem', fontWeight:700 }}>
                      {savingVidId === v.id ? '...' : '💾 Guardar'}
                    </button>
                    <button
                      onClick={() => deleteVideo(v.id)}
                      style={{ background:'rgba(217,83,79,0.1)', border:'1px solid #d9534f', color:'#d9534f', borderRadius:'6px', padding:'8px', cursor:'pointer', fontSize:'0.82rem' }}>
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── D: IMAGEN COMUNIDAD ───────────────────── */}
      <div style={{ borderTop:'2px solid rgba(200,169,110,0.35)', paddingTop:'32px' }}>
        <h2 className="admin-sec-title" style={{ marginBottom:'8px' }}>🤝 Banner "Únete a la Comunidad"</h2>
        <p style={{ color:'#4a3520', fontSize:'0.85rem', marginBottom:'20px' }}>
          Imagen que aparece al lado del texto de la sección Comunidad al final del Portafolio.
        </p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'28px', alignItems:'start' }}>
          <div>
            <div className="admin-form-group" style={{ marginBottom:'16px' }}>
              <label>Subir imagen (hasta 5MB)</label>
              <input type="file" accept="image/*" onChange={handleComunidadFile}
                style={{ display:'block', marginTop:'8px', color:'#1a3d4a' }} />
            </div>
            <div className="admin-form-group" style={{ marginBottom:'16px' }}>
              <label>O pegar URL directamente</label>
              <input type="url" className="admin-input"
                value={comunidadUrl}
                onChange={e => { setComunidadUrl(e.target.value); if(!comunidadFile) setComunidadPreview(e.target.value) }}
                placeholder="https://..." style={{ marginTop:'6px' }} />
            </div>
            <button className="btn-primary" onClick={saveComunidad} disabled={savingCom} style={{ width:'100%' }}>
              {savingCom ? 'Guardando...' : '💾 Guardar Imagen de Comunidad'}
            </button>
          </div>
          <div>
            {comunidadPreview ? (
              <img src={comunidadPreview.startsWith('uploads/') ? `http://localhost/Austral_Collector/${comunidadPreview}` : comunidadPreview}
                alt="Preview"
                style={{ width:'100%', height:'200px', objectFit:'cover', borderRadius:'10px', border:'1px solid rgba(255,215,0,0.3)' }}
                onError={e => e.target.style.display='none'} />
            ) : (
              <div style={{ width:'100%', height:'200px', background:'rgba(0,0,0,0.07)', borderRadius:'10px', border:'1px dashed rgba(139,90,43,0.35)', display:'flex', alignItems:'center', justifyContent:'center', color:'#3a2a0f', fontSize:'0.85rem', fontWeight:500 }}>
                Vista previa aquí
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


// ── SECCIÓN: Destacados ────────────────────────────────────
function AdminDestacados({ adminId }) {
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
  const [txtDestacado, setTxtDestacado] = useState('')
  const [txtCumple, setTxtCumple] = useState('')

  useEffect(() => {
    authFetch(`${API_URL}/destacados.php`)
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
        setTxtDestacado(d.config?.txt_destacado || '')
        setTxtCumple(d.config?.txt_cumple || '')
      })
      .catch(e => setError(e.message))
  }, [])

  const handleSave = (clave, valor) => {
    setSaving(true)
    authFetch(`${API_URL}/destacados.php`, {
      method: 'POST',
      body: JSON.stringify({ clave, valor, adminId })
    })
      .then(r => r.json())
      .then(d => {
        if (d.success) toast.success('✅ Guardado correctamente.')
        else toast.error('❌ Error al guardar.')
      })
      .catch(e => toast.error('❌ ' + e.message))
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

        {/* --- MENSAJES PERSONALIZADOS --- */}
        <div className="dest-card">
          <h3 className="dest-card-title">📝 Mensajes de Biografía</h3>
          <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '16px' }}>
            Escribe el texto que acompañará a la biografía del Destacado y del Cumpleañero, por si ellos no tienen uno definido.
          </p>

          <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: '1fr 1fr' }}>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h4 style={{ color: '#ddd', marginBottom: '8px', fontSize: '0.9rem' }}>🏆 Mensaje de Destacado</h4>
              <textarea 
                className="admin-input" 
                rows="4" 
                value={txtDestacado}
                onChange={e => setTxtDestacado(e.target.value)}
                placeholder="Por su increíble colección y valiosos aportes..."
                style={{ width: '100%', marginBottom: '12px', resize: 'vertical' }}
              />
              <button
                className="btn-outline btn-sm"
                disabled={saving}
                onClick={() => handleSave('txt_destacado', txtDestacado)}
                style={{ width: '100%' }}
              >
                Guardar Mensaje
              </button>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h4 style={{ color: '#ddd', marginBottom: '8px', fontSize: '0.9rem' }}>🎉 Mensaje de Cumpleañero</h4>
              <textarea 
                className="admin-input" 
                rows="4" 
                value={txtCumple}
                onChange={e => setTxtCumple(e.target.value)}
                placeholder="¡El Gremio celebra tu día...!"
                style={{ width: '100%', marginBottom: '12px', resize: 'vertical' }}
              />
              <button
                className="btn-outline btn-sm"
                disabled={saving}
                onClick={() => handleSave('txt_cumple', txtCumple)}
                style={{ width: '100%' }}
              >
                Guardar Mensaje
              </button>
            </div>
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

    authFetch(`${API_URL}/get_activity_log.php?${params.toString()}`)
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
        
        {/* Barra de Filtros Refinada */}
        <div style={{ 
          display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap', 
          background: 'rgba(30, 77, 90, 0.05)',
          padding: '16px 20px', 
          borderRadius: '10px', 
          marginTop: '12px',
          border: '1.5px solid rgba(45, 110, 126, 0.1)'
        }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.70rem', color: '#1e4d5a', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Responsable</label>
            <input 
              type="text" 
              placeholder="Buscar usuario..." 
              className="admin-input" 
              style={{ width: '180px', background: 'rgba(255,250,240,0.5)', borderColor: 'rgba(180,160,120,0.4)', color: '#2e1f0f' }}
              value={fUsuario}
              onChange={e => setFUsuario(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.70rem', color: '#1e4d5a', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Categoría</label>
            <select 
              className="admin-select"
              style={{ width: '150px', height: '38px', background: 'rgba(255,250,240,0.5)', borderColor: 'rgba(180,160,120,0.4)', color: '#2e1f0f' }}
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
            <label style={{ fontSize: '0.70rem', color: '#1e4d5a', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Desde</label>
            <input 
              type="date" 
              className="admin-input" 
              style={{ width: '150px', background: 'rgba(255,250,240,0.5)', borderColor: 'rgba(180,160,120,0.4)', color: '#2e1f0f' }}
              value={fFechaDesde}
              onChange={e => setFFechaDesde(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.70rem', color: '#1e4d5a', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Hasta</label>
            <input 
              type="date" 
              className="admin-input" 
              style={{ width: '150px', background: 'rgba(255,250,240,0.5)', borderColor: 'rgba(180,160,120,0.4)', color: '#2e1f0f' }}
              value={fFechaHasta}
              onChange={e => setFFechaHasta(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto', alignSelf: 'flex-end' }}>
            <button className="btn-outline btn-sm" onClick={() => { setFUsuario(''); setFTipo(''); setFFechaDesde(''); setFFechaHasta(''); setTimeout(loadData, 50) }} 
              style={{ borderColor: 'rgba(180,160,120,0.6)', color: '#5a4530' }}>
              Limpiar
            </button>
            <button className="btn-primary btn-sm" onClick={loadData}>
              🔍 Filtrar Log
            </button>
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
                    <span className={`badge ${getLogConfig(log.tipo).class}`}>
                      {getLogConfig(log.tipo).label}
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
function AdminModeracion({ adminId }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTipo, setFilterTipo] = useState('all') // all | figura | cosplay
  const [selectedPost, setSelectedPost] = useState(null)
  
  // Modal de eliminación con advertencia
  const [postToRemove, setPostToRemove] = useState(null) // { id, tipo, nombre }
  const [deleteReason, setDeleteReason] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const loadData = () => {
    setLoading(true)
    authFetch(`${API_URL}/publicaciones.php`)
      .then(r => r.json())
      .then(d => setPosts(d.data || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadData() }, [])

  const handleDelete = async (e) => {
    e.preventDefault()
    if (!postToRemove || !deleteReason) return
    
    setIsDeleting(true)
    authFetch(`${API_URL}/publicaciones.php`, {
      method: 'DELETE',
      body: JSON.stringify({
        id: postToRemove.id,
        tipo: postToRemove.tipo,
        motivo: deleteReason,
        adminId: adminId
      })
    })
    .then(r => r.json())
    .then(d => {
      if (d.success) {
        toast.success('Publicación eliminada correctamente. Correo de advertencia enviado.')
        setPostToRemove(null)
        setDeleteReason('')
        loadData()
      } else {
        toast.error('Error: ' + d.error)
      }
    })
    .catch(e => toast.info(e.message))
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
                    src={`${BASE_URL}/${p.imagen_url}`} 
                    alt="Mini" 
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </td>
                <td>
                  <strong>{p.nombre}</strong>
                </td>
                <td>
                  <span className={`badge ${getLogConfig(p.tipo).class}`}>
                    {getLogConfig(p.tipo).label}
                  </span>
                </td>
                <td>
                  <span className="td-muted">{p.autor}</span>
                </td>
                <td className="td-muted">{p.created_at.split(' ')[0]}</td>
                <td>
                  <div className="action-row centered">
                    <button className="act-btn" style={{ background: 'var(--color-teal)', border: '1px solid rgba(255,255,255,0.2)' }} title="Ver Publicación" onClick={() => setSelectedPost(p)}>
                      👁️
                    </button>
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

      <PostModal 
        post={selectedPost}
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        onLike={() => {}} 
        onTagClick={() => {}} 
      />
    </div>
  )
}

// ── SECCIÓN: Promociones Home ─────────────────────────────────
const PROMOS_API = '/api/admin'

function AdminPromos({ adminId }) {
  const [promos, setPromos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [imgPreview, setImgPreview] = useState(null)

  const emptyForm = { id: null, titulo: '', link_url: '', orden: 0 }
  const [form, setForm] = useState(emptyForm)
  const [imgFile, setImgFile] = useState(null)

  const loadData = () => {
    setLoading(true)
    authFetch(`${PROMOS_API}/promos.php`)
      .then(r => r.json())
      .then(d => setPromos(d.promos || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadData() }, [])

  const handleImgChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImgFile(file)
    const reader = new FileReader()
    reader.onload = ev => setImgPreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.titulo || !form.link_url) return toast.info('Nombre y Link son obligatorios.')
    if (!imgFile && !form.id) return toast.info('La Imagen es obligatoria.')
    setSaving(true)

    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    fd.append('adminId', adminId)
    if (imgFile) fd.append('imagen', imgFile)

    try {
      const token = localStorage.getItem('austral_auth_token')
      const r = await fetch(`${PROMOS_API}/promos.php`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: fd
      })
      const d = await r.json()
      if (d.success) {
        setShowForm(false)
        setForm(emptyForm)
        setImgFile(null)
        setImgPreview(null)
        loadData()
      } else {
        toast.error(d.error || 'Error al guardar.')
      }
    } catch(err) {
      toast.error('Error de conexión: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const toggleActivo = async (id) => {
    authFetch(`${PROMOS_API}/promos.php`, {
      method: 'PUT',
      body: JSON.stringify({ id, action: 'toggle_activo' })
    }).then(() => loadData())
  }

  const handleDelete = async (id) => {
    if (!await confirmDialog('¿Eliminar esta promoción?')) return
    authFetch(`${PROMOS_API}/promos.php`, {
      method: 'DELETE',
      body: JSON.stringify({ id, adminId })
    }).then(() => loadData())
  }

  const handleEdit = (p) => {
    setForm({
      id: p.id,
      titulo: p.titulo,
      link_url: p.link_url,
      orden: p.orden
    })
    setImgPreview(p.imagen_url ? `${BASE_URL}/${p.imagen_url}` : null)
    setImgFile(null)
    setShowForm(true)
  }

  return (
    <div className="admin-section">
      <div className="admin-sec-header">
        <h2 className="admin-sec-title">🌟 Promociones</h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button className="btn-primary btn-sm" onClick={() => { setShowForm(true); setForm(emptyForm); setImgPreview(null); setImgFile(null); }}>
            ➕ Agregar Promoción
          </button>
        </div>
      </div>

      <div style={{ padding: '12px 18px', background: 'rgba(45,110,126,0.1)', border: '1px solid rgba(45,110,126,0.3)', borderRadius: '10px', marginBottom: '24px', color: 'rgba(240,228,204,0.85)' }}>
        <strong style={{ color: '#dfc08a' }}>Nota:</strong> Las promociones que agregues aquí se mostrarán automáticamente de forma simultánea en las 3 secciones de prueba del Home (Carrusel, Panel Lateral y Tarjetas Inferiores).
      </div>

      {/* Modal de formulario */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1001, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <form
            onSubmit={handleSubmit}
            style={{ width: '560px', maxHeight: '90vh', overflowY: 'auto', background: '#0d2830', border: '1px solid var(--color-gold)', borderRadius: '14px', padding: '2rem', boxShadow: '0 20px 60px rgba(0,0,0,0.7)' }}
          >
            <h3 style={{ borderBottom: '1px solid rgba(255,215,0,0.3)', paddingBottom: '12px', marginBottom: '22px', color: '#ffd700', fontSize: '1.3rem' }}>
              {form.id ? '✏️ Editar Promoción' : '🌟 Nueva Promoción'}
            </h3>

            <div className="admin-form-group">
              <label>Nombre de la Promoción (control interno) *</label>
              <input type="text" className="admin-input" required placeholder="Ej: Tienda Oficial"
                value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} />
            </div>

            <div className="admin-form-group">
              <label>URL de destino (link externo) *</label>
              <input type="url" className="admin-input" required placeholder="https://..."
                value={form.link_url} onChange={e => setForm({...form, link_url: e.target.value})} />
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Orden (número bajo = primero)</label>
                <input type="number" className="admin-input" min="0" max="99"
                  value={form.orden} onChange={e => setForm({...form, orden: e.target.value})} />
              </div>
              <div className="admin-form-group">
                <label>Imagen / Logo {form.id ? '(Opcional)' : '*'}</label>
                <span style={{ fontSize: '0.75rem', color: '#aaa', display: 'block', marginBottom: '6px' }}>Te recomendamos que ocupes una imagen de estas dimensiones: 800x400 px (horizontal 2:1).</span>
                <input type="file" className="admin-input" accept="image/*"
                  required={!form.id}
                  onChange={handleImgChange}
                  style={{ padding: '6px' }}
                />
              </div>
            </div>

            {imgPreview && (
              <div style={{ marginBottom: '16px', textAlign: 'center' }}>
                <img src={imgPreview} alt="Preview" style={{ maxHeight: '100px', maxWidth: '100%', borderRadius: '8px', border: '1px solid rgba(201,168,76,0.3)' }} />
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button type="submit" className="btn-primary" disabled={saving} style={{ flex: 1 }}>
                {saving ? 'Guardando...' : '💾 Guardar Promoción'}
              </button>
              <button type="button" className="btn-outline" onClick={() => setShowForm(false)} disabled={saving}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla */}
      {loading ? <Loading /> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Enlace</th>
              <th style={{ textAlign: 'center' }}>Orden</th>
              <th style={{ textAlign: 'center' }}>Activo</th>
              <th style={{ textAlign: 'center' }}>Acciones</th>
            </tr></thead>
            <tbody>
              {promos.length === 0 && (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: '#aaa' }}>No tienes promociones registradas. Usa el botón "Agregar Promoción".</td></tr>
              )}
              {promos.map(p => (
                <tr key={p.id}>
                  <td>
                    {p.imagen_url
                      ? <img src={`${BASE_URL}/${p.imagen_url}`} alt={p.titulo} style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '6px', border: '1px solid rgba(201,168,76,0.3)' }} />
                      : <span style={{ color: '#aaa', fontSize: '0.75rem' }}>Sin imagen</span>
                    }
                  </td>
                  <td><strong>{p.titulo}</strong></td>
                  <td>
                    <a href={p.link_url} target="_blank" rel="noreferrer"
                      style={{ color: '#1e4d5a', fontWeight: 'bold', fontSize: '0.75rem', textDecoration: 'underline', wordBreak: 'break-all', maxWidth: '140px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >{p.link_url}</a>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', color: '#1e4d5a', fontSize: '1.1rem' }}>{p.orden}</span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                      <button
                        className={`act-btn ${parseInt(p.activo) ? 'act-gold' : ''}`}
                        onClick={() => toggleActivo(p.id)}
                        title={parseInt(p.activo) ? 'Desactivar' : 'Activar'}
                        style={{
                          width: '36px', height: '36px', fontSize: '1.1rem',
                          background: parseInt(p.activo) ? '#ffd700' : 'rgba(255,255,255,0.08)',
                          border: '1px solid rgba(201,168,76,0.4)',
                          borderRadius: '8px', cursor: 'pointer',
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
                        }}
                      >
                        {parseInt(p.activo) ? '✅' : '⚪'}
                      </button>
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                      <button
                        className="act-btn"
                        onClick={() => handleEdit(p)}
                        title="Editar"
                        style={{
                          width: '36px', height: '36px', fontSize: '1.1rem',
                          background: 'rgba(45,110,126,0.3)', border: '1px solid rgba(45,110,126,0.5)',
                          color: '#fff', borderRadius: '8px', cursor: 'pointer',
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        className="act-btn act-red"
                        onClick={() => handleDelete(p.id)}
                        title="Eliminar"
                        style={{
                          width: '36px', height: '36px', fontSize: '1.1rem',
                          background: '#c0392b', border: '1px solid #000',
                          color: '#fff', borderRadius: '8px', cursor: 'pointer',
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ── SECCIÓN: Asistente Virtual (Mascota) ─────────────────
function AdminMascota({ adminId }) {
  const [texts, setTexts] = useState({
    inicio: '',
    nosotros: '',
    galeria: '',
    miembros: '',
    contacto: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    authFetch(`${API_URL}/mascot_texts.php`)
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data) {
          setTexts({
            inicio: d.data.inicio || '',
            nosotros: d.data.nosotros || '',
            galeria: d.data.galeria || '',
            miembros: d.data.miembros || '',
            contacto: d.data.contacto || ''
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field, value) => {
    setTexts(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    authFetch(`${API_URL}/mascot_texts.php`, {
      method: 'PUT',
      body: JSON.stringify({ ...texts, adminId })
    })
      .then(r => r.json())
      .then(d => {
        if (d.success) toast.success('Textos de la mascota guardados correctamente.');
        else toast.error('Error al guardar: ' + d.error);
      })
      .catch(e => toast.error('Error: ' + e.message))
      .finally(() => setSaving(false));
  };

  if (loading) return <Loading />;

  return (
    <div className="admin-section">
      <div className="admin-sec-header">
        <h2 className="admin-sec-title">🤖 Diálogos del Asistente Virtual</h2>
      </div>
      <p style={{ color: 'var(--color-cream)', marginBottom: '20px', fontSize: '0.95rem' }}>
        Configura lo que dice la mascota de Austral Collector dependiendo de la página en la que se encuentre el usuario. Puedes usar saltos de línea para separar el texto o HTML básico.
      </p>

      <form onSubmit={handleSave} className="admin-form-card" style={{ maxWidth: '800px' }}>
        <div className="admin-form-group" style={{ marginBottom: '15px' }}>
          <label>Página de Inicio</label>
          <textarea 
            className="admin-input" 
            rows="3" 
            value={texts.inicio} 
            onChange={(e) => handleChange('inicio', e.target.value)} 
            placeholder="Ej: ¡Hola! Bienvenido a Austral Collector."
          />
        </div>
        <div className="admin-form-group" style={{ marginBottom: '15px' }}>
          <label>Página Nosotros / Identidad</label>
          <textarea 
            className="admin-input" 
            rows="3" 
            value={texts.nosotros} 
            onChange={(e) => handleChange('nosotros', e.target.value)} 
          />
        </div>
        <div className="admin-form-group" style={{ marginBottom: '15px' }}>
          <label>Página Galería / Post</label>
          <textarea 
            className="admin-input" 
            rows="3" 
            value={texts.galeria} 
            onChange={(e) => handleChange('galeria', e.target.value)} 
          />
        </div>
        <div className="admin-form-group" style={{ marginBottom: '15px' }}>
          <label>Página Miembros / Perfiles</label>
          <textarea 
            className="admin-input" 
            rows="3" 
            value={texts.miembros} 
            onChange={(e) => handleChange('miembros', e.target.value)} 
          />
        </div>
        <div className="admin-form-group" style={{ marginBottom: '20px' }}>
          <label>Página de Contacto</label>
          <textarea 
            className="admin-input" 
            rows="3" 
            value={texts.contacto} 
            onChange={(e) => handleChange('contacto', e.target.value)} 
          />
        </div>

        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Guardando...' : '💾 Guardar Textos'}
        </button>
      </form>
    </div>
  );
}
