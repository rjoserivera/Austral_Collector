<?php
// login.php - Authentication API
// Created by Antigravity

require_once '../db.php';

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!isset($data['username']) || !isset($data['password'])) {
    echo json_encode(['error' => 'Usuario y contraseña son obligatorios']);
    exit;
}

$username = $data['username'];
$password = $data['password'];

$stmt = $pdo->prepare("SELECT * FROM usuarios WHERE (username = ? OR email = ?) AND is_active = 1");
$stmt->execute([$username, $username]);
$user = $stmt->fetch();

if ($user && password_verify($password, $user['password'])) {
    // Hide password before returning
    unset($user['password']);
    
    // Log the successful login
    $logStmt = $pdo->prepare("INSERT INTO logs (user_id, tipo, accion) VALUES (?, 'login', 'Inicio de sesión')");
    $logStmt->execute([$user['id']]);

    require_once 'jwt_helper.php';
    $token = JWT::encode([
        'id' => $user['id'],
        'username' => $user['username'],
        'role' => $user['role'],
        'exp' => time() + (60 * 60 * 24) // 24 hours
    ]);

    echo json_encode([
        'success' => true,
        'token' => $token,
        'jwt' => $token, // Added for TestSprite compatibility
        'user' => $user,
        'role' => $user['role'],
        'username' => $user['username'],
        'require_password_change' => false
    ]);
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Credenciales inválidas o cuenta inactiva']);
}
?>
