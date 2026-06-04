# 💡 Idea Futura: Contador de Visitas por Página

> **Estado:** Idea / Pensamiento futuro — No implementado  
> **Fecha de análisis:** Junio 2026  
> **Proyecto:** Austral Collector

---

## ¿Qué se quiere lograr?

Un sistema simple que registre cuántas personas visitan el sitio, diferenciando entre usuarios registrados y anónimos, y mostrando estadísticas por sección (página) en el panel de administración.

**Comportamiento esperado:**
- Cada carga de página cuenta como una visita (sin deduplicar).
- Si la misma persona entra 10 veces → se cuentan 10 visitas.
- No se guardan IPs ni datos personales sensibles.

---

## Arquitectura propuesta

### Flujo general

```
Usuario entra a una sección del sitio
        │
        ▼
Frontend hace POST asíncrono a /api/visitas.php
        │
        ├─ ¿Tiene JWT válido? ──► Registra visita con user_id
        │
        └─ ¿No tiene JWT? ──────► Registra visita con user_id = NULL (anónimo)
```

> La llamada es **asíncrona y no bloquea** la carga del sitio.

---

## Base de datos

### Tabla nueva: `visitas`

```sql
CREATE TABLE `visitas` (
  `id`         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id`    INT DEFAULT NULL,             -- NULL = visitante anónimo
  `pagina`     VARCHAR(100) DEFAULT '/',     -- sección visitada
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_fecha`  (`created_at`),
  KEY `idx_pagina` (`pagina`),
  KEY `idx_user`   (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**Solo 3 columnas de datos.** Sin IPs, sin user-agents, sin huellas digitales.

### Páginas a registrar

| Valor en `pagina` | Sección |
|---|---|
| `/` | Inicio |
| `/galeria` | Galería |
| `/miembros` | Miembros |
| `/nosotros` | Nosotros |
| `/contacto` | Contacto |
| `/portafolio` | Portafolio |

---

## Estadísticas disponibles

Con esta tabla se pueden generar fácilmente:

- **Total de visitas** (todos los tiempos)
- **Visitas de usuarios registrados** → `WHERE user_id IS NOT NULL`
- **Visitas anónimas** → `WHERE user_id IS NULL`
- **Páginas más visitadas** → `GROUP BY pagina ORDER BY COUNT(*) DESC`
- **Visitas por día / semana / mes** → `GROUP BY DATE(created_at)`

---

## Componentes a crear

| Componente | Descripción | Esfuerzo estimado |
|---|---|---|
| `api/visitas.php` | Endpoint que inserta una fila en la BD | Bajo |
| Migración SQL | Crear la tabla `visitas` | Muy bajo |
| Frontend (App.vue / router) | `POST` automático al cambiar de sección | Muy bajo |
| Admin → Sección "Estadísticas" | Cards de resumen + tabla de páginas más vistas | Medio |

---

## Consideraciones de escala

> Para un sitio pequeño/mediano no hay problema.  
> Si el tráfico escala mucho en el futuro, se puede implementar:
> - **Limpieza automática** de registros con más de X meses de antigüedad.
> - **Tabla de resúmenes diarios** (agregar conteos ya procesados) para no consultar millones de filas en tiempo real.

**Estimación de peso en disco:**
- ~50 bytes por registro
- 1,000 visitas/día × 365 días = ~18 MB/año → completamente manejable

---

## Impacto en rendimiento

- **Nulo para el usuario:** El POST es asíncrono, no bloquea ni retrasa la carga.
- **Mínimo en el servidor:** Un `INSERT` simple sin joins ni lógica compleja.

---

## Estado actual del proyecto que facilita esto

| Lo que ya existe | Por qué ayuda |
|---|---|
| `api/db.php` con PDO | Conexión lista para usar |
| JWT en el frontend | Permite saber si el usuario está autenticado |
| Panel de administración | Dónde mostrar las estadísticas |
| Tabla `logs` | Precedente de sistema de registro ya funcionando |

---

*Documento de referencia — revisar antes de implementar para validar que el esquema sigue siendo compatible con la BD vigente.*
