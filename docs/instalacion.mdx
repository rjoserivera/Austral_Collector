---
title: Instalación y Configuración
description: Guía completa para poner en marcha Austral Collector en tu entorno local.
---

## Requisitos Previos

Antes de ejecutar la plataforma, asegúrate de tener instalados los siguientes programas:

| Herramienta | Versión mínima | Descarga |
|---|---|---|
| Node.js | 18+ | [nodejs.org](https://nodejs.org/) |
| XAMPP | 8.x | [apachefriends.org](https://www.apachefriends.org/) |
| Git | Cualquiera | [git-scm.com](https://git-scm.com/) |

<Note>NPM viene incluido automáticamente con Node.js. No necesitas instalarlo por separado.</Note>

---

## 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/austral-collector.git
cd "austral-collector"
```

O si lo descargaste como `.zip`, extráelo y entra a la carpeta desde la terminal.

---

## 2. Instalar Dependencias del Frontend

```bash
npm install
```

Esto instalará todas las dependencias del proyecto listadas en `package.json` (React, React Router, Vite, etc.).

---

## 3. Configurar XAMPP y la Base de Datos

<Steps>
  <Step title="Iniciar XAMPP">
    Abre el Panel de Control de XAMPP e inicia los servicios **Apache** y **MySQL**.
  </Step>
  <Step title="Crear la base de datos">
    Abre `http://localhost/phpmyadmin` en tu navegador, crea una base de datos llamada:
    ```
    austral_collector_db
    ```
  </Step>
  <Step title="Importar el esquema">
    En phpMyAdmin, selecciona la base de datos recién creada, ve a la pestaña **Importar** y sube el archivo:
    ```
    db_backup.sql
    ```
    Que se encuentra en la raíz del proyecto.
  </Step>
  <Step title="Verificar la conexión">
    El archivo `api/db.php` ya viene configurado para desarrollo local:
    ```php
    $host = 'localhost';
    $db   = 'austral_collector_db';
    $user = 'root';
    $pass = '';
    ```
    No necesitas cambiar nada si usas XAMPP con configuración predeterminada.
  </Step>
</Steps>

---

## 4. Configurar la URL de la API

Abre el archivo `src/config.js`. Asegúrate de que la URL apunte a tu entorno local:

```js
// Para desarrollo local
export const API_URL  = 'http://localhost/Austral%20Collector/api';
export const BASE_URL = 'http://localhost/Austral%20Collector';
```

Si quieres acceder desde otros dispositivos en tu red local (por ejemplo, desde el celular), usa tu IP local:

```js
export const API_URL  = 'http://192.168.X.X/Austral%20Collector/api';
export const BASE_URL = 'http://192.168.X.X/Austral%20Collector';
```

---

## 5. Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

La terminal mostrará:

```
  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.X.X:5173/
```

Abre el enlace en tu navegador y verás la plataforma Austral Collector funcionando.

---

## Scripts Disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia servidor de desarrollo con HMR |
| `npm run host` | Inicia el servidor accesible desde tu red local |
| `npm run build` | Genera el build de producción en `/dist` |
| `npm run preview` | Previsualiza el build de producción |
| `npm run lint` | Ejecuta ESLint sobre el código fuente |

---

## Producción

Cuando vayas a lanzar el sitio en un servidor web real, edita `src/config.js` y descomenta las líneas de producción:

```js
// export const API_URL  = 'https://www.australcollector.com/api';
// export const BASE_URL = 'https://www.australcollector.com';
```

Y comenta (o elimina) las líneas de desarrollo local.
