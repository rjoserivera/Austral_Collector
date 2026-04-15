<?php
// api/admin/galeria_portafolio.php
// CRUD para la galería controlada por el administrador

require_once '../db.php';
require_once 'auth_check.php';

$method = $_SERVER['REQUEST_METHOD'];
$uploadDir = __DIR__ . '/../../uploads/portafolio/';

try {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM galeria_portafolio ORDER BY orden ASC, id ASC");
        $items = $stmt->fetchAll();
        echo json_encode(['success' => true, 'items' => $items]);

    } elseif ($method === 'POST') {
        // Subida de imagen con multipart/form-data
        $descripcion = trim($_POST['descripcion'] ?? '');
        $orden = intval($_POST['orden'] ?? 0);

        if (empty($_FILES['imagen']['tmp_name'])) {
            echo json_encode(['success' => false, 'error' => 'No se recibió ninguna imagen.']);
            exit;
        }

        $file = $_FILES['imagen'];
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
        if (!in_array($ext, $allowed)) {
            echo json_encode(['success' => false, 'error' => 'Formato de imagen no permitido.']);
            exit;
        }

        if ($file['size'] > 5 * 1024 * 1024) {
            echo json_encode(['success' => false, 'error' => 'La imagen supera los 5MB.']);
            exit;
        }

        $filename = 'portafolio_' . time() . '_' . rand(100, 999) . '.' . $ext;
        $destPath = $uploadDir . $filename;

        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        if (!move_uploaded_file($file['tmp_name'], $destPath)) {
            echo json_encode(['success' => false, 'error' => 'Error al guardar la imagen.']);
            exit;
        }

        $imagen_url = 'uploads/portafolio/' . $filename;
        $stmt = $pdo->prepare("INSERT INTO galeria_portafolio (descripcion, imagen_url, orden) VALUES (?, ?, ?)");
        $stmt->execute([$descripcion, $imagen_url, $orden]);
        $newId = $pdo->lastInsertId();

        echo json_encode(['success' => true, 'id' => $newId, 'imagen_url' => $imagen_url]);

    } elseif ($method === 'PUT') {
        $data = json_decode(file_get_contents('php://input'), true);
        $id = intval($data['id'] ?? 0);
        $descripcion = trim($data['descripcion'] ?? '');
        $orden = intval($data['orden'] ?? 0);

        if (!$id) {
            echo json_encode(['success' => false, 'error' => 'ID faltante.']);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE galeria_portafolio SET descripcion = ?, orden = ? WHERE id = ?");
        $stmt->execute([$descripcion, $orden, $id]);
        echo json_encode(['success' => true]);

    } elseif ($method === 'DELETE') {
        $data = json_decode(file_get_contents('php://input'), true);
        $id = intval($data['id'] ?? 0);

        if (!$id) {
            echo json_encode(['success' => false, 'error' => 'ID faltante.']);
            exit;
        }

        // Obtener la ruta del archivo para eliminarlo
        $stmt = $pdo->prepare("SELECT imagen_url FROM galeria_portafolio WHERE id = ?");
        $stmt->execute([$id]);
        $item = $stmt->fetch();

        if ($item) {
            $filePath = __DIR__ . '/../../' . $item['imagen_url'];
            if (file_exists($filePath)) {
                unlink($filePath);
            }
        }

        $stmt = $pdo->prepare("DELETE FROM galeria_portafolio WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);

    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
    }

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
