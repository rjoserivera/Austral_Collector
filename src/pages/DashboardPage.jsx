import { useState } from 'react'
import { Link } from 'react-router-dom'
import './DashboardPage.css'

const MY_FIGURES = [
  { id: 201, name: 'Robotech VF-1S', year: 1985, image: '/mock_fig2.png', likes: 21, saves: 4 },
  { id: 202, name: 'Skeletor Original', year: 1982, image: '/mock_fig3.png', likes: 45, saves: 12 },
  { id: 203, name: 'Macross SDF-1', year: 1984, image: '/mock_fig1.png', likes: 112, saves: 34 },
  { id: 204, name: 'Gundam Z', year: 1985, image: '/mock_fig1.png', likes: 88, saves: 20 },
  { id: 205, name: 'Voltron Lion Force', year: 1984, image: '/mock_fig2.png', likes: 210, saves: 55 },
]

export default function DashboardPage() {
  const [bio, setBio] = useState('Coleccionista apasionado de robots japoneses y figuras vintage...')

  return (
    <div className="dashboard-page section-wrapper">

      {/* ── HEADER DASHBOARD ──────────────────────────────────── */}
      <h1 className="db-title">Mi Panel de Coleccionista</h1>
      <p className="db-subtitle">Administra tu perfil público y tu inventario de figuras.</p>
      <div className="gold-divider" style={{ margin: '16px 0 32px' }}/>

      <div className="db-layout">

        {/* ── COLUMNA IZQ: EDICIÓN DE PERFIL ──────────────────── */}
        <aside className="db-sidebar card">
          <h2 className="db-section-title">⚙️ Editar Perfil</h2>

          <div className="db-field">
            <label className="db-label">Biografía</label>
            <textarea
              className="db-textarea"
              rows={4}
              value={bio}
              onChange={e => setBio(e.target.value)}
            />
          </div>

          <div className="db-field">
            <label className="db-label">Avatar (Foto Circular)</label>
            <div className="db-media-preview">
              <img
                src="/mock_avatar.png"
                alt="Mi Avatar"
                className="db-avatar-img"
              />
              <div className="db-media-actions">
                <button className="btn-outline db-btn-sm">✏️ Editar</button>
                <button className="btn-outline db-btn-sm btn-danger">🗑️ Eliminar</button>
              </div>
            </div>
          </div>

          <div className="db-field">
            <label className="db-label">Fondo de Cabecera (Banner)</label>
            <div className="db-media-preview">
              <div className="db-banner-img-wrap">
                <img
                  src="/mock_banner.png"
                  alt="Fondo Cabecera"
                  className="db-banner-img"
                />
              </div>
              <div className="db-media-actions">
                <button className="btn-outline db-btn-sm">✏️ Editar</button>
                <button className="btn-outline db-btn-sm btn-danger">🗑️ Eliminar</button>
              </div>
            </div>
          </div>

          <div className="db-save-block">
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Guardar Cambios
            </button>
          </div>
        </aside>

        {/* ── COLUMNA DER: INVENTARIO (4 COLUMNAS) ────────────── */}
        <main className="db-main">
          <div className="db-inventory-header">
            <div>
              <h2 className="db-section-title">📦 Tus Figuras</h2>
              <span className="db-inventory-count">{MY_FIGURES.length} piezas en tu colección publicadas</span>
            </div>
            <button className="btn-primary db-add-btn">
              <span className="db-add-icon">＋</span> Subir Nueva Figura
            </button>
          </div>

          <div className="db-grid-4">
            {MY_FIGURES.map(fig => (
              <article key={fig.id} className="db-card card">
                <div className="db-card-img-wrap">
                  <img src={fig.image} alt={fig.name} className="db-card-img" loading="lazy"/>
                </div>
                <div className="db-card-body">
                  <h4 className="db-card-name">{fig.name}</h4>
                  <span className="db-card-year">{fig.year}</span>
                  <div className="db-card-meta">
                    <span className="db-counter red-heart">❤ {fig.likes}</span>
                    <span className="db-counter gray-star">⭐ {fig.saves}</span>
                  </div>
                </div>
                {/* Overlay actions on hover */}
                <div className="db-card-overlay">
                  <button className="db-action-btn edit" title="Editar">✏️</button>
                  <button className="db-action-btn delete" title="Eliminar">🗑️</button>
                </div>
              </article>
            ))}

            {/* Empty slot placeholder */}
            <div className="db-card card db-card-empty">
              <button className="db-empty-add-btn">
                <span className="db-empty-plus">＋</span>
                <span>Subir Nueva</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
