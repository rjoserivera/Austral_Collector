import './AdminPage.css'

const ACTIVITY_LOG = [
  { id: 1, user: 'RetroTech_AR', avatar: '/mock_avatar.png', action: 'Publicó una nueva figura: "Gundam Z"', time: 'Hace 5 min' },
  { id: 2, user: 'VintageCollect', avatar: '/mock_avatar.png', action: 'Dio like a "Optimus Prime G1"', time: 'Hace 12 min' },
  { id: 3, user: 'Dave', avatar: '/mock_avatar.png', action: 'Editó su biografía de perfil.', time: 'Hace 1 hora' },
  { id: 4, user: 'SolitudeDust', avatar: '/mock_avatar.png', action: 'Comentó en el Tablón de Mensajes', time: 'Hace 2 horas' },
  { id: 5, user: 'AdminMaster', avatar: '/logov2_sin_fondo.png', action: 'Restableció la contraseña del usuario #451', time: 'Hace 4 horas' },
]

export default function AdminPage() {
  return (
    <div className="admin-page section-wrapper">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Panel de Control General</h1>
          <p className="admin-subtitle">Vista de administración master (Nivel 5).</p>
        </div>
        <div className="admin-status">
          <span className="status-dot"></span> Sistemas Operativos
        </div>
      </div>

      {/* ── 4 BLOQUES DE GESTIÓN (Grid 2x2) ───────────────────── */}
      <section className="admin-dashboard-grid">
        
        {/* Bloque 1: Contenidos */}
        <div className="admin-panel card">
          <div className="panel-header">
            <h3 className="panel-title">⭐ Administrar Contenidos</h3>
          </div>
          <p className="panel-desc">Gestiona figuras, eventos y posts del feed público.</p>
          <div className="panel-actions">
            <button className="btn-outline admin-btn-action" title="Agregar">➕ Agregar</button>
            <button className="btn-outline admin-btn-action" title="Editar">✏️ Editar</button>
            <button className="btn-outline admin-btn-action danger" title="Eliminar">🗑️ Eliminar</button>
          </div>
        </div>

        {/* Bloque 2: Usuarios */}
        <div className="admin-panel card">
          <div className="panel-header">
            <h3 className="panel-title">👥 Gestionar Usuarios</h3>
          </div>
          <p className="panel-desc">Alta, baja y modificación de cuentas de coleccionistas.</p>
          <div className="panel-actions">
            <button className="btn-outline admin-btn-action" title="Crear Cuenta">➕ Crear</button>
            <button className="btn-outline admin-btn-action" title="Reset Password">🔑 Reset Pass</button>
            <button className="btn-outline admin-btn-action danger" title="Eliminar Cuenta">💀 Banear</button>
          </div>
        </div>

        {/* Bloque 3: Tablón */}
        <div className="admin-panel card">
          <div className="panel-header">
            <h3 className="panel-title">📋 Tablón de Mensajes</h3>
            <span className="badge-alert">3 Nuevos</span>
          </div>
          <p className="panel-desc">Revisa reportes, alertas de comunidad y mensajes directos al soporte.</p>
          <div className="panel-actions" style={{ marginTop: 'auto' }}>
            <button className="btn-primary" style={{ width: '100%' }}>Ir al Tablón</button>
          </div>
        </div>

        {/* Bloque 4: Actividad Preview */}
        <div className="admin-panel card">
          <div className="panel-header">
            <h3 className="panel-title">⚡ Actividad en Vivo</h3>
          </div>
          <ul className="live-activity-list">
            <li className="live-activity-item">
              <span className="live-time">10:42</span>
              <span className="live-text">Dave subió "He-Man".</span>
            </li>
            <li className="live-activity-item">
              <span className="live-time">10:39</span>
              <span className="live-text">Nuevo registro: user_99</span>
            </li>
          </ul>
        </div>
      </section>

      {/* ── LOG DE ACTIVIDAD RECIENTE (Tabla) ─────────────────── */}
      <section className="admin-log-section card">
        <div className="log-header">
          <h2 className="admin-section-title">Log de Actividad Reciente</h2>
          <button className="btn-outline log-btn-sm">Ver Todo →</button>
        </div>
        
        <div className="log-table-wrap">
          <table className="log-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Acción Realizada</th>
                <th>Tiempo Transcurrido</th>
                <th>Ver</th>
              </tr>
            </thead>
            <tbody>
              {ACTIVITY_LOG.map(log => (
                <tr key={log.id}>
                  <td className="td-user">
                    <img src={log.avatar} alt="Avatar" className="log-avatar" />
                    <span>{log.user}</span>
                  </td>
                  <td className="td-action">{log.action}</td>
                  <td className="td-time">{log.time}</td>
                  <td className="td-btn">
                    <button className="btn-outline log-btn-sm">Detalle</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  )
}
