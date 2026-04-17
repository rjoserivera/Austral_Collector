<?php
// api/admin/videos_portafolio.php
// CRUD dinámico para los videos del portafolio con migración automática

require_once '../db.php';
require_once 'auth_check.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    // --- 1. MIGRACIÓN AUTOMÁTICA / CREACIÓN DE TABLA ---
    $pdo->exec("CREATE TABLE IF NOT EXISTS videos_portafolio (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(255) DEFAULT '',
        descripcion TEXT,
        link_yt VARCHAR(255) NOT NULL,
        orden INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    // Verificar si la tabla está vacía para intentar la migración desde configuracion
    $stmtCount = $pdo->query("SELECT COUNT(*) FROM videos_portafolio");
    if ($stmtCount->fetchColumn() == 0) {
        // Intentar migrar los 4 videos antiguos
        $stmtOld = $pdo->query("SELECT clave, valor FROM configuracion WHERE clave LIKE 'portafolio_video_%'");
        $oldVideos = $stmtOld->fetchAll();
        $i = 0;
        foreach ($oldVideos as $row) {
            if (!empty($row['valor'])) {
                $stmtIns = $pdo->prepare("INSERT INTO videos_portafolio (titulo, link_yt, orden) VALUES (?, ?, ?)");
                $stmtIns->execute(["Video Antiguo", $row['valor'], $i++]);
            }
        }
    }

    // --- 2. MANEJO DE MÉTODOS ---

    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM videos_portafolio ORDER BY orden ASC, id ASC");
        echo json_encode(['success' => true, 'videos' => $stmt->fetchAll()]);

    } elseif ($method === 'POST') {
        // Crear un nuevo slot de video (vacío o con datos)
        $data = json_decode(file_get_contents('php://input'), true);
        $titulo = $data['titulo'] ?? 'Nuevo Video';
        $link_yt = $data['link_yt'] ?? '';
        $descripcion = $data['descripcion'] ?? '';
        $orden = intval($data['orden'] ?? 0);

        $stmt = $pdo->prepare("INSERT INTO videos_portafolio (titulo, descripcion, link_yt, orden) VALUES (?, ?, ?, ?)");
        $stmt->execute([$titulo, $descripcion, $link_yt, $orden]);
        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);

    } elseif ($method === 'PUT') {
        $data = json_decode(file_get_contents('php://input'), true);

        // Caso A: Reordenar (Bulk)
        if (isset($data['action']) && $data['action'] === 'reorder' && is_array($data['items'])) {
            $pdo->beginTransaction();
            foreach ($data['items'] as $item) {
                if (isset($item['id'], $item['orden'])) {
                    $stmt = $pdo->prepare("UPDATE videos_portafolio SET orden = ? WHERE id = ?");
                    $stmt->execute([intval($item['orden']), intval($item['id'])]);
                }
            }
            $pdo->commit();
            echo json_encode(['success' => true]);
            exit;
        }

        // Caso B: Editar un solo video
        $id = intval($data['id'] ?? 0);
        $titulo = $data['titulo'] ?? '';
        $descripcion = $data['descripcion'] ?? '';
        $link_yt = $data['link_yt'] ?? '';

        if (!$id) {
            echo json_encode(['success' => false, 'error' => 'ID faltante']);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE videos_portafolio SET titulo = ?, descripcion = ?, link_yt = ? WHERE id = ?");
        $stmt->execute([$titulo, $descripcion, $link_yt, $id]);
        echo json_encode(['success' => true]);

    } elseif ($method === 'DELETE') {
        $data = json_decode(file_get_contents('php://input'), true);
        $id = intval($data['id'] ?? 0);
        if ($id) {
            $stmt = $pdo->prepare("DELETE FROM videos_portafolio WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => 'ID faltante']);
        }

    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
    }

} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
