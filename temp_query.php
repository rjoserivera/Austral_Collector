<?php
require_once 'api/db.php';
$stmt = $pdo->query('SELECT * FROM videos');
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
?>
