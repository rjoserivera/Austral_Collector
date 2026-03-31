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

### 2. Instalar las Dependencias (Solo la primera vez)
Como esto está construido sobre React (Vite.js) y React-Router, las carpetas pesadas no se suben a Git (`node_modules`). Para instalarlas mágicamente, corre este comando:
```bash
npm install
```

### 3. Iniciar el Servidor de Desarrollo
Una vez que `npm install` haya finalizado al 100%, debes levantar el entorno visual con la terminal:
```bash
npm run dev
```
> [!NOTE]
> ¡Listo! Se mostrará en tu consola un enlace local (generalmente es `http://localhost:5173/`). Solo ábrelo en tu navegador Chrome o Safari y verás el mundo de Austral Collector.

---

## 📁 Estado Actual de la Aplicación

**Tecnología Usada:** React + Vite + Vanilla CSS.

- **Frontend (Visual): 100% Completado.** Carruseles, modales emergentes oscuros, paneles laterales, tipografías variables, etc.
- **Datos (Mock Data):** Por el momento, la carga de Figuras, Usuarios y Noticias funciona mediante **Mock Arrays** (Datos simulados falsos incrustados en los componentes de las páginas) alojados en las carpetas `src/pages` y `src/components`. NO requiere base de datos de MySQL para arrancar y lucirse.
- **Backend (PHP/MySQL):** Aún no se conecta mediante API `fetch()` al servidor XAMPP, el enlazado será el último paso.
- Todos los assets visuales (fotos, logos, mascotas) viven seguros en la carpeta `/public` y están referenciados de manera relativa, por lo que **funcionan de maravilla en cualquier computadora que ejecute estos comandos**.

🏆 **¡Que disfrutes tu recorrido por el coleccionismo oscuro y los juguetes de tu infancia!**
