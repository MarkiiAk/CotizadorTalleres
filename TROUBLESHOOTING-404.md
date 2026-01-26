# 🚨 SOLUCIÓN AL ERROR 404

## El Problema

Estás viendo este error en la consola:
```
POST https://saggarage.com.mx/gestion/backend-php/auth/login 404 (Not Found)
```

## ¿Por Qué Pasa?

El error 404 significa que el backend PHP **NO está subido al servidor** o está en una ubicación diferente.

---

## ✅ SOLUCIÓN RÁPIDA

### PASO 1: Verificar si el backend existe

1. Abre tu navegador
2. Ve a: `https://saggarage.com.mx/gestion/backend-php/`
3. **Deberías ver**:
   ```json
   {
     "message": "SAG Garage API - Gestión de Órdenes de Servicio",
     "version": "1.0.0",
     "status": "active"
   }
   ```

4. **Si ves un 404 o error diferente**, significa que el backend NO está subido aún.

---

### PASO 2: Subir el Backend PHP a cPanel

#### A. Accede a cPanel
1. Entra a tu cPanel
2. Ve a **File Manager**
3. Navega a `public_html/gestion/`

#### B. Sube la Carpeta backend-php
1. **DESDE TU COMPUTADORA**: Ve a la carpeta del proyecto
2. Localiza la carpeta `backend-php/`
3. **Sube TODA la carpeta** `backend-php/` a `public_html/gestion/`

La estructura debe quedar así:
```
public_html/gestion/
└── backend-php/
    ├── index.php
    ├── .htaccess           ← MUY IMPORTANTE
    ├── .env                ← Crear manualmente
    ├── config/
    │   ├── database.php
    │   └── jwt.php
    └── controllers/
        ├── AuthController.php
        └── OrdenesController.php
```

#### C. Crear el archivo .env

**IMPORTANTE**: El archivo `.env` NO se sube automáticamente por seguridad.

1. En cPanel File Manager, dentro de `backend-php/`
2. Click derecho → **New File** → Nombra: `.env`
3. Click derecho en `.env` → **Edit**
4. Pega este contenido:

```env
DB_HOST=saggarage.com
DB_NAME=saggarag_GestionPresupuestos
DB_USER=saggarag_admin
DB_PASS=Kndiani2593!
DB_CHARSET=utf8mb4

JWT_SECRET=sag-garage-secret-key-2026-change-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRATION=86400

CORS_ORIGIN=https://saggarage.com.mx
CORS_METHODS=GET,POST,PUT,DELETE,OPTIONS
CORS_HEADERS=Content-Type,Authorization

ENV=production
DEBUG=false
```

5. **Guarda el archivo**

#### D. Verificar Permisos

Asegúrate que los archivos tengan estos permisos:
- `.htaccess` → **644**
- `index.php` → **644**
- `.env` → **644** (NO 777)
- Todos los archivos PHP → **644**
- Carpetas → **755**

---

### PASO 3: Probar el Backend

1. Abre tu navegador
2. Ve a: `https://saggarage.com.mx/gestion/backend-php/`
3. Deberías ver el mensaje de bienvenida de la API

Si ves el mensaje, **¡el backend está funcionando!**

---

### PASO 4: Probar el Login

1. Ve a: `https://saggarage.com.mx/gestion/login`
2. Usuario: `admin`
3. Contraseña: `Admin123!`
4. Haz clic en "Iniciar Sesión"

Si entras al Dashboard, **¡TODO FUNCIONA!** 🎉

---

## 🔧 Otros Problemas Comunes

### Error: "Failed to connect to database"

**Causa**: Credenciales incorrectas en `.env`

**Solución**:
1. Verifica que el archivo `.env` existe en `backend-php/`
2. Verifica que las credenciales sean exactas:
   - DB_HOST=saggarage.com
   - DB_USER=saggarag_admin
   - DB_PASS=Kndiani2593!
   - DB_NAME=saggarag_GestionPresupuestos

### Error CORS

**Causa**: El dominio en `.htaccess` no coincide

**Solución**:
1. Abre `backend-php/.htaccess`
2. Busca la línea: `Header set Access-Control-Allow-Origin`
3. Debe decir: `"https://saggarage.com.mx"` (con .mx)
4. Si dice otra cosa, corrígelo

### El .htaccess no funciona

**Causa**: Apache no tiene mod_rewrite habilitado

**Solución**:
1. Contacta a tu hosting
2. Pide que habiliten `mod_rewrite` y `mod_headers`
3. En cPanel suele estar habilitado por defecto

---

## 📋 Checklist de Verificación

Antes de contactar soporte, verifica:

- [ ] La carpeta `backend-php/` está en `public_html/gestion/backend-php/`
- [ ] El archivo `.htaccess` existe dentro de `backend-php/`
- [ ] El archivo `.env` existe y tiene las credenciales correctas
- [ ] Los permisos son correctos (644 para archivos, 755 para carpetas)
- [ ] `https://saggarage.com.mx/gestion/backend-php/` responde con JSON
- [ ] La base de datos tiene las tablas `users` y `ordenes`
- [ ] El usuario `admin` existe en la tabla `users`

---

## 🆘 ¿Aún Tienes Problemas?

Si después de seguir estos pasos sigues viendo el error 404:

1. **Revisa los logs de error de Apache** en cPanel
2. **Verifica que PHP esté funcionando** en tu hosting
3. **Contacta al soporte de tu hosting** y muéstrales este archivo

---

## 📞 Información de Debug

Cuando contactes soporte, proporciona:

1. URL que da error: `https://saggarage.com.mx/gestion/backend-php/auth/login`
2. Error que ves: `404 Not Found`
3. Estructura de carpetas en cPanel
4. Contenido del `.htaccess`
5. Versión de PHP (debe ser 7.4 o superior)

---

¡El sistema funciona perfectamente una vez que el backend está correctamente subido!