<?php
// verificacion_badge.php — Admin: Upload External Collaborator Badge
// Created by Antigravity

require_once '../db.php';
require_once 'auth_check.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

$userId = $_POST['user_id'] ?? null;
if (!$userId) {
    echo json_encode(['error' => 'user_id requerido']);
    exit;
}

// Validate file
if (empty($_FILES['badge']) || $_FILES['badge']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['error' => 'No se recibió ningún archivo válido']);
    exit;
}

$file     = $_FILES['badge'];
$allowed  = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml'];
$finfo    = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (!in_array($mimeType, $allowed)) {
    echo json_encode(['error' => 'Formato no permitido. Usa PNG, JPEG, WEBP, GIF o SVG.']);
    exit;
}

if ($file['size'] > 2 * 1024 * 1024) {
    echo json_encode(['error' => 'El archivo no debe superar 2MB.']);
    exit;
}

// Build destination
$uploadDir = dirname(__DIR__, 2) . '/uploads/badges/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$ext      = pathinfo($file['name'], PATHINFO_EXTENSION) ?: 'png';
$filename = 'badge_' . $userId . '_' . uniqid() . '.' . $ext;
$destPath = $uploadDir . $filename;

if (!move_uploaded_file($file['tmp_name'], $destPath)) {
    echo json_encode(['error' => 'Error al guardar el archivo en el servidor']);
    exit;
}

$relativePath = 'uploads/badges/' . $filename;

// Update DB
try {
    $stmt = $pdo->prepare(
        "UPDATE usuarios SET verification_type = 'external', verification_badge = ? WHERE id = ?"
    );
    $stmt->execute([$relativePath, $userId]);

    echo json_encode([
        'success'           => true,
        'verification_badge'=> $relativePath
    ]);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
