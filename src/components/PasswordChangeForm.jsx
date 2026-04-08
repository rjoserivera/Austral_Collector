import { useState } from 'react';

export default function PasswordChangeForm({ username, apiUrl, onSuccess }) {
  const [passActual, setPassActual] = useState('');
  const [passNuevo, setPassNuevo] = useState('');
  const [passConfirm, setPassConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null); // { type: 'ok'|'error', text }

  const handleSubmit = (e) => {
    e.preventDefault();
    setMsg(null);
    if (passNuevo !== passConfirm) { setMsg({ type: 'error', text: 'Las contraseñas nuevas no coinciden.' }); return; }
    if (passNuevo.length < 6) { setMsg({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres.' }); return; }

    setSaving(true);
    fetch(`${apiUrl}/auth/cambiar_password.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password_actual: passActual, password_nuevo: passNuevo })
    })
    .then(r => r.json())
    .then(d => {
      if (d.success) {
        setMsg({ type: 'ok', text: '✅ Contraseña actualizada correctamente.' });
        setPassActual(''); setPassNuevo(''); setPassConfirm('');
        if (onSuccess) onSuccess();
      } else {
        setMsg({ type: 'error', text: d.error || 'Error al actualizar.' });
      }
    })
    .catch(e => setMsg({ type: 'error', text: e.message }))
    .finally(() => setSaving(false));
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px', textAlign: 'left' }}>
      {msg && (
        <div style={{ 
          padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem', textAlign: 'center',
          background: msg.type === 'ok' ? 'rgba(0,200,100,0.15)' : 'rgba(200,50,50,0.15)',
          border: `1px solid ${msg.type === 'ok' ? '#00c864' : '#c83232'}`,
          color: msg.type === 'ok' ? '#7fff99' : '#ffb5b5'
        }}>
          {msg.text}
        </div>
      )}
      <input 
        type="password" placeholder="Contraseña actual temporal" 
        value={passActual} onChange={e => setPassActual(e.target.value)} 
        className="login-input" style={{ fontSize: '0.85rem', padding: '8px 12px', width: '100%' }} required 
      />
      <input 
        type="password" placeholder="Tu NUEVA contraseña" 
        value={passNuevo} onChange={e => setPassNuevo(e.target.value)} 
        className="login-input" style={{ fontSize: '0.85rem', padding: '8px 12px', width: '100%' }} required 
      />
      <input 
        type="password" placeholder="Confirmar NUEVA contraseña" 
        value={passConfirm} onChange={e => setPassConfirm(e.target.value)} 
        className="login-input" style={{ fontSize: '0.85rem', padding: '8px 12px', width: '100%' }} required 
      />
      <button type="submit" className="btn-primary" style={{ fontSize: '0.85rem', padding: '10px 12px', width: '100%', justifyContent: 'center' }} disabled={saving}>
        {saving ? 'Actualizando...' : '🔐 Actualizar Contraseña'}
      </button>
    </form>
  );
}
