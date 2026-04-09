<?php
/**
 * enviar_mensaje.php - Maneja el envío de mensajes personalizados (individuales o masivos).
 */

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/mailer.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['success' => false, 'error' => 'Método no permitido']));
}

$data = json_decode(file_get_contents('php://input'), true);
$userId = $data['user_id'] ?? null;
$asunto = $data['asunto'] ?? 'Comunicado Oficial — Austral Collector';
$mensaje = $data['mensaje'] ?? '';
$massSend = $data['mass_send'] ?? false;

if (empty($mensaje)) {
    exit(json_encode(['success' => false, 'error' => 'El mensaje no puede estar vacío']));
}

try {
    $results = [];
    $totalSent = 0;
    
    if ($massSend) {
        // Enviar a TODOS los usuarios activos
        $stmt = $pdo->query("SELECT username, email FROM usuarios WHERE is_active = 1");
        $users = $stmt->fetchAll();
        
        foreach ($users as $u) {
            if (sendCustomEmail($u['email'], $u['username'], $asunto, $mensaje)) {
                $totalSent++;
            }
        }
        
        echo json_encode([
            'success' => true, 
            'message' => "Mensaje enviado masivamente a $totalSent usuarios.",
            'total' => $totalSent
        ]);
        
    } else {
        // Enviar a un usuario INDIVIDUAL
        if (!$userId) exit(json_encode(['success' => false, 'error' => 'Falta el ID de usuario']));
        
        $stmt = $pdo->prepare("SELECT username, email FROM usuarios WHERE id = ?");
        $stmt->execute([$userId]);
        $u = $stmt->fetch();
        
        if (!$u) exit(json_encode(['success' => false, 'error' => 'Usuario no encontrado']));
        
        if (sendCustomEmail($u['email'], $u['username'], $asunto, $mensaje)) {
            echo json_encode(['success' => true, 'message' => 'Mensaje enviado correctamente a ' . $u['username']]);
        } else {
            echo json_encode(['success' => false, 'error' => 'No se pudo enviar el correo. Revisa el log SMTP.']);
        }
    }

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
