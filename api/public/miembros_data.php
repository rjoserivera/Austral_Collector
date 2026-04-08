<?php
// miembros_data.php - Public endpoint to retrieve all active members
// Created by Antigravity

require_once '../db.php';

try {
    $sql = "SELECT 
                u.id, 
                u.username, 
                u.banner_url, 
                u.avatar_url, 
                u.role, 
                u.biografia,
                (SELECT COUNT(*) FROM posts WHERE user_id = u.id) as total_posts,
                (SELECT COUNT(*) FROM likes WHERE post_id IN (SELECT id FROM posts WHERE user_id = u.id)) as total_likes
            FROM usuarios u
            WHERE u.is_active = 1
            ORDER BY u.created_at DESC";
            
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $miembros = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'data' => $miembros
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
