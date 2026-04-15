<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../db.php';

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

$viewer_username = $data['viewer_username'] ?? '';
$rated_user_id = $data['rated_user_id'] ?? 0;

if (empty($viewer_username) || !$rated_user_id) {
    echo json_encode(['success' => false, 'error' => 'Datos inválidos.']);
    exit;
}

try {
    $stmtViewer = $pdo->prepare("SELECT id FROM usuarios WHERE username = ?");
    $stmtViewer->execute([$viewer_username]);
    $viewer_id = $stmtViewer->fetchColumn();

    if (!$viewer_id) {
        echo json_encode(['success' => false, 'error' => 'Usuario autenticado inválido.']);
        exit;
    }

    $stmtDel = $pdo->prepare("DELETE FROM perfil_ratings WHERE rater_id = ? AND rated_user_id = ?");
    $stmtDel->execute([$viewer_id, $rated_user_id]);

    // Opcional: logear actividad
    $pdo->prepare("INSERT INTO logs (user_id, accion, tipo) VALUES (?, ?, 'perfil')")
        ->execute([$viewer_id, "Retiraste tu calificación del perfil #$rated_user_id."]);

    echo json_encode(['success' => true]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Error de base de datos: ' . $e->getMessage()]);
}
?>
