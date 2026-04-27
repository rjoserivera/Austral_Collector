<?php
// api/auth/eliminar_post.php
require_once '../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
    exit;
}

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

$id = intval($data['id'] ?? 0);

if ($id <= 0) {
    echo json_encode(['success' => false, 'error' => 'ID de publicación inválido']);
    exit;
}

try {
    $pdo->beginTransaction();

    // Obtener información para posible borrado de archivo e identificar usuario (opcional si requerimos seguridad)
    $stmtImg = $pdo->prepare("SELECT imagen_url, user_id, nombre, tipo FROM posts WHERE id = ?");
    $stmtImg->execute([$id]);
    $post = $stmtImg->fetch(PDO::FETCH_ASSOC);

    if (!$post) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'error' => 'La publicación no existe']);
        exit;
    }

    // Borrado manual de dependencias por si no hay CASCADE en la BD
    $pdo->prepare("DELETE FROM post_hashtags WHERE post_id = ?")->execute([$id]);
    $pdo->prepare("DELETE FROM likes WHERE post_id = ?")->execute([$id]);
    
    // Si hubieran otras dependencias, se agregarían acá.
    
    // Borrado del post principal
    $stmt = $pdo->prepare("DELETE FROM posts WHERE id = ?");
    $stmt->execute([$id]);

    // Registrar en logs
    $logStmt = $pdo->prepare("INSERT INTO logs (user_id, tipo, accion) VALUES (?, ?, ?)");
    $logStmt->execute([$post['user_id'], $post['tipo'] ?? 'figura', "Eliminó publicación: " . $post['nombre']]);

    $pdo->commit();

    // Eliminar el archivo físico de la imagen
    if (!empty($post['imagen_url'])) {
        $filePath = dirname(__DIR__, 2) . '/' . $post['imagen_url'];
        if (file_exists($filePath) && is_file($filePath)) {
            unlink($filePath);
        }
    }

    echo json_encode(['success' => true, 'message' => 'Publicación eliminada con éxito']);

} catch (PDOException $e) {
    $pdo->rollBack();
    echo json_encode(['success' => false, 'error' => 'Error de base de datos: ' . $e->getMessage()]);
}
?>
