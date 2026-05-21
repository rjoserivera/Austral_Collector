<?php
// toggle_pin.php - Toggle the is_pinned status of a post
require_once '../db.php';

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

$postId = intval($data['post_id'] ?? 0);
$isPinned = intval($data['is_pinned'] ?? 0);

if (!$postId) {
    echo json_encode(['success' => false, 'error' => 'Post ID no válido']);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE posts SET is_pinned = ? WHERE id = ?");
    $stmt->execute([$isPinned, $postId]);
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
