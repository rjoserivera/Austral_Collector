import './VerifiedBadge.css'
import { BASE_URL } from '../config.js'

/**
 * VerifiedBadge
 * Muestra la insignia de verificación al lado del nombre de usuario.
 *
 * Props:
 *   type       - 'austral' | 'external' | 'none' | null
 *   badgeUrl   - ruta relativa de la imagen (solo para type='external')
 *   size       - tamaño en px (default 20)
 */
export default function VerifiedBadge({ type, badgeUrl, size = 20 }) {
  if (!type || type === 'none') return null

  if (type === 'austral') {
    return (
      <span
        className="verified-badge type-austral"
        data-tooltip="✓ Verificado por Austral Collector"
        style={{ width: size, height: size }}
      >
        <img
          src="/logo_head.png"
          alt="Verificado por Austral Collector"
          width={size}
          height={size}
        />
      </span>
    )
  }

  if (type === 'external' && badgeUrl) {
    return (
      <span
        className="verified-badge type-external"
        data-tooltip="✓ Colaborador Externo"
        style={{ width: size, height: size }}
      >
        <img
          src={badgeUrl.startsWith('http') ? badgeUrl : `${BASE_URL}/${badgeUrl}`}
          alt="Colaborador Externo"
          width={size}
          height={size}
        />
      </span>
    )
  }

  return null
}
