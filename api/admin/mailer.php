<?php
/**
 * mailer.php - Servicio de Correo para Austral Collector
 * 
 * ESTRATEGIA DE ENVÍO (compatible con cPanel/hosting):
 * 1. Intenta SMTP directo con Gmail (funciona en local/VPS)
 * 2. Si falla (cPanel bloquea puerto 465), usa mail() nativo del servidor
 */

// -------------------------------------------------------
// HELPER: Construir cuerpo del mensaje RAW para SMTP
// -------------------------------------------------------
function _buildRawMessage(array $headers, string $body): string {
    return implode("\r\n", $headers) . "\r\n\r\n" . $body . "\r\n.\r\n";
}

// -------------------------------------------------------
// HELPER: Envío via SMTP manual (Gmail SSL 465)
// -------------------------------------------------------
function _sendViaSmtp(string $toEmail, string $subject, string $htmlBody): array {
    $adminEmail  = "administracion@australcollector.cl";
    $appPassword = "}s%Eet7n,RO}";
    $host        = "ssl://mail.australcollector.cl";
    $port        = 465;
    $smtpLog     = "";
    $success     = false;

    $headers = [
        "From: \"Austral Collector\" <{$adminEmail}>",
        "To: {$toEmail}",
        "Subject: {$subject}",
        "MIME-Version: 1.0",
        "Content-Type: text/html; charset=UTF-8",
        "Content-Transfer-Encoding: base64",
    ];

    try {
        $socket = @fsockopen($host, $port, $errno, $errstr, 12);
        if (!$socket) throw new Exception("fsockopen fallo [{$errno}]: {$errstr}");

        $read = function() use ($socket) {
            $r = "";
            while ($l = fgets($socket, 515)) {
                $r .= $l;
                if ($l[3] === ' ') break;
            }
            return $r;
        };
        $cmd = function($c) use ($socket, $read) {
            fputs($socket, $c . "\r\n");
            return $read();
        };

        $smtpLog .= $read();
        $smtpLog .= $cmd("EHLO localhost");
        $smtpLog .= $cmd("AUTH LOGIN");
        $smtpLog .= $cmd(base64_encode($adminEmail));
        $smtpLog .= $cmd(base64_encode($appPassword));
        $smtpLog .= $cmd("MAIL FROM: <{$adminEmail}>");
        $smtpLog .= $cmd("RCPT TO: <{$toEmail}>");
        $smtpLog .= $cmd("DATA");

        // Cuerpo en base64 para evitar problemas con caracteres especiales
        $encodedBody = base64_encode($htmlBody);
        fputs($socket, implode("\r\n", $headers) . "\r\n\r\n" . $encodedBody . "\r\n.\r\n");

        $final = $read();
        $smtpLog .= $final;
        $smtpLog .= $cmd("QUIT");
        fclose($socket);

        if (strpos($final, "250 ") !== false) {
            $success = true;
        }
    } catch (Exception $e) {
        $smtpLog .= "SMTP_ERROR: " . $e->getMessage();
    }

    return ['success' => $success, 'log' => $smtpLog, 'method' => 'smtp'];
}

// -------------------------------------------------------
// HELPER: Envío via mail() nativo del servidor (cPanel)
// -------------------------------------------------------
function _sendViaNativeMail(string $toEmail, string $subject, string $htmlBody): array {
    $senderEmail = "no-reply@alphadocere.cl"; // dominio del hosting cPanel
    $senderName  = "Austral Collector";

    $headers  = "From: \"{$senderName}\" <{$senderEmail}>\r\n";
    $headers .= "Reply-To: {$senderEmail}\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    $success = @mail($toEmail, $subject, $htmlBody, $headers);

    return ['success' => (bool)$success, 'log' => $success ? 'native mail() OK' : 'native mail() FAILED', 'method' => 'native_mail'];
}

// -------------------------------------------------------
// HELPER: Dispatcher — intenta SMTP, fallback a mail()
// -------------------------------------------------------
function _dispatchEmail(string $toEmail, string $subject, string $htmlBody, string $tag): bool {
    $logFile = __DIR__ . '/mail_sent.log';
    $ts      = date('Y-m-d H:i:s');

    // 1. Intento SMTP
    $result = _sendViaSmtp($toEmail, $subject, $htmlBody);

    // 2. Si SMTP falla → fallback a mail() nativo
    if (!$result['success']) {
        $smtpLog = $result['log'];
        $result  = _sendViaNativeMail($toEmail, $subject, $htmlBody);
        $result['smtp_log'] = $smtpLog; // guardar ambos logs
    }

    // 3. Log
    $status  = $result['success'] ? "SENT via {$result['method']}" : "FAILED";
    $logLine = "[{$ts}] {$tag} TO: {$toEmail} | SUBJECT: {$subject} | STATUS: {$status}\n";
    if (!$result['success']) {
        $logLine .= "--- SMTP LOG ---\n" . ($result['smtp_log'] ?? $result['log']) . "\n";
        $logLine .= "--- NATIVE LOG ---\n" . $result['log'] . "\n";
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
