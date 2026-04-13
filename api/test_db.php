<?php
require 'db.php';
$stmt = $pdo->query('SELECT NOW() as db_time, CURDATE() as cd, CURTIME() as ct');
$time = $stmt->fetch(PDO::FETCH_ASSOC);

$stmt2 = $pdo->query('SELECT id, username, fecha_nacimiento, DAY(fecha_nacimiento) as d, MONTH(fecha_nacimiento) as m FROM usuarios WHERE MONTH(fecha_nacimiento) = MONTH(CURDATE())');
$users = $stmt2->fetchAll(PDO::FETCH_ASSOC);

echo "DB Time: \n";
print_r($time);
echo "\nUsers: \n";
print_r($users);
