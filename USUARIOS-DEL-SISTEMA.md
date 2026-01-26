# 🔐 USUARIOS DEL SISTEMA - SAG GARAGE

Documentación completa de usuarios registrados en el sistema de gestión de presupuestos.

---

## 📊 Resumen de Usuarios

**Total de usuarios activos**: 3
**Base de datos**: `saggarag_GestionPresupuestos`
**Tabla**: `usuarios`

---

## 👥 Lista de Usuarios

### 1️⃣ Usuario Admin (Default)

```
🔹 ID: 1
🔹 Username: admin
🔹 Contraseña: [Desconocida - Hash por defecto del schema]
🔹 Nombre: Administrador SAG
🔹 Email: admin@saggarage.com
🔹 Rol: admin
🔹 Estado: ✅ Activo
🔹 Creado: 2026-01-23 23:25:48
```

**Hash de contraseña**:
```
$2b$10$rKzWzW5h0qF4kYxKx0qF5OqF5OqF5OqF5OqF5OqF5OqF5OqF5Oq
```

**⚠️ NOTA**: Este es el usuario por defecto del schema. La contraseña real es desconocida porque el hash es un placeholder. **Se recomienda cambiar la contraseña o usar otro usuario.**

---

### 2️⃣ Usuario Markii AK

```
🔹 ID: 2
🔹 Username: markiiak
🔹 Contraseña: [Desconocida]
🔹 Nombre: Markii AK
🔹 Email: markiiak@saggarage.com
🔹 Rol: admin
🔹 Estado: ✅ Activo
🔹 Creado: 2026-01-26 16:32:23
```

**Hash de contraseña**:
```
$2y$10$8ZqVZ5fYHxKvP7iJ0QwMZeX5Y9mKNhLvRwJ1pQ2sT3uV4wX5yZ6aO
```

**⚠️ NOTA**: Este hash usa `$2y$` (PHP bcrypt) en lugar de `$2b$` (bcryptjs de Node). La contraseña original no está documentada.

---

### 3️⃣ Usuario SAG Garage ⭐ NUEVO

```
🔹 ID: [Se asignará al insertar]
🔹 Username: saggarage
🔹 Contraseña: 050899
🔹 Nombre: SAG Garage Usuario
🔹 Email: saggarage@saggarage.com
🔹 Rol: admin
🔹 Estado: ✅ Activo
🔹 Creado: [Al momento de insertar]
```

**Hash de contraseña**:
```
$2b$10$QA99BEkgi1ooYWBmf.rknOQAq8TSQQegRiO7lzZOO6YH1uM.1wOC.
```

**✅ RECOMENDADO**: Este es el usuario principal con contraseña conocida y documentada.

**📄 Archivo SQL**: `backend/insert-user-saggarage.sql`

---

## 🔑 Credenciales de Acceso (CONFIDENCIAL)

| # | Username | Password | Rol | Estado | Notas |
|---|----------|----------|-----|--------|-------|
| 1 | `admin` | ❓ Desconocida | admin | ✅ Activo | Hash placeholder del schema |
| 2 | `markiiak` | ❓ Desconocida | admin | ✅ Activo | Hash PHP, password no documentada |
| 3 | `saggarage` | **050899** | admin | ⏳ Por insertar | ⭐ Usuario principal recomendado |

---

## 📝 Cómo Insertar el Nuevo Usuario

### Opción 1: Usando phpMyAdmin en cPanel

1. Ve a cPanel → phpMyAdmin
2. Selecciona la base de datos `saggarag_GestionPresupuestos`
3. Haz clic en la pestaña **SQL**
4. Copia y pega el contenido del archivo `backend/insert-user-saggarage.sql`
5. Haz clic en **Ejecutar**

### Opción 2: SQL Directo

```sql
INSERT INTO `usuarios` (`username`, `password_hash`, `nombre_completo`, `email`, `rol`, `activo`, `fecha_creacion`, `ultima_modificacion`) 
VALUES (
    'saggarage',
    '$2b$10$QA99BEkgi1ooYWBmf.rknOQAq8TSQQegRiO7lzZOO6YH1uM.1wOC.',
    'SAG Garage Usuario',
    'saggarage@saggarage.com',
    'admin',
    1,
    NOW(),
    NOW()
);
```

### Verificar la Inserción

```sql
SELECT id, username, nombre_completo, email, rol, activo 
FROM usuarios 
WHERE username = 'saggarage';
```

---

## 🔐 Información Técnica sobre Hashes

### Tipos de Hash Usados

1. **bcrypt (Node.js)** - Identificador: `$2b$`
   - Usado por: AuthController.php (backend PHP)
   - Costo: 10 rounds
   - Compatible con: `password_verify()` de PHP

2. **bcrypt (PHP)** - Identificador: `$2y$`
   - Usado por: usuario `markiiak`
   - Costo: 10 rounds
   - Compatible con: `password_verify()` de PHP

### ✅ Compatibilidad

Ambos tipos de hash (`$2b$` y `$2y$`) son **100% compatibles** con `password_verify()` de PHP, que es lo que usa el backend en producción.

---

## 🛠️ Generar Nuevas Contraseñas

Si necesitas crear más usuarios o cambiar contraseñas, usa uno de estos scripts:

### Script PHP (Si tienes PHP instalado)

```bash
php backend-php/generate-password-hash.php
```

**Ubicación**: `backend-php/generate-password-hash.php`

### Script Node.js (Recomendado)

```bash
cd backend
node generate-password-hash.cjs
```

**Ubicación**: `backend/generate-password-hash.cjs`

**Editar contraseña**: Abre el archivo y cambia la variable `password`.

---

## 🔒 Seguridad y Mejores Prácticas

### ✅ Recomendaciones

1. **Nunca compartas este archivo** fuera del equipo de desarrollo
2. Cambia las contraseñas después de la configuración inicial
3. Usa contraseñas fuertes (mínimo 8 caracteres, números, letras y símbolos)
4. Considera implementar autenticación de dos factores (2FA) en el futuro
5. Desactiva usuarios que ya no necesites acceso

### ⚠️ Cambiar Contraseña de Usuario Existente

```sql
-- Ejemplo: Cambiar contraseña de 'admin'
UPDATE usuarios 
SET password_hash = '$2b$10$[NUEVO_HASH_AQUI]',
    ultima_modificacion = NOW()
WHERE username = 'admin';
```

### 🗑️ Desactivar Usuario (NO eliminarlo)

```sql
-- Mejor práctica: Desactivar en lugar de eliminar
UPDATE usuarios 
SET activo = 0,
    ultima_modificacion = NOW()
WHERE username = 'usuario_a_desactivar';
```

---

## 📋 Roles del Sistema

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| `admin` | Administrador | Acceso completo al sistema |
| `tecnico` | Técnico Mecánico | Crear/editar órdenes, ver reportes |
| `recepcionista` | Recepcionista | Crear órdenes, consultar estado |

**Nota**: Actualmente todos los usuarios son `admin`. Se recomienda crear usuarios con roles específicos según sea necesario.

---

## 🚀 Inicio de Sesión

**URL**: `https://saggarage.com.mx/gestion/login`

**Credenciales recomendadas**:
- Username: `saggarage`
- Password: `050899`

---

## 📞 Soporte

Si tienes problemas con el acceso:

1. Verifica que el usuario esté activo en la base de datos
2. Confirma que el hash de la contraseña sea correcto
3. Revisa los logs del backend en `backend-php/`
4. Verifica la conexión a la base de datos en `.env`

---

## 📅 Historial de Cambios

| Fecha | Acción | Usuario | Detalles |
|-------|--------|---------|----------|
| 2026-01-23 | Creación | admin | Usuario por defecto del schema |
| 2026-01-26 | Creación | markiiak | Usuario administrativo |
| 2026-01-26 | Documentación | saggarage | Usuario principal documentado |

---

**⚠️ IMPORTANTE**: Este archivo contiene información sensible. Manténlo seguro y nunca lo subas a repositorios públicos.

**📝 Última actualización**: 26 de Enero, 2026