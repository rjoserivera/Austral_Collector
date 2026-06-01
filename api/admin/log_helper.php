<?php
/**
 * log_helper.php
 * Función centralizada de logging para el panel de administración.
 * Usa el usuario autenticado vía JWT ($currentUser) para registrar
 * quién realizó cada acción, incluyendo su nombre de usuario.
 */

function adminLog($pdo, $currentUser, string $tipo, string $accion): void {
    if (!$currentUser || !isset($currentUser->id)) return;

    // Prefijar siempre con el nombre del admin para mayor claridad en el log
    $adminUsername = $currentUser->username ?? ('Admin ID ' . $currentUser->id);
    $accionConAdmin = "[{$adminUsername}] {$accion}";

    try {
        $stmt = $pdo->prepare("INSERT INTO logs (user_id, tipo, accion) VALUES (?, ?, ?)");
        $stmt->execute([$currentUser->id, $tipo, $accionConAdmin]);
    } catch (Throwable $e) {
        // No interrumpir el flujo principal si el log falla
        error_log("adminLog error: " . $e->getMessage());
    }
}
?>
