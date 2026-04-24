<?php
require_once '../db.php';

header('Content-Type: application/json');

try {
    $stmt = $pdo->query("SELECT section_name, message FROM mascot_texts");
    $texts = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $texts[$row['section_name']] = $row['message'];
    }
    echo json_encode(['success' => true, 'data' => $texts]);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
