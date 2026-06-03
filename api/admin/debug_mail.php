<?php
/**
 * debug_mail.php - Script de diagnóstico TEMPORAL
 * ⚠️ ELIMINAR después de diagnosticar el problema.
 * 
 * Acceso: https://australcollector.cl/api/admin/debug_mail.php?key=debugac2026
 */

// Clave simple para no exponer el script al público
if (($_GET['key'] ?? '') !== 'debugac2026') {
    http_response_code(403);
    die(json_encode(['error' => 'Acceso denegado']));
}

header('Content-Type: application/json; charset=utf-8');

// ── Configuración SMTP (igual que mailer.php) ─────────────────────────────
$adminEmail  = "administracion@australcollector.cl";
$appPassword = "}s%Eet7n,RO}";
$host        = "ssl://mail.australcollector.cl";
$port        = 465;

// ── Destinatario de prueba (puedes cambiarlo en la URL con ?to=xxx) ───────
$toEmail = $_GET['to'] ?? 'jose.rivera71@inacapmail.cl';
$subject = "=?UTF-8?B?" . base64_encode("Test de entrega — Austral Collector") . "?=";
$htmlBody = "<html><body><p>Este es un correo de <strong>prueba de diagnóstico</strong> enviado el " . date('Y-m-d H:i:s') . ".</p></body></html>";

$log = [];
$success = false;

// ── Conexión SMTP manual con log completo ─────────────────────────────────
try {
    $log[] = "Conectando a {$host}:{$port}...";
    $socket = @fsockopen($host, $port, $errno, $errstr, 15);
    
    if (!$socket) {
        throw new Exception("fsockopen FALLÓ [{$errno}]: {$errstr}");
    }
    $log[] = "✅ Conexión establecida";

    $read = function() use ($socket, &$log) {
        $r = "";
        while ($l = fgets($socket, 515)) {
            $r .= $l;
            $log[] = "  S: " . trim($l);
            if (isset($l[3]) && $l[3] === ' ') break;
        }
        return $r;
    };

    $cmd = function($c) use ($socket, $read, &$log) {
        $log[] = "C: " . (strlen($c) > 60 ? substr($c, 0, 60) . "...[base64]" : $c);
        fputs($socket, $c . "\r\n");
        return $read();
    };

    $read(); // Banner del servidor
    $cmd("EHLO australcollector.cl");
    $cmd("AUTH LOGIN");
    $cmd(base64_encode($adminEmail));
    $r = $cmd(base64_encode($appPassword));
    
    if (strpos($r, '235') === false) {
        throw new Exception("AUTH FALLÓ. Respuesta: " . trim($r));
    }
    $log[] = "✅ Autenticación exitosa";

    $cmd("MAIL FROM: <{$adminEmail}>");
    $rcptResp = $cmd("RCPT TO: <{$toEmail}>");
    
    if (strpos($rcptResp, '25') === false) {
        $log[] = "❌ RCPT TO rechazado por el servidor saliente";
    } else {
        $log[] = "✅ RCPT TO aceptado por mail.australcollector.cl";
    }

    $cmd("DATA");

    $headers = implode("\r\n", [
        "From: \"Austral Collector\" <{$adminEmail}>",
        "To: {$toEmail}",
        "Subject: {$subject}",
        "MIME-Version: 1.0",
        "Content-Type: text/html; charset=UTF-8",
        "Content-Transfer-Encoding: base64",
    ]);

    $encodedBody = chunk_split(base64_encode($htmlBody), 76, "\r\n");
    fputs($socket, $headers . "\r\n\r\n" . $encodedBody . "\r\n.\r\n");

    $final = $read();
    $log[] = "Respuesta final DATA: " . trim($final);

    $cmd("QUIT");
    fclose($socket);

    if (strpos($final, "250") !== false) {
        $success = true;
        $log[] = "✅ El servidor australcollector.cl ACEPTÓ el correo para entrega.";
        $log[] = "ℹ️  Esto NO garantiza entrega — el servidor destino (" . explode('@', $toEmail)[1] . ") podría rechazarlo después.";
        $log[] = "ℹ️  Revisa rebotes en la bandeja de: {$adminEmail}";
    } else {
        $log[] = "❌ El servidor rechazó el correo en DATA.";
    }

} catch (Exception $e) {
    $log[] = "💥 EXCEPCIÓN: " . $e->getMessage();
}

echo json_encode([
    'to'      => $toEmail,
    'smtp_accepted' => $success,
    'log'     => $log,
    'nota'    => 'Si smtp_accepted=true pero no llega el correo, el rechazo es del servidor DESTINO. Revisar rebotes en administracion@australcollector.cl'
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>
