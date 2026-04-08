<?php
// editar_post.php - Edit an existing figura or cosplay post
// Accepts multipart/form-data

require_once '../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
    exit;
}

$postId       = intval($_POST['id'] ?? 0);
$nombre       = trim($_POST['nombre'] ?? '');
$tipo         = $_POST['tipo'] ?? 'figura';
$descripcion  = trim($_POST['descripcion'] ?? '');
$anio         = trim($_POST['anio'] ?? '');
$hashtagsRaw  = $_POST['hashtags'] ?? null;
$mediaOrderRaw = $_POST['media_order'] ?? '[]';

if (!$postId || !$nombre) {
    echo json_encode(['success' => false, 'error' => 'Faltan datos obligatorios (id, nombre).']);
    exit;
}

// --- Upload new images ---
$uploadDir = dirname(__DIR__, 2) . '/uploads/posts/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$newFiles = [];
if (!empty($_FILES['images']['name'][0])) {
    foreach ($_FILES['images']['name'] as $i => $originalName) {
        if ($_FILES['images']['error'][$i] !== UPLOAD_ERR_OK) continue;
        if ($_FILES['images']['size'][$i] > 5 * 1024 * 1024) continue;

        $ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
        $allowed = ['jpg', 'jpeg', 'png', 'webp'];
        if (!in_array($ext, $allowed)) continue;

        $filename = uniqid('post_', true) . '.' . $ext;
        $dest = $uploadDir . $filename;
        if (move_uploaded_file($_FILES['images']['tmp_name'][$i], $dest)) {
            $newFiles[] = 'uploads/posts/' . $filename;
        }
    }
}

// --- Rebuild final ordered media list ---
// media_order is an array of either original URLs or 'new_N' placeholders
$mediaOrder = json_decode($mediaOrderRaw, true) ?? [];
$newFileIndex = 0;
$orderedMedia = [];
foreach ($mediaOrder as $entry) {
    if (str_starts_with($entry, 'new_')) {
        if (isset($newFiles[$newFileIndex])) {
            $orderedMedia[] = $newFiles[$newFileIndex++];
        }
    } else {
        $orderedMedia[] = $entry; // kept original
    }
}

if (count($orderedMedia) === 0) {
    echo json_encode(['success' => false, 'error' => 'No hay imágenes válidas.']);
    exit;
}

$imagen_url    = $orderedMedia[0];
$imagenes_extra = array_slice($orderedMedia, 1);
$extraJson     = count($imagenes_extra) > 0 ? json_encode($imagenes_extra) : null;
$anioVal       = $anio !== '' ? $anio : null;

try {
    $stmt = $pdo->prepare(
        "UPDATE posts SET nombre=?, descripcion=?, imagen_url=?, imagenes_extra=?, tipo=?, anio=?
         WHERE id=?"
    );
    $stmt->execute([$nombre, $descripcion, $imagen_url, $extraJson, $tipo, $anioVal, $postId]);

    // Replace hashtags
    $pdo->prepare("DELETE FROM post_hashtags WHERE post_id = ?")->execute([$postId]);

    if ($hashtagsRaw) {
        $hashtags = json_decode($hashtagsRaw, true);
        if (is_array($hashtags)) {
            foreach ($hashtags as $tag) {
                $tag = trim(ltrim($tag, '#'));
                if ($tag === '') continue;

                $pdo->prepare("INSERT IGNORE INTO hashtags (nombre) VALUES (?)")->execute([$tag]);
                $hRow = $pdo->prepare("SELECT id FROM hashtags WHERE nombre = ?");
                $hRow->execute([$tag]);
                $hashtagId = $hRow->fetchColumn();

                $pdo->prepare("INSERT IGNORE INTO post_hashtags (post_id, hashtag_id) VALUES (?, ?)")
                    ->execute([$postId, $hashtagId]);
            }
        }
    }

    echo json_encode(['success' => true]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
