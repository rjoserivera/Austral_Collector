<?php
// db.php - Database Connection Setup
// Created by Antigravity
define('JWT_SECRET', 'AustralCollector_Secure_Key_2026_!!');

// Global Headers for API
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: *');

if (($_SERVER['REQUEST_METHOD'] ?? '') == 'OPTIONS') {
    exit;
}

$host = 'localhost';
$db   = 'australcollector_plus';
$user = 'australcollector_joseph';
$pass = 'NGvg6JOIdK3wbDeqPD4V4VQIb98Wsk5sGQQUbdg';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
     die(json_encode(['error' => 'Error de conexión: ' . $e->getMessage()]));
}
// End of db.php
