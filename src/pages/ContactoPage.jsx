import './ContactoPage.css'
import { API_URL } from '../config.js'

export default function ContactoPage() {
  const handleSubmit = (e) => {
    e.preventDefault()
    
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const mensaje = document.getElementById('mensaje').value;

    fetch(`${API_URL}/public/contacto.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, mensaje })
    })
    .then(r => r.json())
    .then(d => {
      if (d.success) {
        toast.info('🚀 Mensaje enviado. Te contactaremos pronto al correo que incluiste.');
        document.querySelector('.contacto-form-new').reset();
      } else {
        toast.error('❌ Error al enviar el correo: ' + d.error);
      }
    })
    .catch(err => {
      console.error(err);
      toast.error('❌ Error de red al intentar enviar el mensaje.');
    });
  }

  return (
    <div className="contacto-page">
      <div className="contacto-bg" aria-hidden="true"/>
      <div className="contacto-grain" aria-hidden="true"/>

      <div className="section-wrapper contacto-inner-narrow">
        
        {/* ── HERO HEADER ────────────────────────────────────────── */}
        <header className="contacto-hero-row">
          <img src="/austral_saludando.png" alt="Austral Collector Robot" className="contacto-hero-robot"/>
          <div className="contacto-hero-text">
            <h1 className="contacto-title-main">CONTÁCTANOS</h1>
            <p className="contacto-subtitle">¿Tienes alguna duda o sugerencia?<br/>Contáctanos y serás escuchado.</p>
          </div>
        </header>

        {/* ── FORMULARIO ────────────────────────────────────────── */}
        <section className="contacto-panel card-distressed">
          <h2 className="panel-title">
            <span className="skull-icon" aria-hidden="true">💀</span> Formulario de Contacto
          </h2>

          <form className="contacto-form-new" onSubmit={handleSubmit}>
            <div className="form-group-custom">
              <label htmlFor="nombre">Nombre y Apellido</label>
              <input type="text" id="nombre" required />
            </div>
            <div className="form-group-custom">
              <label htmlFor="email">Correo Electrónico</label>
              <input type="email" id="email" required />
            </div>
            <div className="form-group-custom">
              <label htmlFor="mensaje">Mensaje</label>
              <textarea id="mensaje" rows="4" placeholder="Escribe tu mensaje, duda o sugerencia aquí..." required></textarea>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn-enviar-custom">Enviar Mensaje</button>
            </div>
          </form>
        </section>

        {/* ── INFO Y REDES ───────────────────────────────────────── */}
        <aside className="contacto-panel card-distressed-sub">
          <h2 className="panel-title">
            <span className="loc-icon" aria-hidden="true">📍</span> Contáctanos
          </h2>
          
          <div className="contacto-info-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="c-info-line">
              <span className="info-emoji">✉️</span> 
              <div>
                <strong>E-mail de Contacto:</strong><br/>
                {/* TODO (PRODUCCIÓN): Cambiar al correo oficial cuando se levante el proyecto.
                    Correo oficial: australcollector@gmail.com
                <a href="mailto:australcollector@gmail.com" style={{ color: '#fff', textDecoration: 'none' }}>australcollector@gmail.com</a>
                */}
                <a href="mailto:austral.cadmin@gmail.com" style={{ color: '#fff', textDecoration: 'none' }}>austral.cadmin@gmail.com</a>
              </div>
            </div>
            <div className="c-info-line">
              <span className="info-emoji">📞</span> 
              <div>
                <strong>+56 9 1234 5678</strong><br/>
                <small>(Próximamente)</small>
              </div>
            </div>
            <div className="c-info-line">
              <span className="info-emoji">🕒</span> 
              <div>
                <strong>Horario de Atención</strong><br/>
                <small>Disponibles al correo de Lunes a Viernes, de 10:00 a 18:00 hrs</small>
              </div>
            </div>
          </div>

          <div className="social-footer">
            <p style={{ color: '#fff', fontWeight: '500' }}>Síguenos en nuestras redes sociales:</p>
            <div className="social-icons-real">
              <a href="https://www.facebook.com/profile.php?id=61573729671622" target="_blank" rel="noopener noreferrer" className="real-soc fb" aria-label="Facebook">
                <svg viewBox="0 0 320 512"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/></svg>
              </a>
              {/* Twitter eliminado: Austral Collector no posee cuenta en Twitter/X */}
              <a href="https://www.instagram.com/australcollector/" target="_blank" rel="noopener noreferrer" className="real-soc ig" aria-label="Instagram">
                <svg viewBox="0 0 448 512"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12.2 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>
              </a>
              <a href="https://www.youtube.com/@AUSTRALCOLLECTOR" target="_blank" rel="noopener noreferrer" className="real-soc yt" aria-label="YouTube">
                <svg viewBox="0 0 576 512"><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/></svg>
              </a>
            </div>
          </div>
        </aside>
        
      </div>
    </div>
  )
}
