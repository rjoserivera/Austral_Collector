<?php
// get_stats.php - Statistics for Admin Dashboard
// Created by Antigravity

require_once '../db.php';

try {
    $stats = [
        'usuarios' => $pdo->query("SELECT COUNT(*) FROM usuarios")->fetchColumn(),
        'perfiles' => $pdo->query("SELECT COUNT(DISTINCT user_id) FROM posts")->fetchColumn(),
        'figuras'  => $pdo->query("SELECT COUNT(*) FROM posts WHERE tipo = 'figura'")->fetchColumn(),
        'cosplays' => $pdo->query("SELECT COUNT(*) FROM posts WHERE tipo = 'cosplay'")->fetchColumn(),
        'videos'   => $pdo->query("SELECT COUNT(*) FROM videos")->fetchColumn(),
        'destacado'=> $pdo->query("SELECT COUNT(*) FROM destacado_mes")->fetchColumn()
    ];

    $logs = $pdo->query("SELECT l.*, u.username as user, DATE_FORMAT(l.created_at, '%d/%m/%Y %H:%i') as time 
                         FROM logs l 
                         LEFT JOIN usuarios u ON l.user_id = u.id 
                         ORDER BY l.created_at DESC LIMIT 15")->fetchAll();

    echo json_encode([
        'success' => true,
        'stats' => $stats,
        'logs' => $logs
    ]);

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
