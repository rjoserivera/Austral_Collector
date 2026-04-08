<?php
// update_profile.php - Update user metadata
// Created by Antigravity

require_once '../db.php';

$userId = $_POST['user_id'] ?? null;

if (!$userId) {
    echo json_encode(['success' => false, 'error' => 'Usuario no identificado']);
    exit;
}

$biografia = $_POST['biografia'] ?? '';
$nombre    = $_POST['nombre'] ?? null;
$apellido  = $_POST['apellido'] ?? null;

$uploadDir = '../../uploads/profiles/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// Check which fields to update
$updates = [];
$params = [];

if (isset($_POST['biografia'])) {
    $updates[] = "biografia = ?";
    $params[] = $biografia;
}
if ($nombre !== null) {
    $updates[] = "nombre = ?";
    $params[] = $nombre;
}
if ($apellido !== null) {
    $updates[] = "apellido = ?";
    $params[] = $apellido;
}

$avatar_url = null;
$banner_url = null;

if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === UPLOAD_ERR_OK) {
    $ext = pathinfo($_FILES['avatar']['name'], PATHINFO_EXTENSION);
    $filename = 'avatar_' . $userId . '_' . time() . '.' . $ext;
    if (move_uploaded_file($_FILES['avatar']['tmp_name'], $uploadDir . $filename)) {
        $avatar_url = 'uploads/profiles/' . $filename;
        $updates[] = "avatar_url = ?";
        $params[] = $avatar_url;
    }
}

if (isset($_FILES['banner']) && $_FILES['banner']['error'] === UPLOAD_ERR_OK) {
    $ext = pathinfo($_FILES['banner']['name'], PATHINFO_EXTENSION);
    $filename = 'banner_' . $userId . '_' . time() . '.' . $ext;
    if (move_uploaded_file($_FILES['banner']['tmp_name'], $uploadDir . $filename)) {
        $banner_url = 'uploads/profiles/' . $filename;
        $updates[] = "banner_url = ?";
        $params[] = $banner_url;
    }
}

if (empty($updates)) {
    echo json_encode(['success' => true, 'message' => 'No changes made']);
    exit;
}

try {
    $sql = "UPDATE usuarios SET " . implode(', ', $updates) . " WHERE id = ?";
    $params[] = $userId;
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    $response = ['success' => true, 'message' => 'Perfil actualizado'];
    if ($avatar_url) $response['avatar_url'] = $avatar_url;
    if ($banner_url) $response['banner_url'] = $banner_url;

    echo json_encode($response);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
