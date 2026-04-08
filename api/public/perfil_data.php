<?php
// perfil_data.php - User Profile and Posts
// Created by Antigravity

require_once '../db.php';

$username = $_GET['username'] ?? '';

if (empty($username)) {
    echo json_encode(['error' => 'Usuario no especificado']);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM usuarios WHERE username = ?");
$stmt->execute([$username]);
$user = $stmt->fetch();

if (!$user) {
    echo json_encode(['error' => 'Usuario no encontrado']);
    exit;
}

unset($user['password']);

$viewerName = $_GET['viewer_username'] ?? '';
$viewerId = 0;
if ($viewerName) {
    $stmtV = $pdo->prepare("SELECT id FROM usuarios WHERE username = ?");
    $stmtV->execute([$viewerName]);
    $viewerId = $stmtV->fetchColumn() ?: 0;
}

$stmtPosts = $pdo->prepare(
    "SELECT p.*,
     (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as total_likes,
     (SELECT 1 FROM likes WHERE user_id = ? AND post_id = p.id) as userLiked
     FROM posts p WHERE user_id = ? ORDER BY orden ASC, created_at DESC"
);
$stmtPosts->execute([$viewerId, $user['id']]);
$posts = $stmtPosts->fetchAll();

// Enrich each post with imagenes_extra (decoded) and hashtags
foreach ($posts as &$post) {
    // Decode imagenes_extra JSON
    $post['imagenes_extra'] = isset($post['imagenes_extra'])
        ? json_decode($post['imagenes_extra'], true) ?? []
        : [];

    // Fetch hashtags for this post
    $hStmt = $pdo->prepare(
        "SELECT h.nombre FROM hashtags h
         JOIN post_hashtags ph ON ph.hashtag_id = h.id
         WHERE ph.post_id = ?"
    );
    $hStmt->execute([$post['id']]);
    $post['hashtags'] = $hStmt->fetchAll(PDO::FETCH_COLUMN);
}
unset($post);

$stmtStats = $pdo->prepare(
    "SELECT COUNT(*) as total_posts,
     (SELECT COUNT(*) FROM likes WHERE post_id IN (SELECT id FROM posts WHERE user_id = ?)) as total_likes
     FROM posts WHERE user_id = ?"
);
$stmtStats->execute([$user['id'], $user['id']]);
$stats = $stmtStats->fetch();

echo json_encode([
    'success' => true,
    'data' => [
        'id'              => $user['id'],
        'username'        => $user['username'],
        'email'           => $user['email'],
        'nombre'          => $user['nombre'],
        'apellido'        => $user['apellido'],
        'biografia'       => $user['biografia'],
        'avatar_url'      => $user['avatar_url'],
        'banner_url'      => $user['banner_url'],
        'role'            => $user['role'],
        'fecha_nacimiento' => $user['fecha_nacimiento'],
        'stats'           => $stats,
        'collection'      => $posts
    ]
]);
?>
