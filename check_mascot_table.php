<?php
require 'api/db.php';
$stmt = $pdo->query("SHOW TABLES LIKE 'mascot_texts'");
echo $stmt->rowCount();
?>
