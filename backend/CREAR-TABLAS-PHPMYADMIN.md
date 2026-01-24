# 🗄️ Crear Tablas en MySQL via phpMyAdmin

Ya que la conexión remota está bloqueada por el hosting, usaremos phpMyAdmin directamente.

## 📋 Pasos para Crear las Tablas

### 1. Acceder a phpMyAdmin

1. Entra a tu **cPanel**: https://saggarage.com.mx:2083
2. Busca **phpMyAdmin** en las herramientas de bases de datos
3. Haz clic para abrirlo

### 2. Seleccionar la Base de Datos

1. En el panel izquierdo, busca y haz clic en: **`saggarag_GestionPresupuestos`**
2. Verás que está vacía (sin tablas)

### 3. Ejecutar el Script SQL

1. Haz clic en la pestaña **"SQL"** en la parte superior
2. Abre el archivo `database-schema.sql` (está en la carpeta `backend/`)
3. **Copia TODO el contenido** del archivo
4. **Pégalo** en el cuadro de texto grande de phpMyAdmin
5. Haz clic en el botón **"Continuar"** o **"Go"** abajo a la derecha

### 4. Verificar que se Crearon las Tablas

Después de ejecutar el script, deberías ver:

✅ **10 tablas creadas exitosamente:**

1. `usuarios` - Usuarios del sistema (admin, técnicos)
2. `clientes` - Información de clientes
3. `vehiculos` - Datos de vehículos
4. `ordenes_servicio` - Orden principal
5. `problemas_reportados` - Problemas que reporta el cliente
6. `inspeccion_visual` - Inspección técnica del vehículo
7. `servicios_orden` - Servicios a realizar
8. `refacciones_orden` - Refacciones necesarias
9. `mano_obra_orden` - Mano de obra
10. `garantia_orden` - Términos de garantía

### 5. Verificación Rápida

En el panel izquierdo deberías ver la base de datos expandida con las 10 tablas.

Si haces clic en cualquier tabla, verás su estructura con todas las columnas.

## ✅ ¡Listo!

Una vez creadas las tablas, cuando subas el código al servidor:
- El backend podrá conectarse usando `DB_HOST=localhost`
- Todas las operaciones CRUD funcionarán perfectamente
- Los datos se guardarán en MySQL en lugar de JSON

## 🔧 Para Desarrollo Local

Mientras trabajas en tu PC local:
- El sistema seguirá usando el archivo JSON (`ordenes-db.json`)
- Cuando lo subas a producción, automáticamente usará MySQL

## 📝 Notas Importantes

- Las tablas tienen restricciones de integridad referencial (FOREIGN KEYS)
- Los índices están optimizados para búsquedas rápidas
- Los campos están validados con tipos de datos correctos
- Hay un usuario admin inicial que se crea automáticamente

---

**¿Necesitas ayuda?** Si tienes problemas al ejecutar el SQL, avísame y te ayudo.
