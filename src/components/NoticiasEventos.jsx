import './NoticiasEventos.css'

const EVENTOS = [
  {
    id: 1,
    title: 'Feria de Coleccionismo Buenos Aires 2025',
    date: '15 Abr 2025',
    image: 'https://images.unsplash.com/photo-1536825211030-094de935f680?w=80&h=60&fit=crop',
    tag: 'Feria',
  },
  {
    id: 2,
    title: 'Subasta Online — Robots Japoneses Vintage',
    date: '22 Abr 2025',
    image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=80&h=60&fit=crop',
    tag: 'Subasta',
  },
  {
    id: 3,
    title: 'Meet & Collectors — Zona Norte GBA',
    date: '10 May 2025',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=80&h=60&fit=crop',
    tag: 'Evento',
  },
]

const TAG_COLORS = {
  Feria: '#C0392B',
  Subasta: '#C9A84C',
  Evento: '#3A7D44',
}

export default function NoticiasEventos() {
  return (
    <aside className="noticias-eventos card" id="noticias">
      <div className="sidebar-panel-header">
        <span className="sidebar-panel-icon">📅</span>
        <h3 className="sidebar-panel-title">Noticias &amp; Eventos</h3>
      </div>
      <div className="gold-divider" />

      <ul className="evento-list">
        {EVENTOS.map(ev => (
          <li key={ev.id} className="evento-item" id={`evento-${ev.id}`}>
            <div className="evento-thumb-wrap">
              <img src={ev.image} alt={ev.title} className="evento-thumb" loading="lazy" />
              <span
                className="evento-tag"
                style={{ background: TAG_COLORS[ev.tag] }}
              >{ev.tag}</span>
            </div>
            <div className="evento-info">
              <h4 className="evento-title">{ev.title}</h4>
              <span className="evento-date">📅 {ev.date}</span>
            </div>
          </li>
        ))}
      </ul>

      <button className="btn-outline sidebar-ver-mas-btn">Ver todos los eventos →</button>
    </aside>
  )
}
