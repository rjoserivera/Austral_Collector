<?php
/**
 * Auth Check Middleware
 * Verifies JWT token and blocks request if invalid.
 */
require_once __DIR__ . '/../auth/jwt_helper.php';

function verifyToken() {
    // X-Token: header personalizado que Apache nunca bloquea (fallback principal)
    // Authorization: header estándar (puede ser bloqueado por Apache en CGI/FastCGI)
    $token = null;

    // 1. X-Token header (nunca bloqueado por Apache)
    if (!empty($_SERVER['HTTP_X_TOKEN'])) {
        $token = $_SERVER['HTTP_X_TOKEN'];
    }
    // 2. Authorization header vía $_SERVER (cuando mod_rewrite lo pasa)
    elseif (!empty($_SERVER['HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
        if (preg_match('/Bearer\s(\S+)/', $authHeader, $m)) $token = $m[1];
    }
    // 3. REDIRECT_HTTP_AUTHORIZATION (FastCGI/suEXEC)
    elseif (!empty($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
        if (preg_match('/Bearer\s(\S+)/', $authHeader, $m)) $token = $m[1];
    }
    // 4. getallheaders() como último recurso
    elseif (function_exists('getallheaders')) {
        $headers = getallheaders();
        foreach ($headers as $k => $v) {
            if (strtolower($k) === 'x-token') { $token = $v; break; }
            if (strtolower($k) === 'authorization') {
                if (preg_match('/Bearer\s(\S+)/', $v, $m)) { $token = $m[1]; break; }
            }
        }
    }

    if (!$token) {
        http_response_code(401);
        die(json_encode(['error' => 'No autorizado: Token no encontrado']));
    }

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
