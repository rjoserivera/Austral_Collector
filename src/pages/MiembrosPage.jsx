import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL, BASE_URL } from '../config.js'
import './MiembrosPage.css'

export default function MiembrosPage() {
  const [miembros, setMiembros] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${API_URL}/public/miembros_data.php`)
      .then(r => r.json())
      .then(d => {
        if (d.success) setMiembros(d.data)
        setLoading(false)
      })
      .catch(e => {
        console.error("Error cargando miembros:", e)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="miembros-page section-wrapper" style={{textAlign: 'center', paddingTop: '100px', color: '#aaa'}}>Cargando directorio de coleccionistas...</div>
  }

  return (
    <div className="miembros-page">
      <section className="mi-hero">
        <div className="mi-hero-inner section-wrapper">
          <div className="hp-hero-mascot-wrap mi-mascot-row">
            <div className="hp-mascot-glow" aria-hidden="true"/>
            <img src="/robot_completo_sin_fondo.png" alt="Mascota Robot Austral Collector" className="hp-mascot"/>
          </div>
          
          <div className="mi-hero-content">
            <h1 className="mi-hero-title">
              <span className="mi-title-teal">DIRECTORIO DE</span><br/>
              <span className="mi-title-red">COLECCIONISTAS</span>
            </h1>
            <p className="mi-hero-desc">Explora los perfiles de todos los miembros de Austral Collector. ¡Descubre sus figuras, conéctate y comparte tu pasión!</p>
          </div>
        </div>
      </section>

      <div className="mi-grid">
        {miembros.map(m => (
          <article key={m.id} className="mi-card" onClick={() => navigate(`/perfil/${m.username}`)}>
            <div className="mi-card-banner" style={{ backgroundImage: `url('${m.banner_url ? BASE_URL + '/' + m.banner_url : '/mock_banner.png'}')` }} />
            
            <div className="mi-card-avatar-wrap">
              <img src={m.avatar_url ? `${BASE_URL}/${m.avatar_url}` : '/mock_avatar.png'} alt={m.username} className="mi-card-avatar" loading="lazy" />
            </div>

            <div className="mi-card-body">
              <div className="mi-card-name-row">
                <h3 className="mi-card-name" title={m.username}>{m.username}</h3>
                {m.role === 'admin' && <span className="mi-card-role-badge">Admin</span>}
              </div>
              <p className="mi-card-headline" title={m.headline}>{m.headline || 'Coleccionista'}</p>
              <p className="mi-card-bio">{m.biografia || 'Sin biografía disponible. ¡Un coleccionista misterioso!'}</p>

              <div className="mi-card-stats">
                <div className="mi-card-stat" title="Publicaciones subidas">
                  <span>{m.total_posts}</span> 📦
                </div>
                <div className="mi-card-stat" title="Total de Me Gusta recibidos">
                  <span>{m.total_likes}</span> ❤️
                </div>
              </div>
            </div>
          </article>
        ))}

        {miembros.length === 0 && (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#aaa', marginTop: '40px' }}>No hay coleccionistas registrados aún.</p>
        )}
      </div>
    </div>
  )
}
