---
title: Arquitectura del Proyecto
description: Estructura de carpetas, páginas, componentes, flujo de datos y patrones de diseño de Austral Collector.
---

## Visión General

Austral Collector es una **SPA (Single Page Application)** construida con React 19 y Vite 8. El frontend se comunica con un backend PHP a través de una API REST. La autenticación se maneja mediante JWT almacenado en `localStorage`. La aplicación es una **PWA instalable** con capacidad offline via IndexedDB.

```
alpha/
├── api/                         # Backend PHP (API REST)
│   ├── auth/                    # Endpoints autenticados (JWT requerido)
│   │   ├── login.php            # POST - Inicio de sesión
│   │   ├── publicar_post.php    # POST - Crear publicación
│   │   ├── editar_post.php      # PUT  - Editar publicación propia
│   │   ├── eliminar_post.php    # DELETE - Eliminar publicación propia
│   │   ├── toggle_like.php      # POST - Dar/quitar like a figura
│   │   ├── rate_profile.php     # POST - Valorar perfil de coleccionista
│   │   ├── delete_rating.php    # DELETE - Eliminar valoración
│   │   ├── update_profile.php   # PUT  - Actualizar perfil propio
│   │   ├── reordenar_posts.php  # POST - Reordenar publicaciones propias
│   │   ├── cambiar_password.php # POST - Cambiar contraseña
│   │   ├── enviar_clave_temporal.php # POST - Enviar clave temporal (admin)
│   │   └── jwt_helper.php       # Librería interna JWT
│   ├── admin/                   # Endpoints exclusivos del administrador
│   │   ├── usuarios.php         # CRUD completo de usuarios
│   │   ├── publicaciones.php    # Moderación de publicaciones
│   │   ├── eventos.php          # CRUD de eventos de la comunidad
│   │   ├── galeria_portafolio.php # Gestión de galería curada
│   │   ├── videos.php           # Configuración de video slots
│   │   ├── videos_portafolio.php# Videos del portafolio
│   │   ├── promos.php           # Gestión de promociones de la Home
│   │   ├── destacados.php       # Miembro destacado, cumpleañero y mensajes
│   │   ├── identidad_admin.php  # Identidad visual (logo, mascota, banner)
│   │   ├── mascot_texts.php     # Mensajes de la mascota por página
│   │   ├── verificacion_badge.php # Gestión de badge de verificación
│   │   ├── get_stats.php        # Estadísticas del dashboard admin
│   │   ├── get_activity_log.php # Log de actividad completo con filtros
│   │   ├── mailer.php           # Motor de envío de correos (PHPMailer/SMTP)
│   │   ├── enviar_mensaje.php   # Endpoint del formulario de contacto
│   │   ├── portafolio_grupos.php# Grupos del portafolio
│   │   └── auth_check.php       # Middleware de verificación de rol admin
│   ├── public/                  # Endpoints sin autenticación (lectura pública)
│   │   ├── home_data.php        # Datos completos de la HomePage
│   │   ├── galeria_data.php     # Figuras para la galería pública
│   │   ├── miembros_data.php    # Lista de coleccionistas
│   │   ├── perfil_data.php      # Perfil público de un coleccionista
│   │   ├── portafolio_data.php  # Datos de la página Portafolio
│   │   ├── get_site_config.php  # Configuración pública del sitio
│   │   ├── identidad.php        # Identidad visual pública
│   │   ├── mascot_texts.php     # Textos de la mascota (lectura pública)
│   │   ├── get_hashtags.php     # Hashtags disponibles
│   │   └── contacto.php         # Envío del formulario de contacto
│   ├── db.php                   # Conexión PDO a MySQL
│   ├── image_utils.php          # Utilidades para procesamiento de imágenes
│   ├── figures.php              # GET - Figuras públicas de la colección
│   ├── events.php               # GET - Eventos públicos
│   └── index.php                # Punto de entrada general de la API
├── src/                         # Frontend React
│   ├── components/              # Componentes reutilizables
│   ├── pages/                   # Páginas completas de la aplicación
│   ├── contexts/                # Contextos globales de React
│   │   └── NotificationContext.jsx # Toast + Confirm global
│   ├── hooks/                   # Custom hooks de React
│   │   └── useSyncStatus.jsx    # Estado de sincronización offline/online
│   ├── utils/                   # Utilidades
│   │   └── offlineSync.js       # Sincronización de posts offline con IndexedDB
│   ├── assets/                  # Recursos estáticos internos del build
│   ├── config.js                # URLs de API, authFetch e isTokenExpired
│   ├── index.css                # Sistema de diseño global (variables, reset)
│   ├── App.jsx                  # Rutas principales + lógica de sesión global
│   └── main.jsx                 # Punto de entrada React
├── public/                      # Archivos estáticos públicos (logos, iconos, imágenes)
│   └── uploads/                 # Imágenes subidas por usuarios (posts, avatares)
├── docs/                        # Documentación (Mintlify)
├── dist/                        # Build de producción generado por Vite
├── .env                         # Variables de entorno (no incluido en git)
├── .env.example                 # Plantilla de variables de entorno
└── vite.config.js               # Configuración Vite + PWA + Workbox
```

---

## Rutas de la Aplicación

| Ruta | Página | Acceso | Descripción |
|---|---|---|---|
| `/` | `HomePage` | Público | Pantalla principal con hero, figuras, miembro destacado, eventos y videos |
| `/portafolio` | `PortafolioPage` | Público | Portafolio curado, galería de imágenes y videos de la comunidad |
| `/galeria` | `GaleriaPage` | Público | Galería completa con búsqueda, filtros y likes |
| `/miembros` | `MiembrosPage` | Público | Directorio de todos los coleccionistas registrados |
| `/perfil/:id` | `PerfilPublicoPage` | Público | Perfil detallado de un coleccionista con publicaciones y valoraciones |
| `/contacto` | `ContactoPage` | Público | Formulario de contacto con envío por correo |
| `/login` | `LoginPage` | Público | Inicio de sesión con manejo de clave temporal |
| `/dashboard` | `DashboardPage` | Requiere login | Panel personal del usuario autenticado |
| `/admin` | `AdminPage` | Solo `admin` | Panel de administración completo |

---

## Páginas

### 🏠 HomePage
Página principal de la plataforma. Carga todos sus datos desde `/api/public/home_data.php`. Contiene los siguientes bloques:

| Componente | Descripción |
|---|---|
| `HeroBanner` | Banner animado con logo y partículas flotantes, llamada a la acción |
| `UltimasFiguras` | Carrusel de las figuras más recientes con auto-scroll |
| `FigurasMasVotadas` | Ranking de colecciones por número de likes/votos |
| `MiembroDestacado` | Tarjeta del coleccionista seleccionado por el admin del mes |
| `NoticiasEventos` | Grid de noticias y eventos publicados por el administrador |
| `VideosComunidad` | Grid de hasta 4 videos de YouTube configurados por el admin |
| `CTAFinal` | Sección de llamada a la acción para nuevos registros |

### 🖼️ GaleriaPage
Galería completa de figuras con:
- Búsqueda por nombre y filtros por categoría y año
- Tarjetas de figura con imagen, nombre, año y contador de likes
- Modal de detalle (`PostModal`) con galería de fotos extra, descripción, hashtags y botón de like
- Paginación con navegación por número de página

### 👥 MiembrosPage
Directorio de todos los coleccionistas con:
- Avatar, nombre de usuario, rol y badge de verificación
- Estadísticas básicas (publicaciones, seguidores)
- Enlace al perfil público de cada miembro

### 👤 PerfilPublicoPage
Perfil detallado de un coleccionista:
- Banner y avatar personalizables
- Estadísticas completas (publicaciones, likes recibidos, valoración promedio)
- Publicaciones del usuario en grid con modal de detalle
- Sistema de valoración por estrellas (solo miembros autenticados)
- Badge de verificación si el admin lo otorgó

### 📁 PortafolioPage
Sección "Nosotros" / Portafolio de la comunidad:
- Galería curada de imágenes configurada por el administrador, agrupada por secciones
- Videos destacados en formato carrusel
- Banner de comunidad personalizable

### 📊 DashboardPage
Panel personal del usuario autenticado:
- Feed de publicaciones propias
- Crear nuevas publicaciones (imágenes + video YouTube opcional + hashtags)
- Editar y eliminar publicaciones propias
- Reordenar publicaciones con drag-and-drop
- Indicador de estado de sincronización offline/online
- Edición del perfil propio (avatar, nombre, contraseña)

### 📞 ContactoPage
Formulario de contacto con:
- Campos de nombre, email, asunto y mensaje
- Envío vía el endpoint `/api/public/contacto.php`
- Información de horarios y redes sociales

### 🔑 LoginPage
Formulario de inicio de sesión con:
- Validación de credenciales contra el backend JWT
- Detección automática de `require_pass_change` para mostrar el modal de cambio forzado de contraseña

### 🛡️ AdminPage
Panel de administración completo. Ver sección [Panel de Administración](/admin/panel).

---

## Componentes Principales

| Componente | Archivo | Descripción |
|---|---|---|
| `NavBar` | `NavBar.jsx` | Barra de navegación responsive con menú, estado de sesión y dropdown de usuario |
| `Footer` | `Footer.jsx` | Pie de página con redes sociales, links y copyright |
| `HeroBanner` | `HeroBanner.jsx` | Banner hero animado con partículas flotantes |
| `UltimasFiguras` | `UltimasFiguras.jsx` | Carrusel de figuras recientes con autoplay |
| `FigurasMasVotadas` | `FigurasMasVotadas.jsx` | Ranking de figuras más votadas |
| `MiembroDestacado` | `MiembroDestacado.jsx` | Tarjeta del miembro destacado del mes |
| `NoticiasEventos` | `NoticiasEventos.jsx` | Grid de noticias y eventos de la comunidad |
| `VideosComunidad` | `VideosComunidad.jsx` | Grid de videos de YouTube embebidos |
| `CTAFinal` | `CTAFinal.jsx` | Sección de llamada a la acción para registro |
| `PostModal` | `PostModal.jsx` | Modal para ver publicaciones en detalle con galería extra |
| `CreatePostModal` | `CreatePostModal.jsx` | Modal para crear y editar publicaciones |
| `PasswordChangeForm` | `PasswordChangeForm.jsx` | Formulario de cambio de contraseña |
| `VerifiedBadge` | `VerifiedBadge.jsx` | Badge de verificación con tooltip para perfiles verificados |
| `VirtualAssistant` | `VirtualAssistant.jsx` | Mascota virtual con mensajes contextuales por página |
| `LayoutCentral` | `LayoutCentral.jsx` | Envoltorio de layout con márgenes y ancho máximo |

---

## Contextos y Hooks

### NotificationContext (`contexts/NotificationContext.jsx`)
Provee un sistema global de notificaciones sin dependencias externas:
- **`toast.success(msg)`** — Notificación verde de éxito
- **`toast.error(msg)`** — Notificación roja de error
- **`toast.info(msg)`** — Notificación azul informativa
- **`confirmDialog(msg)`** — Diálogo de confirmación asíncrono con promesa

### useSyncStatus (`hooks/useSyncStatus.jsx`)
Hook que expone el estado de sincronización PWA:
- `status: 'online' | 'offline' | 'pending' | 'error'`
- `isOnline: boolean`
- `pendingCount: number` — Posts pendientes de sincronizar en IndexedDB

---

## Autenticación y JWT

El sistema de autenticación usa tokens JWT firmados con HS256.

### Flujo de Login

1. El usuario envía credenciales al endpoint `POST /api/auth/login.php`
2. El backend valida y devuelve un token JWT + datos del usuario
3. El frontend almacena en `localStorage`:
   - `austral_auth_token` — Token JWT
   - `austral_auth_user` — Datos del usuario (JSON)
   - `austral_auth_role` — Rol (`admin` o `member`)
   - `austral_auth_require_pass_change` — `"true"` si debe cambiar contraseña

### Helper authFetch

Disponible en `src/config.js`. Inyecta el token automáticamente y redirige a `/login` si el servidor responde `401`:

```js
export function authFetch(url, options = {}) {
  const token = localStorage.getItem('austral_auth_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
  return fetch(url, { ...options, headers }).then(response => {
    if (response.status === 401) {
      localStorage.removeItem('austral_auth_token');
      localStorage.removeItem('austral_auth_user');
      localStorage.removeItem('austral_auth_role');
      localStorage.removeItem('austral_auth_require_pass_change');
      window.location.href = '/login';
      return new Promise(() => {});
    }
    return response;
  });
}
```

### isTokenExpired

Verifica si el token local expiró sin hacer peticiones al servidor:

```js
export function isTokenExpired() {
  const token = localStorage.getItem('austral_auth_token');
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp ? payload.exp < Math.floor(Date.now() / 1000) : false;
  } catch {
    return true;
  }
}
```

---

## Soporte Offline (PWA)

La aplicación es una **PWA instalable** con soporte offline completo:

- **`vite-plugin-pwa`** genera el Service Worker con Workbox automáticamente
- Las publicaciones creadas sin conexión se guardan en **IndexedDB** con la librería `idb`
- Al recuperar la conexión, `syncOfflinePosts()` las sincroniza automáticamente con el servidor
- El hook `useSyncStatus` expone el estado de la cola de sincronización al Dashboard

### Estrategias de caché (Workbox)

| Tipo | Estrategia | TTL |
|---|---|---|
| Peticiones a `/api/*` | NetworkFirst | 7 días |
| Imágenes en `/uploads/*` | CacheFirst | 30 días |

---

## Mascota Virtual (VirtualAssistant)

El componente `VirtualAssistant` muestra una mascota flotante con mensajes contextuales configurables por el administrador.

### Comportamiento

- **En escritorio**: Siempre visible, muestra el mensaje de la página actual
- **En móvil** (`≤ 768px`):
  - Se oculta cuando el usuario interactúa (scroll, toque, click)
  - Reaparece automáticamente junto con su burbuja de mensaje luego de **5 segundos de inactividad**
  - Al tocar la mascota directamente, reinicia el timer sin ocultarla
- Los textos se cargan desde `/api/public/mascot_texts.php` al montar
- Al cambiar de página (ruta), muestra el mensaje correspondiente a esa sección

### Páginas configurables

| Sección | Clave |
|---|---|
| Inicio | `inicio` |
| Nosotros / Portafolio | `nosotros` |
| Galería | `galeria` |
| Miembros / Perfiles | `miembros` |
| Contacto | `contacto` |

---

## Sistema de Diseño

Definido en `src/index.css` como variables CSS globales:

```css
--color-gold:    #dfc08a;   /* Dorado principal */
--color-teal:    #1e4d5a;   /* Verde-azul oscuro */
--color-rust:    #8b2020;   /* Rojo óxido de acento */
--color-bg:      #c8b89a;   /* Beige vintage de fondo */
--font-title:    'Cinzel Decorative'; /* Títulos ornamentales */
--font-heading:  'Rajdhani';          /* Subtítulos y etiquetas */
--font-body:     'Lora';              /* Texto de cuerpo */
```
