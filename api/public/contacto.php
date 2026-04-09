<?php
// contacto.php - Enviar formulario de contacto a administración
// Created by Antigravity

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../admin/mailer.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['success' => false, 'error' => 'Método no permitido']));
}

$data = json_decode(file_get_contents('php://input'), true);
$nombre = $data['nombre'] ?? '';
$email = $data['email'] ?? '';
$mensaje = $data['mensaje'] ?? '';

if (empty($nombre) || empty($email) || empty($mensaje)) {
    exit(json_encode(['success' => false, 'error' => 'Faltan campos obligatorios']));
}

$adminEmail = "austral.cadmin@gmail.com";
$asunto = "🌟 Nuevo Contacto Web: $nombre";

// Vamos a usar la función pública sendCustomEmail del mailer.php existente, 
// pero pasamos los detalles en el cuerpo.
$cuerpoCorreo = "Has recibido una nueva consulta desde el Formulario de Contacto.\n\n" .
                "👤 Nombre: $nombre\n" .
                "📧 Correo del usuario: $email\n\n" .
                "📝 Mensaje del usuario:\n" .
                "----------------------------------------------------\n" .
                "$mensaje\n" .
                "----------------------------------------------------\n\n".
                "Si deseas responderle a este usuario, escribe directamente a: $email";

// Enviarle el correo AL ADMINISTRADOR
// (Usamos "Administrativo" como destinatario referencial interno)
if (sendCustomEmail($adminEmail, "Administración de Austral Collector", $asunto, $cuerpoCorreo)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Hubo un fallo técnico al conectar con el servidor de correo SMTP.']);
}
?>
