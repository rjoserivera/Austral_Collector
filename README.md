# 🏺 Austral Collector

### 🌐 [**Ver en producción → australcollector.cl**](https://australcollector.cl/)

> Plataforma web comunitaria para coleccionistas chilenos de figuras vintage, juguetes retro y objetos de colección. Diseñada con una estética **Dark-Fantasy y Steampunk**, con animaciones fluidas, modales interactivos, panel de administración completo y soporte offline como PWA instalable.

[![Live](https://img.shields.io/badge/🌐%20Ver%20en%20vivo-australcollector.cl-dfc08a?style=for-the-badge)](https://australcollector.cl/)

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&style=flat-square)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white&style=flat-square)
![PHP](https://img.shields.io/badge/PHP-8-777BB4?logo=php&logoColor=white&style=flat-square)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white&style=flat-square)
![PWA](https://img.shields.io/badge/PWA-Offline--Ready-5A0FC8?logo=pwa&logoColor=white&style=flat-square)

---

## ✨ Características

- 🎨 **Diseño Dark-Fantasy / Steampunk** — Paleta dorada, tipografías ornamentales, animaciones fluidas
- 🖼️ **Galería de figuras** — Con votos, likes, hashtags y perfiles públicos de coleccionistas
- 📰 **Dashboard personal** — Publicar, editar, reordenar y gestionar colecciones propias
- 🛡️ **Panel de administración completo** — Usuarios, eventos, galería, moderación, videos, promociones, log de actividad y más
- 🤖 **Mascota Virtual** — Mensajes contextuales por página, aparece automáticamente al detectar inactividad en móvil
- 📱 **PWA instalable** — Soporte offline con IndexedDB y sincronización automática al reconectar
- 🔒 **Autenticación JWT** — Roles `admin` / `member`, clave temporal y cambio forzado de contraseña
- 📧 **Sistema de correos** — Para claves temporales, advertencias de moderación y contacto
- ✅ **Badges de verificación** — El admin puede verificar perfiles de coleccionistas
- ⭐ **Valoraciones de perfiles** — Los miembros pueden puntuar con estrellas los perfiles de otros coleccionistas
- 🔔 **Toast y Confirm personalizados** — Sin librerías de UI externas

---

## 🚀 Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 19 + Vite 8 |
| Estilos | Vanilla CSS (Dark-Fantasy theme) |
| Routing | React Router DOM v7 |
| Backend | PHP 8 + PDO |
| Base de datos | MySQL |
| Autenticación | JWT (JSON Web Tokens) |
| PWA / Offline | vite-plugin-pwa + Workbox + IndexedDB |
| Notificaciones | Sistema Toast + Confirm custom |

---

## ⚙️ Instalación Rápida

### Requisitos previos
- [Node.js 18+](https://nodejs.org/)
- [XAMPP](https://www.apachefriends.org/) con Apache y MySQL activos

### 1. Clonar el repositorio
> ⚠️ La carpeta debe llamarse exactamente `Austral_Collector` para que las rutas del API en XAMPP funcionen correctamente.

```bash
git clone https://github.com/rjoserivera/Austral_Collector.git Austral_Collector
cd Austral_Collector
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar la base de datos
- Abre `http://localhost/phpmyadmin`
- Crea una base de datos llamada `austral_collector_db`
- Importa el esquema SQL que se encuentra en el archivo `alphadocere_austral_collector.sql` (en la raíz del proyecto)

### 4. Configurar variables de entorno

Copia `.env.example` a `.env` y completa los valores:

```bash
cp .env.example .env
```

### 5. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Disponible en `http://localhost:5173/`

---

## 📜 Scripts Disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run host` | Servidor accesible desde la red local |
| `npm run build` | Build de producción en `/dist` |
| `npm run preview` | Previsualizar el build de producción |
| `npm run lint` | Ejecutar ESLint sobre el código fuente |

---

## 📁 Estructura del Proyecto

```
Austral_Collector/
├── api/                    # Backend PHP (API REST + JWT)
│   ├── auth/               # Endpoints autenticados (login, posts, perfil)
│   ├── admin/              # Endpoints exclusivos del administrador
│   └── public/             # Endpoints públicos (sin autenticación)
├── src/                    # Frontend React
│   ├── components/         # Componentes reutilizables (NavBar, Footer, Modales, etc.)
│   ├── pages/              # Páginas completas (Home, Galería, Admin, Dashboard, etc.)
│   ├── contexts/           # Contextos globales (NotificationContext)
│   ├── hooks/              # Custom hooks (useSyncStatus)
│   ├── utils/              # Utilidades (offlineSync con IndexedDB)
│   ├── config.js           # URLs de API + helper authFetch
│   └── App.jsx             # Rutas principales + lógica global de sesión
├── public/                 # Assets públicos (logos, imágenes, íconos)
│   └── uploads/            # Imágenes subidas por usuarios
├── docs/                   # Documentación técnica (Mintlify)
│   ├── historias.mdx       # Historias de usuario (28 HU)
│   ├── arquitectura.mdx    # Arquitectura completa del sistema
│   ├── diagramas.html      # Diagramas interactivos (Mermaid.js)
│   ├── admin/panel.mdx     # Guía del panel de administración
│   └── api/                # Referencia de endpoints
├── .env.example            # Plantilla de variables de entorno
└── vite.config.js          # Configuración Vite + PWA + Workbox
```

---

## 🗺️ Rutas de la Aplicación

| Ruta | Página | Acceso |
|---|---|---|
| `/` | HomePage | Público |
| `/portafolio` | PortafolioPage | Público |
| `/galeria` | GaleriaPage | Público |
| `/miembros` | MiembrosPage | Público |
| `/perfil/:id` | PerfilPublicoPage | Público |
| `/contacto` | ContactoPage | Público |
| `/login` | LoginPage | Público |
| `/dashboard` | DashboardPage | 🔒 Requiere login |
| `/admin` | AdminPage | 🛡️ Solo administradores |

---

## 📖 Documentación

🌐 **Sitio en producción:** [https://australcollector.cl/](https://australcollector.cl/)

La documentación completa del proyecto está en la carpeta `docs/` y se sirve con [Mintlify](https://mintlify.com/):

```bash
cd docs
mintlify dev
```

Disponible en `http://localhost:3000`

También puedes abrir directamente el archivo de diagramas interactivos:

```
docs/diagramas.html
```

Contiene 8 diagramas del sistema: arquitectura, flujo de navegación, autenticación JWT, flujo offline PWA, panel admin, base de datos (ER), componentes React y casos de uso por actor.

---

## 🔗 Repositorios Vinculados

Este proyecto cuenta con dos repositorios remotos principales configurados:
- **origin**: `https://github.com/rjoserivera/Austral_Collector`
- **cliente**: `https://github.com/luisalmonacid3091-spec/australcollector`

Para subir cambios a ambos repositorios a la vez, recuerda hacer push a cada uno de ellos individualmente o configurar una URL de push múltiple en el remoto.

---

## 🤝 Contribuir

Lee [CONTRIBUTING.md](docs/CONTRIBUTING.md) para conocer cómo colaborar con el proyecto.

---

## 📜 Licencia

Este proyecto está bajo la licencia incluida en [LICENSE](docs/LICENSE).

---

## 🏆 ¡Bienvenido al coleccionismo oscuro y los juguetes de tu infancia!
