<?php
// ============================================================
//  Austral Collector — Image Utilities
//  Compatible con PHP 7.2+
//  Provides addWatermark() for post image uploads.
// ============================================================

/**
 * Applies the Austral Collector watermark to an image file.
 *
 * The watermark is scaled proportionally to 22% of the target image width
 * and placed in the bottom-right corner with a 12px margin.
 *
 * Supported formats: JPEG, PNG, WEBP.
 *
 * @param  string $targetPath  Absolute path to the image file to watermark.
 * @return bool                true on success, false on any failure.
 */
function addWatermark($targetPath)
{
    // ── 1. Detect image type and load ────────────────────────
    $info = @getimagesize($targetPath);
    if (!$info) {
        return false;
    }

    $mime = $info['mime'];

    if ($mime === 'image/jpeg') {
        $target = @imagecreatefromjpeg($targetPath);
    } elseif ($mime === 'image/png') {
        $target = @imagecreatefrompng($targetPath);
    } elseif ($mime === 'image/webp') {
        $target = @imagecreatefromwebp($targetPath);
    } else {
        return false; // Unsupported format
    }

    if (!$target) {
        return false;
    }

    $tw = imagesx($target);
    $th = imagesy($target);

    // ── 2. Load watermark PNG ─────────────────────────────────
    $wmPath = dirname(__DIR__) . '/public/timbre agua pagina web 25opacidad.png';
    if (!file_exists($wmPath)) {
        imagedestroy($target);
        return false;
    }

    $wm = @imagecreatefrompng($wmPath);
    if (!$wm) {
        imagedestroy($target);
        return false;
    }

    $wmW = imagesx($wm);
    $wmH = imagesy($wm);

    // ── 3. Scale watermark to 22% of target width ────────────
    $newWmW = (int) round($tw * 0.22);
    $ratio  = ($wmW > 0) ? ($newWmW / $wmW) : 1;
    $newWmH = (int) round($wmH * $ratio);

    if ($newWmW < 1 || $newWmH < 1) {
        imagedestroy($wm);
        imagedestroy($target);
        return false;
    }

    $wmScaled = imagecreatetruecolor($newWmW, $newWmH);
    imagealphablending($wmScaled, false);
    imagesavealpha($wmScaled, true);
    $transparent = imagecolorallocatealpha($wmScaled, 0, 0, 0, 127);
    imagefill($wmScaled, 0, 0, $transparent);
    imagecopyresampled($wmScaled, $wm, 0, 0, 0, 0, $newWmW, $newWmH, $wmW, $wmH);
    imagedestroy($wm);

    // ── 4. Composite watermark onto target image ─────────────
    $margin = 12;
    $destX  = $margin;
    $destY  = $th - $newWmH - $margin;

    imagealphablending($target, true);
    imagecopy($target, $wmScaled, $destX, $destY, 0, 0, $newWmW, $newWmH);
    imagedestroy($wmScaled);

    // ── 5. Save result overwriting original file ─────────────
    if ($mime === 'image/jpeg') {
        $saved = imagejpeg($target, $targetPath, 92);
    } elseif ($mime === 'image/png') {
        imagesavealpha($target, true);
        $saved = imagepng($target, $targetPath, 6);
    } elseif ($mime === 'image/webp') {
        $saved = imagewebp($target, $targetPath, 90);
    } else {
        $saved = false;
    }

    imagedestroy($target);
    return (bool) $saved;
}
?>
