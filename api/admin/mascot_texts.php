<?php
// api/admin/mascot_texts.php
// Created by Antigravity

require_once '../db.php';
require_once 'auth_check.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT section_name, message FROM mascot_texts");
        $texts = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $texts[$row['section_name']] = $row['message'];
        }
        echo json_encode(['success' => true, 'data' => $texts]);
    } 
    elseif ($method === 'PUT') {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $pdo->beginTransaction();
        
        $stmt = $pdo->prepare("INSERT INTO mascot_texts (section_name, message) VALUES (?, ?) ON DUPLICATE KEY UPDATE message = VALUES(message)");
        
        foreach (['inicio', 'nosotros', 'galeria', 'miembros', 'contacto'] as $section) {
            if (isset($data[$section])) {
                $stmt->execute([$section, $data[$section]]);
            }
        }
        
        $pdo->commit();
        
        // Log action
        if (isset($data['adminId'])) {
            $logStmt = $pdo->prepare("INSERT INTO logs (user_id, tipo, accion) VALUES (?, 'admin', 'Actualizó los textos de la mascota virtual')");
            $logStmt->execute([$data['adminId']]);
        }
        
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'Método no permitido']);
    }
} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo json_encode(['error' => $e->getMessage()]);
}
?>
