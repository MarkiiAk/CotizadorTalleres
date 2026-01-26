# 🚀 DEPLOY MANUAL - SOLUCIÓN RÁPIDA

## ❌ Problema: GitHub Actions no puede conectar por FTP

El error `ETIMEDOUT` indica que tu servidor cPanel está bloqueando las conexiones FTP desde GitHub Actions. Esto es común en hostings compartidos por seguridad.

## ✅ SOLUCIÓN: Deploy Manual (5 minutos)

Ya que GitHub Actions no funciona, haremos el deploy manualmente. **Es súper rápido, solo una vez, y listo.**

---

## 📦 PASO 1: Descargar el Backend PHP del Repositorio

### Opción A: Desde GitHub (más fácil)

1. Ve a: https://github.com/MarkiiAk/CotizadorTalleres
2. Click en el botón verde **"Code"**
3. Click en **"Download ZIP"**
4. Descarga el archivo
5. Descomprime el ZIP
6. Localiza la carpeta `backend-php/`

### Opción B: Desde tu computadora

1. Abre el explorador de archivos
2. Ve a: `C:\Proyectos\Taller Gudino\sag-garage-presupuestos\`
3. Localiza la carpeta `backend-php/`

---

## 📤 PASO 2: Subir Backend PHP a cPanel

### A. Entrar a cPanel

1. Ve a tu cPanel de saggarage.com.mx
2. Abre **File Manager**
3. Navega a: `public_html/gestion/`

### B. Crear archivo ZIP (para subir más rápido)

**EN TU COMPUTADORA**:

1. Ve a la carpeta `backend-php/`
2. Selecciona TODO el contenido dentro:
   - `index.php`
   - `.htaccess`
   - `.env` (si existe)
   - Carpeta `config/`
   - Carpeta `controllers/`

3. Haz clic derecho → **"Send to"** → **"Compressed (zipped) folder"**
4. Nómbralo: `backend-php.zip`

### C. Subir el ZIP a cPanel

1. En cPanel File Manager, asegúrate estar en `public_html/gestion/`
2. Click en **"Upload"** (arriba)
3. Arrastra o selecciona `backend-php.zip`
4. Espera a que suba (100%)
5. Cierra la ventana de upload
6. **Regresa a File Manager**

### D. Extraer el ZIP

1. Haz clic derecho en `backend-php.zip`
2. Click en **"Extract"**
3. Confirma la extracción
4. Se creará la carpeta `backend-php/`
5. Elimina el archivo `backend-php.zip`

---

## ⚙️ PASO 3: Crear el archivo .env

**IMPORTANTE**: Este archivo NO se sube por seguridad.

1. En cPanel File Manager, entra a: `public_html/gestion/backend-php/`

2. Verifica si existe `.env`:
   - **Si existe**: Click derecho → **"Edit"**
   - **Si NO existe**: Click derecho → **"New File"** → Nómbralo `.env`

3. Edita el archivo y pega:

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

4. **Guarda el archivo** (botón "Save Changes")

---

## ✅ PASO 4: Verificar que Funciona

### A. Verificar Backend

1. Abre tu navegador
2. Ve a: `https://saggarage.com.mx/gestion/backend-php/`

**Deberías ver:**
```json
{
  "message": "SAG Garage API - Gestión de Órdenes de Servicio",
  "version": "1.0.0",
  "status": "active"
}
```

✅ Si ves esto = **¡BACKEND FUNCIONANDO!**

### B. Probar Login

1. Ve a: `https://saggarage.com.mx/gestion/login`
2. Usuario: `admin`
3. Contraseña: `Admin123!`
4. Click en "Iniciar Sesión"

✅ Si entras al Dashboard = **¡TODO FUNCIONA!** 🎉

---

## 📋 Estructura Final en cPanel

Verifica que tengas esta estructura:

```
public_html/gestion/
├── index.html              ← Frontend React
├── assets/                 ← CSS y JS del frontend
│   ├── index-xxxxx.js
│   └── index-xxxxx.css
├── logo.jpg
├── garantia.pdf (opcional)
└── backend-php/            ← ¡ESTO ES LO IMPORTANTE!
    ├── index.php
    ├── .htaccess
    ├── .env                ← Con tus credenciales
    ├── config/
    │   ├── database.php
    │   └── jwt.php
    └── controllers/
        ├── AuthController.php
        └── OrdenesController.php
```

---

## 🔧 Verificar Permisos

Si el backend no funciona, revisa los permisos:

1. Selecciona todos los archivos en `backend-php/`
2. Click derecho → **"Permissions"**
3. Configura:
   - Archivos (`.php`, `.htaccess`, `.env`): **644**
   - Carpetas (`config`, `controllers`): **755**

---

## 🆘 Problemas Comunes

### Error 404 en /backend-php/

**Causa**: La carpeta no está en la ubicación correcta

**Solución**: 
- Verifica que la ruta sea: `public_html/gestion/backend-php/`
- NO debe ser: `public_html/backend-php/`

### Error 500

**Causa**: Problema con `.htaccess` o permisos

**Solución**:
1. Verifica que el `.htaccess` existe
2. Revisa permisos (644 para archivos)
3. Contacta a tu hosting para verificar que `mod_rewrite` esté activo

### Error de base de datos

**Causa**: Credenciales incorrectas en `.env`

**Solución**:
1. Abre el archivo `.env` en cPanel
2. Verifica cada línea:
   - DB_HOST=saggarage.com
   - DB_USER=saggarag_admin
   - DB_PASS=Kndiani2593!
   - DB_NAME=saggarag_GestionPresupuestos

---

## 💡 Actualizaciones Futuras

Cuando hagas cambios en el backend:

1. Modifica los archivos en tu computadora
2. Sube solo los archivos modificados por FTP
3. **NO borres el archivo `.env`** del servidor

O simplemente repite este proceso (toma 2 minutos).

---

## 🎯 Resumen

1. ✅ Descarga `backend-php/` de GitHub o tu PC
2. ✅ Comprímelo en un ZIP
3. ✅ Súbelo a `public_html/gestion/` en cPanel
4. ✅ Extrae el ZIP
5. ✅ Crea el archivo `.env` con las credenciales
6. ✅ Prueba `https://saggarage.com.mx/gestion/backend-php/`
7. ✅ Haz login en `https://saggarage.com.mx/gestion/login`

**¡Listo! Sistema 100% funcional en 5 minutos.**