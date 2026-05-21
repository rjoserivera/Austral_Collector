import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './VirtualAssistant.css';

export default function VirtualAssistant() {
  const [showBubble, setShowBubble] = useState(false);
  const [texts, setTexts] = useState({});
  const location = useLocation();
  const mascotRef = useRef(null);

  useEffect(() => {
    fetch('/api/public/mascot_texts.php')
      .then(r => r.json())
      .then(d => {
        if (d.success) setTexts(d.data);
      })
      .catch(e => console.error(e));
  }, []);

  // Auto-show bubble when page/route changes
  useEffect(() => {
    setShowBubble(false);
    const timer = setTimeout(() => setShowBubble(true), 1000);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const [isIdle, setIsIdle] = useState(true);

  useEffect(() => {
    let idleTimer;
    
    const handleActivity = (e) => {
      if (window.innerWidth <= 768) {
        const isMascotTouch = mascotRef.current && e && mascotRef.current.contains(e.target);

        if (isMascotTouch) {
          // Si toca la mascota: solo reinicia el timer, NO la oculta
          clearTimeout(idleTimer);
          idleTimer = setTimeout(() => {
            setIsIdle(true);
            setShowBubble(true);
          }, 5000);
        } else {
          // Actividad normal: ocultar mascota si estaba tocando fuera
          if (e && (e.type === 'scroll' || e.type === 'touchmove' || e.type === 'touchstart' || e.type === 'click')) {
            setShowBubble(false);
          }
          setIsIdle(false);
          clearTimeout(idleTimer);
          idleTimer = setTimeout(() => {
            setIsIdle(true);
            setShowBubble(true);
          }, 5000); // 5 segundos de inactividad
        }
      } else {
        setIsIdle(true); // En escritorio siempre visible
      }
    };

    const events = ['scroll', 'touchmove', 'touchstart', 'mousedown', 'click', 'resize', 'keydown', 'mousemove'];
    events.forEach(event => window.addEventListener(event, handleActivity, { passive: true }));

    // Ejecutar una vez al montar para ocultarlo inicialmente en móvil si se desea
    handleActivity();

    return () => {
      clearTimeout(idleTimer);
      events.forEach(event => window.removeEventListener(event, handleActivity));
    };
  }, []);

  // Determine section based on current path
  const path = location.pathname;
  let section = 'inicio';
  if (path.includes('nosotros') || path.includes('identidad') || path.includes('portafolio')) section = 'nosotros';
  else if (path.includes('galeria') || path.includes('post')) section = 'galeria';
  else if (path.includes('miembros') || path.includes('perfil')) section = 'miembros';
  else if (path.includes('contacto')) section = 'contacto';

  const defaultMsg = '<strong>Horario de Atención</strong><br/><small>Disponibles al correo de Lunes a Viernes, de 10:00 a 18:00 hrs</small>';
  const rawMsg = texts[section] || defaultMsg;

  // Convert newlines to <br/> if the user inputs plain text with newlines
  const htmlMsg = rawMsg.replace(/\n/g, '<br/>');

  const isHidden = !isIdle && !showBubble;

  return (
    <aside className={`virtual-assistant-panel ${isHidden ? 'hidden' : ''}`}>
      {showBubble && (
        <div className="mascot-speech-bubble fade-in" dangerouslySetInnerHTML={{ __html: htmlMsg }} />
      )}
      <img 
        ref={mascotRef}
        src="/austral_saludando.png" 
        alt="Mascota Austral" 
        className="mascot-img" 
        onClick={() => setShowBubble(prev => !prev)}
        title="¡Hazme clic!"
      />
    </aside>
  );
}
