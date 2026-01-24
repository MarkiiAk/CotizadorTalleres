# 🔍 DIAGNÓSTICO DE CONEXIÓN MYSQL

## ✅ Estado Actual

El backend **SÍ está funcionando** pero en modo fallback (usando archivos JSON en lugar de MySQL).

Mensaje que aparece:
```
⚠️  MySQL no disponible - usando archivos JSON
```

## 🎯 Opciones para Solucionar

### **OPCIÓN 1: Usar MySQL Local (Recomendado para desarrollo)**

Si quieres usar MySQL en tu computadora local:

#### Paso 1: Verifica si MySQL está instalado y corriendo

```bash
# En cmd o PowerShell:
mysql --version
```

Si NO está instalado, descarga e instala:
- **XAMPP**: https://www.apachefriends.org/ (incluye MySQL/MariaDB)
- **MySQL Workbench**: https://dev.mysql.com/downloads/workbench/

#### Paso 2: Crea la base de datos local

1. Abre **phpMyAdmin** (si usas XAMPP: http://localhost/phpmyadmin)
2. Crea una nueva base de datos llamada: `saggarag_GestionPresupuestos`
3. Ejecuta el archivo `database-schema.sql` para crear las tablas

O desde línea de comandos:
```bash
mysql -u root -p
CREATE DATABASE saggarag_GestionPresupuestos;
USE saggarag_GestionPresupuestos;
SOURCE c:/Proyectos/Taller Gudino/sag-garage-presupuestos/backend/database-schema.sql
```

#### Paso 3: Actualiza el archivo `.env`

Cambia estas líneas en `backend/.env`:

```env
# Para MySQL/XAMPP local:
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=          # <-- Deja vacío si no configuraste contraseña
DB_NAME=saggarag_GestionPresupuestos
```

#### Paso 4: Reinicia el backend

```bash
cd sag-garage-presupuestos\backend
npm run dev
```

Deberías ver:
```
✅ MySQL conectado
```

---

### **OPCIÓN 2: Continuar con Archivos JSON (Más simple)**

Si prefieres NO usar MySQL por ahora:

**✅ NO HAGAS NADA** - El sistema ya funciona perfecto con archivos JSON

- Los datos se guardan en `backend/data/ordenes.json`
- Es ideal para desarrollo y pruebas
- Más adelante puedes migrar a MySQL cuando subas a producción

---

### **OPCIÓN 3: Conectar a MySQL Remoto (Producción)**

Si ya tienes MySQL en cPanel/hosting:

1. Asegúrate que tu IP esté en "Remote MySQL" en cPanel
2. Usa las credenciales actuales del `.env`:
   ```env
   DB_HOST=saggarage.com  # O la IP de tu servidor
   DB_USER=saggarag_admin
   DB_PASSWORD=Kndiani2593!
   DB_NAME=saggarag_GestionPresupuestos
   ```

---

## 🧪 Probar la Conexión

Ejecuta el script de diagnóstico:

```bash
cd sag-garage-presupuestos\backend
node test-mysql-hosts.cjs
```

Esto te dirá exactamente qué está fallando.

---

## ⚡ Recomendación

Para **desarrollo local**:
1. Usa **OPCIÓN 2** (JSON) - Es más rápido y no requiere configuración
2. El sistema funciona perfecto así
3. Cuando subas a producción, usa MySQL

Para **producción**:
- Sigue **OPCIÓN 3** - Configura MySQL remoto en cPanel

---

## 📝 Notas Importantes

- **El sistema NO necesita MySQL** para funcionar
- JSON es perfectamente válido para desarrollo
- MySQL solo es necesario si:
  - Tienes múltiples usuarios concurrentes
  - Necesitas búsquedas complejas
  - Quieres backups automáticos
  - Estás en producción con tráfico alto

---

## 🆘 ¿Problemas?

Si ves este error al intentar conectar:
```
Error: ER_ACCESS_DENIED_ERROR
```
→ Usuario/contraseña incorrectos

Si ves:
```
Error: ECONNREFUSED
```
→ MySQL no está corriendo o el puerto/host es incorrecto

Si ves:
```
Error: ER_BAD_DB_ERROR
```
→ La base de datos no existe, créala primero
