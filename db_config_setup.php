<?php
require_once __DIR__ . '/api/db.php';

$sql = "
CREATE TABLE IF NOT EXISTS configuracion (
    clave VARCHAR(50) PRIMARY KEY,
    valor TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO configuracion (clave, valor) VALUES
('miembro_destacado', ''),
('video_destacado_1', ''),
('video_destacado_2', ''),
('video_destacado_3', ''),
('video_destacado_4', '');
";

try {
    $pdo->exec($sql);
    echo "Tabla configuracion creada o actualizada exitosamente.\n";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
