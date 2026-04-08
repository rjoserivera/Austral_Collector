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
    $logStmt = $pdo->prepare("INSERT INTO logs (user_id, tipo, accion) VALUES (?, 'auth', 'Inicio de sesión')");
    $logStmt->execute([$user['id']]);

    echo json_encode([
        'success' => true,
        'user' => $user,
        'role' => $user['role'],
        'username' => $user['username']
    ]);
} else {
    echo json_encode(['error' => 'Credenciales inválidas o cuenta inactiva']);
}
?>
