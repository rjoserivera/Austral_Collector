<?php
/**
 * mailer.php - Servicio de Correo para Austral Collector
 * Maneja el envío de correos y genera un log de respaldo para pruebas locales.
 */

function sendModerationEmail($toEmail, $username, $postName, $postType, $motivo) {
    $adminEmail = "austral.cadmin@gmail.com";
    $appPassword = "sqek pnpi tejo qfqy";
    $subject = "Notificación de Moderación — Austral Collector";
    
    // Contenido del correo en HTML
    $messageBody = "
    <html>
    <head>
        <title>Aviso de Moderación</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 600px; }
            .header { font-size: 1.2rem; font-weight: bold; color: #1e4d5a; margin-bottom: 15px; }
            .details { background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .footer { font-size: 0.9rem; color: #777; margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>Hola, $username</div>
            <p>Te informamos que tu publicación ha sido revisada por nuestro equipo de moderación.</p>
            
            <div class='details'>
                <strong>Publicación:</strong> $postName<br>
                <strong>Tipo:</strong> $postType<br>
                <strong>Acción:</strong> Eliminada<br>
                <strong>Motivo:</strong> $motivo
            </div>
            
            <p>Si crees que esto es un error o tienes dudas, puedes contactarnos respondiendo a este correo.</p>
            
            <div class='footer'>
                Atentamente,<br>
                Equipo de Administración de Austral Collector
            </div>
        </div>
    </body>
    </html>
    ";

    // Encabezados SMTP
    $headers = [
        "From: \"Austral Collector Admin\" <$adminEmail>",
        "To: $toEmail",
        "Subject: $subject",
        "MIME-Version: 1.0",
        "Content-Type: text/html; charset=UTF-8"
    ];

    $smtpResponse = "";
    $mailed = false;

    // Conexión SMTP manual vía sockets (SSL Port 465)
    $host = "ssl://smtp.gmail.com";
    $port = 465;
    
    try {
        $socket = fsockopen($host, $port, $errno, $errstr, 15);
        if (!$socket) throw new Exception("No se pudo conectar: $errstr");

        $getResponse = function($socket) {
            $response = "";
            while ($line = fgets($socket, 515)) {
                $response .= $line;
                if (substr($line, 3, 1) == " ") break;
            }
            return $response;
        };

        $sendCommand = function($socket, $cmd) use ($getResponse) {
            fputs($socket, $cmd . "\r\n");
            return $getResponse($socket);
        };

        $smtpResponse .= $getResponse($socket);
        $smtpResponse .= $sendCommand($socket, "EHLO localhost");
        $smtpResponse .= $sendCommand($socket, "AUTH LOGIN");
        $smtpResponse .= $sendCommand($socket, base64_encode($adminEmail));
        $smtpResponse .= $sendCommand($socket, base64_encode($appPassword));
        $smtpResponse .= $sendCommand($socket, "MAIL FROM: <$adminEmail>");
        $smtpResponse .= $sendCommand($socket, "RCPT TO: <$toEmail>");
        $smtpResponse .= $sendCommand($socket, "DATA");
        
        fputs($socket, implode("\r\n", $headers) . "\r\n\r\n" . $messageBody . "\r\n.\r\n");
        $smtpResponse .= $getResponse($socket);
        
        $smtpResponse .= $sendCommand($socket, "QUIT");
        fclose($socket);
        
        if (strpos($smtpResponse, "250 ") !== false || strpos($smtpResponse, "235 ") !== false) {
            $mailed = true;
        }

    } catch (Exception $e) {
        $smtpResponse .= "ERROR: " . $e->getMessage();
    }

    // Guardar en el log de archivos para verificación
    $logFile = __DIR__ . '/mail_sent.log';
    $timestamp = date('Y-m-d H:i:s');
    $logContent = "[$timestamp] TO: $toEmail | SUBJECT: $subject | STATUS: " . ($mailed ? "SENT" : "FAILED") . "\n";
    if (!$mailed) {
        $logContent .= "--- SMTP LOG ---\n$smtpResponse\n";
    }
    $logContent .= "--------------------------------------------------------\n\n";
    
    file_put_contents($logFile, $logContent, FILE_APPEND);

    return $mailed;
}

function sendTempKeyEmail($toEmail, $username, $tempKey) {
    $adminEmail = "austral.cadmin@gmail.com";
    $appPassword = "sqek pnpi tejo qfqy";
    $subject = "Tu Clave Temporal — Austral Collector";
    
    $messageBody = "
    <html>
    <head>
        <title>Clave Temporal Generada</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 600px; }
            .header { font-size: 1.2rem; font-weight: bold; color: #1e4d5a; margin-bottom: 15px; }
            .key-box { background: #1e4d5a; color: #fff; padding: 15px; text-align: center; font-size: 1.5rem; font-family: monospace; border-radius: 5px; margin: 20px 0; letter-spacing: 2px; }
            .footer { font-size: 0.8rem; color: #777; margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>Hola, $username</div>
            <p>Se ha generado una clave temporal para tu cuenta en Austral Collector.</p>
            <p>Puedes usar esta clave para iniciar sesión y cambiarla por una definitiva desde tu perfil.</p>
            
            <div class='key-box'>$tempKey</div>
            
            <p><strong>Nota:</strong> Si no has solicitado este cambio, por favor contacta con nosotros de inmediato.</p>
            
            <div class='footer'>
                Este es un mensaje automático del sistema.<br>
                Austral Collector - Administración.
            </div>
        </div>
    </body>
    </html>
    ";

    $headers = [
        "From: \"Austral Collector Admin\" <$adminEmail>",
        "To: $toEmail",
        "Subject: $subject",
        "MIME-Version: 1.0",
        "Content-Type: text/html; charset=UTF-8"
    ];

    $smtpResponse = "";
    $mailed = false;
    $host = "ssl://smtp.gmail.com";
    $port = 465;
    
    try {
        $socket = fsockopen($host, $port, $errno, $errstr, 15);
        if (!$socket) throw new Exception("Error de conexión");

        $getResponse = function($socket) {
            $response = "";
            while ($line = fgets($socket, 515)) {
                $response .= $line;
                if (substr($line, 3, 1) == " ") break;
            }
            return $response;
        };

        $sendCommand = function($socket, $cmd) use ($getResponse) {
            fputs($socket, $cmd . "\r\n");
            return $getResponse($socket);
        };

        $smtpResponse .= $getResponse($socket);
        $smtpResponse .= $sendCommand($socket, "EHLO localhost");
        $smtpResponse .= $sendCommand($socket, "AUTH LOGIN");
        $smtpResponse .= $sendCommand($socket, base64_encode($adminEmail));
        $smtpResponse .= $sendCommand($socket, base64_encode($appPassword));
        $smtpResponse .= $sendCommand($socket, "MAIL FROM: <$adminEmail>");
        $smtpResponse .= $sendCommand($socket, "RCPT TO: <$toEmail>");
        $smtpResponse .= $sendCommand($socket, "DATA");
        
        fputs($socket, implode("\r\n", $headers) . "\r\n\r\n" . $messageBody . "\r\n.\r\n");
        $smtpResponse .= $getResponse($socket);
        
        $smtpResponse .= $sendCommand($socket, "QUIT");
        fclose($socket);
        
        if (strpos($smtpResponse, "250 ") !== false) $mailed = true;

    } catch (Exception $e) {
        $smtpResponse .= "ERROR: " . $e->getMessage();
    }

    $logFile = __DIR__ . '/mail_sent.log';
    $logContent = "[" . date('Y-m-d H:i:s') . "] KEY_SENT TO: $toEmail | STATUS: " . ($mailed ? "SENT" : "FAILED") . "\n";
    if (!$mailed) {
        $logContent .= "--- SMTP LOG ---\n$smtpResponse\n";
    }
    $logContent .= "--------------------------------------------------------\n\n";

    file_put_contents($logFile, $logContent, FILE_APPEND);

    return $mailed;
}

function sendCustomEmail($toEmail, $username, $subject, $messageText) {
    $adminEmail = "austral.cadmin@gmail.com";
    $appPassword = "sqek pnpi tejo qfqy";
    
    $messageBody = "
    <html>
    <head>
        <title>$subject</title>
        <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; background: #f4f7f8; padding: 20px; }
            .container { padding: 30px; border: 1px solid #e0e0e0; border-radius: 12px; max-width: 600px; background: #ffffff; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
            .header { font-size: 1.4rem; font-weight: bold; color: #1e4d5a; margin-bottom: 20px; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px; }
            .content { font-size: 1.05rem; white-space: pre-wrap; margin-bottom: 30px; }
            .footer { font-size: 0.85rem; color: #999; border-top: 1px solid #eee; padding-top: 15px; text-align: center; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>Hola, $username</div>
            <div class='content'>$messageText</div>
            <div class='footer'>
                Enviado por la administración de Austral Collector.<br>
                Este es un canal oficial de comunicación.
            </div>
        </div>
    </body>
    </html>
    ";

    $headers = [
        "From: \"Austral Collector Admin\" <$adminEmail>",
        "To: $toEmail",
        "Subject: $subject",
        "MIME-Version: 1.0",
        "Content-Type: text/html; charset=UTF-8"
    ];

    $smtpResponse = "";
    $mailed = false;
    $host = "ssl://smtp.gmail.com";
    $port = 465;
    
    try {
        $socket = fsockopen($host, $port, $errno, $errstr, 20);
        if (!$socket) throw new Exception("Error de conexión");

        $getResponse = function($socket) {
            $response = "";
            while ($line = fgets($socket, 515)) {
                $response .= $line;
                if (substr($line, 3, 1) == " ") break;
            }
            return $response;
        };

        $sendCommand = function($socket, $cmd) use ($getResponse) {
            fputs($socket, $cmd . "\r\n");
            return $getResponse($socket);
        };

        $smtpResponse .= $getResponse($socket);
        $smtpResponse .= $sendCommand($socket, "EHLO localhost");
        $smtpResponse .= $sendCommand($socket, "AUTH LOGIN");
        $smtpResponse .= $sendCommand($socket, base64_encode($adminEmail));
        $smtpResponse .= $sendCommand($socket, base64_encode($appPassword));
        $smtpResponse .= $sendCommand($socket, "MAIL FROM: <$adminEmail>");
        $smtpResponse .= $sendCommand($socket, "RCPT TO: <$toEmail>");
        $smtpResponse .= $sendCommand($socket, "DATA");
        
        fputs($socket, implode("\r\n", $headers) . "\r\n\r\n" . $messageBody . "\r\n.\r\n");
        $smtpResponse .= $getResponse($socket);
        
        $smtpResponse .= $sendCommand($socket, "QUIT");
        fclose($socket);
        
        if (strpos($smtpResponse, "250 ") !== false) $mailed = true;

    } catch (Exception $e) {
        $smtpResponse .= "ERROR: " . $e->getMessage();
    }

    $logFile = __DIR__ . '/mail_sent.log';
    $logContent = "[" . date('Y-m-d H:i:s') . "] CUSTOM_MAIL TO: $toEmail | SUBJECT: $subject | STATUS: " . ($mailed ? "SENT" : "FAILED") . "\n";
    file_put_contents($logFile, $logContent, FILE_APPEND);

    return $mailed;
}
?>
