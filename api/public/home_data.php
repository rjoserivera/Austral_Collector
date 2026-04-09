<?php
// home_data.php - Home Page Content Aggregator
// Created by Antigravity

require_once '../db.php';

try {
    $viewerName = $_GET['viewer_username'] ?? '';
    $viewerId = 0;
    if ($viewerName) {
        $stmtV = $pdo->prepare("SELECT id FROM usuarios WHERE username = ?");
        $stmtV->execute([$viewerName]);
        $viewerId = $stmtV->fetchColumn() ?: 0;
    }

    // 1. Latest posts (Ultimas) - Only Figuras
    $stmtUltimas = $pdo->prepare("SELECT p.*, u.username as autor, u.avatar_url as autor_avatar,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as total_likes,
        (SELECT 1 FROM likes WHERE user_id = ? AND post_id = p.id) as userLiked
        FROM posts p JOIN usuarios u ON p.user_id = u.id 
        WHERE p.tipo = 'figura'
        ORDER BY p.created_at DESC LIMIT 10");
    $stmtUltimas->execute([$viewerId]);
    $ultimas = $stmtUltimas->fetchAll();

    // 2. Most voted (Votadas) - Only Figuras
    $stmtVotadas = $pdo->prepare("SELECT p.*, u.username as autor, u.avatar_url as autor_avatar,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as total_likes,
        (SELECT 1 FROM likes WHERE user_id = ? AND post_id = p.id) as userLiked
        FROM posts p JOIN usuarios u ON p.user_id = u.id 
        WHERE p.tipo = 'figura'
        ORDER BY total_likes DESC LIMIT 6");
    $stmtVotadas->execute([$viewerId]);
    $votadas = $stmtVotadas->fetchAll();

    // 3. Featured videos
    // Try to get specific IDs from configuration
    $stmtCfg = $pdo->query("SELECT clave, valor FROM configuracion WHERE clave LIKE 'video_destacado_%'");
    $videoConfigs = $stmtCfg->fetchAll(PDO::FETCH_KEY_PAIR);
    $videoIds = array_filter(array_values($videoConfigs));

    if (!empty($videoIds)) {
        $placeholders = implode(',', array_fill(0, count($videoIds), '?'));
        // Order by the specific IDs provided in config slots
        $stmtVideos = $pdo->prepare("SELECT * FROM videos WHERE id IN ($placeholders) ORDER BY FIELD(id, $placeholders)");
        $stmtVideos->execute(array_merge($videoIds, $videoIds));
        $videos = $stmtVideos->fetchAll();
    } else {
        $stmtVideos = $pdo->query("SELECT * FROM videos ORDER BY destacado DESC, created_at DESC LIMIT 4");
        $videos = $stmtVideos->fetchAll();
    }

    // 4. Upcoming events
    $stmtEventos = $pdo->query("SELECT * FROM eventos ORDER BY created_at DESC LIMIT 5");
    $eventos = $stmtEventos->fetchAll();

    // 5. Featured member (Destacado del Mes)
    // Check configuration first
    $miembroId = $pdo->query("SELECT valor FROM configuracion WHERE clave = 'miembro_destacado'")->fetchColumn();
    
    if ($miembroId) {
        $stmtDestacadoUser = $pdo->prepare("SELECT * FROM usuarios WHERE id = ?");
        $stmtDestacadoUser->execute([$miembroId]);
        $destacadoUser = $stmtDestacadoUser->fetch();
    } else {
        $stmtDestacado = $pdo->query("SELECT u.* FROM usuarios u JOIN destacado_mes d ON u.id = d.user_id ORDER BY d.id DESC LIMIT 1");
        $destacadoUser = $stmtDestacado->fetch();
    }
    
    $destacado = null;
    if ($destacadoUser) {
        unset($destacadoUser['password']);
        $stmtStats = $pdo->prepare("SELECT (SELECT COUNT(*) FROM posts WHERE user_id = ?) as posts, (SELECT COUNT(*) FROM likes WHERE post_id IN (SELECT id FROM posts WHERE user_id = ?)) as likes");
        $stmtStats->execute([$destacadoUser['id'], $destacadoUser['id']]);
        $stats = $stmtStats->fetch();
        $destacado = ['user' => $destacadoUser, 'stats' => $stats];
    }

    // 6. Latest Cosplays
    $stmtCosplay = $pdo->prepare("SELECT p.*, u.username as autor, u.avatar_url as autor_avatar,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as total_likes,
        (SELECT 1 FROM likes WHERE user_id = ? AND post_id = p.id) as userLiked
        FROM posts p JOIN usuarios u ON p.user_id = u.id WHERE p.tipo = 'cosplay' ORDER BY p.created_at DESC LIMIT 4");
    $stmtCosplay->execute([$viewerId]);
    $ultimos_cosplays = $stmtCosplay->fetchAll();

    // 7. Cumpleaneros: Buscar si hay alguien de cumpleaños hoy o mañana
    $stmtCumple = $pdo->query("
        SELECT *, 
        IF(DATE_FORMAT(fecha_nacimiento, '%c-%d') = DATE_FORMAT(CURDATE(), '%c-%d'), 'hoy', 'manana') as estado_cumple 
        FROM usuarios 
        WHERE DATE_FORMAT(fecha_nacimiento, '%c-%d') IN (DATE_FORMAT(CURDATE(), '%c-%d'), DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 1 DAY), '%c-%d')) 
        AND is_active = 1
    ");
    $rawCumple = $stmtCumple->fetchAll();
    
    $cumpleaneros = [];
    foreach ($rawCumple as $u) {
        unset($u['password']);
        $stmtStatsC = $pdo->prepare("SELECT (SELECT COUNT(*) FROM posts WHERE user_id = ?) as posts, (SELECT COUNT(*) FROM likes WHERE post_id IN (SELECT id FROM posts WHERE user_id = ?)) as likes");
        $stmtStatsC->execute([$u['id'], $u['id']]);
        $statsC = $stmtStatsC->fetch();
        $cumpleaneros[] = ['user' => $u, 'stats' => $statsC];
    }

    // 8. Global Dynamic Text Configs
    $stmtConfigGen = $pdo->query("SELECT clave, valor FROM configuracion WHERE clave IN ('txt_destacado', 'txt_cumple')");
    $globalConfig = $stmtConfigGen->fetchAll(PDO::FETCH_KEY_PAIR);

    echo json_encode([
        'success' => true,
        'data' => [
            'ultimas' => $ultimas,
            'votadas' => $votadas,
            'videos' => $videos,
            'eventos' => $eventos,
            'destacado' => $destacado,
            'ultimos_cosplays' => $ultimos_cosplays,
            'cumpleaneros' => $cumpleaneros,
            'config' => $globalConfig
        ]
    ]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
