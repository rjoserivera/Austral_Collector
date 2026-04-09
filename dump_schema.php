<?php
require_once __DIR__ . '/api/db.php';
$stmt = $pdo->query("SHOW TABLES");
$tables = $stmt->fetchAll(PDO::FETCH_COLUMN);

$out = "";
foreach ($tables as $t) {
    $out .= "$t:\n";
    $stmt2 = $pdo->query("DESCRIBE $t");
    $cols = $stmt2->fetchAll(PDO::FETCH_ASSOC);
    foreach ($cols as $c) {
        $out .= "  {$c['Field']} ({$c['Type']})\n";
    }
}
file_put_contents('db_schema.txt', $out);
