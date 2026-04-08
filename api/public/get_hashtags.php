<?php
// get_hashtags.php - Returns all distinct hashtag names for autocomplete

require_once '../db.php';

try {
    $stmt = $pdo->query("SELECT nombre FROM hashtags ORDER BY nombre ASC");
    $hashtags = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo json_encode(['success' => true, 'hashtags' => $hashtags]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'hashtags' => [], 'error' => $e->getMessage()]);
}
?>
