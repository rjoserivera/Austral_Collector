<?php
// usuarios.php - Admin User CRUD
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
        $stmt = $pdo->query("SELECT * FROM usuarios ORDER BY created_at DESC");
        $users = $stmt->fetchAll();
        foreach($users as &$u) unset($u['password']);
        echo json_encode(['usuarios' => $users]);
    } 
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        $passHash = password_hash($data['password'], PASSWORD_BCRYPT);
        $stmt = $pdo->prepare("INSERT INTO usuarios (username, email, password, role, nombre, apellido, fecha_nacimiento, is_active) VALUES (?,?,?,?,?,?,?,?)");
        $stmt->execute([
            $data['username'], $data['email'], $passHash, $data['role'],
            $data['nombre'], $data['apellido'], $data['fecha_nacimiento'], $data['is_active']
        ]);
        
        logAction($pdo, $data['adminId'] ?? null, 'admin', "Creó al usuario: " . $data['username']);
        
        echo json_encode(['success' => true, 'username' => $data['username']]);
    }
    elseif ($method === 'PUT') {
        $data = json_decode(file_get_contents('php://input'), true);
        if ($data['action'] === 'update_field') {
            $stmt = $pdo->prepare("UPDATE usuarios SET " . $data['field'] . " = ? WHERE id = ?");
            $stmt->execute([$data['value'], $data['id']]);
            
            logAction($pdo, $data['adminId'] ?? null, 'admin', "Actualizó " . $data['field'] . " del usuario ID: " . $data['id']);
        } else {
            $stmt = $pdo->prepare("UPDATE usuarios SET username=?, email=?, role=?, nombre=?, apellido=?, fecha_nacimiento=?, is_active=? WHERE id=?");
            $stmt->execute([
                $data['username'], $data['email'], $data['role'],
                $data['nombre'], $data['apellido'], $data['fecha_nacimiento'], $data['is_active'], $data['id']
            ]);
            
            logAction($pdo, $data['adminId'] ?? null, 'admin', "Editó perfil completo del usuario: " . $data['username']);
        }
        echo json_encode(['success' => true]);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
