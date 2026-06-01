<?php
// api/get_site_config.php - Endpoint público para configuración del sitio (logo, etc.)
require_once __DIR__ . '/db.php';

try {
    $stmtCfg = $pdo->query("SELECT clave, valor FROM configuracion WHERE clave IN ('logo_sitio')");
    $globalConfig = $stmtCfg->fetchAll(PDO::FETCH_KEY_PAIR);

    echo json_encode([
        'success' => true,
        'config'  => $globalConfig ?: new stdClass()
    ]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
