# Austral Collector - Prototipo Visual (Frontend V1)

¡Aventura en el Coleccionismo Chileno! 
Este repositorio contiene la versión interactiva y estética oficial de la plataforma **Austral Collector**. Está diseñado bajo una temática Dark-Fantasy y Steampunk, con animaciones fluidas, carruseles infinitos, modales interactivos y un diseño adaptable a diferentes dispositivos.

---

## 🚀 Requisitos Previos

Antes de ejecutar la plataforma localmente, asegúrate de tener instalados:
1. **Node.js**: (Recomendado versión 18+)
   - Descarga desde: [nodejs.org](https://nodejs.org/)
2. **NPM** (Viene incluido junto a Node).
3. **Git**: (Opcional, para clonar).

---

## 🛠️ Cómo Clonar y Correr el Proyecto (Para Compartir)

Si un compañero o colaborador desea visualizar este proyecto tal cual está diseñado, debe seguir estos 3 sencillos comandos desde su terminal:

### 1. Clonar (o descargar) el repositorio
Puedes descargar el .ZIP directamente o usar el comando:
```bash
git clone https://ruta-de-tu-repositorio.git
```
*(Luego, asegúrate de entrar en la carpeta clonada con `cd Austral Collector`)*

### 2. Instalación Automática (Un solo paso)
Para configurar todo automáticamente (Node, Python y avisos de DB), simplemente ejecuta el archivo setup:
```bash
setup.bat
```
*(Este comando instalará las dependencias de React y Python por ti).*

### 3. Iniciar el Servidor de Desarrollo
Una vez que el setup haya finalizado, puedes levantar el entorno visual:
```bash
npm run dev
```
> [!NOTE]
> ¡Listo! Se mostrará en tu consola un enlace local (generalmente es `http://localhost:5173/`). Solo ábrelo en tu navegador Chrome o Safari y verás el mundo de Austral Collector.

---

## 📁 Estado Actual de la Aplicación

**Tecnología Usada:** React + Vite + Vanilla CSS.

- **Frontend (Visual): 100% Completado.** Carruseles, modales emergentes oscuros, paneles laterales, tipografías variables, etc.
- **Backend (PHP/MySQL):** Ya está conectado mediante llamadas API a la base de datos de XAMPP.
- Para que los datos dinámicos carguen correctamente (usuarios, figuras, galería), **es obligatorio tener XAMPP encendido e importar la base de datos** (`austral_collector_backup.sql`).
- Todos los assets visuales fijos (fotos, logos, mascotas) viven seguros en la carpeta `/public`.

🏆 **¡Que disfrutes tu recorrido por el coleccionismo oscuro y los juguetes de tu infancia!**
