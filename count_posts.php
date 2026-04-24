<?php
require 'api/db.php';
echo $pdo->query("SELECT COUNT(*) FROM posts")->fetchColumn();
?>
