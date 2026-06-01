<?php
// api/admin/portafolio_grupos.php
// CRUD para las secciones (grupos) y sus items (fotos/videos) en el portafolio

require_once '../db.php';
require_once 'auth_check.php';
require_once 'log_helper.php';

$method = $_SERVER['REQUEST_METHOD'];
$uploadDir = __DIR__ . '/../../uploads/portafolio/';

try {
    if ($method === 'GET') {
        // Fetch all groups
        $stmtG = $pdo->query("SELECT * FROM portafolio_grupos ORDER BY orden ASC, id ASC");
        $grupos = $stmtG->fetchAll();

        // Fetch all items
        $stmtI = $pdo->query("SELECT * FROM portafolio_items ORDER BY orden ASC, id ASC");
        $itemsRaw = $stmtI->fetchAll();

        // Group items by grupo_id
        $itemsByGroup = [];
        foreach ($itemsRaw as $item) {
            $itemsByGroup[$item['grupo_id']][] = $item;
        }

        foreach ($grupos as &$g) {
            $g['items'] = $itemsByGroup[$g['id']] ?? [];
        }

        echo json_encode(['success' => true, 'grupos' => $grupos]);
        exit;
    }

    if ($method === 'POST') {
        // Check if it's a multipart/form-data upload or JSON
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        if (strpos($contentType, 'application/json') !== false) {
            $data = json_decode(file_get_contents('php://input'), true);
        } else {
            $data = $_POST;
        }

        $action = $data['action'] ?? '';

        if ($action === 'create_group') {
            $titulo = trim($data['titulo'] ?? 'Nueva Sección');
            $stmt = $pdo->prepare("INSERT INTO portafolio_grupos (titulo, orden) VALUES (?, (SELECT COALESCE(MAX(orden), 0) + 1 FROM portafolio_grupos pg))");
            $stmt->execute([$titulo]);
            $newId = $pdo->lastInsertId();
            adminLog($pdo, $currentUser, 'admin', "Creó sección de portafolio: \"$titulo\"");
            echo json_encode(['success' => true, 'id' => $newId]);

        } elseif ($action === 'update_group') {
            $id = intval($data['id'] ?? 0);
            $titulo = trim($data['titulo'] ?? '');
            if ($id && $titulo) {
                $stmt = $pdo->prepare("UPDATE portafolio_grupos SET titulo = ? WHERE id = ?");
                $stmt->execute([$titulo, $id]);
                echo json_encode(['success' => true]);
                adminLog($pdo, $currentUser, 'admin', "Renombró sección de portafolio ID $id a: \"$titulo\"");
            } else {
                echo json_encode(['success' => false, 'error' => 'Datos inválidos.']);
            }

        } elseif ($action === 'delete_group') {
            $id = intval($data['id'] ?? 0);
            if ($id) {
                // Delete associated files first
                $stmt = $pdo->prepare("SELECT url FROM portafolio_items WHERE grupo_id = ? AND tipo = 'foto'");
                $stmt->execute([$id]);
                while ($row = $stmt->fetch()) {
                    $filePath = __DIR__ . '/../../' . $row['url'];
                    if (file_exists($filePath) && is_file($filePath)) {
                        unlink($filePath);
                    }
                }
                $stmtDel = $pdo->prepare("DELETE FROM portafolio_grupos WHERE id = ?");
                $stmtDel->execute([$id]);
                adminLog($pdo, $currentUser, 'admin', "Eliminó sección de portafolio ID: $id (incluyendo todo su contenido)");
                echo json_encode(['success' => true]);
            }

        } elseif ($action === 'reorder_groups') {
            if (isset($data['grupos']) && is_array($data['grupos'])) {
                $pdo->beginTransaction();
                foreach ($data['grupos'] as $g) {
                    $stmt = $pdo->prepare("UPDATE portafolio_grupos SET orden = ? WHERE id = ?");
                    $stmt->execute([intval($g['orden']), intval($g['id'])]);
                }
                $pdo->commit();
                echo json_encode(['success' => true]);
            }

        } elseif ($action === 'add_item') {
            $grupo_id = intval($data['grupo_id'] ?? 0);
            $tipo = $data['tipo'] ?? 'foto'; // foto | video
            $titulo = trim($data['titulo'] ?? '');
            $descripcion = trim($data['descripcion'] ?? '');
            $url = trim($data['url'] ?? ''); // Used for video

            if (!$grupo_id) {
                echo json_encode(['success' => false, 'error' => 'ID de grupo faltante.']);
                exit;
            }

            if ($tipo === 'video') {
                if (!$url) {
                    echo json_encode(['success' => false, 'error' => 'URL de YouTube faltante.']);
                    exit;
                }
                $stmt = $pdo->prepare("INSERT INTO portafolio_items (grupo_id, tipo, url, titulo, descripcion, orden) VALUES (?, ?, ?, ?, ?, (SELECT COALESCE(MAX(orden), 0) + 1 FROM portafolio_items pi WHERE grupo_id = ?))");
                $stmt->execute([$grupo_id, $tipo, $url, $titulo, $descripcion, $grupo_id]);
                $newId = $pdo->lastInsertId();
                $stmtFetch = $pdo->prepare("SELECT * FROM portafolio_items WHERE id = ?");
                $stmtFetch->execute([$newId]);
                $newItem = $stmtFetch->fetch();
                echo json_encode(['success' => true, 'id' => $newId, 'item' => $newItem]);
                exit;
            } 
            
            if ($tipo === 'foto') {
                if (empty($_FILES['imagen']['tmp_name'])) {
                    echo json_encode(['success' => false, 'error' => 'No se recibió ninguna imagen.']);
                    exit;
                }
                $file = $_FILES['imagen'];
                $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
                $allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
                if (!in_array($ext, $allowed)) {
                    echo json_encode(['success' => false, 'error' => 'Formato no permitido.']);
                    exit;
                }
                $filename = 'porta_' . time() . '_' . rand(100, 999) . '.' . $ext;
                $destPath = $uploadDir . $filename;
                if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
                if (!move_uploaded_file($file['tmp_name'], $destPath)) {
                    echo json_encode(['success' => false, 'error' => 'Error al guardar la imagen.']);
                    exit;
                }
                $imagen_url = 'uploads/portafolio/' . $filename;
                $stmt = $pdo->prepare("INSERT INTO portafolio_items (grupo_id, tipo, url, titulo, descripcion, orden) VALUES (?, ?, ?, ?, ?, (SELECT COALESCE(MAX(orden), 0) + 1 FROM portafolio_items pi WHERE grupo_id = ?))");
                $stmt->execute([$grupo_id, $tipo, $imagen_url, $titulo, $descripcion, $grupo_id]);
                $newId = $pdo->lastInsertId();
                $stmtFetch = $pdo->prepare("SELECT * FROM portafolio_items WHERE id = ?");
                $stmtFetch->execute([$newId]);
                $newItem = $stmtFetch->fetch();
                echo json_encode(['success' => true, 'id' => $newId, 'item' => $newItem]);
                exit;
            }

        } elseif ($action === 'update_item') {
            $id = intval($data['id'] ?? 0);
            $titulo = trim($data['titulo'] ?? '');
            $descripcion = trim($data['descripcion'] ?? '');
            $url = trim($data['url'] ?? '');

            if (!$id) {
                echo json_encode(['success' => false, 'error' => 'ID faltante.']);
                exit;
            }

            // If updating video, update URL. If updating photo, just update text.
            $stmt = $pdo->prepare("SELECT tipo FROM portafolio_items WHERE id = ?");
            $stmt->execute([$id]);
            $item = $stmt->fetch();
            
            if ($item['tipo'] === 'video') {
                $stmtU = $pdo->prepare("UPDATE portafolio_items SET titulo = ?, descripcion = ?, url = ? WHERE id = ?");
                $stmtU->execute([$titulo, $descripcion, $url, $id]);
            } else {
                // Check if a new image was uploaded
                if (!empty($_FILES['imagen']['tmp_name'])) {
                    $file = $_FILES['imagen'];
                    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
                    $allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
                    if (!in_array($ext, $allowed)) {
                        echo json_encode(['success' => false, 'error' => 'Formato no permitido.']);
                        exit;
                    }
                    $filename = 'porta_' . time() . '_' . rand(100, 999) . '.' . $ext;
                    $destPath = $uploadDir . $filename;
                    if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
                    if (!move_uploaded_file($file['tmp_name'], $destPath)) {
                        echo json_encode(['success' => false, 'error' => 'Error al guardar la imagen.']);
                        exit;
                    }
                    $new_url = 'uploads/portafolio/' . $filename;
                    $stmtU = $pdo->prepare("UPDATE portafolio_items SET titulo = ?, descripcion = ?, url = ? WHERE id = ?");
                    $stmtU->execute([$titulo, $descripcion, $new_url, $id]);
                } else {
                    $stmtU = $pdo->prepare("UPDATE portafolio_items SET titulo = ?, descripcion = ? WHERE id = ?");
                    $stmtU->execute([$titulo, $descripcion, $id]);
                }
            }
            $stmtFetch = $pdo->prepare("SELECT * FROM portafolio_items WHERE id = ?");
            $stmtFetch->execute([$id]);
            $updatedItem = $stmtFetch->fetch();
            echo json_encode(['success' => true, 'item' => $updatedItem]);

        } elseif ($action === 'delete_item') {
            $id = intval($data['id'] ?? 0);
            if ($id) {
                $stmt = $pdo->prepare("SELECT url, tipo FROM portafolio_items WHERE id = ?");
                $stmt->execute([$id]);
                $item = $stmt->fetch();
                if ($item && $item['tipo'] === 'foto') {
                    $filePath = __DIR__ . '/../../' . $item['url'];
                    if (file_exists($filePath) && is_file($filePath)) {
                        unlink($filePath);
                    }
                }
                $stmtDel = $pdo->prepare("DELETE FROM portafolio_items WHERE id = ?");
                $stmtDel->execute([$id]);
                echo json_encode(['success' => true]);
            }

        } elseif ($action === 'reorder_items') {
            if (isset($data['items']) && is_array($data['items'])) {
                $pdo->beginTransaction();
                foreach ($data['items'] as $it) {
                    $stmt = $pdo->prepare("UPDATE portafolio_items SET orden = ? WHERE id = ?");
                    $stmt->execute([intval($it['orden']), intval($it['id'])]);
                }
                $pdo->commit();
                echo json_encode(['success' => true]);
            }
        } else {
            echo json_encode(['success' => false, 'error' => 'Acción desconocida.']);
        }
    }

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
