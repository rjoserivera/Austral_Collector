<?php
require_once 'auth_check.php';
// If we reach here, user is authenticated
echo json_encode([
    'message' => 'Admin API Root',
    'status' => 'authorized',
    'user' => $currentUser,
    'endpoints' => [
        'stats' => 'get_stats.php',
        'users' => 'usuarios.php',
        'events' => 'eventos.php',
        'publications' => 'publicaciones.php',
        'videos' => 'videos.php'
    ]
]);
?>
