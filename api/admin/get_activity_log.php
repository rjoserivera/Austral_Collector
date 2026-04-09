<?php
require_once __DIR__ . '/../db.php';

// Headers for JSON
header('Content-Type: application/json');

try {
    // Basic admin check (could be improved with session check)
    // For now, simpler check as in other admin scripts
    // $userId = $_GET['user_id'] ?? null;
    
    $where = [];
    $params = [];

    // Filter by user
    if (!empty($_GET['usuario'])) {
        $where[] = "u.username LIKE ?";
        $params[] = "%" . $_GET['usuario'] . "%";
    }

    // Filter by type
    if (!empty($_GET['tipo'])) {
        $where[] = "l.tipo = ?";
        $params[] = $_GET['tipo'];
    }

    // Filter by Date From
    if (!empty($_GET['fecha_desde'])) {
        $where[] = "DATE(l.created_at) >= ?";
        $params[] = $_GET['fecha_desde'];
    }

    // Filter by Date To
    if (!empty($_GET['fecha_hasta'])) {
        $where[] = "DATE(l.created_at) <= ?";
        $params[] = $_GET['fecha_hasta'];
    }

    $sql = "SELECT l.id, l.tipo, l.accion, l.user_id, u.username as user, 
                   DATE_FORMAT(l.created_at, '%d/%m/%Y %H:%i') as time
            FROM logs l 
            LEFT JOIN usuarios u ON l.user_id = u.id";

    if (count($where) > 0) {
        $sql .= " WHERE " . implode(" AND ", $where);
    }

    $sql .= " ORDER BY l.created_at DESC LIMIT 200";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'logs' => $logs
    ]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
