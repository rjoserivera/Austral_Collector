<?php
require_once 'db.php';
header('Content-Type: application/json');
try {
    $pdo->exec("UPDATE logs SET tipo = 'login' WHERE tipo IN ('auth', 'login')");
    $pdo->exec("UPDATE logs SET tipo = 'admin' WHERE tipo = 'admin'");
    $pdo->exec("UPDATE logs SET tipo = 'figura' WHERE tipo = 'figura'");
    $pdo->exec("UPDATE logs SET tipo = 'cosplay' WHERE tipo = 'cosplay'");
    $pdo->exec("UPDATE logs SET tipo = 'alerta' WHERE tipo IN ('event', 'publicacion', 'alerta')");
    $pdo->exec("UPDATE logs SET tipo = 'usuario' WHERE tipo = 'usuario'");
    echo json_encode(['success' => true, 'message' => 'Logs updated successfully']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
