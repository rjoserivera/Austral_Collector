<?php
require 'api/db.php';
$stmt = $pdo->query("SELECT COUNT(*) FROM posts WHERE user_id NOT IN (1,2,3,15,16,47,52,63,67,68,72,75)");
echo $stmt->fetchColumn();
?>
