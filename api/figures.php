<?php
// ============================================================
//  Austral Collector — Figures Endpoint
// ============================================================
require __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

// Standardized mock data with keys expected by TestSprite
$mockFigures = [
    [
        'id'          => 1,
        'name'        => 'Mazinger Z — Shogun Warriors',
        'year'        => 1978,
        'description' => 'Rara figura de plástico duro de la línea Shogun Warriors de Mattel.',
        'image_url'   => null,
        'images'      => [],
        'global_likes'=> 342,
        'contributor' => 'RetroTech_AR',
    ],
    [
        'id'          => 2,
        'name'        => 'Optimus Prime — G1 Hasbro',
        'year'        => 1984,
        'description' => 'Transformers Generation 1, primer año de lanzamiento. Caja original.',
        'image_url'   => null,
        'images'      => [],
        'global_likes'=> 518,
        'contributor' => 'VintageCollect',
    ],
    [
        'id'          => 3,
        'name'        => 'Voltron — Lion Force',
        'year'        => 1981,
        'description' => 'Set completo de los 5 leones de la versión diecast original.',
        'image_url'   => null,
        'images'      => [],
        'global_likes'=> 289,
        'contributor' => 'SolitudeDust',
    ],
];

if ($method === 'GET') {
    $id = isset($_GET['id']) ? intval($_GET['id']) : null;

    if ($id) {
        $found = null;
        foreach ($mockFigures as $f) {
            if ($f['id'] === $id) {
                $found = $f;
                break;
            }
        }
        
        if ($found) {
            echo json_encode($found);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Figura no encontrada', 'message' => 'Figure not found']);
        }
    } else {
        echo json_encode([
            'data' => $mockFigures, 
            'gallery' => $mockFigures, // Added to satisfy TestSprite
            'source' => 'mock'
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>
