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
$score = $data['score'] ?? 0;

if (empty($viewer_username) || !$rated_user_id || $score < 1 || $score > 5) {
    echo json_encode(['success' => false, 'error' => 'Datos inválidos o puntuación incorrecta (1-5).']);
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

    if ($viewer_id == $rated_user_id) {
        echo json_encode(['success' => false, 'error' => 'No puedes puntuar tu propio perfil.']);
        exit;
    }

    $stmtUpsert = $pdo->prepare("
        INSERT INTO perfil_ratings (rater_id, rated_user_id, score) 
        VALUES (?, ?, ?) 
        ON DUPLICATE KEY UPDATE score = ?
    ");
    $stmtUpsert->execute([$viewer_id, $rated_user_id, $score, $score]);

    // Opcional: logear actividad
    $pdo->prepare("INSERT INTO logs (user_id, accion, tipo) VALUES (?, ?, 'perfil')")
        ->execute([$viewer_id, "Puntuaste el perfil #$rated_user_id con $score estrellas."]);

    echo json_encode(['success' => true]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Error de base de datos: ' . $e->getMessage()]);
}
?>
