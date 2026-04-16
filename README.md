# 🏺 Austral Collector

Plataforma web comunitaria para coleccionistas chilenos de figuras vintage, juguetes retro y objetos de colección. Diseñada con una estética **Dark-Fantasy y Steampunk**, con animaciones fluidas, modales interactivos y soporte offline como PWA.

---

## 🚀 Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | React 19 + Vite 8 |
| Estilos | Vanilla CSS |
| Routing | React Router DOM v7 |
| Backend | PHP 8 + PDO |
| Base de datos | MySQL (XAMPP) |
| Autenticación | JWT |
| PWA / Offline | vite-plugin-pwa + IndexedDB |

---

## ⚙️ Instalación rápida

### Requisitos previos
- [Node.js 18+](https://nodejs.org/)
- [XAMPP](https://www.apachefriends.org/) con Apache y MySQL activos

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/austral-collector.git
cd "austral-collector"
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar la base de datos
- Abre `http://localhost/phpmyadmin`
- Crea una base de datos llamada `austral_collector_db`
- Importa el archivo `db_backup.sql` que está en la raíz del proyecto

### 4. Iniciar el servidor de desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173/`

---

## 📜 Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run host` | Servidor accesible desde la red local |
| `npm run build` | Build de producción en `/dist` |
| `npm run preview` | Previsualizar el build |
| `npm run lint` | Ejecutar ESLint |

---

## 📁 Estructura del proyecto

```
Austral Collector/
├── api/          # Backend PHP (API REST + JWT)
├── src/          # Frontend React
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── utils/
├── public/       # Assets públicos (logos, imágenes)
├── docs/         # Documentación (Mintlify)
└── db_backup.sql # Esquema inicial de la base de datos
```

---

## 📖 Documentación

La documentación completa del proyecto está disponible en la carpeta `docs/` y se sirve con Mintlify:

```bash
cd docs
mintlify dev
```

Disponible en `http://localhost:3000`

---

## 🤝 Contribuir

Lee [CONTRIBUTING.md](docs/CONTRIBUTING.md) para conocer cómo colaborar con la documentación del proyecto.

---

## 🏆 ¡Que disfrutes tu recorrido por el coleccionismo oscuro y los juguetes de tu infancia!
