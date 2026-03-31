import './MiembroDestacado.css'

const MEMBER = {
  name: 'Alejandro Vidal',
  username: '@RetroTech_AR',
  avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&h=120&fit=crop&crop=face',
  bio: 'Coleccionista apasionado de robots japoneses y juguetes del espacio de los 70-80. Más de 200 piezas en la colección.',
  likes: 3480,
  verified: true,
  pieces: 215,
  badges: [
    { emoji: '🥇', label: 'Top Coleccionista' },
    { emoji: '🔬', label: 'Verificado' },
    { emoji: '⭐', label: 'Nivel 8' },
    { emoji: '🏆', label: 'Premio 2024' },
    { emoji: '🤝', label: 'Mentor' },
  ],
}

export default function MiembroDestacado() {
  return (
    <aside className="miembro-destacado card" id="miembro-destacado">
      {/* Header */}
      <div className="sidebar-panel-header">
        <span className="sidebar-panel-icon">👑</span>
        <h3 className="sidebar-panel-title">Miembro Destacado</h3>
      </div>
      <div className="gold-divider" />

      {/* Avatar */}
      <div className="miembro-avatar-section">
        <div className="miembro-avatar-frame">
          <div className="miembro-avatar-ring" />
          <img
            src={MEMBER.avatar}
            alt={`Foto de ${MEMBER.name}`}
            className="miembro-avatar"
          />
          {MEMBER.verified && (
            <div className="miembro-verified" title="Verificado">✔</div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="miembro-info">
        <h4 className="miembro-name">{MEMBER.name}</h4>
        <span className="miembro-username">{MEMBER.username}</span>
        <p className="miembro-bio">{MEMBER.bio}</p>
      </div>

      {/* Stats */}
      <div className="miembro-stats">
        <div className="miembro-stat">
          <span className="miembro-stat-num">♥ {MEMBER.likes.toLocaleString()}</span>
          <span className="miembro-stat-lbl">Likes</span>
        </div>
        <div className="miembro-stat-div" />
        <div className="miembro-stat">
          <span className="miembro-stat-num">{MEMBER.pieces}</span>
          <span className="miembro-stat-lbl">Piezas</span>
        </div>
      </div>

      {/* Badges */}
      <div className="miembro-badges-section">
        <span className="miembro-badges-label">Insignias</span>
        <div className="miembro-badges">
          {MEMBER.badges.map((b, i) => (
            <div key={i} className="miembro-badge" title={b.label} id={`badge-${i}`}>
              <span className="badge-emoji">{b.emoji}</span>
            </div>
          ))}
        </div>
      </div>

      <button className="btn-outline sidebar-ver-mas-btn" style={{ marginTop: '16px' }}>
        Ver Perfil Completo →
      </button>
    </aside>
  )
}
