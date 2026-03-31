import { useState } from 'react'
import { Link } from 'react-router-dom'
import './UltimasFiguras.css'

const FIGURES = [
  {
    id: 1,
    name: 'Mazinger Z — Shogun Warriors',
    year: 1978,
    image: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=160&h=120&fit=crop',
    description: 'Rara figura de plástico duro de la línea Shogun Warriors de Mattel. Versión original japonesa con el escudo en el pecho completamente intacto y los detalles de pintura en excelente estado para su antigüedad.',
    globalLikes: 342,
    userLiked: false,
    userLikes: 0,
  },
  {
    id: 2,
    name: 'Optimus Prime — G1 Hasbro',
    year: 1984,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=160&h=120&fit=crop',
    description: 'Transformers Generation 1, primer año de lanzamiento. Caja original con ventana, instrucciones en japonés y inglés. Robot completo con todos sus accesorios originales incluyendo la pistola láser.',
    globalLikes: 518,
    userLiked: false,
    userLikes: 0,
  },
  {
    id: 3,
    name: 'Voltron — Lion Force',
    year: 1981,
    image: 'https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=160&h=120&fit=crop',
    description: 'Set completo de los 5 leones de la versión diecast original. Combinación funcional, piezas robustas y detalladas. Uno de los más codiciados por coleccionistas de robots japoneses de los 80.',
    globalLikes: 289,
    userLiked: false,
    userLikes: 0,
  },
]

function HeartCounter({ figureId, globalLikes, userLiked, userLikes, onToggle }) {
  return (
    <div className="heart-counter" id={`heart-${figureId}`}>
      <button
        className={`heart-btn ${userLiked ? 'heart-active' : ''}`}
        onClick={onToggle}
        title="Me gusta"
        aria-label="Toggle like"
      >
        {userLiked ? '❤️' : '🤍'}
        <span className="heart-label">Mis likes</span>
        <span className="heart-count">{userLikes}</span>
      </button>
      <div className="heart-divider" />
      <div className="heart-global">
        <span className="heart-icon-global">♥</span>
        <span className="heart-label">Global</span>
        <span className="heart-count">{globalLikes}</span>
      </div>
    </div>
  )
}

export default function UltimasFiguras() {
  const [figures, setFigures] = useState(FIGURES)

  const handleToggleLike = (id) => {
    setFigures(prev =>
      prev.map(f => {
        if (f.id !== id) return f
        if (f.userLiked) {
          return { ...f, userLiked: false, userLikes: f.userLikes - 1, globalLikes: f.globalLikes - 1 }
        } else {
          return { ...f, userLiked: true, userLikes: f.userLikes + 1, globalLikes: f.globalLikes + 1 }
        }
      })
    )
  }

  return (
    <section className="ultimas-figuras">
      <div className="section-label">Últimas Incorporaciones</div>
      <h2 className="section-heading">Figuras Recientes</h2>

      <div className="figuras-list">
        {figures.map(fig => (
          <article key={fig.id} className="card figura-card" id={`figura-${fig.id}`}>
            <div className="figura-img-wrap">
              <img src={fig.image} alt={fig.name} className="figura-img" loading="lazy" />
              <div className="figura-year-badge">{fig.year}</div>
            </div>
            <div className="figura-content">
              <h3 className="figura-name">{fig.name}</h3>
              <p className="figura-desc">{fig.description}</p>
              <div className="figura-footer">
                <HeartCounter
                  figureId={fig.id}
                  globalLikes={fig.globalLikes}
                  userLiked={fig.userLiked}
                  userLikes={fig.userLikes}
                  onToggle={() => handleToggleLike(fig.id)}
                />
                <button className="btn-outline figura-detail-btn">Ver detalle →</button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="figuras-explore">
        <Link to="/galeria" id="btn-explorar-galeria" className="btn-primary">
          🗂️ Explorar Galería
        </Link>
      </div>
    </section>
  )
}
