import './FigurasMasVotadas.css'

const RANKED = [
  {
    id: 1,
    rank: 1,
    name: 'Gundam RX-78-2 — First Grade',
    year: 1980,
    image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=80&h=80&fit=crop',
    likes: 1204,
    collector: 'RetroTech_AR',
  },
  {
    id: 2,
    rank: 2,
    name: 'Grendizer — Popy Godaikin',
    year: 1976,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&h=80&fit=crop',
    likes: 987,
    collector: 'VintageCollect',
  },
  {
    id: 3,
    rank: 3,
    name: 'Battle of the Planets — Gatchaman',
    year: 1979,
    image: 'https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=80&h=80&fit=crop',
    likes: 754,
    collector: 'SolitudeDust',
  },
]

const RANK_MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' }
const RANK_COLORS = {
  1: 'linear-gradient(135deg, #C9A84C 0%, #E2C06A 50%, #C9A84C 100%)',
  2: 'linear-gradient(135deg, #9e9e9e 0%, #c9c9c9 50%, #9e9e9e 100%)',
  3: 'linear-gradient(135deg, #8B5E3C 0%, #C4895C 50%, #8B5E3C 100%)',
}

export default function FigurasMasVotadas() {
  return (
    <section className="figuras-votadas">
      <div className="section-label">Ranking Comunidad</div>
      <h2 className="section-heading">Figuras Más Votadas</h2>

      <div className="ranking-list">
        {RANKED.map(fig => (
          <article key={fig.id} className="card ranking-card" id={`ranking-${fig.id}`}>
            {/* Rank badge */}
            <div
              className="rank-badge"
              style={{ background: RANK_COLORS[fig.rank] }}
              aria-label={`Puesto ${fig.rank}`}
            >
              <span className="rank-medal">{RANK_MEDALS[fig.rank]}</span>
              <span className="rank-num">#{fig.rank}</span>
            </div>

            {/* Image */}
            <div className="ranking-img-wrap">
              <img src={fig.image} alt={fig.name} className="ranking-img" loading="lazy" />
            </div>

            {/* Info */}
            <div className="ranking-info">
              <h3 className="ranking-name">{fig.name}</h3>
              <span className="ranking-year">{fig.year}</span>
              <span className="ranking-collector">por {fig.collector}</span>
            </div>

            {/* Like bar */}
            <div className="ranking-likes-wrap">
              <div className="ranking-likes-count">
                <span className="ranking-likes-icon">♥</span>
                <span className="ranking-likes-num">{fig.likes.toLocaleString()}</span>
              </div>
              <div className="ranking-bar-bg">
                <div
                  className="ranking-bar-fill"
                  style={{ width: `${(fig.likes / 1204) * 100}%` }}
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
