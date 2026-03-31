import './VideosComunidad.css'

const VIDEOS = [
  {
    id: 1,
    title: 'Unboxing Mazinger Z 1978 — Popy Japan',
    author: 'RetroTech_AR',
    views: '12.4K',
    duration: '14:32',
    thumb: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=220&fit=crop',
  },
  {
    id: 2,
    title: 'Cómo restaurar figuras de lata oxidadas',
    author: 'VintageCollect',
    views: '8.7K',
    duration: '22:10',
    thumb: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=400&h=220&fit=crop',
  },
  {
    id: 3,
    title: 'Top 10 Transformers G1 más valiosos',
    author: 'SolitudeDust',
    views: '21.3K',
    duration: '18:45',
    thumb: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400&h=220&fit=crop',
  },
  {
    id: 4,
    title: 'Feria de Coleccionismo BA 2024 — Recorrido',
    author: 'AustralAdmin',
    views: '5.2K',
    duration: '9:20',
    thumb: 'https://images.unsplash.com/photo-1536825211030-094de935f680?w=400&h=220&fit=crop',
  },
]

function PlayIcon() {
  return (
    <svg className="play-icon" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="30" r="28" fill="rgba(0,0,0,0.6)" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
      <polygon points="24,18 46,30 24,42" fill="white" />
    </svg>
  )
}

export default function VideosComunidad() {
  return (
    <section className="videos-comunidad" id="videos">
      <div className="section-wrapper">
        <div className="section-label">Comunidad en Acción</div>
        <h2 className="section-heading">Videos de la Comunidad</h2>

        <div className="video-grid">
          {VIDEOS.map(vid => (
            <article
              key={vid.id}
              className="video-card card"
              id={`video-${vid.id}`}
              tabIndex={0}
              role="button"
              aria-label={`Reproducir: ${vid.title}`}
            >
              <div className="video-thumb-wrap">
                <img
                  src={vid.thumb}
                  alt={vid.title}
                  className="video-thumb"
                  loading="lazy"
                />
                <div className="video-overlay">
                  <PlayIcon />
                </div>
                <span className="video-duration">{vid.duration}</span>
              </div>
              <div className="video-info">
                <h3 className="video-title">{vid.title}</h3>
                <div className="video-meta">
                  <span className="video-author">👤 {vid.author}</span>
                  <span className="video-views">▶ {vid.views} vistas</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="videos-footer">
          <button className="btn-outline" id="btn-ver-videos">Ver más videos →</button>
        </div>
      </div>
    </section>
  )
}
