<?php
// ============================================================
// api/admin/promos.php — CRUD para Secciones Promocionales
// ============================================================
require_once '../db.php';
require_once 'auth_check.php';
require_once '../image_utils.php';
require_once 'log_helper.php';

$method = $_SERVER['REQUEST_METHOD'];

// ── GET: listar todas ────────────────────────────────────────
if ($method === 'GET') {
    $seccion = $_GET['seccion'] ?? null;

    if ($seccion) {
        $stmt = $pdo->prepare("SELECT * FROM hp_promociones WHERE seccion = ? ORDER BY orden ASC, id ASC");
        $stmt->execute([$seccion]);
    } else {
        $stmt = $pdo->query("SELECT * FROM hp_promociones ORDER BY seccion ASC, orden ASC, id ASC");
    }

    echo json_encode(['success' => true, 'promos' => $stmt->fetchAll()]);
    exit;
}

// ── POST: crear nueva promo ──────────────────────────────────
if ($method === 'POST') {
    // Soporta multipart/form-data para subir imagen
    $seccion   = $_POST['seccion']   ?? 'carousel';
    $titulo    = trim($_POST['titulo']    ?? '');
    $subtitulo = trim($_POST['subtitulo'] ?? '');
    $link_url  = trim($_POST['link_url']  ?? '');
    $btn_texto = trim($_POST['btn_texto'] ?? 'Ver más');
    $orden     = (int)($_POST['orden'] ?? 0);

    $id = (int)($_POST['id'] ?? 0);

    if (!$titulo || !$link_url) {
        echo json_encode(['success' => false, 'error' => 'Título y link son obligatorios.']);
        exit;
    }

    $imagen_url = null;

    // Procesar upload de imagen si viene
    if (!empty($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = dirname(__DIR__, 2) . '/uploads/promos/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $ext      = strtolower(pathinfo($_FILES['imagen']['name'], PATHINFO_EXTENSION));
        $allowed  = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];
        if (!in_array($ext, $allowed)) {
            echo json_encode(['success' => false, 'error' => 'Formato de imagen no permitido.']);
            exit;
        }

        $filename = 'promo_' . uniqid() . '.' . $ext;
        $dest     = $uploadDir . $filename;

        if (move_uploaded_file($_FILES['imagen']['tmp_name'], $dest)) {
            $imagen_url = 'uploads/promos/' . $filename;
        }
    }

    if ($id > 0) {
        // UPDATE MODES
        if ($imagen_url) {
            // Delete old image
            $row = $pdo->prepare("SELECT imagen_url FROM hp_promociones WHERE id = ?");
            $row->execute([$id]);
            $oldImg = $row->fetchColumn();
            if ($oldImg && file_exists(dirname(__DIR__, 2) . '/' . $oldImg)) {
                unlink(dirname(__DIR__, 2) . '/' . $oldImg);
            }
            // Update with new image
            $stmt = $pdo->prepare("UPDATE hp_promociones SET titulo = ?, link_url = ?, orden = ?, seccion = ?, imagen_url = ? WHERE id = ?");
            $stmt->execute([$titulo, $link_url, $orden, $seccion, $imagen_url, $id]);
        } else {
            // Update without changing image
            $stmt = $pdo->prepare("UPDATE hp_promociones SET titulo = ?, link_url = ?, orden = ?, seccion = ? WHERE id = ?");
            $stmt->execute([$titulo, $link_url, $orden, $seccion, $id]);
        }
        echo json_encode(['success' => true, 'id' => $id]);
        adminLog($pdo, $currentUser, 'admin', "Actualizó promoción/aliado: \"$titulo\"");
        exit;
    } else {
        // INSERT MODE
        $stmt = $pdo->prepare(
            "INSERT INTO hp_promociones (seccion, titulo, subtitulo, imagen_url, link_url, btn_texto, orden)
             VALUES (?, ?, ?, ?, ?, ?, ?)"
        );
        $stmt->execute([$seccion, $titulo, $subtitulo ?: null, $imagen_url, $link_url, $btn_texto, $orden]);

        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
        adminLog($pdo, $currentUser, 'admin', "Agregó nueva promoción/aliado: \"$titulo\"");
        exit;
    }
}

// ── PUT: actualizar campo o toggle activo ────────────────────
if ($method === 'PUT') {
    $body = json_decode(file_get_contents('php://input'), true) ?? [];

    $id     = (int)($body['id'] ?? 0);
    $action = $body['action'] ?? 'toggle_activo';

    if (!$id) {
        echo json_encode(['success' => false, 'error' => 'ID requerido.']);
        exit;
    }

    if ($action === 'toggle_activo') {
        $pdo->prepare("UPDATE hp_promociones SET activo = NOT activo WHERE id = ?")->execute([$id]);
        adminLog($pdo, $currentUser, 'admin', "Cambió visibilidad de promoción ID: $id");
        echo json_encode(['success' => true]);
        exit;
    }

    if ($action === 'update') {
        $fields = ['titulo', 'subtitulo', 'link_url', 'btn_texto', 'orden', 'seccion'];
        $set    = [];
        $vals   = [];
        foreach ($fields as $f) {
            if (array_key_exists($f, $body)) {
                $set[]  = "$f = ?";
                $vals[] = $body[$f];
            }
        }
        if (empty($set)) {
            echo json_encode(['success' => false, 'error' => 'Nada que actualizar.']);
            exit;
        }
        $vals[] = $id;
        $pdo->prepare("UPDATE hp_promociones SET " . implode(', ', $set) . " WHERE id = ?")->execute($vals);
        echo json_encode(['success' => true]);
        exit;
    }

    echo json_encode(['success' => false, 'error' => 'Acción desconocida.']);
    exit;
}

// ── DELETE: eliminar promo ───────────────────────────────────
if ($method === 'DELETE') {
    $body = json_decode(file_get_contents('php://input'), true) ?? [];
    $id   = (int)($body['id'] ?? 0);

    if (!$id) {
        echo json_encode(['success' => false, 'error' => 'ID requerido.']);
        exit;
    }

    // Eliminar imagen si existe
    $row = $pdo->prepare("SELECT imagen_url FROM hp_promociones WHERE id = ?");
    $row->execute([$id]);
    $promo = $row->fetch();
    if ($promo && $promo['imagen_url']) {
        $imgPath = dirname(__DIR__, 2) . '/' . $promo['imagen_url'];
        if (file_exists($imgPath)) unlink($imgPath);
    }

    $pdo->prepare("DELETE FROM hp_promociones WHERE id = ?")->execute([$id]);
    adminLog($pdo, $currentUser, 'admin', "Eliminó promoción/aliado ID: $id");
    echo json_encode(['success' => true]);
    exit;
}

echo json_encode(['success' => false, 'error' => 'Método no permitido.']);
