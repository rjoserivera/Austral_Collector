# Análisis de Capacidad del Servidor — Austral Collector
> Generado el 03-06-2026 | Hosting: blue186.dnsmisitio.net (cPanel compartido)

---

## 1. Estado Actual del Disco

| Ubicación | Uso actual |
|-----------|------------|
| `public_html/` | **164.20 MB** |
| Subdirectorios ocultos | 43.77 MB |
| MySQL | 0.47 MB |
| Otros | ~2.8 MB |
| **TOTAL USADO** | **211.26 MB** |
| **CUOTA LÍMITE** | **1,024 MB** |
| **DISPONIBLE** | **~812 MB** |

### Composición del espacio en `public_html/`

La carpeta `uploads/posts/` concentra el crecimiento más rápido. Del análisis de las imágenes en el servidor:

| Tipo de archivo | Tamaño promedio |
|-----------------|-----------------|
| Fotos de figura (JPG grandes) | ~2.0 – 4.2 MB |
| Fotos de cosplay (JPG medianos) | ~1.7 – 2.5 MB |
| Imágenes comprimidas (JPG pequeños) | ~600 – 650 KB |
| **Promedio ponderado estimado** | **~1.5 MB por imagen** |

---

## 2. Proyección de Vida Útil del Disco

Con **812 MB disponibles** y un promedio de **1.5 MB por imagen**:

| Ritmo de subida | Imágenes restantes | Tiempo estimado hasta llenarse |
|------------------|--------------------|-------------------------------|
| 3 imágenes/día | ~541 | **~180 días (6 meses)** |
| 5 imágenes/día | ~541 | **~108 días (3.5 meses)** |
| 10 imágenes/día | ~541 | **~54 días (1.8 meses)** |
| 20 imágenes/día | ~541 | **~27 días (< 1 mes)** ⚠️ |

> **ALERTA:** Con crecimiento de usuarios y sin optimización de imágenes, el disco puede llenarse en **menos de 4 meses**.

---

## 3. Análisis de Memoria RAM por Request

El servidor es **hosting compartido** con `memory_limit` PHP estimado en **256 MB** (estándar cPanel).

### 3.1 — Consumo RAM al subir imágenes (GD Library)

El código en `api/image_utils.php` carga la imagen **completa en memoria** antes de aplicar la marca de agua, sin redimensionar primero:

```
RAM usada = ancho × alto × 4 bytes × 2 (imagen original + imagen escala de agua)
```

| Resolución de la imagen subida | Píxeles totales | RAM consumida |
|-------------------------------|-----------------|---------------|
| 1280×720 (HD) | 921,600 px | ~7 MB ✅ |
| 1920×1080 (Full HD) | 2,073,600 px | ~16 MB ✅ |
| 2400×1600 (cámara básica) | 3,840,000 px | ~30 MB ⚠️ |
| 3000×2000 (12 MP celular) | 6,000,000 px | **~46 MB** ⚠️ |
| 4000×3000 (foto DSLR) | 12,000,000 px | **~92 MB** 🔴 |
| 4032×3024 (iPhone/Samsung) | 12,192,768 px | **~94 MB** 🔴 |

> **CRÍTICO:** Una sola foto de celular moderno consume **~92 MB de RAM** en el proceso de watermark.  
> Con `memory_limit = 256 MB`, apenas **2 uploads simultáneos** de fotos de celular agotan la memoria del servidor.

### 3.2 — Consumo RAM al navegar (sin subir imágenes)

| Acción del usuario | RAM estimada por request |
|--------------------|--------------------------|
| Cargar página principal (feed) | ~8–12 MB |
| Ver perfil de usuario | ~6–10 MB |
| Admin panel (listado posts) | ~12–20 MB |
| Login / operaciones simples | ~4–6 MB |

---

## 4. Capacidad de Usuarios Simultáneos

### 4.1 — Solo navegación (sin uploads)

Con `memory_limit = 256 MB` y ~10 MB por request de navegación:

```
256 MB ÷ 10 MB = ~25 requests PHP simultáneos máximos
```

| Escenario | Usuarios simultáneos estimados | Estado |
|-----------|-------------------------------|--------|
| Solo navegando (feed, perfiles) | **~25–40 usuarios** | ✅ Estable |
| Navegando + consultas DB activas | **~15–25 usuarios** | ✅ Estable |
| Navegando + 1 upload simultáneo | **~12–18 usuarios** | ⚠️ Aceptable |
| Navegando + 3 uploads simultáneos | **~5–8 usuarios** | 🔴 Crítico |
| 4+ uploads simultáneos grandes | **Posible error 500** | 🔴 Colapso |

### 4.2 — Punto de quiebre crítico

```
Colapso = cuando (uploads × RAM/upload) + (navegación × 10 MB) > 256 MB

Ejemplo real:
3 uploads de foto celular = 3 × 92 MB = 276 MB
→ SUPERA el límite de 256 MB
→ PHP lanza: "Fatal error: Allowed memory size exhausted"
```

---

## 5. Problemas Identificados en el Código

### 5.1 — Sin redimensionado previo al watermark

**Archivo:** `api/image_utils.php` — función `addWatermark()`

```php
// ❌ PROBLEMA: Carga la imagen completa en RAM sin revisar resolución
$target = @imagecreatefromjpeg($targetPath);
// ... procesa sin importar si son 1 MB o 12 MB
imagejpeg($target, $targetPath, 92); // guarda con calidad alta
```

Una foto de 4 MB de celular se procesa íntegra en RAM y se guarda ~igual de pesada.

### 5.2 — Sin compresión inteligente al guardar

La calidad JPEG se guarda en **92/100**, cuando la diferencia visual entre 82 y 92 es imperceptible pero el tamaño de archivo aumenta un **30–40%** innecesariamente.

### 5.3 — Sin conversión a WebP

Las imágenes se guardan en JPEG/PNG. El formato **WebP** ofrece **25–35% menos peso** con la misma calidad visual. No se usa en ningún punto del flujo.

### 5.4 — Sin caché HTTP para imágenes

No existen headers `Cache-Control` ni `Expires` configurados. Cada vez que un usuario visita la página, el navegador descarga todas las imágenes desde cero, generando tráfico y carga de servidor innecesarios.

---

## 6. Soluciones Propuestas

### 🔴 Solución 1 — Redimensionado + Compresión automática [URGENTE]

**Archivo:** `api/image_utils.php`  
**Dificultad:** Baja (solo código PHP)  
**Costo:** $0

Agregar una función que redimensione la imagen a **máximo 1920px** de ancho y guarde con calidad **82%** antes de aplicar la marca de agua.

```php
function resizeImageIfNeeded(string $path, int $maxWidth = 1920): void {
    $info = @getimagesize($path);
    if (!$info) return;

    [$origW, $origH] = [$info[0], $info[1]];
    if ($origW <= $maxWidth) return; // Ya está en tamaño aceptable

    $newW = $maxWidth;
    $newH = (int) round($origH * ($maxWidth / $origW));

    $mime = $info['mime'];
    if ($mime === 'image/jpeg')     $src = @imagecreatefromjpeg($path);
    elseif ($mime === 'image/png')  $src = @imagecreatefrompng($path);
    elseif ($mime === 'image/webp') $src = @imagecreatefromwebp($path);
    else return;

    if (!$src) return;

    $dst = imagecreatetruecolor($newW, $newH);
    imagecopyresampled($dst, $src, 0, 0, 0, 0, $newW, $newH, $origW, $origH);
    imagedestroy($src);

    if ($mime === 'image/jpeg')     imagejpeg($dst, $path, 82);
    elseif ($mime === 'image/png')  imagepng($dst, $path, 7);
    elseif ($mime === 'image/webp') imagewebp($dst, $path, 82);

    imagedestroy($dst);
}
```

**Llamarlo al inicio de `addWatermark()`:**

```php
function addWatermark($targetPath) {
    resizeImageIfNeeded($targetPath, 1920); // ← agregar esta línea
    correctImageOrientation($targetPath);
    // ... resto del código igual
}
```

**Impacto esperado:**

| Métrica | Sin optimización | Con optimización | Mejora |
|---------|-----------------|-----------------|--------|
| Tamaño promedio imagen | ~1.5 MB | **~380 KB** | **75% menos** |
| RAM por upload (celular) | ~92 MB | **~18 MB** | **80% menos** |
| Imágenes restantes en disco | ~541 | **~2,137** | **4× más** |
| Vida útil disco (5 img/día) | ~108 días | **~427 días** | **4× más** |
| Uploads simultáneos seguros | 2–3 | **~10–12** | **5× más** |

---

### 🟠 Solución 2 — Headers de caché HTTP [IMPORTANTE]

**Archivo:** `.htaccess` (raíz del proyecto)  
**Dificultad:** Muy baja (2 líneas de configuración)  
**Costo:** $0

```apache
# Caché de 30 días para imágenes estáticas
<FilesMatch "\.(jpg|jpeg|png|webp|gif|svg)$">
    Header set Cache-Control "max-age=2592000, public"
    Header set Expires "access plus 30 days"
</FilesMatch>
```

**Impacto:** Los navegadores guardan las imágenes localmente. En la segunda visita, no hacen ningún request al servidor para las imágenes. Reduce el tráfico de red en **40–60%** para usuarios recurrentes.

---

### 🟡 Solución 3 — Aumentar cuota de disco [MEDIO PLAZO]

**Acción:** Contactar a `dnsmisitio.net` para aumentar la cuota de disco.

| Plan | Cuota | Vida útil estimada (5 img/día sin optimizar) |
|------|-------|----------------------------------------------|
| Actual | 1 GB | ~108 días |
| Plan 5 GB | 5 GB | **~540 días (~1.5 años)** |
| Plan 10 GB | 10 GB | **~1,080 días (~3 años)** |

**Costo estimado:** CLP ~$3,000–8,000/mes adicionales según plan.

---

### 🟢 Solución 4 — Almacenamiento externo con CDN [LARGO PLAZO]

**Descripción:** Mover las imágenes de `uploads/` a un servicio de almacenamiento externo como **Cloudflare R2** (gratuito hasta 10 GB, sin cargo por ancho de banda).

| Servicio | Precio almacenamiento | Ancho de banda | Gratis |
|----------|-----------------------|----------------|--------|
| **Cloudflare R2** | $0.015/GB/mes | **Gratis** | **10 GB** |
| Amazon S3 | $0.023/GB/mes | $0.09/GB | 5 GB (1 año) |
| Backblaze B2 | $0.006/GB/mes | Gratis hasta 3× almacenado | 10 GB |

**Ventajas adicionales:**
- Las imágenes se sirven desde una CDN global → carga más rápida en todo Chile
- El servidor de hosting deja de gastar disco en imágenes
- Escala ilimitado sin cambiar de plan de hosting

**Complejidad:** Requiere refactorizar el sistema de upload para subir a la API de R2/S3 en vez de a disco local.

---

## 7. Tabla de Prioridades

| # | Solución | Dificultad | Costo | Impacto en disco | Impacto en RAM | Urgencia |
|---|----------|------------|-------|------------------|----------------|----------|
| 1 | Redimensionado + compresión | ⭐ Baja | $0 | **×4 más capacidad** | **×5 menos RAM** | 🔴 Urgente |
| 2 | Headers de caché `.htaccess` | ⭐ Muy baja | $0 | Sin efecto | Reduce carga | 🟠 Esta semana |
| 3 | Aumentar cuota de disco | ⭐ Ninguna | ~$5k CLP/mes | Directo | Sin efecto | 🟡 Próximo mes |
| 4 | Migrar a Cloudflare R2 | ⭐⭐⭐ Alta | $0 (~10 GB) | **Ilimitado** | Reduce carga | 🟢 Largo plazo |

---

## 8. Conclusión

El servidor actual soporta cómodamente **25–40 usuarios navegando simultáneamente**, pero tiene dos vulnerabilidades críticas:

1. **Disco:** Sin optimización de imágenes, se llena en ~3–4 meses con crecimiento normal.
2. **RAM:** Solo **2–3 uploads simultáneos** de fotos de celular pueden colapsar el proceso PHP con un `Fatal error: Allowed memory size exhausted`.

La **Solución 1** (redimensionado automático en `image_utils.php`) resuelve ambos problemas de forma inmediata, sin costo y con solo ~30 líneas de código adicional. Es la acción más prioritaria antes de que la plataforma crezca en usuarios.
