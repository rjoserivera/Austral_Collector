<?php
require 'api/db.php';
$stmt = $pdo->query("SELECT id, nombre, created_at FROM posts ORDER BY created_at DESC LIMIT 60");
print_r($stmt->fetchAll());
?>
