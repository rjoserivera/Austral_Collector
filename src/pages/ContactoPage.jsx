import './ContactoPage.css'
import { API_URL } from '../config.js'
import { toast } from '../contexts/NotificationContext.jsx'

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
    .catch(e => {
      console.error(e);
      toast.error('❌ Error de conexión al enviar el correo.');
    });
  }

  return (
    <div className="contacto-page">
      <div className="contacto-bg" aria-hidden="true"/>
      <div className="contacto-grain" aria-hidden="true"/>

      <div className="section-wrapper contacto-inner-narrow">
        
        {/* ── HERO HEADER ────────────────────────────────────────── */}
        <header className="contacto-hero-row">
          <img src="/robot_sin_fondon.png" alt="Austral Collector Robot" className="contacto-hero-robot"/>
          <div className="contacto-hero-text">
            <h1 className="contacto-title-main">CONTÁCTANOS</h1>
            <p className="contacto-subtitle">¿Tienes alguna duda o sugerencia?<br/>Contáctanos y serás escuchado.</p>
          </div>
        </header>

        {/* ── FORMULARIO PRINCIPAL ──────────────── */}
        <div className="contacto-content-row">
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
        </div>


      </div>
    </div>
  )
}
