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

    try {
        $pdo->exec("ALTER TABLE usuarios ADD COLUMN require_password_change TINYINT(1) DEFAULT 0");
    } catch(PDOException $e) {}

    $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE (username = ? OR email = ?) AND is_active = 1");
    $stmt->execute([$username, $username]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        // Hide password before returning
        unset($user['password']);
        
        // Cast the require_password_change column to a proper boolean
        if (isset($user['require_password_change'])) {
            $user['require_password_change'] = (bool)$user['require_password_change'];
        }
        
        // Log the successful login
        $logStmt = $pdo->prepare("INSERT INTO logs (user_id, tipo, accion) VALUES (?, 'login', 'Inicio de sesión')");
        $logStmt->execute([$user['id']]);

        $alert_destacado = false;
        if ($user['role'] === 'admin') {
            $hasManuallySetDestacado = $pdo->query("SELECT valor FROM configuracion WHERE clave = 'miembro_destacado'")->fetchColumn() ? true : false;
            $hasBirthdays = $pdo->query("SELECT COUNT(*) FROM usuarios WHERE MONTH(fecha_nacimiento) = MONTH(CURDATE()) AND DAY(fecha_nacimiento) >= DAY(CURDATE()) AND is_active = 1")->fetchColumn() > 0;
            $alert_destacado = !$hasManuallySetDestacado && !$hasBirthdays;
        }

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
            'alert_destacado' => $alert_destacado,
            'require_password_change' => isset($user['require_password_change']) ? (bool)$user['require_password_change'] : false
        ]);
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Credenciales inválidas o cuenta inactiva']);
}
?>
