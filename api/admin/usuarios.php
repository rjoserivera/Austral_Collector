<?php
// usuarios.php - Admin User CRUD
// Created by Antigravity

require_once '../db.php';

$method = $_SERVER['REQUEST_METHOD'];

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
        echo json_encode(['success' => true]);
    }
    elseif ($method === 'PUT') {
        $data = json_decode(file_get_contents('php://input'), true);
        if ($data['action'] === 'update_field') {
            $stmt = $pdo->prepare("UPDATE usuarios SET " . $data['field'] . " = ? WHERE id = ?");
            $stmt->execute([$data['value'], $data['id']]);
        } else {
            $stmt = $pdo->prepare("UPDATE usuarios SET username=?, email=?, role=?, nombre=?, apellido=?, fecha_nacimiento=?, is_active=? WHERE id=?");
            $stmt->execute([
                $data['username'], $data['email'], $data['role'],
                $data['nombre'], $data['apellido'], $data['fecha_nacimiento'], $data['is_active'], $data['id']
            ]);
        }
        echo json_encode(['success' => true]);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
