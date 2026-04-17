<?php
// api/admin/subir_general.php
// Servicio para subir imágenes administrativas generales (sin registro en galería)

require_once '../db.php';
require_once 'auth_check.php';

$method = $_SERVER['REQUEST_METHOD'];
$uploadDir = __DIR__ . '/../../uploads/general/';

if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

try {
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

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $filename = 'general_' . time() . '_' . rand(100, 999) . '.' . $ext;
    $destPath = $uploadDir . $filename;

    if (!move_uploaded_file($file['tmp_name'], $destPath)) {
        echo json_encode(['success' => false, 'error' => 'Error al guardar la imagen en el servidor.']);
        exit;
    }

    $imagen_url = 'uploads/general/' . $filename;
    
    // No insertamos nada en galeria_portafolio
    echo json_encode([
        'success' => true, 
        'imagen_url' => $imagen_url,
        'message' => 'Imagen subida correctamente a la carpeta general.'
    ]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
