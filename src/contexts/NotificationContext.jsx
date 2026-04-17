import { useState, useEffect, useRef, useCallback } from 'react'

// ── GLOBAL HELPERS ─────────────────────────────────────────────
export const toast = {
  add: (message, type = 'info', duration = 4000) => {
    window.dispatchEvent(new CustomEvent('app-toast', { detail: { message, type, duration } }))
  },
  success: (message, duration) => toast.add(message, 'success', duration),
  error: (message, duration) => toast.add(message, 'error', duration),
  info: (message, duration) => toast.add(message, 'info', duration)
}

export const confirmDialog = (message) => {
  return new Promise((resolve) => {
    const handler = (e) => {
      window.removeEventListener('app-confirm-res', handler)
      resolve(e.detail)
    }
    window.addEventListener('app-confirm-res', handler)
    window.dispatchEvent(new CustomEvent('app-confirm', { detail: { message } }))
  })
}

// ── PROVIDER ───────────────────────────────────────────────────
export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const [confirm, setConfirm] = useState(null)
  const idRef = useRef(0)

  useEffect(() => {
    const handleToast = (e) => {
      const { message, type, duration } = e.detail
      const id = ++idRef.current
      setToasts(prev => [...prev, { id, message, type }])
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, duration || 4000)
    }

    const handleConfirm = (e) => {
      setConfirm({ message: e.detail.message })
    }

    window.addEventListener('app-toast', handleToast)
    window.addEventListener('app-confirm', handleConfirm)
    return () => {
      window.removeEventListener('app-toast', handleToast)
      window.removeEventListener('app-confirm', handleConfirm)
    }
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const handleConfirmResult = (result) => {
    window.dispatchEvent(new CustomEvent('app-confirm-res', { detail: result }))
    setConfirm(null)
  }

  return (
    <>
      {children}

      {/* ── Toast Container ── */}
      <div style={{
        position: 'fixed', top: '80px', right: '20px',
        zIndex: 99999, display: 'flex', flexDirection: 'column', gap: '10px',
        maxWidth: '360px', width: '100%', pointerEvents: 'none'
      }}>
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onRemove={removeToast} />
        ))}
      </div>

      {/* ── Confirm Modal ── */}
      {confirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
          zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px', backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #0d2830, #112a33)',
            border: '1px solid rgba(201,168,76,0.4)',
            borderRadius: '16px', padding: '32px 28px',
            maxWidth: '400px', width: '100%',
            boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
            animation: 'confirmSlideIn 0.2s ease'
          }}>
            <div style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '16px' }}>⚠️</div>
            <p style={{
              color: '#f0e4cc', fontSize: '1rem', textAlign: 'center',
              lineHeight: '1.6', marginBottom: '28px', fontFamily: 'var(--font-body)'
            }}>
              {confirm.message}
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => handleConfirmResult(false)}
                style={{
                  flex: 1, padding: '11px', borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: 'rgba(255,255,255,0.06)', color: '#ccc',
                  cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.target.style.background='rgba(255,255,255,0.12)'}
                onMouseLeave={e => e.target.style.background='rgba(255,255,255,0.06)'}
              >
                Cancelar
              </button>
              <button
                onClick={() => handleConfirmResult(true)}
                style={{
                  flex: 1, padding: '11px', borderRadius: '10px',
                  border: '1px solid rgba(192,57,43,0.6)',
                  background: 'linear-gradient(135deg, #c0392b, #96281b)',
                  color: '#fff', cursor: 'pointer',
                  fontSize: '0.9rem', fontWeight: '700',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.target.style.opacity='0.85'}
                onMouseLeave={e => e.target.style.opacity='1'}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes confirmSlideIn {
          from { opacity: 0; transform: scale(0.92) translateY(-12px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
      `}</style>
    </>
  )
}

// ── Toast Item Component ──────────────────────────────────────────
const TOAST_STYLES = {
  success: {
    bg: 'linear-gradient(135deg, #0d3326, #0a2c40)',
    border: 'rgba(46,178,102,0.5)',
    icon: '✅',
    accent: '#2eb266'
  },
  error: {
    bg: 'linear-gradient(135deg, #2d0a0a, #1a0808)',
    border: 'rgba(220,53,69,0.5)',
    icon: '❌',
    accent: '#dc3545'
  },
  info: {
    bg: 'linear-gradient(135deg, #0d2830, #0a1e2a)',
    border: 'rgba(45,110,126,0.5)',
    icon: 'ℹ️',
    accent: '#2d6e7e'
  },
  warning: {
    bg: 'linear-gradient(135deg, #2a1a00, #1a1000)',
    border: 'rgba(201,168,76,0.5)',
    icon: '⚠️',
    accent: '#c9a84c'
  }
}

function ToastItem({ toast, onRemove }) {
  const s = TOAST_STYLES[toast.type] || TOAST_STYLES.info
  return (
    <div
      onClick={() => onRemove(toast.id)}
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
        borderLeft: `4px solid ${s.accent}`,
        borderRadius: '12px',
        padding: '14px 16px',
        display: 'flex', alignItems: 'flex-start', gap: '12px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        cursor: 'pointer', pointerEvents: 'all',
        animation: 'toastSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <span style={{ fontSize: '1.2rem', flexShrink: 0, marginTop: '1px' }}>{s.icon}</span>
      <p style={{
        color: '#f0e4cc', fontSize: '0.88rem', lineHeight: '1.5',
        margin: 0, fontFamily: 'var(--font-body)', flex: 1
      }}>
        {toast.message}
      </p>
      <span style={{ color: 'rgba(240,228,204,0.4)', fontSize: '1rem', flexShrink: 0, lineHeight: 1 }}>×</span>
    </div>
  )
}

export function useNotification() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider')
  return ctx
}

// Global CSS for toast animation (injected once)
if (!document.getElementById('toast-styles')) {
  const style = document.createElement('style')
  style.id = 'toast-styles'
  style.textContent = `
    @keyframes toastSlideIn {
      from { opacity: 0; transform: translateX(60px) scale(0.9); }
      to   { opacity: 1; transform: translateX(0)    scale(1); }
    }
  `
  document.head.appendChild(style)
}
