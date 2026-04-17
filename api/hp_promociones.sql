-- ============================================================
-- hp_promociones.sql
-- Tabla para gestionar las secciones promocionales del Home
-- Ejecutar en: austral_collector_db
-- ============================================================

CREATE TABLE IF NOT EXISTS `hp_promociones` (
  `id`        INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `seccion`   ENUM('carousel','sidebar','bottom') NOT NULL DEFAULT 'carousel'
              COMMENT 'carousel=Partners, sidebar=Panel lateral, bottom=Destacados',
  `titulo`    VARCHAR(120) NOT NULL,
  `subtitulo` VARCHAR(200) DEFAULT NULL,
  `imagen_url` VARCHAR(300) DEFAULT NULL,
  `link_url`  VARCHAR(500) NOT NULL,
  `btn_texto` VARCHAR(60)  DEFAULT 'Ver más',
  `orden`     TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `activo`    TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_seccion_activo` (`seccion`, `activo`, `orden`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos de prueba para previsualización
INSERT INTO `hp_promociones` (`seccion`, `titulo`, `subtitulo`, `imagen_url`, `link_url`, `btn_texto`, `orden`) VALUES
-- CAROUSEL (logos de partners)
('carousel', 'MercadoLibre',  'Tienda oficial',         NULL, 'https://mercadolibre.cl',          'Ir a la tienda', 1),
('carousel', 'Falabella',     'Figuras y coleccionables',NULL, 'https://falabella.com',            'Ver catálogo',   2),
('carousel', 'Linio Chile',   'Importados premium',      NULL, 'https://linio.falabella.com/cl-es','Explorar',       3),
-- SIDEBAR (panel lateral derecho)
('sidebar',  'Facebook Austral', 'Únete a nuestra comunidad', NULL, 'https://facebook.com', 'Seguirnos', 1),
('sidebar',  'Discord del Gremio', 'Chat en tiempo real',     NULL, 'https://discord.com',  'Entrar',    2),
-- BOTTOM (tarjetas grandes)
('bottom',   'Tienda Partner #1', 'Las mejores figuras de importación a precios accesibles para la comunidad.', NULL, 'https://example.com', 'Ir a la Tienda', 1),
('bottom',   'Comunidad Otaku CL', 'Foro y mercado de coleccionismo nacional.',                                  NULL, 'https://example.com', 'Unirse Ahora',   2),
('bottom',   'Guía del Coleccionista', 'Artículos, reseñas y tips para hacer crecer tu colección.',             NULL, 'https://example.com', 'Leer Más',       3);
