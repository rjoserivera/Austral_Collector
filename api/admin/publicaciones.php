<?php
/**
 * publicaciones.php - Admin Content Moderation API
 * Handles listing and deleting user posts (Figures/Cosplays).
 */

require_once '../db.php';
require_once 'auth_check.php';

$method = $_SERVER['REQUEST_METHOD'];

function logAction($pdo, $userId, $tipo, $accion) {
    if (!$userId) return;
    $stmt = $pdo->prepare("INSERT INTO logs (user_id, tipo, accion) VALUES (?, ?, ?)");
    $stmt->execute([$userId, $tipo, $accion]);
}

try {
    if ($method === 'GET') {
        $viewerName = $_GET['viewer_username'] ?? '';
        $viewerId = 0;
        if ($viewerName) {
            $stmtV = $pdo->prepare("SELECT id FROM usuarios WHERE username = ?");
            $stmtV->execute([$viewerName]);
            $viewerId = $stmtV->fetchColumn() ?: 0;
        }

        // Fetch all posts with user information, total likes and userLiked status
        $sql = "SELECT p.*, u.username as autor,
                (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as total_likes,
                (SELECT 1 FROM likes WHERE user_id = ? AND post_id = p.id) as userLiked
                FROM posts p 
                LEFT JOIN usuarios u ON p.user_id = u.id 
                ORDER BY p.created_at DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$viewerId]);
        $posts = $stmt->fetchAll();
        
        // Enrich posts with hashtags
        foreach ($posts as &$post) {
            $hStmt = $pdo->prepare("SELECT h.nombre FROM hashtags h JOIN post_hashtags ph ON ph.hashtag_id = h.id WHERE ph.post_id = ?");
            $hStmt->execute([$post['id']]);
            $post['hashtags'] = $hStmt->fetchAll(PDO::FETCH_COLUMN);
            
            // Ensure images_extra is an array for the frontend
            if (isset($post['imagenes_extra']) && is_string($post['imagenes_extra'])) {
                $post['imagenes_extra'] = json_decode($post['imagenes_extra'], true) ?? [];
            }
        }
        unset($post);
        
        echo json_encode(['success' => true, 'data' => $posts]);
    } 
    elseif ($method === 'DELETE') {
        require_once __DIR__ . '/mailer.php';

        $data = json_decode(file_get_contents('php://input'), true);
        $postId = $data['id'] ?? null;
        $adminId = $data['adminId'] ?? null;
        $motivo = $data['motivo'] ?? 'No especificado';
        
        if (!$postId) {
            echo json_encode(['success' => false, 'error' => 'ID de publicación no proporcionado.']);
            exit;
        }

        // Obtener información del post y del autor antes de borrar para el correo
        $stmt = $pdo->prepare("
            SELECT p.nombre, p.tipo, u.email, u.username 
            FROM posts p 
            JOIN usuarios u ON p.user_id = u.id 
            WHERE p.id = ?
        ");
        $stmt->execute([$postId]);
        $post = $stmt->fetch();

        if ($post) {
            // Intentar enviar el correo de notificación
            sendModerationEmail($post['email'], $post['username'], $post['nombre'], $post['tipo'], $motivo);

            // Proceder con la eliminación
            $stmt = $pdo->prepare("DELETE FROM posts WHERE id = ?");
            $stmt->execute([$postId]);
            
            logAction($pdo, $adminId, 'admin', "Eliminó publicación: " . $post['nombre'] . " ($post[tipo]). Motivo: " . $motivo);
            
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Publicación no encontrada.']);
        }
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'error' => 'Método no permitido.']);
    }

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
