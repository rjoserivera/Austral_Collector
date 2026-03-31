import { useParams } from 'react-router-dom'
import './PerfilPublicoPage.css'

const USER_DATA = {
  id: 'me',
  name: 'RetroTech_AR',
  headline: 'Especialista en Robots Japoneses de los 80',
  joined: 'Abril 2022',
  bio: 'Coleccionista apasionado de robots japoneses y juguetes del espacio de los años 70 y 80. Llevo más de 10 años juntando piezas únicas en ferias locales e internacionales. Siempre buscando sumar otro Shogun Warrior a la colección.',
  avatar: '/mock_avatar.png',
  banner: '/mock_banner.png',
  collection: [
    { id: 301, name: 'Robotech VF-1S', year: 1985, image: '/mock_fig2.png', likes: 21, saves: 4 },
    { id: 302, name: 'Skeletor Original', year: 1982, image: '/mock_fig3.png', likes: 45, saves: 12 },
    { id: 303, name: 'Macross SDF-1', year: 1984, image: '/mock_fig1.png', likes: 112, saves: 34 },
    { id: 304, name: 'Gundam Z', year: 1985, image: '/mock_fig1.png', likes: 88, saves: 20 },
    { id: 305, name: 'Voltron Lion Force', year: 1984, image: '/mock_fig2.png', likes: 210, saves: 55 },
    { id: 306, name: 'Mazinger Z Popy', year: 1978, image: '/mock_fig3.png', likes: 180, saves: 70 },
  ]
}

export default function PerfilPublicoPage() {
  const { id } = useParams()
  // En un caso real haríamos un fetch con el id. Usamos mock.

  return (
    <div className="perfil-page">
      {/* ── BANNER PANORÁMICO ──────────────────────────────────── */}
      <section className="perfil-header" style={{ backgroundImage: `url('${USER_DATA.banner}')` }}>
        <div className="perfil-overlay" aria-hidden="true"/>
      </section>

      <div className="section-wrapper perfil-content-wrapper">
        {/* ── CABECERA / INFO USUARIO ────────────────────────────── */}
        <section className="perfil-info-card">
          <div className="perfil-avatar-wrap">
            <div className="perfil-avatar-ring"/>
            <img src={USER_DATA.avatar} alt={USER_DATA.name} className="perfil-avatar"/>
          </div>
          <div className="perfil-user-details">
            <h1 className="perfil-name">{USER_DATA.name}</h1>
            <p className="perfil-headline">{USER_DATA.headline}</p>
            <div className="perfil-meta">
              <span>🗓️ Se unió en {USER_DATA.joined}</span>
              <span className="perfil-stat-sep">✦</span>
              <span>📦 {USER_DATA.collection.length} Figuras</span>
            </div>
            <p className="perfil-bio">{USER_DATA.bio}</p>
          </div>
        </section>

        <div className="gold-divider" style={{ margin: '40px 0 32px' }}/>

        {/* ── GALERÍA DE PORTAFOLIO ──────────────────────────────── */}
        <section className="perfil-portafolio">
          <h2 className="perfil-section-title">⚜️ Portafolio de Colección</h2>
          
          <div className="perfil-grid-4">
            {USER_DATA.collection.map(fig => (
              <article key={fig.id} className="perfil-card card">
                <div className="perfil-img-wrap">
                  <img src={fig.image} alt={fig.name} className="perfil-img" loading="lazy"/>
                </div>
                <div className="perfil-card-body">
                  <h4 className="perfil-card-name">{fig.name}</h4>
                  <span className="perfil-card-year">Año: {fig.year}</span>
                  <div className="perfil-card-meta">
                    <span className="perfil-counter red-heart">❤ {fig.likes}</span>
                    <span className="perfil-counter gray-star">⭐ {fig.saves}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
