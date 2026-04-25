<?php
// get_stats.php - Statistics for Admin Dashboard
// Created by Antigravity

require_once '../db.php';
require_once 'auth_check.php';

try {
    $stats = [
        'usuarios' => $pdo->query("SELECT COUNT(*) FROM usuarios")->fetchColumn(),
        'perfiles' => $pdo->query("SELECT COUNT(DISTINCT user_id) FROM posts")->fetchColumn(),
        'figuras'  => $pdo->query("SELECT COUNT(*) FROM posts WHERE tipo = 'figura'")->fetchColumn(),
        'cosplays' => $pdo->query("SELECT COUNT(*) FROM posts WHERE tipo = 'cosplay'")->fetchColumn(),
        'videos'   => $pdo->query("SELECT COUNT(*) FROM videos")->fetchColumn(),
        'destacado'=> $pdo->query("SELECT COUNT(*) FROM configuracion WHERE clave = 'miembro_destacado'")->fetchColumn(),
        'total_posts' => $pdo->query("SELECT COUNT(*) FROM posts")->fetchColumn(),
        'total_likes' => $pdo->query("SELECT COUNT(*) FROM likes")->fetchColumn(),
        'eventos' => $pdo->query("SELECT COUNT(*) FROM eventos")->fetchColumn(),
    ];

    // Cumpleaños de este mes
    $birthdayCount = $pdo->query("SELECT COUNT(*) FROM usuarios WHERE MONTH(fecha_nacimiento) = MONTH(CURDATE()) AND is_active = 1")->fetchColumn();
    $birthdayUsers = $pdo->query("SELECT id, username, nombre, apellido, avatar_url, DATE_FORMAT(fecha_nacimiento, '%d/%m') as fecha_cumple, DAY(fecha_nacimiento) as dia
                                  FROM usuarios 
                                  WHERE MONTH(fecha_nacimiento) = MONTH(CURDATE()) AND is_active = 1 
                                  ORDER BY DAY(fecha_nacimiento) ASC")->fetchAll();

    // Usuario más nuevo
    $newestUser = $pdo->query("SELECT username, DATE_FORMAT(created_at, '%d/%m/%Y') as fecha FROM usuarios ORDER BY created_at DESC LIMIT 1")->fetch();

    $logs = $pdo->query("SELECT l.*, u.username as user, DATE_FORMAT(l.created_at, '%d/%m/%Y %H:%i') as time 
                         FROM logs l 
                         LEFT JOIN usuarios u ON l.user_id = u.id 
                         ORDER BY l.created_at DESC LIMIT 15")->fetchAll();

    $hasManuallySetDestacado = $pdo->query("SELECT valor FROM configuracion WHERE clave = 'miembro_destacado'")->fetchColumn() ? true : false;
    $hasBirthdays = $pdo->query("SELECT COUNT(*) FROM usuarios WHERE MONTH(fecha_nacimiento) = MONTH(CURDATE()) AND DAY(fecha_nacimiento) >= DAY(CURDATE()) AND is_active = 1")->fetchColumn() > 0;
    $alert_destacado = !$hasManuallySetDestacado && !$hasBirthdays;

    echo json_encode([
        'success' => true,
        'stats' => $stats,
        'logs' => $logs,
        'alert_destacado' => $alert_destacado,
        'birthdays' => [
            'count' => (int)$birthdayCount,
            'users' => $birthdayUsers
        ],
        'newest_user' => $newestUser ?: null
    ]);

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
