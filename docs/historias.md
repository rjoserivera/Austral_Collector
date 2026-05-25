---
title: Historias de Usuario
description: Requerimientos funcionales de Austral Collector documentados como historias de usuario.
---

Las siguientes historias de usuario definen los requerimientos funcionales de la plataforma Austral Collector, organizadas por actor y módulo.

---

## 👤 Actor: Visitante (usuario no registrado)

### HU-01 — Ver la página principal
**Como** visitante,  
**quiero** ver la página principal con figuras recientes, el miembro destacado y eventos de la comunidad,  
**para** conocer la actividad de la plataforma antes de registrarme.

**Criterios de aceptación:**
- La HomePage carga sin requerir autenticación
- Se muestran las últimas figuras en un carrusel
- Se muestra el miembro destacado del mes con su avatar y estadísticas
- Se muestran los eventos próximos de la comunidad
- Se muestran los videos de YouTube configurados por el admin
- La mascota virtual muestra un mensaje contextual de bienvenida

---

### HU-02 — Explorar la galería de figuras
**Como** visitante,  
**quiero** explorar la galería completa de figuras con filtros por categoría y año,  
**para** descubrir las colecciones de la comunidad.

**Criterios de aceptación:**
- La galería es pública, no requiere login
- Se puede buscar por nombre de figura
- Se puede filtrar por categoría y año
- Al hacer clic en una figura se abre un modal con fotos detalladas y descripción
- La galería tiene paginación funcional

---

### HU-03 — Ver perfiles de coleccionistas
**Como** visitante,  
**quiero** ver el perfil público de cualquier coleccionista,  
**para** conocer su colección y estadísticas.

**Criterios de aceptación:**
- El perfil incluye avatar, banner, nombre, descripción y estadísticas
- Se muestran todas las publicaciones del usuario
- Si el usuario tiene badge de verificación, se visualiza
- No requiere inicio de sesión para ver perfiles

---

### HU-04 — Contactar al administrador
**Como** visitante,  
**quiero** enviar un mensaje de contacto a través del formulario,  
**para** hacer consultas o solicitar información.

**Criterios de aceptación:**
- El formulario tiene campos de nombre, email, asunto y mensaje
- Al enviar, el mensaje llega al correo del administrador
- El usuario recibe confirmación visual del envío exitoso
- Se valida el formato del correo antes de enviar

---

### HU-05 — Iniciar sesión
**Como** visitante registrado,  
**quiero** iniciar sesión con mi usuario y contraseña,  
**para** acceder a mi panel personal y publicar en la plataforma.

**Criterios de aceptación:**
- El formulario valida que ambos campos estén completos
- Si las credenciales son incorrectas, se muestra mensaje de error
- Si la cuenta está desactivada, se muestra mensaje informativo
- Al iniciar sesión correctamente, se redirige al Dashboard
- Si `require_pass_change` es true, se muestra modal de cambio forzado de contraseña antes de continuar

---

## 🧑‍💻 Actor: Miembro Registrado

### HU-06 — Ver mi dashboard personal
**Como** miembro,  
**quiero** acceder a mi panel personal con mis publicaciones y estadísticas,  
**para** gestionar mi presencia en la plataforma.

**Criterios de aceptación:**
- El dashboard es accesible solo con sesión activa
- Muestra mis publicaciones en orden personalizable
- Muestra un indicador de estado online/offline con posts pendientes de sincronizar
- Permite acceder al formulario de edición de perfil

---

### HU-07 — Publicar figuras de mi colección
**Como** miembro,  
**quiero** crear publicaciones con fotos de mis figuras,  
**para** compartir mi colección con la comunidad.

**Criterios de aceptación:**
- Puedo subir una imagen principal y hasta 3 imágenes extra
- Puedo agregar título, descripción, año, categoría y hashtags
- Puedo incluir un enlace de YouTube opcional
- La publicación aparece en mi perfil público y en la galería
- Si estoy offline, la publicación se guarda en IndexedDB y se sincroniza al recuperar la conexión

---

### HU-08 — Editar y eliminar mis publicaciones
**Como** miembro,  
**quiero** poder editar o eliminar publicaciones que yo haya creado,  
**para** mantener mi contenido actualizado.

**Criterios de aceptación:**
- Solo puedo editar/eliminar mis propias publicaciones
- Al editar, los campos se pre-rellenan con el contenido actual
- Al eliminar, se pide confirmación antes de proceder
- Los cambios se reflejan inmediatamente en el perfil y la galería

---

### HU-09 — Reordenar mis publicaciones
**Como** miembro,  
**quiero** reordenar el orden en que aparecen mis publicaciones en mi perfil,  
**para** destacar las que considero más importantes.

**Criterios de aceptación:**
- Desde el Dashboard puedo arrastrar o usar botones de orden para reorganizar mis posts
- El nuevo orden se guarda en el servidor
- Se refleja inmediatamente en mi perfil público

---

### HU-10 — Dar like a figuras
**Como** miembro,  
**quiero** dar o quitar like a las figuras de otros coleccionistas,  
**para** valorar las colecciones de la comunidad.

**Criterios de aceptación:**
- El botón de like está disponible en la galería y en el modal de detalle
- Solo los usuarios autenticados pueden dar likes
- Al hacer click, el contador se actualiza en tiempo real
- Un segundo click retira el like (toggle)

---

### HU-11 — Valorar el perfil de otro coleccionista
**Como** miembro,  
**quiero** dar una puntuación de 1 a 5 estrellas al perfil de otro coleccionista,  
**para** reconocer la calidad de su colección.

**Criterios de aceptación:**
- La valoración solo está disponible en perfiles de otros usuarios (no el propio)
- Se puede modificar o eliminar una valoración ya enviada
- El promedio de valoraciones se muestra en el perfil del coleccionista
- Requiere inicio de sesión

---

### HU-12 — Editar mi perfil
**Como** miembro,  
**quiero** actualizar mi avatar, nombre, descripción y contraseña,  
**para** mantener mi perfil público actualizado.

**Criterios de aceptación:**
- Desde el Dashboard puedo actualizar mis datos personales
- Puedo subir un nuevo avatar como imagen o URL
- Para cambiar la contraseña debo ingresar la actual
- Los cambios se reflejan inmediatamente en mi perfil público

---

### HU-13 — Cambiar contraseña temporal
**Como** miembro que recibió una clave temporal,  
**quiero** ser forzado a crear una nueva contraseña al iniciar sesión,  
**para** proteger mi cuenta.

**Criterios de aceptación:**
- Al iniciar sesión con clave temporal, se muestra un modal bloqueante
- No se puede navegar por la plataforma hasta cambiar la contraseña
- El modal desaparece solo después de guardar exitosamente la nueva contraseña

---

### HU-14 — Usar la plataforma sin conexión
**Como** miembro en zona sin conexión,  
**quiero** que mis publicaciones creadas offline se guarden y suban automáticamente al reconectarme,  
**para** no perder mi contenido por falta de internet.

**Criterios de aceptación:**
- Al publicar sin conexión, aparece indicador "Pendiente de sincronización"
- Al recuperar conexión, los posts se sincronizan automáticamente
- El indicador desaparece una vez sincronizados
- Se muestra notificación de éxito o error tras la sincronización

---

## 🛡️ Actor: Administrador

### HU-15 — Acceder al panel de administración
**Como** administrador,  
**quiero** acceder a un panel de control exclusivo,  
**para** gestionar todos los aspectos de la plataforma.

**Criterios de aceptación:**
- El panel es accesible solo para usuarios con rol `admin`
- Incluye un sidebar de navegación entre secciones
- En móvil, el sidebar se convierte en un menú off-canvas con botón hamburguesa
- Al intentar acceder sin permisos, se redirige a `/login`

---

### HU-16 — Ver estadísticas generales en tiempo real
**Como** administrador,  
**quiero** ver métricas clave de la plataforma en el dashboard inicial,  
**para** monitorear la actividad de la comunidad.

**Criterios de aceptación:**
- Se muestran: total de usuarios, publicaciones, figuras, colecciones verificadas
- Se muestra un widget de cumpleañeros del mes
- Se muestra un resumen de actividad reciente
- El indicador "Sistemas Operativos" confirma el estado de la base de datos

---

### HU-17 — Gestionar usuarios
**Como** administrador,  
**quiero** crear, editar, activar/desactivar y buscar usuarios,  
**para** controlar la membresía de la plataforma.

**Criterios de aceptación:**
- Puedo ver la lista completa de usuarios con paginación
- Puedo buscar usuarios por nombre o email
- Puedo cambiar el rol de un usuario (admin ↔ member)
- Puedo activar o desactivar cuentas sin eliminarlas
- Puedo crear un nuevo usuario con todos sus datos

---

### HU-18 — Enviar clave temporal a un usuario
**Como** administrador,  
**quiero** generar y enviar una clave temporal al correo de un usuario,  
**para** ayudarlo a recuperar el acceso a su cuenta.

**Criterios de aceptación:**
- Desde el panel de usuarios, hay un botón de "Enviar clave temporal"
- La clave temporal se genera automáticamente y se envía por correo
- Al iniciar sesión con esa clave, el usuario es forzado a cambiarla

---

### HU-19 — Moderar publicaciones
**Como** administrador,  
**quiero** revisar y eliminar publicaciones inapropiadas de cualquier miembro,  
**para** mantener la calidad del contenido de la plataforma.

**Criterios de aceptación:**
- Puedo ver todas las publicaciones con filtro por tipo (figura/cosplay) y búsqueda
- Puedo abrir el modal de detalle de cualquier publicación
- Al eliminar, debo ingresar el motivo obligatoriamente
- El sistema envía automáticamente un correo de advertencia al autor
- La acción queda registrada en el log de actividad

---

### HU-20 — Gestionar eventos de la comunidad
**Como** administrador,  
**quiero** crear, editar y eliminar eventos,  
**para** informar a la comunidad sobre actividades y fechas importantes.

**Criterios de aceptación:**
- Puedo crear eventos con título, descripción, fecha, imagen y link externo
- Los eventos aparecen en el componente `NoticiasEventos` de la HomePage
- Puedo editar o eliminar eventos existentes

---

### HU-21 — Gestionar la galería del portafolio
**Como** administrador,  
**quiero** subir, organizar y eliminar imágenes de la galería curada del portafolio,  
**para** mostrar el trabajo de la comunidad de forma curada.

**Criterios de aceptación:**
- Puedo subir imágenes por archivo o URL
- Puedo organizar imágenes en grupos/secciones
- Puedo agregar descripción a cada imagen
- Puedo eliminar imágenes existentes

---

### HU-22 — Configurar videos de la comunidad
**Como** administrador,  
**quiero** configurar los videos de YouTube que aparecen en la HomePage y el Portafolio,  
**para** mostrar contenido audiovisual de la comunidad.

**Criterios de aceptación:**
- Hay 4 slots de video disponibles para la Home
- Selecciono el video de una lista de videos registrados en el sistema
- Se muestra un preview de la miniatura del video
- Los videos aparecen en el componente `VideosComunidad` de la HomePage

---

### HU-23 — Gestionar promociones de la Home
**Como** administrador,  
**quiero** agregar y eliminar imágenes de promoción con sus enlaces,  
**para** destacar publicaciones o productos en la página principal.

**Criterios de aceptación:**
- Puedo subir imagen de promoción y su URL de destino
- Las promociones aparecen en la sección designada de la HomePage
- Puedo eliminar promociones existentes

---

### HU-24 — Seleccionar el miembro destacado del mes
**Como** administrador,  
**quiero** seleccionar manualmente el coleccionista que aparece como "Miembro Destacado",  
**para** reconocer a los miembros más activos de la comunidad.

**Criterios de aceptación:**
- Busco y selecciono un usuario de la lista de miembros
- El miembro seleccionado aparece en el componente `MiembroDestacado` de la HomePage
- Puedo también personalizar los mensajes de Destacado y Cumpleañero del mes

---

### HU-25 — Gestionar la identidad visual del sitio
**Como** administrador,  
**quiero** actualizar el logo de inicio, la mascota y el banner principal,  
**para** personalizar la apariencia de la plataforma.

**Criterios de aceptación:**
- Puedo subir el logo principal por archivo o URL
- Puedo subir la imagen de la mascota
- Puedo subir o cambiar el banner del hero
- Los cambios se reflejan en toda la plataforma sin necesidad de redespliegue

---

### HU-26 — Configurar mensajes de la mascota por página
**Como** administrador,  
**quiero** personalizar el texto que muestra la mascota en cada sección del sitio,  
**para** ofrecer mensajes contextuales y útiles a los visitantes.

**Criterios de aceptación:**
- Hay un campo de texto para cada sección: inicio, nosotros, galería, miembros, contacto
- Los cambios se guardan inmediatamente
- La mascota muestra el mensaje correspondiente a la página en la que se encuentra el usuario
- En móvil, el mensaje se muestra automáticamente al reaparecer la mascota por inactividad

---

### HU-27 — Gestionar badges de verificación
**Como** administrador,  
**quiero** otorgar o revocar el badge de verificación a los perfiles de los miembros,  
**para** destacar a los coleccionistas auténticos y de confianza.

**Criterios de aceptación:**
- Desde el panel puedo ver la lista de miembros con su estado de verificación
- Puedo activar o desactivar el badge de verificación individualmente
- El badge aparece en el perfil público del miembro y en el directorio de miembros

---

### HU-28 — Revisar el log completo de actividad
**Como** administrador,  
**quiero** ver un historial filtrable de todas las acciones realizadas en la plataforma,  
**para** auditar la actividad del sistema y detectar comportamientos anómalos.

**Criterios de aceptación:**
- El log muestra: fecha/hora, acción, usuario responsable y tipo de acción
- Puedo filtrar por usuario, categoría de acción y rango de fechas
- El log tiene paginación con 20 registros por página
- Los tipos de acción se distinguen visualmente con badges de color
