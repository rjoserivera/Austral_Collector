<?php
require_once __DIR__ . '/../db.php';

try {
    $stmt = $pdo->query("SELECT id, icon, title, descripcion as `desc` FROM identidad ORDER BY FIELD(id, 'mision', 'valores', 'metas')");
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode(['success' => true, 'data' => $data]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
