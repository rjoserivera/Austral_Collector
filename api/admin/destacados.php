<?php
// api/admin/destacados.php
// Created by Antigravity

require_once '../db.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        // Fetch current config
        $stmt = $pdo->query("SELECT * FROM configuracion");
        $configRows = $stmt->fetchAll();
        $config = [];
        foreach ($configRows as $row) {
            $config[$row['clave']] = $row['valor'];
        }

        // Fetch user list (for select)
        $stmtUsers = $pdo->query("SELECT id, username as nombre FROM usuarios WHERE is_active = 1 ORDER BY username ASC");
        $usuarios = $stmtUsers->fetchAll();

        // Fetch video list (for select)
        $stmtVideos = $pdo->query("SELECT id, titulo as nombre FROM videos ORDER BY created_at DESC");
        $videos = $stmtVideos->fetchAll();

        echo json_encode([
            'success' => true,
            'config' => $config,
            'listas' => [
                'usuarios' => $usuarios,
                'videos' => $videos
            ]
        ]);
    } 
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        $clave = $data['clave'] ?? '';
        $valor = $data['valor'] ?? '';

        if (!$clave) {
            echo json_encode(['success' => false, 'error' => 'Clave faltante']);
            exit;
        }

        // Update or insert config
        $stmt = $pdo->prepare("INSERT INTO configuracion (clave, valor) VALUES (?, ?) ON DUPLICATE KEY UPDATE valor = ?");
        $stmt->execute([$clave, $valor, $valor]);

        // Specific logic: sync with other tables if needed
        if ($clave === 'miembro_destacado' && $valor) {
            // Check if it's already the latest in destacado_mes
            $latest = $pdo->query("SELECT user_id FROM destacado_mes ORDER BY id DESC LIMIT 1")->fetchColumn();
            if ($latest != $valor) {
                $stmtDM = $pdo->prepare("INSERT INTO destacado_mes (user_id, mes_anio) VALUES (?, ?)");
                $stmtDM->execute([$valor, date('m-Y')]);
            }
        }

        echo json_encode(['success' => true]);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
