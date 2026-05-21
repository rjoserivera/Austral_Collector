<?php
require_once 'db.php';
$stmt = $pdo->query("DESCRIBE posts");
$columns = $stmt->fetchAll();
print_r($columns);
