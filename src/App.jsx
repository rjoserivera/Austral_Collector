import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import HomePage from './pages/HomePage'
import PortafolioPage from './pages/PortafolioPage'
import GaleriaPage from './pages/GaleriaPage'
import DashboardPage from './pages/DashboardPage'
import PerfilPublicoPage from './pages/PerfilPublicoPage'
import AdminPage from './pages/AdminPage'
import ContactoPage from './pages/ContactoPage'

function App() {
  return (
    <div className="app-root">
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/portafolio" element={<PortafolioPage />} />
        <Route path="/galeria" element={<GaleriaPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/perfil/:id" element={<PerfilPublicoPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/contacto" element={<ContactoPage />} />
      </Routes>
    </div>
  )
}

export default App
