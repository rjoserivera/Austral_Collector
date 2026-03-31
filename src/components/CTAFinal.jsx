import './CTAFinal.css'
import { Link } from 'react-router-dom'

export default function CTAFinal() {
  return (
    <section className="cta-final" id="comunidad">
      <div className="cta-bg-overlay" aria-hidden="true" />
      <div className="cta-grain" aria-hidden="true" />

      <div className="cta-inner section-wrapper">
        <div className="cta-star" aria-hidden="true">✦</div>

        <div className="cta-ornament top" aria-hidden="true">
          <div className="ornament-line" />
          <span className="ornament-diamond">◆</span>
          <div className="ornament-line" />
        </div>

        <h2 className="cta-title">Únete a la Comunidad</h2>
        <p className="cta-subtitle">
          Más de <strong>1.800 coleccionistas</strong> ya comparten sus tesoros.<br />
          Registrate gratis y empezá a catalogar tu colección hoy.
        </p>

        <div className="cta-actions">
          <button onClick={() => alert("Función de registro aún no implementada.")} id="btn-unirse-cta" className="btn-primary cta-btn">
            ✦ Unirse Ahora
          </button>
          <button className="btn-outline cta-btn">Conocer Más →</button>
        </div>

        <div className="cta-ornament bottom" aria-hidden="true">
          <div className="ornament-line" />
          <span className="ornament-diamond">◆</span>
          <div className="ornament-line" />
        </div>

        <div className="cta-trust">
          <span>🔒 Sin costo</span>
          <span>✔ Sin publicidad</span>
          <span>🎖️ Comunidad verificada</span>
        </div>
      </div>
    </section>
  )
}
