<?php
// publicar_post.php - Create a new figura or cosplay post
// Accepts multipart/form-data with images[]

require_once '../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
    exit;
}

// --- Validate required fields ---
$user_id    = intval($_POST['user_id'] ?? 0);
$nombre     = trim($_POST['nombre'] ?? '');
$tipo       = $_POST['tipo'] ?? 'figura';
$descripcion = trim($_POST['descripcion'] ?? '');
$anio       = trim($_POST['anio'] ?? '');
$hashtagsRaw = $_POST['hashtags'] ?? null;

if (!$user_id || !$nombre) {
    echo json_encode(['success' => false, 'error' => 'Faltan datos obligatorios (user_id, nombre).']);
    exit;
}

if (!in_array($tipo, ['figura', 'cosplay'])) {
    echo json_encode(['success' => false, 'error' => 'Tipo inválido.']);
    exit;
}

// --- Handle image upload ---
$uploadDir = dirname(__DIR__, 2) . '/uploads/posts/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$uploadedFiles = [];
if (!empty($_FILES['images']['name'][0])) {
    foreach ($_FILES['images']['name'] as $i => $originalName) {
        if ($_FILES['images']['error'][$i] !== UPLOAD_ERR_OK) continue;
        if ($_FILES['images']['size'][$i] > 5 * 1024 * 1024) continue; // skip >5MB

        $ext  = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
        $allowed = ['jpg', 'jpeg', 'png', 'webp'];
        if (!in_array($ext, $allowed)) continue;

        $filename = uniqid('post_', true) . '.' . $ext;
        $dest = $uploadDir . $filename;
        if (move_uploaded_file($_FILES['images']['tmp_name'][$i], $dest)) {
            $uploadedFiles[] = 'uploads/posts/' . $filename;
        }
    }
}

if (count($uploadedFiles) === 0) {
    echo json_encode(['success' => false, 'error' => 'No se pudo subir ninguna imagen.']);
    exit;
}

$imagen_url    = $uploadedFiles[0];
$imagenes_extra = array_slice($uploadedFiles, 1);

// --- Insert post ---
try {
    $extraJson = count($imagenes_extra) > 0 ? json_encode($imagenes_extra) : null;
    $anioVal   = $anio !== '' ? $anio : null;

    $stmt = $pdo->prepare(
        "INSERT INTO posts (user_id, nombre, descripcion, imagen_url, imagenes_extra, tipo, anio)
         VALUES (?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->execute([$user_id, $nombre, $descripcion, $imagen_url, $extraJson, $tipo, $anioVal]);
    $postId = $pdo->lastInsertId();

    // --- Handle Hashtags ---
    if ($hashtagsRaw) {
        $hashtags = json_decode($hashtagsRaw, true);
        if (is_array($hashtags)) {
            foreach ($hashtags as $tag) {
                $tag = trim(ltrim($tag, '#'));
                if ($tag === '') continue;

                // Upsert into hashtags table
                $pdo->prepare("INSERT IGNORE INTO hashtags (nombre) VALUES (?)")->execute([$tag]);
                $hRow = $pdo->prepare("SELECT id FROM hashtags WHERE nombre = ?");
                $hRow->execute([$tag]);
                $hashtagId = $hRow->fetchColumn();

                // Link to post
                $pdo->prepare("INSERT IGNORE INTO post_hashtags (post_id, hashtag_id) VALUES (?, ?)")
                    ->execute([$postId, $hashtagId]);
            }
        }
    }

    echo json_encode(['success' => true, 'post_id' => $postId]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
