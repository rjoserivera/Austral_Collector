# 🚀 Guía de Despliegue — Austral Collector

> **Stack:** React + Vite (Frontend) · PHP + MariaDB (Backend) · XAMPP (Local) · cPanel (Producción)  
> **Última actualización:** Junio 2026

---

## Índice

1. [Entorno Local (XAMPP)](#1-entorno-local-xampp)
2. [Producción (cPanel / Hosting)](#2-producción-cpanel--hosting)
3. [Variables de Entorno (.env)](#3-variables-de-entorno-env)
4. [Checklist de Entrega al Cliente](#4-checklist-de-entrega-al-cliente)
5. [Problemas Comunes](#5-problemas-comunes)

---

## 1. Entorno Local (XAMPP)

### Requisitos previos

| Herramienta | Versión mínima | Descarga |
|---|---|---|
| **XAMPP** | PHP 8.0+ | [apachefriends.org](https://www.apachefriends.org/) |
| **Node.js** | 18+ | [nodejs.org](https://nodejs.org/) |
| **Composer** | Cualquiera | [getcomposer.org](https://getcomposer.org/) |
| **Git** | Cualquiera | [git-scm.com](https://git-scm.com/) |

---

### Paso 1 — Clonar el proyecto en XAMPP

Abrí una terminal y ejecutá:

```bash
cd C:\xampp\htdocs
git clone <URL_DEL_REPOSITORIO> Austral_Collector
```

> ⚠️ El nombre de la carpeta **debe ser exactamente `Austral_Collector`** porque el proxy de Vite apunta a `http://localhost/Austral_Collector`.

---

### Paso 2 — Instalar dependencias de Node

```bash
cd C:\xampp\htdocs\Austral_Collector
npm install
```

---

### Paso 3 — Instalar dependencias de PHP (Composer)

```bash
cd C:\xampp\htdocs\Austral_Collector\backend
composer install
```

---

### Paso 4 — Crear la base de datos

1. Abrí XAMPP y encendé **Apache** y **MySQL**.
2. Entrá a `http://localhost/phpmyadmin`.
3. Creá una nueva base de datos llamada (por ejemplo) `austral_collector_local`.
4. Seleccioná esa base de datos → clic en **Importar**.
5. Subí el archivo `alphadocere_austral_collector.sql` que está en la raíz del proyecto.
6. Clic en **Continuar**. ✅

---

### Paso 5 — Configurar el archivo .env

1. Copiá el archivo `.env.example` y renombralo a `.env` (en la raíz del proyecto).
2. Completalo con tus datos locales:

```env
ENVIRONMENT=dev

DEV_AUTH_DB_HOST=localhost
DEV_AUTH_DB_NAME=austral_collector_local
DEV_AUTH_DB_USER=root
DEV_AUTH_DB_PASS=
DEV_AUTH_DB_PORT=3306
```

> 🔒 El archivo `.env` **nunca** debe subirse a Git. Ya está ignorado en `.gitignore`.

---

### Paso 6 — Levantar el servidor de desarrollo

Con XAMPP encendido (Apache + MySQL), ejecutá en la raíz del proyecto:

```bash
npm run dev
```

Abrí tu navegador en:

```
http://localhost:5173/
```

El frontend en Vite redirige automáticamente las llamadas `/api/*` hacia `http://localhost/Austral_Collector/api/` en XAMPP.

> ✅ Si ves la plataforma y los datos cargan (figuras, miembros, eventos), **¡está funcionando!**

---

### Crear un usuario administrador local

Ejecutá el script incluido haciendo doble clic en:

```
crear_usuario_local.bat
```

Te pedirá email, contraseña y rol. Seguí las instrucciones en pantalla.

---

## 2. Producción (cPanel / Hosting)

> **Hosting actual:** `blue186.dnsmisitio.net` (cPanel compartido, MariaDB 10.6, PHP 8.3)

### Paso 1 — Compilar el frontend

Antes de subir a producción, generá la versión optimizada:

```bash
npm run build
```

Esto crea (o sobreescribe) la carpeta `dist/` con todos los archivos estáticos del frontend.

---

### Paso 2 — Subir archivos al servidor

Subí por **FTP (FileZilla)** o por el **Administrador de archivos de cPanel** los siguientes archivos/carpetas a `public_html/`:

```
✅ Subir esto:
├── dist/               ← El frontend compilado (todo el contenido dentro)
├── api/                ← Toda la carpeta del backend PHP
├── backend/            ← Toda la carpeta (incluye vendor/ y config/)
├── uploads/            ← Carpeta de imágenes (si no existe en producción, crearla vacía)
├── .htaccess           ← Reglas de Apache (React Router)
└── .env                ← Variables de producción (ver sección 3)

❌ NO subir esto:
├── node_modules/
├── src/
├── docs/
├── .git/
└── .env.example
```

> ⚠️ Si hacés cambios en el frontend, siempre ejecutá `npm run build` **antes** de subir. No subas los archivos de `src/` directamente.

---

### Paso 3 — Configurar el .env en producción

Creá (o editá) el archivo `.env` en la raíz de `public_html/` con los datos de producción:

```env
ENVIRONMENT=prod

PROD_AUTH_DB_HOST=localhost
PROD_AUTH_DB_NAME=alphadocere_australcollector
PROD_AUTH_DB_USER=australcollector_joseph
PROD_AUTH_DB_PASS=<contraseña_real>
PROD_AUTH_DB_PORT=3306
```

> 🔒 **Nunca** compartas este archivo. Las credenciales reales solo deben estar en el servidor.

---

### Paso 4 — Importar la base de datos en cPanel

1. Entrá al cPanel → **MySQL Databases** → verifica que la base de datos existe.
2. Abrí **phpMyAdmin** desde cPanel.
3. Seleccioná la base de datos → **Importar** → subí `alphadocere_austral_collector.sql`.

> Si la base de datos ya tiene datos de producción, **no reimportes** el SQL completo o borrarás todo. Solo importá las tablas nuevas que necesites con ALTER TABLE.

---

### Paso 5 — Verificar el .htaccess

El `.htaccess` ya está configurado para React Router (SPA). Verificá que esté en la raíz de `public_html/` y que Apache tenga `mod_rewrite` activo (en cPanel compartido siempre está activo).

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

---

### Paso 6 — Verificar en producción

Abrí el dominio del cliente en el navegador y revisá:

- [ ] La página de inicio carga correctamente
- [ ] Las imágenes y datos dinámicos aparecen
- [ ] El login funciona (usuario admin existente)
- [ ] El panel de administración es accesible
- [ ] Los correos de recuperación de contraseña llegan (SendGrid configurado)

---

## 3. Variables de Entorno (.env)

Referencia completa de todas las variables disponibles:

```env
# ─── ENTORNO ──────────────────────────────────────────────
# Valores: 'dev' (local) o 'prod' (producción)
ENVIRONMENT=dev

# ─── BASE DE DATOS — LOCAL ────────────────────────────────
DEV_AUTH_DB_HOST=localhost
DEV_AUTH_DB_NAME=austral_collector_local
DEV_AUTH_DB_USER=root
DEV_AUTH_DB_PASS=
DEV_AUTH_DB_PORT=3306

# ─── BASE DE DATOS — PRODUCCIÓN ──────────────────────────
PROD_AUTH_DB_HOST=localhost
PROD_AUTH_DB_NAME=alphadocere_australcollector
PROD_AUTH_DB_USER=australcollector_joseph
PROD_AUTH_DB_PASS=<contraseña>
PROD_AUTH_DB_PORT=3306
```

---

## 4. Checklist de Entrega al Cliente

Antes de hacer la entrega formal, verificá que todo esto esté completo:

### Técnico
- [ ] `npm run build` ejecutado con éxito y carpeta `dist/` subida
- [ ] Archivo `.env` de producción configurado en el servidor
- [ ] Base de datos importada y con datos iniciales (admin, configuración)
- [ ] Carpeta `uploads/` existente y con permisos de escritura (`755`)
- [ ] `.htaccess` presente en la raíz del `public_html/`
- [ ] SendGrid configurado para envío de correos

### Accesos a entregar al cliente
- [ ] URL del sitio en producción
- [ ] Email y contraseña del usuario **administrador** principal
- [ ] Acceso al cPanel (si corresponde)
- [ ] Credenciales de la base de datos (guardar en lugar seguro)

### Documentación
- [ ] Esta guía de despliegue
- [ ] Guía de uso del panel de administración (si existe)

---

## 5. Problemas Comunes

| Error | Causa probable | Solución |
|---|---|---|
| La página carga pero los datos no aparecen | XAMPP no está corriendo | Encender Apache + MySQL en XAMPP |
| `vendor/autoload.php not found` | Falta correr Composer | Ejecutar `composer install` dentro de `backend/` |
| `Access denied for user 'root'` | Credenciales incorrectas en `.env` | Revisar `.env` local, contraseña vacía en XAMPP por defecto |
| Las rutas de React dan 404 en producción | Falta el `.htaccess` o mal configurado | Verificar que `.htaccess` esté en `public_html/` |
| Las imágenes subidas no aparecen | Carpeta `uploads/` sin permisos | Dar permisos `755` a la carpeta `uploads/` en cPanel |
| Login no funciona en producción | `.env` apunta a `dev` | Cambiar `ENVIRONMENT=prod` en el `.env` del servidor |
| Error 500 en la API | Error PHP oculto | Revisar logs en cPanel → **Error Logs** |
| Los correos no llegan | SendGrid no configurado | Verificar API Key de SendGrid en `backend/app/` |

---

> **Nota:** Para cambios futuros en el frontend, siempre seguir el ciclo:  
> `editar en src/` → `npm run build` → `subir carpeta dist/ al servidor`

