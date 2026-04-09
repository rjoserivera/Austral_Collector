<?php
require_once __DIR__ . '/api/db.php';
$stmt = $pdo->query("SHOW TABLES");
$tables = $stmt->fetchAll(PDO::FETCH_COLUMN);

foreach ($tables as $table) {
    echo "TABLE: $table\n";
    $stmt2 = $pdo->query("DESCRIBE $table");
    $cols = $stmt2->fetchAll(PDO::FETCH_ASSOC);
    foreach ($cols as $col) {
        echo "  - {$col['Field']} ({$col['Type']})\n";
    }
}
