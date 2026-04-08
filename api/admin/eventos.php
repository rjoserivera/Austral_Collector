<?php
// eventos.php
// Created by Antigravity

require_once '../db.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM eventos ORDER BY created_at DESC");
        echo json_encode(['success' => true, 'eventos' => $stmt->fetchAll()]);
    } 
    elseif ($method === 'POST') {
        $id = $_POST['id'] ?? null;
        $titulo = $_POST['titulo'] ?? '';
        $fecha_display = $_POST['fecha_display'] ?? '';
        
        if ($id) {
            $stmt = $pdo->prepare("UPDATE eventos SET titulo=?, fecha_display=? WHERE id=?");
            $stmt->execute([$titulo, $fecha_display, $id]);
        } else {
            $stmt = $pdo->prepare("INSERT INTO eventos (titulo, fecha_display) VALUES (?,?)");
            $stmt->execute([$titulo, $fecha_display]);
        }
        echo json_encode(['success' => true]);
    }
    elseif ($method === 'DELETE') {
        $data = json_decode(file_get_contents('php://input'), true);
        $pdo->prepare("DELETE FROM eventos WHERE id = ?")->execute([$data['id']]);
        echo json_encode(['success' => true]);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
