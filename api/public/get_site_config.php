<?php
// api/public/get_site_config.php
require_once '../db.php';

try {
    $stmtCfg = $pdo->query("SELECT clave, valor FROM configuracion WHERE clave IN ('logo_sitio')");
    $globalConfig = $stmtCfg->fetchAll(PDO::FETCH_KEY_PAIR);

    echo json_encode([
        'success' => true,
        'config' => $globalConfig
    ]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
