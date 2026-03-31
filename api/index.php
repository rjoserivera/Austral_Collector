<?php
// ============================================================
//  Austral Collector — PHP API Entry Point
//  Access via: http://localhost/Austral Collector/api/
// ============================================================

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Parse the route
$path    = trim($_GET['route'] ?? '', '/');
$method  = $_SERVER['REQUEST_METHOD'];
$parts   = explode('/', $path);
$resource = $parts[0] ?? '';

switch ($resource) {
    case 'figures':
        require __DIR__ . '/figures.php';
        break;
    case 'events':
        require __DIR__ . '/events.php';
        break;
    case 'members':
        require __DIR__ . '/members.php';
        break;
    default:
        http_response_code(200);
        echo json_encode([
            'status'  => 'ok',
            'app'     => 'Austral Collector API',
            'version' => '1.0.0',
            'routes'  => ['/figures', '/events', '/members'],
        ]);
}
