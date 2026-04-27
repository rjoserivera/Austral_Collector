<?php
// perfil_data.php - User Profile and Posts
// Created by Antigravity

require_once '../db.php';

$username = $_GET['username'] ?? '';

if (empty($username)) {
    echo json_encode(['error' => 'Usuario no especificado']);
    exit;
}

// Accept either a username string or a numeric ID
if (is_numeric($username)) {
    $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE id = ?");
    $stmt->execute([(int)$username]);
} else {
    $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE username = ?");
    $stmt->execute([$username]);
}
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

$stats = [
    'total_posts' => 0,
    'total_likes' => 0,
    'average_rating' => 0.0,
    'total_ratings' => 0,
    'viewer_rating' => null
];

// Stats from User ID
$stats['total_posts'] = $pdo->query("SELECT COUNT(*) FROM posts WHERE user_id = {$user['id']}")->fetchColumn();
$stats['total_likes'] = $pdo->query("SELECT COUNT(*) FROM likes WHERE post_id IN (SELECT id FROM posts WHERE user_id = {$user['id']})")->fetchColumn();

// Ratings Stats
$ratingData = $pdo->query("SELECT ROUND(AVG(score), 1) as avg_score, COUNT(*) as count FROM perfil_ratings WHERE rated_user_id = {$user['id']}")->fetch();
if ($ratingData) {
    $stats['average_rating'] = $ratingData['avg_score'] ?: 0.0;
    $stats['total_ratings'] = $ratingData['count'];
}

// Check viewer rating if viewer is logged in
if ($viewerId > 0) {
    $vRating = $pdo->prepare("SELECT score FROM perfil_ratings WHERE rater_id = ? AND rated_user_id = ?");
    $vRating->execute([$viewerId, $user['id']]);
    $stats['viewer_rating'] = $vRating->fetchColumn() ?: null;
}

// Formatear cumpleaños
$cumpleanios = null;
if ($user['fecha_nacimiento']) {
    $date = new DateTime($user['fecha_nacimiento']);
    $meses = [
        1 => 'enero', 2 => 'febrero', 3 => 'marzo', 4 => 'abril', 5 => 'mayo', 6 => 'junio',
        7 => 'julio', 8 => 'agosto', 9 => 'septiembre', 10 => 'octubre', 11 => 'noviembre', 12 => 'diciembre'
    ];
    $dia = $date->format('j'); // día sin cero inicial
    $mes = $meses[(int)$date->format('n')];
    $cumpleanios = $dia . ' de ' . $mes;
}

echo json_encode([
    'success' => true,
    'data' => [
        'id'                 => $user['id'],
        'username'           => $user['username'],
        'email'              => $user['email'],
        'nombre'             => $user['nombre'],
        'apellido'           => $user['apellido'],
        'biografia'          => $user['biografia'],
        'avatar_url'         => $user['avatar_url'],
        'banner_url'         => $user['banner_url'],
        'role'               => $user['role'],
        'fecha_nacimiento'   => $user['fecha_nacimiento'],
        'cumpleanios'        => $cumpleanios,
        'verification_type'  => $user['verification_type']  ?? 'none',
        'verification_badge' => $user['verification_badge'] ?? null,
        'stats'              => $stats,
        'collection'         => $posts
    ]
]);
?>
