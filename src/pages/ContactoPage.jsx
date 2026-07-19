import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import './ContactoPage.css'
import { API_URL } from '../config.js'
import { toast } from '../contexts/NotificationContext.jsx'

export default function ContactoPage() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('contacto')

  useEffect(() => {
    if (location.state && location.state.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location]);
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleContactoSubmit = (e) => {
    e.preventDefault()
    
    const nombre = document.getElementById('nombre_contacto').value.trim();
    const email = document.getElementById('email_contacto').value.trim();
    const asunto = document.getElementById('asunto_contacto').value.trim();
    const mensaje = document.getElementById('mensaje_contacto').value.trim();

    if (!nombre) {
      toast.error('❌ El nombre no puede estar vacío ni contener solo espacios.');
      return;
    }

    if (!asunto) {
      toast.error('❌ El asunto no puede estar vacío.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('❌ Ingresa un correo electrónico válido (ej: usuario@dominio.com).');
      return;
    }

    if (!mensaje) {
      toast.error('❌ El mensaje no puede estar vacío ni contener solo espacios.');
      return;
    }

    setIsSubmitting(true);

    fetch(`${API_URL}/public/contacto.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, asunto, mensaje })
    })
    .then(r => r.json())
    .then(d => {
      if (d.success) {
        toast.info('🚀 Te has comunicado con la administración. Te responderemos pronto. (Por favor revisa tu carpeta de SPAM entre hoy y mañana por si acaso)', 10000);
        document.getElementById('form-contacto').reset();
      } else {
        toast.error('❌ Error al enviar el correo: ' + d.error);
      }
    })
    .catch(e => {
      console.error(e);
      toast.error('❌ Error de conexión al enviar el correo.');
    })
    .finally(() => {
      setIsSubmitting(false);
    });
  }

  const handleRegistroSubmit = (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre_registro').value.trim();
    const email = document.getElementById('email_registro').value.trim();
    const username = document.getElementById('username_registro').value.trim();
    const fechaNacimiento = document.getElementById('fecha_nacimiento').value;

    if (!nombre || !email || !username || !fechaNacimiento) {
      toast.error('❌ Por favor completa todos los campos.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('❌ Ingresa un correo electrónico válido.');
      return;
    }

    setIsSubmitting(true);

    fetch(`${API_URL}/public/solicitud_registro.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, username, fechaNacimiento })
    })
    .then(r => r.json())
    .then(d => {
      if (d.success) {
        toast.info('🚀 Solicitud de registro enviada. La administración la revisará. (Por favor revisa tu carpeta de SPAM entre hoy y mañana por si acaso)', 10000);
        document.getElementById('form-registro').reset();
      } else {
        toast.error('❌ Error al enviar la solicitud: ' + d.error);
      }
    })
    .catch(e => {
      console.error(e);
      toast.error('❌ Error de conexión al enviar la solicitud.');
    })
    .finally(() => {
      setIsSubmitting(false);
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
            <h1 className="global-hero-title" style={{ textAlign: 'center', margin: 0 }}>
              <span className="global-title-red">CONTÁCTANOS</span>
            </h1>
            <p className="contacto-subtitle">¿Tienes alguna duda o sugerencia?<br/>Contáctanos y serás escuchado.</p>
          </div>
        </header>

        {/* ── CONTENEDOR UNIFICADO PESTAÑAS + FORMULARIO ──────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* ── SELECTOR DE PESTAÑAS ──────────────── */}
          <div className="perfil-tabs">
          <button 
            className={`tab-btn ${activeTab === 'contacto' ? 'active' : ''}`}
            onClick={() => setActiveTab('contacto')}
          >
            Formulario de Contacto
          </button>
          <button 
            className={`tab-btn ${activeTab === 'registro' ? 'active' : ''}`}
            onClick={() => setActiveTab('registro')}
          >
            Solicitud de Registro
          </button>
        </div>

        {/* ── FORMULARIO PRINCIPAL ──────────────── */}
        <div className="contacto-content-row">
          <section className="contacto-panel card-distressed" style={{ animation: 'fadeIn 0.3s ease-out' }}>
            
            {activeTab === 'contacto' ? (
              <>
                <h2 className="panel-title">Formulario de Contacto</h2>
                <form id="form-contacto" className="contacto-form-new" onSubmit={handleContactoSubmit}>
                  <div className="form-group-custom">
                    <label htmlFor="nombre_contacto">Nombre y Apellido</label>
                    <input type="text" id="nombre_contacto" required disabled={isSubmitting} />
                  </div>
                  <div className="form-group-custom">
                    <label htmlFor="email_contacto">Correo Electrónico</label>
                    <input type="email" id="email_contacto" required disabled={isSubmitting} />
                  </div>
                  <div className="form-group-custom">
                    <label htmlFor="asunto_contacto">Asunto</label>
                    <input type="text" id="asunto_contacto" placeholder="Ej: Consulta, Sugerencia, Alianza..." required disabled={isSubmitting} />
                  </div>
                  <div className="form-group-custom">
                    <label htmlFor="mensaje_contacto">Mensaje</label>
                    <textarea id="mensaje_contacto" rows="4" placeholder="Escribe tu mensaje, duda o sugerencia aquí..." required disabled={isSubmitting}></textarea>
                  </div>
                  
                  <div className="form-actions">
                    <button type="submit" className="btn-enviar-custom" disabled={isSubmitting}>
                      {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h2 className="panel-title">Solicitud de Registro</h2>
                <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '20px', textAlign: 'center' }}>
                  Completa tus datos para solicitar el ingreso al coleccionismo. Un administrador revisará tu solicitud y creará tu cuenta verifica tu correo el apartado de spam.
                </p>
                <form id="form-registro" className="contacto-form-new" onSubmit={handleRegistroSubmit}>
                  <div className="form-group-custom">
                    <label htmlFor="nombre_registro">Nombre y Apellido</label>
                    <input type="text" id="nombre_registro" required disabled={isSubmitting} />
                  </div>
                  <div className="form-group-custom">
                    <label htmlFor="email_registro">Correo Electrónico</label>
                    <input type="email" id="email_registro" required disabled={isSubmitting} />
                  </div>
                  <div className="form-group-custom">
                    <label htmlFor="username_registro">Nombre de Usuario Deseado</label>
                    <input type="text" id="username_registro" required disabled={isSubmitting} />
                  </div>
                  <div className="form-group-custom">
                    <label htmlFor="fecha_nacimiento">Fecha de Nacimiento</label>
                    <input type="date" id="fecha_nacimiento" required disabled={isSubmitting} />
                  </div>
                  
                  <div className="form-actions">
                    <button type="submit" className="btn-enviar-custom" disabled={isSubmitting}>
                      {isSubmitting ? 'Enviando Solicitud...' : 'Solicitar Registro'}
                    </button>
                  </div>
                </form>
              </>
            )}

          </section>
        </div>
        </div> {/* Cierra contenedor unificado */}

      </div>
    </div>
  )
}
