<?php
// eventos.php
// Created by Antigravity

require_once '../db.php';

$method = $_SERVER['REQUEST_METHOD'];

function logAction($pdo, $userId, $tipo, $accion) {
    if (!$userId) return;
    $stmt = $pdo->prepare("INSERT INTO logs (user_id, tipo, accion) VALUES (?, ?, ?)");
    $stmt->execute([$userId, $tipo, $accion]);
}

try {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM eventos ORDER BY created_at DESC");
        echo json_encode(['success' => true, 'eventos' => $stmt->fetchAll()]);
    } 
    elseif ($method === 'POST') {
        $id = $_POST['id'] ?? null;
        $titulo = $_POST['titulo'] ?? '';
        $fecha_display = $_POST['fecha_display'] ?? '';
        $adminId = $_POST['adminId'] ?? null;

        $imagen_url = null;
        if (!empty($_FILES['imagen']['name']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = dirname(__DIR__, 2) . '/uploads/eventos/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            $ext = strtolower(pathinfo($_FILES['imagen']['name'], PATHINFO_EXTENSION));
            $allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
            if (in_array($ext, $allowed)) {
                $filename = uniqid('evento_', true) . '.' . $ext;
                if (move_uploaded_file($_FILES['imagen']['tmp_name'], $uploadDir . $filename)) {
                    $imagen_url = 'uploads/eventos/' . $filename;
                }
            }
        }
        
        if ($id) {
            if ($imagen_url) {
                $stmt = $pdo->prepare("UPDATE eventos SET titulo=?, fecha_display=?, imagen_url=? WHERE id=?");
                $stmt->execute([$titulo, $fecha_display, $imagen_url, $id]);
            } else {
                $stmt = $pdo->prepare("UPDATE eventos SET titulo=?, fecha_display=? WHERE id=?");
                $stmt->execute([$titulo, $fecha_display, $id]);
            }
            logAction($pdo, $adminId, 'alerta', "Actualizó el evento: $titulo");
        } else {
            if ($imagen_url) {
                $stmt = $pdo->prepare("INSERT INTO eventos (titulo, fecha_display, imagen_url) VALUES (?,?,?)");
                $stmt->execute([$titulo, $fecha_display, $imagen_url]);
            } else {
                $stmt = $pdo->prepare("INSERT INTO eventos (titulo, fecha_display) VALUES (?,?)");
                $stmt->execute([$titulo, $fecha_display]);
            }
            logAction($pdo, $adminId, 'alerta', "Publicó un nuevo evento: $titulo");
        }
        echo json_encode(['success' => true]);
    }
    elseif ($method === 'DELETE') {
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'] ?? null;
        $adminId = $data['adminId'] ?? null;
        
        $pdo->prepare("DELETE FROM eventos WHERE id = ?")->execute([$id]);
        logAction($pdo, $adminId, 'alerta', "Eliminó el evento ID: $id");
        
        echo json_encode(['success' => true]);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
