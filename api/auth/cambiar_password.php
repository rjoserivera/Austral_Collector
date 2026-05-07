<?php
// cambiar_password.php - User changes their own password
// Created by Antigravity

require_once '../db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'error' => 'No data provided']);
    exit;
}

$username = $data['username'] ?? '';
$password_actual = $data['password_actual'] ?? '';
$password_nuevo = $data['password_nuevo'] ?? '';

if (empty($username) || empty($password_actual) || empty($password_nuevo)) {
    echo json_encode(['success' => false, 'error' => 'Faltan campos obligatorios']);
    exit;
}

if (strlen($password_nuevo) < 6) {
    echo json_encode(['success' => false, 'error' => 'La nueva contraseña debe tener al menos 6 caracteres']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT id, password FROM usuarios WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if (!$user) {
        echo json_encode(['success' => false, 'error' => 'Usuario no encontrado']);
        exit;
    }

    if (!password_verify($password_actual, $user['password'])) {
        echo json_encode(['success' => false, 'error' => 'La contraseña actual es incorrecta']);
        exit;
    }

    $newHash = password_hash($password_nuevo, PASSWORD_BCRYPT);
    $updStmt = $pdo->prepare("UPDATE usuarios SET password = ?, require_password_change = 0 WHERE id = ?");
    $updStmt->execute([$newHash, $user['id']]);

    echo json_encode(['success' => true]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Error de base de datos: ' . $e->getMessage()]);
}
?>
