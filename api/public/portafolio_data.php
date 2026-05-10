<?php
// api/public/portafolio_data.php
// Endpoint público para servir los datos del Portafolio (sin auth)

require_once '../db.php';

try {
    // 1. Grupos y sus Items (Reemplaza galeria y videos individuales)
    $stmtG = $pdo->query("SELECT * FROM portafolio_grupos ORDER BY orden ASC, id ASC");
    $gruposRaw = $stmtG->fetchAll();

    $stmtI = $pdo->query("SELECT * FROM portafolio_items ORDER BY orden ASC, id ASC");
    $itemsRaw = $stmtI->fetchAll();

    $itemsByGroup = [];
    foreach ($itemsRaw as $item) {
        $itemsByGroup[$item['grupo_id']][] = $item;
    }

    $grupos = [];
    foreach ($gruposRaw as $g) {
        $g['items'] = $itemsByGroup[$g['id']] ?? [];
        $grupos[] = $g;
    }

    // 2. Imagen de la comunidad (Configuración)
    $stmtC = $pdo->prepare("SELECT valor FROM configuracion WHERE clave = 'portafolio_comunidad'");
    $stmtC->execute();
    $comunidad_img = $stmtC->fetchColumn() ?: '';

    echo json_encode([
        'success' => true,
        'grupos' => $grupos,
        'comunidad_img' => $comunidad_img
    ]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
