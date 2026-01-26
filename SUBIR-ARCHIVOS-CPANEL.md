# 📤 CÓMO SUBIR LOS ARCHIVOS A CPANEL

## 🎯 PROBLEMA IDENTIFICADO

En tu servidor **NO está la carpeta `backend-php`**. Por eso obtienes error 404.

Actualmente tienes:
```
public_html/gestion/
├── index.html
├── logo.jpg
└── assets/
```

**Debe quedar así:**
```
public_html/gestion/
├── index.html              ← Del build (dist/)
├── assets/                 ← Del build (dist/)
├── garantia.pdf           ← Del build (dist/)
└── backend-php/           ← ¡FALTA ESTO!
    ├── index.php
    ├── .htaccess
    ├── .env
    ├── config/
    └── controllers/
```

---

## 📋 PASO A PASO - SUBIR BACKEND PHP

### PASO 1: Localiza la carpeta en tu computadora

1. Abre el explorador de archivos de Windows
2. Ve a: `C:\Proyectos\Taller Gudino\sag-garage-presupuestos\`
3. Busca la carpeta llamada `backend-php`

Dentro verás:
```
backend-php/
├── index.php
├── .htaccess
├── .env                    ← Este archivo existe localmente
├── .env.example
├── INSTALACION-BACKEND-PHP.md
├── config/
│   ├── database.php
│   └── jwt.php
└── controllers/
    ├── AuthController.php
    └── OrdenesController.php
```

### PASO 2: Preparar archivos para subir

**OPCIÓN A: Subir carpeta completa (más fácil)**

1. Haz click derecho en la carpeta `backend-php`
2. Selecciona "Comprimir" o "Send to" → "Compressed (zipped) folder"
3. Se creará `backend-php.zip`

**OPCIÓN B: Seleccionar archivos manualmente**

Si prefieres no comprimir, selecciona estos archivos:
- ✅ `index.php`
- ✅ `.htaccess`
- ✅ `.env` (o `.env.example` y renómbralo después)
- ✅ Carpeta `config/` completa
- ✅ Carpeta `controllers/` completa

---

### PASO 3: Subir a cPanel

#### A. Acceder al File Manager

1. Entra a tu cPanel de saggarage.com.mx
2. Busca el ícono **"File Manager"** o **"Administrador de archivos"**
3. Click en File Manager

#### B. Navegar a la carpeta correcta

1. En el panel izquierdo, navega a: `public_html/gestion/`
2. Deberías ver: `index.html`, `logo.jpg`, `assets/`

#### C. Subir el archivo ZIP (si usaste OPCIÓN A)

1. Click en el botón **"Upload"** o **"Cargar"** (arriba)
2. Se abrirá una nueva ventana/pestaña
3. Click en **"Select File"** o **"Seleccionar archivo"**
4. Busca y selecciona `backend-php.zip`
5. Espera a que termine de subir (verás una barra de progreso)
6. Cierra la ventana de upload
7. **Regresa al File Manager**
8. Haz click derecho en `backend-php.zip`
9. Selecciona **"Extract"** o **"Extraer"**
10. Confirma la extracción
11. Elimina el archivo `backend-php.zip` (ya no lo necesitas)

#### D. Subir archivos manualmente (si usaste OPCIÓN B)

1. En `public_html/gestion/`, click en **"New Folder"**
2. Nombra la carpeta: `backend-php`
3. Entra a la carpeta `backend-php/`
4. Click en **"Upload"**
5. Sube todos los archivos que seleccionaste:
   - `index.php`
   - `.htaccess`
   - `.env`
6. Crea las carpetas `config/` y `controllers/` con "New Folder"
7. Entra a cada carpeta y sube sus archivos respectivos

---

### PASO 4: Crear/Verificar el archivo .env

**MUY IMPORTANTE**: El archivo `.env` con tus credenciales.

1. En cPanel File Manager, navega a `public_html/gestion/backend-php/`
2. Verifica si existe el archivo `.env`:
   - Si existe: Haz click derecho → **"Edit"**
   - Si NO existe: Click derecho → **"New File"** → Nómbralo `.env`

3. Edita el archivo `.env` y asegúrate que tenga esto:

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

### PASO 5: Verificar estructura final

En cPanel, tu estructura debe verse así:

```
public_html/gestion/
├── backend-php/              ← ¡Ahora SÍ existe!
│   ├── index.php
│   ├── .htaccess
│   ├── .env                  ← Con credenciales
│   ├── .env.example
│   ├── INSTALACION-BACKEND-PHP.md
│   ├── config/
│   │   ├── database.php
│   │   └── jwt.php
│   └── controllers/
│       ├── AuthController.php
│       └── OrdenesController.php
├── index.html
├── assets/
│   ├── index-xxxxx.js
│   └── index-xxxxx.css
├── garantia.pdf (si lo subiste)
└── logo.jpg
```

---

### PASO 6: Verificar permisos

1. En cPanel File Manager, dentro de `backend-php/`
2. Selecciona **todos los archivos**
3. Click derecho → **"Permissions"** o **"Permisos"**
4. Configura:
   - Archivos `.php`, `.htaccess`, `.env`: **644**
   - Carpetas: **755**

---

### PASO 7: PROBAR QUE FUNCIONA

#### A. Probar el Backend

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

✅ Si ves esto, **¡EL BACKEND FUNCIONA!**

#### B. Probar el Login

1. Ve a: `https://saggarage.com.mx/gestion/login`
2. Usuario: `admin`
3. Contraseña: `Admin123!`
4. Click en "Iniciar Sesión"

✅ Si entras al Dashboard, **¡TODO FUNCIONA!**

---

## 🎉 CHECKLIST FINAL

Antes de probar, verifica:

- [ ] La carpeta `backend-php/` existe en `public_html/gestion/backend-php/`
- [ ] Dentro hay: `index.php`, `.htaccess`, `.env`, `config/`, `controllers/`
- [ ] El archivo `.env` tiene las credenciales correctas
- [ ] Los permisos son: 644 para archivos, 755 para carpetas
- [ ] `https://saggarage.com.mx/gestion/backend-php/` muestra el mensaje JSON
- [ ] El login funciona

---

## 🆘 Si algo falla

**Error 404**: El backend no está en la ubicación correcta
- Verifica que la carpeta sea `backend-php` (con guión)
- Verifica que esté dentro de `gestion/`

**Error 500**: Problema con PHP o permisos
- Revisa los permisos (644 para archivos)
- Verifica que el `.htaccess` esté ahí

**Error de base de datos**: Credenciales incorrectas
- Edita el archivo `.env`
- Verifica cada credencial

---

¡Una vez que subas la carpeta `backend-php`, todo funcionará perfectamente!