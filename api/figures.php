<?php
// ============================================================
//  Austral Collector — Figures Endpoint
//  GET  /api/?route=figures        → List all figures
//  GET  /api/?route=figures/{id}   → Get single figure
//  POST /api/?route=figures        → Create figure (future)
// ============================================================

require __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

// Fallback mock data if DB not yet set up
$mockFigures = [
    [
        'id'          => 1,
        'name'        => 'Mazinger Z — Shogun Warriors',
        'year'        => 1978,
        'description' => 'Rara figura de plástico duro de la línea Shogun Warriors de Mattel.',
        'image_url'   => null,
        'global_likes'=> 342,
        'collector'   => 'RetroTech_AR',
    ],
    [
        'id'          => 2,
        'name'        => 'Optimus Prime — G1 Hasbro',
        'year'        => 1984,
        'description' => 'Transformers Generation 1, primer año de lanzamiento. Caja original.',
        'image_url'   => null,
        'global_likes'=> 518,
        'collector'   => 'VintageCollect',
    ],
    [
        'id'          => 3,
        'name'        => 'Voltron — Lion Force',
        'year'        => 1981,
        'description' => 'Set completo de los 5 leones de la versión diecast original.',
        'image_url'   => null,
        'global_likes'=> 289,
        'collector'   => 'SolitudeDust',
    ],
];

if ($method === 'GET') {
    // Try real DB first, fall back to mock
    try {
        $conn = getConnection();
        $result = $conn->query('SELECT * FROM figures ORDER BY created_at DESC LIMIT 20');
        if ($result && $result->num_rows > 0) {
            $figures = [];
            while ($row = $result->fetch_assoc()) {
                $figures[] = $row;
            }
            echo json_encode(['data' => $figures, 'source' => 'db']);
        } else {
            echo json_encode(['data' => $mockFigures, 'source' => 'mock']);
        }
        $conn->close();
    } catch (Throwable $e) {
        echo json_encode(['data' => $mockFigures, 'source' => 'mock']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
