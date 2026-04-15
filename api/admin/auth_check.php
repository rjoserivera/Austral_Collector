<?php
/**
 * Auth Check Middleware
 * Verifies JWT token and blocks request if invalid.
 */
require_once __DIR__ . '/../auth/jwt_helper.php';

function verifyToken() {
    $headers = getallheaders();
    $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : (isset($headers['authorization']) ? $headers['authorization'] : null);

    if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        http_response_code(401);
        die(json_encode(['error' => 'No autorizado: Cabecera Authorization faltante o inválida']));
    }

    $token = $matches[1];
    $userData = JWT::decode($token);

    if (!$userData) {
        http_response_code(401);
        die(json_encode(['error' => 'No autorizado: Token inválido o expirado']));
    }

    return $userData;
}

// Automatically verify on include if not on a public path (optional, but safer to call verifyToken() explicitly)
$currentUser = verifyToken();
?>
