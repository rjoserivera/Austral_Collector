<?php
// reordenar_posts.php - Handle post reordering from user profile
// Created by Antigravity

require_once '../db.php';

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!isset($data['orden']) || !is_array($data['orden'])) {
    echo json_encode(['success' => false, 'error' => 'Datos inválidos']);
    exit;
}

try {
    $pdo->beginTransaction();

    // The order payload is an array of objects like {id: 1, tipo: "figura"} sorted by UI
    $orden = 0;
    $stmt = $pdo->prepare("UPDATE posts SET orden = ? WHERE id = ?");

    foreach ($data['orden'] as $item) {
        $id = intval($item['id']);
        if ($id > 0) {
            $stmt->execute([$orden, $id]);
            $orden++;
        }
    }

    $pdo->commit();
    echo json_encode(['success' => true, 'message' => 'Orden actualizado correctamente']);

} catch (PDOException $e) {
    $pdo->rollBack();
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
