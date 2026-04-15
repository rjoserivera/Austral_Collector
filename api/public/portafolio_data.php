<?php
// api/public/portafolio_data.php
// Endpoint público para servir los datos del Portafolio (sin auth)

require_once '../db.php';

try {
    // 1. Galería de fotos
    $stmt = $pdo->query("SELECT * FROM galeria_portafolio ORDER BY orden ASC, id ASC");
    $galeria = $stmt->fetchAll();

    // 2. Configuración (videos + imagen comunidad)
    $stmt2 = $pdo->query("SELECT clave, valor FROM configuracion WHERE clave LIKE 'portafolio_%'");
    $configRows = $stmt2->fetchAll();
    $config = [];
    foreach ($configRows as $row) {
        $config[$row['clave']] = $row['valor'];
    }

    // Armar lista de videos
    $videos = [];
    for ($i = 1; $i <= 4; $i++) {
        $key = "portafolio_video_{$i}";
        if (!empty($config[$key])) {
            $videos[] = [
                'id'      => $i,
                'link_yt' => $config[$key],
                'titulo'  => "Video {$i}"
            ];
        }
    }

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
