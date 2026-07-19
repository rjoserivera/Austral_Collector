<?php
// solicitud_registro.php - Enviar solicitud de registro a administración
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
$username = $data['username'] ?? '';
$fechaNacimiento = $data['fechaNacimiento'] ?? '';

if (empty($nombre) || empty($email) || empty($username) || empty($fechaNacimiento)) {
    exit(json_encode(['success' => false, 'error' => 'Faltan campos obligatorios']));
}

$adminEmail = "administracion@australcollector.cl";
$asunto = "📝 Nueva Solicitud de Registro: $nombre";

// Formateamos la fecha para que sea más legible si viene en YYYY-MM-DD
$fechaFormat = date('d/m/Y', strtotime($fechaNacimiento));

$cuerpoCorreo = "Has recibido una nueva SOLICITUD DE REGISTRO desde la página web.\n\n" .
                "Por favor, revisa estos datos para crear la cuenta manualmente:\n\n" .
                "----------------------------------------------------\n" .
                "👤 Nombre y Apellido: $nombre\n" .
                "📧 Correo Electrónico: $email\n" .
                "👾 Usuario Deseado: $username\n" .
                "🎂 Fecha de Nacimiento: $fechaFormat ($fechaNacimiento)\n" .
                "----------------------------------------------------\n\n".
                "Para registrar a este usuario, ve al Panel de Administración > Pestaña 'Usuarios' > y haz clic en 'Añadir Usuario'.";

// Enviarle el correo AL ADMINISTRADOR
if (sendCustomEmail($adminEmail, "Administración de Austral Collector", $asunto, $cuerpoCorreo)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Hubo un fallo técnico al conectar con el servidor de correo SMTP.']);
}
?>
