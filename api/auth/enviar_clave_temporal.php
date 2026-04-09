<?php
/**
 * enviar_clave_temporal.php - Genera y envía una nueva clave temporal al usuario.
 */

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../admin/mailer.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$userId = $data['user_id'] ?? null;

if (!$userId) {
    echo json_encode(['success' => false, 'error' => 'Falta el ID de usuario']);
    exit;
}

try {
    // 1. Verificar que el usuario existe y obtener sus datos
    $stmt = $pdo->prepare("SELECT username, email FROM usuarios WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    if (!$user) {
        echo json_encode(['success' => false, 'error' => 'Usuario no encontrado']);
        exit;
    }

    // 2. Generar clave temporal aleatoria (8 caracteres)
    $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    $tempKey = substr(str_shuffle($chars), 0, 8);

    // 3. Hashear y actualizar en BD
    $hashedKey = password_hash($tempKey, PASSWORD_BCRYPT, ['cost' => 12]);
    $update = $pdo->prepare("UPDATE usuarios SET password = ? WHERE id = ?");
    $update->execute([$hashedKey, $userId]);

    // 4. Enviar correo via SMTP
    $sent = sendTempKeyEmail($user['email'], $user['username'], $tempKey);

    if ($sent) {
        // Registrar en el log de actividad
        $log = $pdo->prepare("INSERT INTO logs (user_id, tipo, accion) VALUES (?, 'admin', ?)");
        $log->execute([null, "Generó y envió clave temporal para: " . $user['username']]);

        echo json_encode([
            'success' => true, 
            'message' => 'Clave temporal generada y enviada correctamente',
            'username' => $user['username'],
            'temp_pass' => $tempKey,
            'email' => $user['email'],
            'mail_sent' => true
        ]);
    } else {
        echo json_encode([
            'success' => true, // Marcamos success true para que el modal se abra igual aunque falle el mail
            'mail_sent' => false,
            'username' => $user['username'],
            'temp_pass' => $tempKey,
            'email' => $user['email'],
            'error' => 'La clave se actualizó pero el correo no pudo ser enviado.'
        ]);
    }

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
