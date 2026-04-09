<?php
require_once __DIR__ . '/api/db.php';

$sql = "
CREATE TABLE IF NOT EXISTS identidad (
    id VARCHAR(50) PRIMARY KEY,
    icon VARCHAR(50) NOT NULL,
    title VARCHAR(100) NOT NULL,
    descripcion TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO identidad (id, icon, title, descripcion) VALUES
('mision', '🎯', 'Misión', 'Reunir a coleccionistas apasionados en una comunidad activa donde pueden compartir, exhibir y perseguir piezas únicas del mundo del entretenimiento.'),
('valores', '⭐', 'Valores', 'Comunidad, respeto, pasión por la historia, autenticidad y colaboración entre miembros.'),
('metas', '🏆', 'Metas', 'Expandir la comunidad a nivel nacional, organizar eventos presenciales y posicionarnos como referentes del coleccionismo en Chile.');
";

try {
    $pdo->exec($sql);
    echo "Tabla identidad creada o actualizada exitosamente.\n";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
