<?php
// usuarios.php - Admin User CRUD
// Created by Antigravity

require_once '../db.php';
require_once 'auth_check.php';

$method = $_SERVER['REQUEST_METHOD'];

function logAction($pdo, $userId, $tipo, $accion) {
    if (!$userId) return;
    $stmt = $pdo->prepare("INSERT INTO logs (user_id, tipo, accion) VALUES (?, ?, ?)");
    $stmt->execute([$userId, $tipo, $accion]);
}

try {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM usuarios ORDER BY created_at DESC");
        $users = $stmt->fetchAll();
        foreach($users as &$u) unset($u['password']);
        echo json_encode(['usuarios' => $users]);
    } 
    elseif ($method === 'POST') {
        try {
            $pdo->exec("ALTER TABLE usuarios ADD COLUMN require_password_change TINYINT(1) DEFAULT 0");
        } catch(PDOException $e) {}

        $data = json_decode(file_get_contents('php://input'), true);
        $passHash = password_hash($data['password'], PASSWORD_BCRYPT);
        $stmt = $pdo->prepare("INSERT INTO usuarios (username, email, password, require_password_change, role, nombre, apellido, fecha_nacimiento, is_active, verification_type) VALUES (?,?,?,1,?,?,?,?,?,?)");
        $stmt->execute([
            $data['username'], $data['email'], $passHash, $data['role'],
            $data['nombre'], $data['apellido'], $data['fecha_nacimiento'], $data['is_active'],
            $data['verification_type'] ?? 'none'
        ]);
        
        logAction($pdo, $data['adminId'] ?? null, 'admin', "Creó al usuario: " . $data['username']);
        
        require_once 'mailer.php';
        sendTempKeyEmail($data['email'], $data['username'], $data['password']);
        
        echo json_encode(['success' => true, 'username' => $data['username'], 'id' => (int)$pdo->lastInsertId()]);
    }
    elseif ($method === 'PUT') {
        try {
            $pdo->exec("ALTER TABLE usuarios ADD COLUMN require_password_change TINYINT(1) DEFAULT 0");
        } catch(PDOException $e) {}

        $data = json_decode(file_get_contents('php://input'), true);
        if ($data['action'] === 'update_field') {
            $stmt = $pdo->prepare("UPDATE usuarios SET " . $data['field'] . " = ? WHERE id = ?");
            $stmt->execute([$data['value'], $data['id']]);
            
            logAction($pdo, $data['adminId'] ?? null, 'admin', "Actualizó " . $data['field'] . " del usuario ID: " . $data['id']);
        } else {
            $verType  = $data['verification_type']  ?? 'none';
            $verBadge = $data['verification_badge']  ?? null;
            // If switching away from external, clear the badge
            if ($verType !== 'external') $verBadge = null;

            if (!empty($data['password'])) {
                $passHash = password_hash($data['password'], PASSWORD_BCRYPT);
                $stmt = $pdo->prepare("UPDATE usuarios SET username=?, email=?, password=?, require_password_change=1, role=?, nombre=?, apellido=?, fecha_nacimiento=?, is_active=?, verification_type=?, verification_badge=? WHERE id=?");
                $stmt->execute([
                    $data['username'], $data['email'], $passHash, $data['role'],
                    $data['nombre'], $data['apellido'], $data['fecha_nacimiento'], $data['is_active'],
                    $verType, $verBadge, $data['id']
                ]);
                logAction($pdo, $data['adminId'] ?? null, 'admin', "Editó perfil completo y cambió contraseña del usuario: " . $data['username']);
                
                require_once 'mailer.php';
                sendTempKeyEmail($data['email'], $data['username'], $data['password']);
            } else {
                $stmt = $pdo->prepare("UPDATE usuarios SET username=?, email=?, role=?, nombre=?, apellido=?, fecha_nacimiento=?, is_active=?, verification_type=?, verification_badge=? WHERE id=?");
                $stmt->execute([
                    $data['username'], $data['email'], $data['role'],
                    $data['nombre'], $data['apellido'], $data['fecha_nacimiento'], $data['is_active'],
                    $verType, $verBadge, $data['id']
                ]);
                logAction($pdo, $data['adminId'] ?? null, 'admin', "Editó perfil completo del usuario: " . $data['username']);
            }
        }
        echo json_encode(['success' => true]);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
