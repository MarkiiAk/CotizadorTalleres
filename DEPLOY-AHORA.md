# 🚀 CÓMO SUBIR TODO A CPANEL - PASO A PASO

## ✅ LO QUE YA ESTÁ LISTO

1. ✅ Backend PHP completo
2. ✅ Frontend compilado (carpeta `dist/`)
3. ✅ Base de datos MySQL funcionando
4. ✅ Credenciales configuradas
5. ✅ Todo en GitHub

---

## 📋 SUBIR ARCHIVOS A CPANEL

### PASO 1: Subir el Backend PHP

1. **Abre cPanel** → **File Manager**
2. **Navega a** `public_html/gestion/`
3. **Crea la carpeta** `backend-php` (si no existe)
4. **Sube TODA la carpeta** `backend-php/` de tu proyecto local:
   ```
   backend-php/
   ├── index.php
   ├── .htaccess
   ├── .env                  ← IMPORTANTE: Crear este archivo manualmente
   ├── config/
   │   ├── database.php
   │   └── jwt.php
   └── controllers/
       ├── AuthController.php
       └── OrdenesController.php
   ```

5. **Crea el archivo `.env`** dentro de `backend-php/`:
   - Click derecho → New File → `.env`
   - Edítalo y pega:
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

6. **Verifica permisos**:
   - `.htaccess` → 644
   - `index.php` → 644
   - `.env` → 644 (NO 777)

### PASO 2: Subir el Frontend

1. **Espera** a que termine el `npm run build`
2. **Ve a la carpeta** `dist/` en tu proyecto local
3. **Sube TODO el contenido** de `dist/` a `public_html/gestion/`:
   ```
   public_html/gestion/
   ├── index.html           ← Del dist/
   ├── assets/             ← Del dist/
   ├── garantia.pdf        ← Del dist/
   └── backend-php/        ← Ya lo subiste en PASO 1
   ```

**IMPORTANTE**: Sube el CONTENIDO de `dist/`, NO la carpeta `dist/` completa.

---

## 🧪 PROBAR QUE FUNCIONA

### 1. Probar el Backend PHP

Abre en el navegador:
```
https://saggarage.com.mx/gestion/backend-php/
```

Deberías ver:
```json
{
  "message": "SAG Garage API - Gestión de Órdenes de Servicio",
  "version": "1.0.0",
  "status": "active"
}
```

### 2. Probar el Login

1. Abre: `https://saggarage.com.mx/gestion/login`
2. **Usuario**: admin
3. **Contraseña**: Admin123!
4. Haz clic en "Iniciar Sesión"

Si todo está bien, deberías entrar al Dashboard.

### 3. Probar Crear Orden

1. En el Dashboard, click en "Nueva Orden"
2. Llena los datos
3. Guarda la orden
4. Deberías verla en el Dashboard

---

## 🐛 SI ALGO FALLA

### Error: "Network Error" o "ERR_CONNECTION_REFUSED"

**Causa**: El backend PHP no está accesible.

**Solución**:
1. Verifica que `.htaccess` existe en `backend-php/`
2. Verifica que los permisos sean correctos
3. Abre: `https://saggarage.com.mx/gestion/backend-php/` y confirma que responde

### Error: "Failed to connect to database"

**Causa**: Credenciales incorrectas en `.env`

**Solución**:
1. Edita `backend-php/.env`
2. Verifica que las credenciales sean exactas:
   - DB_HOST=saggarage.com
   - DB_USER=saggarag_admin
   - DB_PASS=Kndiani2593!
   - DB_NAME=saggarag_GestionPresupuestos

### Error: CORS

**Causa**: El CORS_ORIGIN en `.env` no coincide

**Solución**:
1. Edita `backend-php/.env`
2. Asegúrate que `CORS_ORIGIN=https://saggarage.com.mx`

---

## 📁 ESTRUCTURA FINAL EN CPANEL

```
public_html/gestion/
├── index.html                    ← Frontend (React compilado)
├── assets/                       ← CSS, JS, imágenes
│   ├── index-xxxxx.js
│   ├── index-xxxxx.css
│   └── ...
├── garantia.pdf                 ← PDF de garantía
└── backend-php/                 ← Backend PHP
    ├── index.php
    ├── .htaccess
    ├── .env                     ← ¡CREAR MANUALMENTE!
    ├── config/
    │   ├── database.php
    │   └── jwt.php
    └── controllers/
        ├── AuthController.php
        └── OrdenesController.php
```

---

## 🎯 CHECKLIST FINAL

- [ ] Carpeta `backend-php/` subida a `public_html/gestion/backend-php/`
- [ ] Archivo `.env` creado manualmente con las credenciales
- [ ] Permisos verificados (644 para archivos)
- [ ] Contenido de `dist/` subido a `public_html/gestion/`
- [ ] Probado: `https://saggarage.com.mx/gestion/backend-php/` responde
- [ ] Probado: Login funciona
- [ ] Probado: Crear orden funciona

---

## 🔐 CREDENCIALES

**URL**: https://saggarage.com.mx/gestion/login
**Usuario**: admin
**Contraseña**: Admin123!

---

¡Una vez completado esto, tu sistema estará 100% funcional en producción!