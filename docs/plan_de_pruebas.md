---
title: "Plan de Pruebas Funcionales"
description: "Guía detallada para la validación y testing de todas las funcionalidades críticas de Austral Collector."
---

Este documento detalla los casos de prueba manuales que el equipo debe ejecutar para asegurar la calidad y estabilidad de **Austral Collector** en todos sus módulos.

---

## 1. Seguridad y Autenticación

| Escenario | Pasos de Prueba | Resultado Esperado |
| :--- | :--- | :--- |
| **Login Exitoso** | Ingresar usuario y contraseña válidos. | Redirección al perfil del usuario. |
| **Bloqueo por Intentos (Lockout)** | Introducir una contraseña incorrecta 3 veces seguidas. | El sistema debe mostrar un mensaje de error y bloquear el acceso durante 60 segundos. |
| **Recuperación tras Bloqueo** | Esperar el minuto de bloqueo e intentar con la contraseña correcta. | El usuario logra ingresar exitosamente. |
| **Control de Acceso** | Intentar acceder a `/admin` o `/dashboard` sin iniciar sesión. | Redirección inmediata a la página de inicio. |

---

## 2. Gestión de Publicaciones (Galería/Usuarios)

| Escenario | Pasos de Prueba | Resultado Esperado |
| :--- | :--- | :--- |
| **Subir una Foto (Publicar)** | Hacer clic en crear publicación, rellenar campos, añadir hashtags y seleccionar foto. | La foto se sube y aparece en la galería general y perfil. |
| **Marca de Agua (Watermark)** | Subir una publicación nueva y luego abrir la imagen en pantalla completa. | La imagen debe tener el logo de Austral Collector superpuesto (marca de agua) correctamente procesada. |
| **Funcionamiento de Hashtags** | Agregar múltiples hashtags (ej. `#vintage`, `#starwars`) en la publicación. | Los hashtags se guardan, se muestran en azul y son interactivos. |
| **Editar Publicación** | Editar el título y los hashtags de una publicación propia. | Los cambios se reflejan instantáneamente en la interfaz. |
| **Eliminar Publicación (Usuario)**| Hacer clic en el botón de eliminar ("basurero") en una publicación propia. | Mensaje de confirmación; al aceptar, la imagen desaparece. |
| **Interacciones** | Dar "Me gusta" y quitar "Me gusta". | El contador se actualiza en tiempo real de manera consistente. |

---

## 3. Panel de Administración (Gestión Global)

Estas pruebas deben ejecutarse exclusivamente con una cuenta de rol `admin`.

| Escenario | Pasos de Prueba | Resultado Esperado |
| :--- | :--- | :--- |
| **Eliminar Publicación (Admin)** | Buscar una publicación de cualquier usuario y presionar Eliminar. | La publicación desaparece permanentemente de la base de datos y UI. |
| **Fijar Foto / Destacar** | Seleccionar la estrella o botón "Fijar/Destacar" en una publicación o video. | La imagen/video destacado debe reflejarse en la pantalla de Inicio (Portada principal). |
| **Editar Identidad/Portafolio** | Subir, editar y eliminar una imagen/video en la sección de Identidad. | Los cambios se aplican y la foto se puede previsualizar. |
| **Mover / Ordenar (Identidad)** | Cambiar el orden de los elementos o grupos en el Portafolio. | El sistema respeta el nuevo orden en la página pública de Portafolio. |
| **Gestión de Eventos** | Crear un evento con fecha, título de 600x400 y enlace. Editarlo luego. | El evento aparece en la página de inicio para todos los usuarios. |
| **Actualizar Banner** | Cambiar el banner principal de la comunidad pegando una URL o subiendo archivo. | El nuevo banner se refleja en la sección Nosotros / Portafolio. |

---

## 4. Comunicación y Contacto

| Escenario | Pasos de Prueba | Resultado Esperado |
| :--- | :--- | :--- |
| **Envío de Formulario** | Ir a Contacto, llenar Nombre, Correo válido y Mensaje. Hacer clic en Enviar. | Debe aparecer la alerta: *"🚀 Te has comunicado con la administración..."* y limpiarse el formulario. |
| **Recepción de Correo** | Revisar el buzón de `administracion@australcollector.cl`. | El mensaje enviado por el usuario debe haber llegado correctamente. |
| **Validaciones** | Intentar enviar formulario vacío o con un correo sin arroba (`@`). | El sistema detiene el envío y muestra alertas rojas de error. |

---

## 5. Pruebas Generales e Infraestructura

| Escenario | Pasos de Prueba | Resultado Esperado |
| :--- | :--- | :--- |
| **Funcionalidad Offline (PWA)** | Desconectar el internet (o simular "Offline" en dev tools) e intentar dar Like. | El indicador global muestra 🔴 o ⏳ (Sincronizando) y guarda la acción para enviarla después. |
| **Responsive (Móviles)** | Abrir el sistema desde un celular o reduciendo la ventana del navegador. | La interfaz se ajusta, el menú cambia a hamburguesa y no hay desbordes horizontales. |
| **Integridad de Imágenes** | Abrir la consola del navegador y revisar que no existan imágenes rotas (Error 404). | Todas las imágenes, miniaturas y logos cargan sin errores. |
