<?php
// api/public/portafolio_data.php
// Endpoint público para servir los datos del Portafolio (sin auth)

require_once '../db.php';

try {
    // 1. Galería de fotos
    $stmt = $pdo->query("SELECT * FROM galeria_portafolio ORDER BY orden ASC, id ASC");
    $galeria = $stmt->fetchAll();

    // 2. Videos dinámicos (Nueva Tabla)
    $stmtV = $pdo->query("SELECT * FROM videos_portafolio ORDER BY orden ASC, id ASC");
    $videos = $stmtV->fetchAll();

    // 3. Configuración (imagen comunidad)
    $stmt2 = $pdo->query("SELECT clave, valor FROM configuracion WHERE clave = 'portafolio_comunidad'");
    $config = $stmt2->fetch();

    echo json_encode([
        'success'       => true,
        'galeria'       => $galeria,
        'videos'        => $videos,
        'comunidad_img' => $config['portafolio_comunidad'] ?? '',
    ]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
