<?php
// toggle_like.php
require_once '../db.php';

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!isset($data['username']) || !isset($data['post_id'])) {
    echo json_encode(['success' => false, 'error' => 'Faltan datos (username, post_id)']);
    exit;
}

$username = $data['username'];
$postId = intval($data['post_id']);

try {
    // 1. Obtener user id
    $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE username = ?");
    $stmt->execute([$username]);
    $userId = $stmt->fetchColumn();

    if (!$userId) {
        echo json_encode(['success' => false, 'error' => 'Usuario no encontrado']);
        exit;
    }

    // 2. Revisar si ya dio like
    $stmt = $pdo->prepare("SELECT 1 FROM likes WHERE user_id = ? AND post_id = ?");
    $stmt->execute([$userId, $postId]);
    $alreadyLiked = $stmt->fetchColumn();

    if ($alreadyLiked) {
        // Quitar Like
        $pdo->prepare("DELETE FROM likes WHERE user_id = ? AND post_id = ?")->execute([$userId, $postId]);
        $action = 'unliked';
    } else {
        // Dar Like
        $pdo->prepare("INSERT INTO likes (user_id, post_id) VALUES (?, ?)")->execute([$userId, $postId]);
        $action = 'liked';
    }

    // 3. Obtener el total actualizado
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM likes WHERE post_id = ?");
    $stmt->execute([$postId]);
    $totalLikes = $stmt->fetchColumn();

    echo json_encode(['success' => true, 'action' => $action, 'total_likes' => $totalLikes]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
