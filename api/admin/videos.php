<?php
// videos.php
// Created by Antigravity

require_once '../db.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM videos ORDER BY created_at DESC");
        echo json_encode(['videos' => $stmt->fetchAll()]);
    } 
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("INSERT INTO videos (titulo, link_yt) VALUES (?,?)");
        $stmt->execute([$data['titulo'], $data['link']]);
        echo json_encode(['success' => true]);
    }
    elseif ($method === 'DELETE') {
        $data = json_decode(file_get_contents('php://input'), true);
        $pdo->prepare("DELETE FROM videos WHERE id = ?")->execute([$data['id']]);
        echo json_encode(['success' => true]);
    }
    elseif ($method === 'PUT') {
        $data = json_decode(file_get_contents('php://input'), true);
        $pdo->prepare("UPDATE videos SET destacado = 1 - destacado WHERE id = ?")->execute([$data['id']]);
        echo json_encode(['success' => true]);
    }
} catch (PDOException $e) {
     echo json_encode(['error' => $e->getMessage()]);
}
?>
