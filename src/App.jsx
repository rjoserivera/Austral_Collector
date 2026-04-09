import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import PortafolioPage from './pages/PortafolioPage'
import GaleriaPage from './pages/GaleriaPage'
import MiembrosPage from './pages/MiembrosPage'
import DashboardPage from './pages/DashboardPage'
import PerfilPublicoPage from './pages/PerfilPublicoPage'
import AdminPage from './pages/AdminPage'
import ContactoPage from './pages/ContactoPage'
import LoginPage from './pages/LoginPage'
import PasswordChangeForm from './components/PasswordChangeForm'
import { API_URL } from './config.js'
import { syncOfflinePosts } from './utils/offlineSync.js'

const getAuthUser = () => {
  const raw = localStorage.getItem('austral_auth_user');
  try { if (raw) return JSON.parse(raw).username || raw; } catch(e) {}
  return raw;
};

function App() {
  const [requirePassChange, setRequirePassChange] = useState(() => localStorage.getItem('austral_auth_require_pass_change') === 'true')
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    // Verificar en cada cambio de ruta si el usuario necesita cambiar su clave
    const needsChange = localStorage.getItem('austral_auth_require_pass_change') === 'true'
    setRequirePassChange(needsChange)
  }, [location])

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false)
      syncOfflinePosts(API_URL)
    }
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Attempt sync immediately on load if online
    if (navigator.onLine) {
      syncOfflinePosts(API_URL)
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <div className="app-root">
      {isOffline && (
        <div style={{ background: '#c0392b', color: 'white', textAlign: 'center', padding: '6px', fontWeight: 'bold', fontSize: '0.85rem' }}>
          Estás sin conexión a Internet. Estás en modo Lectura/Offline.
        </div>
      )}
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/portafolio" element={<PortafolioPage />} />
        <Route path="/galeria" element={<GaleriaPage />} />
        <Route path="/miembros" element={<MiembrosPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/perfil/:id" element={<PerfilPublicoPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/contacto" element={<ContactoPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>

      <Footer />

      {/* Modal GLobal: Forzar cambio de contraseña */}
      {requirePassChange && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(5,7,12,0.95)', zIndex: 10000,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '24px'
        }}>
          <div style={{
            background: '#121212', border: '1px solid var(--color-gold)', borderRadius: '12px',
            padding: '40px', maxWidth: '400px', width: '100%', textAlign: 'center'
          }}>
            <h2 style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-title)', marginBottom: '12px' }}>
              ⚠️ Cambio Requerido
            </h2>
            <p style={{ color: 'var(--color-cream)', fontSize: '0.95rem', marginBottom: '24px' }}>
              Estás usando una clave temporal. Por tu seguridad, debes crear una nueva contraseña antes de continuar.
            </p>
            <PasswordChangeForm 
              username={getAuthUser()}  
              apiUrl={API_URL}
              onSuccess={() => {
                setRequirePassChange(false)
                localStorage.removeItem('austral_auth_require_pass_change')
              }}
            />
            {/* Ocultamos el botón de cerrar para obligar al cambio, y damos un logout fallback por si acaso */}
            <button 
              className="btn-secondary" 
              style={{ marginTop: '20px', width: '100%', background: 'transparent', border: 'none', color: '#ffb5b5', textDecoration: 'underline' }}
              onClick={() => {
                localStorage.clear()
                navigate('/login')
              }}
            >
              Cancelar e Iniciar Sesión con otra cuenta
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
