<?php
/**
 * mailer.php - Servicio de Correo para Austral Collector
 *
 * ESTRATEGIA DE ENVÍO (3 capas):
 * 1. SendGrid Web API  — máxima compatibilidad (Gmail, Outlook, Microsoft 365, institucional)
 * 2. SMTP directo      — fallback si SendGrid falla
 * 3. mail() nativo     — último recurso cPanel
 */

// ============================================================
// CONFIGURACIÓN CENTRAL
// ============================================================
define('SENDER_EMAIL', 'administracion@australcollector.cl');
define('SENDER_NAME',  'Austral Collector');
define('SENDGRID_API_KEY', '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');
define('SMTP_HOST',    'ssl://mail.australcollector.cl');
define('SMTP_PORT',    465);
define('SMTP_PASS',    '}s%Eet7n,RO}');

// -------------------------------------------------------
// MÉTODO 1: SendGrid Web API v3 (HTTP/HTTPS — sin puertos SMTP)
// Compatible con Microsoft 365, Outlook, inacapmail.cl, etc.
// -------------------------------------------------------
function _sendViaSendGrid(string $toEmail, string $subject, string $htmlBody): array {
    if (!function_exists('curl_init')) {
        return ['success' => false, 'log' => 'cURL no disponible', 'method' => 'sendgrid'];
    }

    $payload = json_encode([
        'personalizations' => [[
            'to' => [['email' => $toEmail]]
        ]],
        'from'    => ['email' => SENDER_EMAIL, 'name' => SENDER_NAME],
        'subject' => $subject,
        'content' => [['type' => 'text/html', 'value' => $htmlBody]]
    ]);

    $ch = curl_init('https://api.sendgrid.com/v3/mail/send');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_TIMEOUT        => 15,
        CURLOPT_HTTPHEADER     => [
            'Authorization: Bearer ' . SENDGRID_API_KEY,
            'Content-Type: application/json',
        ],
    ]);

    $response   = curl_exec($ch);
    $httpCode   = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError  = curl_error($ch);
    curl_close($ch);

    // SendGrid devuelve 202 Accepted cuando el envío es exitoso
    $success = ($httpCode === 202);
    $log     = "HTTP {$httpCode}" . ($curlError ? " | cURL error: {$curlError}" : "") . ($response ? " | Response: {$response}" : "");

    return ['success' => $success, 'log' => $log, 'method' => 'sendgrid'];
}

// -------------------------------------------------------
// MÉTODO 2: SMTP directo (mail.australcollector.cl:465)
// -------------------------------------------------------
function _sendViaSmtp(string $toEmail, string $subject, string $htmlBody): array {
    $smtpLog = "";
    $success = false;

    $encodedSubject = "=?UTF-8?B?" . base64_encode($subject) . "?=";

    $headers = [
        "From: \"" . SENDER_NAME . "\" <" . SENDER_EMAIL . ">",
        "To: {$toEmail}",
        "Subject: {$encodedSubject}",
        "MIME-Version: 1.0",
        "Content-Type: text/html; charset=UTF-8",
        "Content-Transfer-Encoding: base64",
    ];

    try {
        $socket = @fsockopen(SMTP_HOST, SMTP_PORT, $errno, $errstr, 12);
        if (!$socket) throw new Exception("fsockopen fallo [{$errno}]: {$errstr}");

        $read = function() use ($socket) {
            $r = "";
            while ($l = fgets($socket, 515)) {
                $r .= $l;
                if (isset($l[3]) && $l[3] === ' ') break;
            }
            return $r;
        };
        $cmd = function($c) use ($socket, $read) {
            fputs($socket, $c . "\r\n");
            return $read();
        };

        $smtpLog .= $read();
        $smtpLog .= $cmd("EHLO australcollector.cl");
        $smtpLog .= $cmd("AUTH LOGIN");
        $smtpLog .= $cmd(base64_encode(SENDER_EMAIL));
        $smtpLog .= $cmd(base64_encode(SMTP_PASS));
        $smtpLog .= $cmd("MAIL FROM: <" . SENDER_EMAIL . ">");
        $smtpLog .= $cmd("RCPT TO: <{$toEmail}>");
        $smtpLog .= $cmd("DATA");

        $encodedBody = chunk_split(base64_encode($htmlBody), 76, "\r\n");
        fputs($socket, implode("\r\n", $headers) . "\r\n\r\n" . $encodedBody . "\r\n.\r\n");

        $final = $read();
        $smtpLog .= $final;
        $smtpLog .= $cmd("QUIT");
        fclose($socket);

        if (strpos($final, "250") !== false) {
            $success = true;
        }
    } catch (Exception $e) {
        $smtpLog .= "SMTP_ERROR: " . $e->getMessage();
    }

    return ['success' => $success, 'log' => $smtpLog, 'method' => 'smtp'];
}

// -------------------------------------------------------
// MÉTODO 3: mail() nativo cPanel (último recurso)
// -------------------------------------------------------
function _sendViaNativeMail(string $toEmail, string $subject, string $htmlBody): array {
    $encodedSubject = "=?UTF-8?B?" . base64_encode($subject) . "?=";

    $headers  = "From: \"" . SENDER_NAME . "\" <" . SENDER_EMAIL . ">\r\n";
    $headers .= "Reply-To: " . SENDER_EMAIL . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    $success = @mail($toEmail, $encodedSubject, $htmlBody, $headers, "-f " . SENDER_EMAIL);

    return ['success' => (bool)$success, 'log' => $success ? 'native mail() OK' : 'native mail() FAILED', 'method' => 'native_mail'];
}

// -------------------------------------------------------
// DISPATCHER — SendGrid → SMTP → mail()
// -------------------------------------------------------
function _dispatchEmail(string $toEmail, string $subject, string $htmlBody, string $tag): bool {
    $logFile = __DIR__ . '/mail_sent.log';
    $ts      = date('Y-m-d H:i:s');

    // 1. Intentar SendGrid (mejor compatibilidad con Microsoft 365 / correos institucionales)
    $result = _sendViaSendGrid($toEmail, $subject, $htmlBody);

    // 2. Si SendGrid falla → SMTP directo
    if (!$result['success']) {
        $sgLog  = $result['log'];
        $result = _sendViaSmtp($toEmail, $subject, $htmlBody);
        $result['sendgrid_log'] = $sgLog;
    }

    // 3. Si SMTP también falla → mail() nativo
    if (!$result['success']) {
        $smtpLog = $result['log'];
        $result  = _sendViaNativeMail($toEmail, $subject, $htmlBody);
        $result['smtp_log'] = $smtpLog;
    }

    // Log
    $status  = $result['success'] ? "SENT via {$result['method']}" : "FAILED";
    $logLine = "[{$ts}] {$tag} TO: {$toEmail} | SUBJECT: {$subject} | STATUS: {$status}\n";
    if (!$result['success']) {
        $logLine .= "--- SENDGRID LOG ---\n" . ($result['sendgrid_log'] ?? '') . "\n";
        $logLine .= "--- SMTP LOG ---\n"      . ($result['smtp_log']     ?? '') . "\n";
        $logLine .= "--- NATIVE LOG ---\n"    . $result['log']                  . "\n";
    }
    $logLine .= "--------------------------------------------------------\n\n";
    file_put_contents($logFile, $logLine, FILE_APPEND);

    return $result['success'];
}

// ============================================================
// FUNCIÓN PÚBLICA 1: Correo de moderación (publicación eliminada)
// ============================================================
function sendModerationEmail($toEmail, $username, $postName, $postType, $motivo) {
    $subject = "Notificación de Moderación — Austral Collector";

    $html = <<<HTML
    <html><head><style>
        body{font-family:Arial,sans-serif;line-height:1.6;color:#333}
        .container{padding:20px;border:1px solid #ddd;border-radius:8px;max-width:600px;margin:0 auto}
        .header-logo{text-align:center;margin-bottom:20px}
        .header-logo img{max-width:150px;height:auto}
        .header{font-size:1.2rem;font-weight:bold;color:#1e4d5a;margin-bottom:15px}
        .details{background:#f9f9f9;padding:15px;border-radius:5px;margin:15px 0}
        .footer{font-size:.9rem;color:#777;margin-top:20px;border-top:1px solid #eee;padding-top:10px;text-align:center}
        .footer a{color:#1e4d5a;text-decoration:none;font-weight:bold}
    </style></head><body>
        <div class='container'>
            <div class='header-logo'>
                <a href='https://australcollector.cl/' target='_blank'>
                    <img src='https://australcollector.cl/logo_sin_fondo2.png' alt='Austral Collector Logo' width='150' style='display:block;margin:0 auto;border:0;' />
                </a>
            </div>
            <div class='header'>Hola, {$username}</div>
            <p>Te informamos que tu publicación ha sido revisada por nuestro equipo de moderación.</p>
            <div class='details'>
                <strong>Publicación:</strong> {$postName}<br>
                <strong>Tipo:</strong> {$postType}<br>
                <strong>Acción:</strong> Eliminada<br>
                <strong>Motivo:</strong> {$motivo}
            </div>
            <p>Si crees que esto es un error, puedes contactarnos respondiendo a este correo.</p>
            <div class='footer'>
                Equipo de Administración de <a href='https://australcollector.cl/' target='_blank'>Austral Collector</a>
            </div>
        </div>
    </body></html>
HTML;

    return _dispatchEmail($toEmail, $subject, $html, 'MODERATION');
}

// ============================================================
// FUNCIÓN PÚBLICA 2: Correo de clave temporal
// ============================================================
function sendTempKeyEmail($toEmail, $username, $tempKey) {
    $subject = "Tu Clave Temporal — Austral Collector";

    $html = <<<HTML
    <html><head><style>
        body{font-family:Arial,sans-serif;line-height:1.6;color:#333}
        .container{padding:20px;border:1px solid #ddd;border-radius:8px;max-width:600px;margin:0 auto}
        .header-logo{text-align:center;margin-bottom:20px}
        .header-logo img{max-width:150px;height:auto}
        .header{font-size:1.2rem;font-weight:bold;color:#1e4d5a;margin-bottom:15px}
        .key-box{background:#1e4d5a;color:#fff;padding:15px;text-align:center;font-size:1.5rem;font-family:monospace;border-radius:5px;margin:20px 0;letter-spacing:2px}
        .footer{font-size:.8rem;color:#777;margin-top:20px;border-top:1px solid #eee;padding-top:10px;text-align:center}
        .footer a{color:#1e4d5a;text-decoration:none;font-weight:bold}
    </style></head><body>
        <div class='container'>
            <div class='header-logo'>
                <a href='https://australcollector.cl/' target='_blank'>
                    <img src='https://australcollector.cl/logo_sin_fondo2.png' alt='Austral Collector Logo' width='150' style='display:block;margin:0 auto;border:0;' />
                </a>
            </div>
            <div class='header'>Hola, {$username}</div>
            <p>Se ha generado una clave temporal para tu cuenta en <a href='https://australcollector.cl/' target='_blank' style='color:#1e4d5a;font-weight:bold;text-decoration:none;'>Austral Collector</a>.</p>
            <p>Usa esta clave para iniciar sesión y cámbiala por una definitiva desde tu perfil.</p>
            <div class='key-box'>{$tempKey}</div>
            <p><strong>Nota:</strong> Si no solicitaste este cambio, contáctanos de inmediato.</p>
            <div class='footer'>Mensaje automático del sistema — Administración <a href='https://australcollector.cl/' target='_blank'>Austral Collector</a>.</div>
        </div>
    </body></html>
HTML;

    return _dispatchEmail($toEmail, $subject, $html, 'TEMP_KEY');
}

// ============================================================
// FUNCIÓN PÚBLICA 3: Correo personalizado
// ============================================================
function sendCustomEmail($toEmail, $username, $subject, $messageText) {
    $html = <<<HTML
    <html><head><style>
        body{font-family:'Segoe UI',Arial,sans-serif;line-height:1.6;color:#333;background:#f4f7f8;padding:20px}
        .container{padding:30px;border:1px solid #e0e0e0;border-radius:12px;max-width:600px;background:#fff;margin:0 auto;box-shadow:0 4px 6px rgba(0,0,0,.05)}
        .header-logo{text-align:center;margin-bottom:20px}
        .header-logo img{max-width:150px;height:auto}
        .header{font-size:1.4rem;font-weight:bold;color:#1e4d5a;margin-bottom:20px;border-bottom:2px solid #f0f0f0;padding-bottom:10px}
        .content{font-size:1.05rem;white-space:pre-wrap;margin-bottom:30px}
        .footer{font-size:.85rem;color:#999;border-top:1px solid #eee;padding-top:15px;text-align:center}
        .footer a{color:#1e4d5a;text-decoration:none;font-weight:bold}
    </style></head><body>
        <div class='container'>
            <div class='header-logo'>
                <a href='https://australcollector.cl/' target='_blank'>
                    <img src='https://australcollector.cl/logo_sin_fondo2.png' alt='Austral Collector Logo' width='150' style='display:block;margin:0 auto;border:0;' />
                </a>
            </div>
            <div class='header'>Hola, {$username}</div>
            <div class='content'>{$messageText}</div>
            <div class='footer'>Enviado por la administración de <a href='https://australcollector.cl/' target='_blank'>Austral Collector</a>.</div>
        </div>
    </body></html>
HTML;

    return _dispatchEmail($toEmail, $subject, $html, 'CUSTOM_MAIL');
}

// ============================================================
// FUNCIÓN PÚBLICA 4: Correo de registro (nuevo usuario)
// ============================================================
function sendRegistrationEmail($toEmail, $username, $tempKey) {
    $subject = "¡Bienvenido a Austral Collector!";

    $html = <<<HTML
    <html><head><style>
        body{font-family:Arial,sans-serif;line-height:1.6;color:#333}
        .container{padding:20px;border:1px solid #ddd;border-radius:8px;max-width:600px;margin:0 auto}
        .header-logo{text-align:center;margin-bottom:20px}
        .header-logo img{max-width:150px;height:auto}
        .header{font-size:1.2rem;font-weight:bold;color:#1e4d5a;margin-bottom:15px}
        .info-box{background:#f9f9f9;padding:15px;border-radius:5px;margin:15px 0}
        .key-box{background:#1e4d5a;color:#fff;padding:15px;text-align:center;font-size:1.5rem;font-family:monospace;border-radius:5px;margin:20px 0;letter-spacing:2px}
        .footer{font-size:.8rem;color:#777;margin-top:20px;border-top:1px solid #eee;padding-top:10px;text-align:center}
        .footer a{color:#1e4d5a;text-decoration:none;font-weight:bold}
    </style></head><body>
        <div class='container'>
            <div class='header-logo'>
                <a href='https://australcollector.cl/' target='_blank'>
                    <img src='https://australcollector.cl/logo_sin_fondo2.png' alt='Austral Collector Logo' width='150' style='display:block;margin:0 auto;border:0;' />
                </a>
            </div>
            <div class='header'>Hola, ¡felicidades {$username}!</div>
            <p>Se ha creado un perfil para ti en <a href='https://australcollector.cl/' target='_blank' style='color:#1e4d5a;font-weight:bold;text-decoration:none;'>Austral Collector</a>.</p>
            <div class='info-box'>
                <strong>Tu nombre de usuario para iniciar sesión:</strong> {$username}<br>
            </div>
            <p>Usa la siguiente clave temporal para iniciar sesión por primera vez. Por razones de seguridad, el sistema te pedirá actualizar tu contraseña inmediatamente tras ingresar.</p>
            <div class='key-box'>{$tempKey}</div>
            <div class='footer'>Mensaje automático del sistema — Administración <a href='https://australcollector.cl/' target='_blank'>Austral Collector</a>.</div>
        </div>
    </body></html>
HTML;

    return _dispatchEmail($toEmail, $subject, $html, 'REGISTER');
}
?>
