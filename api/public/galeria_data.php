<?php
// galeria_data.php - Gallery Content Filtered
// Created by Antigravity

require_once '../db.php';

$tipo = $_GET['tipo'] ?? 'todas';
$tag  = $_GET['tag'] ?? '';
$viewerName = $_GET['viewer_username'] ?? '';
$viewerId = 0;
if ($viewerName) {
    $stmtV = $pdo->prepare("SELECT id FROM usuarios WHERE username = ?");
    $stmtV->execute([$viewerName]);
    $viewerId = $stmtV->fetchColumn() ?: 0;
}

try {
    $sql    = "SELECT p.*, u.username as autor,
               (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as total_likes,
               (SELECT 1 FROM likes WHERE user_id = ? AND post_id = p.id) as userLiked
               FROM posts p JOIN usuarios u ON p.user_id = u.id";
    $params = [$viewerId];

    if ($tipo !== 'todas') {
        $sql .= " WHERE p.tipo = ?";
        $params[] = $tipo;
    }

    if (!empty($tag)) {
        // Filter by hashtag name via pivot
        $sql .= (strpos($sql, 'WHERE') === false ? " WHERE" : " AND")
              . " p.id IN (SELECT ph.post_id FROM post_hashtags ph JOIN hashtags h ON h.id = ph.hashtag_id WHERE h.nombre = ?)";
        $params[] = $tag;
    }

    $sql .= " ORDER BY p.created_at DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $posts = $stmt->fetchAll();

    // Enrich posts with imagenes_extra and hashtags
    foreach ($posts as &$post) {
        $post['imagenes_extra'] = isset($post['imagenes_extra'])
            ? json_decode($post['imagenes_extra'], true) ?? []
            : [];

        $hStmt = $pdo->prepare(
            "SELECT h.nombre FROM hashtags h
             JOIN post_hashtags ph ON ph.hashtag_id = h.id
             WHERE ph.post_id = ?"
        );
        $hStmt->execute([$post['id']]);
        $post['hashtags'] = $hStmt->fetchAll(PDO::FETCH_COLUMN);
    }
    unset($post);

    echo json_encode([
        'success' => true,
        'posts'   => $posts
    ]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
