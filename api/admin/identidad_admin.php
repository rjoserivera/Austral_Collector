<?php
require_once __DIR__ . '/../db.php';

$method = $_SERVER['REQUEST_METHOD'];

// Función simple para verificar admin basada en user_id enviado en payload/query
function checkAdmin($pdo, $userId) {
    if (!$userId) return false;
    $stmt = $pdo->prepare("SELECT role FROM usuarios WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();
    return $user && strtolower($user['role']) === 'admin';
}

function logAction($pdo, $userId, $tipo, $accion) {
    if (!$userId) return;
    $stmt = $pdo->prepare("INSERT INTO logs (user_id, tipo, accion) VALUES (?, ?, ?)");
    $stmt->execute([$userId, $tipo, $accion]);
}

try {
    if ($method === 'GET') {
        $userId = $_GET['user_id'] ?? null;
        if (!checkAdmin($pdo, $userId)) {
            echo json_encode(['success' => false, 'error' => 'Acceso denegado. Se requiere rol admin.']);
            exit;
        }

        $stmt = $pdo->query("SELECT id, icon, title, descripcion as `desc` FROM identidad ORDER BY FIELD(id, 'mision', 'valores', 'metas')");
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'data' => $data]);
    } 
    elseif ($method === 'PUT' || $method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        $userId = $data['user_id'] ?? null;
        
        if (!checkAdmin($pdo, $userId)) {
            echo json_encode(['success' => false, 'error' => 'Acceso denegado. Se requiere rol admin.']);
            exit;
        }

        $identidades = $data['identidades'] ?? [];
        
        if (!empty($identidades)) {
            $pdo->beginTransaction();
            foreach ($identidades as $item) {
                if (isset($item['id'], $item['icon'], $item['title'], $item['desc'])) {
                    $stmt = $pdo->prepare("UPDATE identidad SET icon=?, title=?, descripcion=? WHERE id=?");
                    $stmt->execute([$item['icon'], $item['title'], $item['desc'], $item['id']]);
                    
                    logAction($pdo, $userId, 'admin', "Actualizó sección de identidad: " . $item['id']);
                }
            }
            $pdo->commit();
        }
        echo json_encode(['success' => true]);
    }
} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
