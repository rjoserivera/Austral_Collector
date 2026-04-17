import { useState } from 'react';
import './VirtualAssistant.css';

export default function VirtualAssistant() {
  const [showBubble, setShowBubble] = useState(false);

  return (
    <aside className="virtual-assistant-panel">
      {showBubble && (
        <div className="mascot-speech-bubble fade-in">
          <strong>Horario de Atención</strong><br/>
          <small>Disponibles al correo de Lunes a Viernes, de 10:00 a 18:00 hrs</small>
        </div>
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
