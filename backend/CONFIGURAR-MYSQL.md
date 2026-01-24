# 🔧 CONFIGURACIÓN DE MYSQL - GUÍA COMPLETA

## ❌ Problema Actual: Acceso Denegado

El error "Access denied" significa que MySQL está rechazando la conexión. Aquí están las soluciones:

---

## 📋 OPCIÓN 1: Configurar desde cPanel (RECOMENDADO)

### Paso 1: Verificar/Crear Base de Datos

1. Inicia sesión en **cPanel de saggarage.com.mx**
2. Ve a **MySQL® Databases**
3. Verifica que existe la base de datos: `saggarag_GestionPresupuestos`
   - Si NO existe, créala con ese nombre exacto

### Paso 2: Verificar Usuario y Permisos

1. En la misma sección **MySQL® Databases**
2. Busca el usuario: `saggarag_admin`
3. Si NO existe:
   - Créalo con la contraseña: `Kndiani2593!`
   - Asegúrate de guardar bien la contraseña
4. **IMPORTANTE**: Asigna el usuario a la base de datos
   - Sección: "Add User To Database"
   - Usuario: `saggarag_admin`
   - Base de datos: `saggarag_GestionPresupuestos`
   - Marca **TODOS LOS PRIVILEGIOS** (ALL PRIVILEGES)

### Paso 3: Habilitar Acceso Remoto (para desarrollo local)

1. En cPanel, busca **Remote MySQL®**
2. Verifica tu IP actual:
   - Ve a: https://www.whatismyip.com/
   - Copia tu dirección IPv4
3. En "Add Access Host", agrega tu IP actual
   - Si tu IP es dinámica, agrega: `%` (permite todas las IPs - SOLO PARA DESARROLLO)
   - ⚠️ **NOTA**: Usar `%` es un riesgo de seguridad, solo hazlo temporalmente

### Paso 4: Ejecutar el Schema SQL desde cPanel

**ESTA ES LA FORMA MÁS FÁCIL:**

1. En cPanel, ve a **phpMyAdmin**
2. Selecciona la base de datos `saggarag_GestionPresupuestos`
3. Click en la pestaña **SQL**
4. Abre el archivo: `backend/database-schema.sql`
5. Copia TODO el contenido
6. Pégalo en el editor SQL de phpMyAdmin
7. Click en **Go** / **Continuar**
8. ✅ Verás un mensaje de éxito y las tablas creadas

---

## 📋 OPCIÓN 2: Ejecutar Script desde Tu PC (Requiere acceso remoto)

### Verificar tu IP actual:

```bash
# Windows PowerShell
(Invoke-WebRequest -uri "https://api.ipify.org").Content

# O visita: https://www.whatismyip.com/
```

### Agregar IP en cPanel:

1. cPanel → **Remote MySQL®**
2. Agregar tu IP actual

### Ejecutar el script:

```bash
cd sag-garage-presupuestos\backend
node setup-database.cjs
```

---

## 📋 OPCIÓN 3: Conexión Local (Cuando el código esté en el servidor)

Una vez que subas el código al servidor con FileZilla, conecta usando `localhost`:

### Archivo `.env` (para producción en el servidor):

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=saggarag_admin
DB_PASSWORD=Kndiani2593!
DB_NAME=saggarag_GestionPresupuestos
```

### Ejecutar desde SSH del servidor:

```bash
cd /home/saggarag/api
node setup-database.cjs
```

---

## 🔍 Verificar que Funciona

### Después de configurar con phpMyAdmin:

1. En phpMyAdmin, selecciona la base de datos
2. Deberías ver estas tablas:
   - ✅ usuarios
   - ✅ clientes
   - ✅ vehiculos
   - ✅ ordenes_servicio
   - ✅ servicios_predefinidos
   - ✅ servicios_orden
   - ✅ refacciones_orden
   - ✅ historial_cambios
   - ✅ pagos
   - ✅ configuracion_sistema

### Datos iniciales que se crearon:

- **Usuario admin** (cambiar contraseña después):
  - Usuario: `admin`
  - Email: `admin@saggarage.com`
  
- **10 servicios predefinidos**:
  - Cambio de aceite
  - Afinación menor/mayor
  - Balanceo, alineación
  - Cambio de frenos
  - Diagnóstico, batería
  - Suspensión, aire acondicionado

---

## 🚨 Solución de Problemas

### Error: "Access denied"

**Causas posibles:**

1. ❌ Usuario/contraseña incorrectos
   - Verifica en cPanel que las credenciales sean exactas
   
2. ❌ Usuario no tiene permisos en la base de datos
   - En cPanel → MySQL Databases → Add User To Database
   - Marca ALL PRIVILEGES
   
3. ❌ IP no autorizada
   - Tu IP cambió desde que la configuraste
   - Ve a cPanel → Remote MySQL® y agrega tu IP actual
   
4. ❌ El firewall del servidor bloquea el puerto 3306
   - Contacta al soporte de hosting
   - O usa phpMyAdmin desde cPanel (no requiere puerto 3306)

### Error: "Unknown database"

- La base de datos no existe
- Créala en cPanel → MySQL® Databases

### Error: "Can't connect to MySQL server"

- El puerto 3306 está bloqueado
- **Solución**: Usa phpMyAdmin desde cPanel

---

## ✅ RECOMENDACIÓN FINAL

**Para desarrollo local**: Usa phpMyAdmin desde cPanel (Opción 1, Paso 4)
- Es más fácil
- No requiere configurar acceso remoto
- Más seguro

**Para producción**: Una vez en el servidor, usa `localhost` como DB_HOST

---

## 📝 Próximos Pasos

Una vez que las tablas estén creadas:

1. ✅ Configurar el backend para usar MySQL
2. ✅ Migrar datos existentes de JSON a MySQL
3. ✅ Probar todas las operaciones CRUD
4. ✅ Desplegar en el servidor

---

## 🆘 ¿Necesitas Ayuda?

Si tienes problemas:

1. Verifica que todas las credenciales sean correctas en cPanel
2. Usa phpMyAdmin (es más fácil para empezar)
3. Verifica los logs de error en el script
4. Contacta al soporte de tu hosting si el problema persiste
