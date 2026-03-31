<?php
// ============================================================
//  Austral Collector — Events Endpoint
//  GET /api/?route=events
// ============================================================

require __DIR__ . '/db.php';

$mockEvents = [
    ['id' => 1, 'title' => 'Feria de Coleccionismo Buenos Aires 2025', 'date' => '2025-04-15', 'tag' => 'Feria'],
    ['id' => 2, 'title' => 'Subasta Online — Robots Japoneses Vintage',  'date' => '2025-04-22', 'tag' => 'Subasta'],
    ['id' => 3, 'title' => 'Meet & Collectors — Zona Norte GBA',          'date' => '2025-05-10', 'tag' => 'Evento'],
];

echo json_encode(['data' => $mockEvents, 'source' => 'mock']);
