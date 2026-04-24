import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './VirtualAssistant.css';

export default function VirtualAssistant() {
  const [showBubble, setShowBubble] = useState(false);
  const [texts, setTexts] = useState({});
  const location = useLocation();

  useEffect(() => {
    fetch('/api/public/mascot_texts.php')
      .then(r => r.json())
      .then(d => {
        if (d.success) setTexts(d.data);
      })
      .catch(e => console.error(e));
  }, []);

  // Determine section based on current path
  const path = location.pathname;
  let section = 'inicio';
  if (path.includes('nosotros') || path.includes('identidad')) section = 'nosotros';
  else if (path.includes('galeria') || path.includes('post')) section = 'galeria';
  else if (path.includes('miembros') || path.includes('perfil')) section = 'miembros';
  else if (path.includes('contacto')) section = 'contacto';

  const defaultMsg = '<strong>Horario de Atención</strong><br/><small>Disponibles al correo de Lunes a Viernes, de 10:00 a 18:00 hrs</small>';
  const rawMsg = texts[section] || defaultMsg;

  // Convert newlines to <br/> if the user inputs plain text with newlines
  const htmlMsg = rawMsg.replace(/\n/g, '<br/>');

  return (
    <aside className="virtual-assistant-panel">
      {showBubble && (
        <div className="mascot-speech-bubble fade-in" dangerouslySetInnerHTML={{ __html: htmlMsg }} />
      )}
      <img 
        src="/austral_saludando.png" 
        alt="Mascota Austral" 
        className="mascot-img" 
        onClick={() => setShowBubble(!showBubble)}
        title="¡Hazme clic!"
      />
    </aside>
  );
}
