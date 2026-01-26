# 🚀 Instalación del Backend PHP en cPanel

## ✅ Compatibilidad Confirmada

Este backend PHP es 100% compatible con tu hosting **NEUBOX Tell It**:
- ✅ PHP 7.4 - 8.3 (tu hosting soporta esto)
- ✅ MySQL con PDO
- ✅ Apache con mod_rewrite
- ✅ Sin dependencias de Node.js
- ✅ Sin necesidad de composer

---

## 📋 Prerequisitos

**YA COMPLETADOS:**
- [x] Base de datos MySQL creada: `saggarag_GestionPresupuestos`
- [x] Usuario MySQL: `saggarag_admin`
- [x] 10 tablas creadas (users, ordenes, clientes, etc.)
- [x] Usuario admin insertado

---

## 📁 Estructura del Backend PHP

```
backend-php/
├── index.php              ← Punto de entrada y router
├── .htaccess             ← Configuración Apache
├── config/
│   ├── database.php      ← Conexión MySQL con PDO
│   └── jwt.php           ← Autenticación JWT
└── controllers/
    ├── AuthController.php      ← Login y autenticación
    └── OrdenesController.php   ← CRUD de órdenes
```

---

## 🔧 PASO 1: Subir archivos a cPanel

### Opción A: File Manager de cPanel (Recomendado)

1. **Accede a cPanel** → File Manager
2. **Navega a** `public_html/`
3. **Crea carpeta** `backend/` (o `api/`)
4. **Sube toda la carpeta** `backend-php/` dentro de `public_html/backend/`

**Estructura final:**
```
public_html/
├── backend/           ← Aquí va el backend PHP
│   ├── index.php
│   ├── .htaccess
│   ├── config/
│   └── controllers/
└── (tu frontend)
```

### Opción B: FTP

1. Usa FileZilla o cualquier cliente FTP
2. Conéctate con las credenciales de NEUBOX
3. Sube `backend-php/` a `public_html/backend/`

---

## 🔧 PASO 2: Configurar Base de Datos

Edita `backend/config/database.php`:

```php
private $host = 'localhost';           // ← Correcto para cPanel
private $db_name = 'saggarag_GestionPresupuestos';  // ← Tu BD
private $username = 'saggarag_admin';              // ← Tu usuario
private $password = 'Kndiani2593!';                // ← Tu contraseña
```

⚠️ **IMPORTANTE:** En producción, cambia la contraseña por algo más seguro.

---

## 🔧 PASO 3: Configurar CORS

Edita `backend/.htaccess` línea 16:

```apache
Header set Access-Control-Allow-Origin "https://saggarage.com"
```

**Cambia a:**
- Tu dominio real si es diferente
- O usa `"*"` para desarrollo (NO recomendado en producción)

También edita `backend/index.php` línea 9:

```php
header('Access-Control-Allow-Origin: https://saggarage.com');
```

---

## 🔧 PASO 4: Configurar JWT Secret Key

Edita `backend/config/jwt.php` línea 8:

```php
private static $secret_key = 'sag-garage-secret-key-2026-change-in-production';
```

**Cámbialo por algo único y seguro:**
```php
private static $secret_key = 'TuClaveSecretaSuperSegura2026!#$%';
```

---

## 🔧 PASO 5: Verificar Permisos

Asegúrate que los archivos tengan los permisos correctos:

```
backend/                755
├── index.php          644
├── .htaccess          644
├── config/            755
│   ├── database.php   644
│   └── jwt.php        644
└── controllers/       755
    ├── AuthController.php    644
    └── OrdenesController.php 644
```

En cPanel File Manager: Click derecho → Change Permissions

---

## 🧪 PASO 6: Probar la API

### 1. Health Check

```bash
curl https://saggarage.com/backend/api/health
```

**Respuesta esperada:**
```json
{
  "status": "ok",
  "database": "MySQL conectado",
  "timestamp": 1737903000
}
```

### 2. Login

```bash
curl -X POST https://saggarage.com/backend/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@saggarage.com",
    "password": "admin123"
  }'
```

**Respuesta esperada:**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "email": "admin@saggarage.com",
    "name": "Administrador",
    "role": "admin"
  }
}
```

### 3. Obtener Órdenes (requiere token)

```bash
curl https://saggarage.com/backend/api/ordenes \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

---

## 🔄 PASO 7: Actualizar Frontend

Edita `sag-garage-presupuestos/.env`:

```env
# Cambiar de Node.js a PHP
VITE_API_URL=https://saggarage.com/backend
```

Luego reconstruye y redespliega el frontend:

```bash
npm run build
```

Sube la carpeta `dist/` a cPanel.

---

## 🐛 Troubleshooting

### Error: "500 Internal Server Error"

**Causa:** Sintaxis PHP o permisos incorrectos

**Solución:**
1. Revisa el error log en cPanel: `Error Log`
2. Verifica permisos: archivos 644, carpetas 755
3. Asegúrate que la versión de PHP sea 7.4+

### Error: "CORS policy blocked"

**Causa:** Headers CORS mal configurados

**Solución:**
1. Edita `.htaccess` línea 16
2. Edita `index.php` línea 9
3. Agrega tu dominio correcto

### Error: "Connection refused" a MySQL

**Causa:** Credenciales incorrectas en `config/database.php`

**Solución:**
1. Verifica en cPanel → MySQL Databases
2. Confirma nombre de BD, usuario y contraseña
3. Asegúrate que el usuario tenga permisos en la BD

### Error: "404 Not Found" en rutas

**Causa:** `.htaccess` no funciona o mod_rewrite deshabilitado

**Solución:**
1. Verifica que `.htaccess` esté en la raíz de `backend/`
2. Contacta a NEUBOX para confirmar que mod_rewrite está habilitado
3. Prueba con URL directa: `https://saggarage.com/backend/index.php/api/health`

---

## 📊 Endpoints Disponibles

### Autenticación
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Usuario actual (requiere token)

### Órdenes
- `GET /api/ordenes` - Listar todas (requiere token)
- `GET /api/ordenes/:id` - Ver una orden (requiere token)
- `POST /api/ordenes` - Crear orden (requiere token)
- `PUT /api/ordenes/:id` - Actualizar orden (requiere token)
- `DELETE /api/ordenes/:id` - Eliminar orden (requiere token)

### Utilidades
- `GET /api/health` - Estado del servidor

---

## 🔐 Seguridad en Producción

### ✅ Checklist de Seguridad

- [ ] Cambiar contraseña de MySQL
- [ ] Cambiar JWT secret key
- [ ] Configurar CORS con dominio específico (no `*`)
- [ ] Verificar permisos de archivos (644/755)
- [ ] Habilitar HTTPS en todo el sitio
- [ ] Revisar logs regularmente
- [ ] Hacer backup de la base de datos

---

## 📈 Ventajas del Backend PHP

✅ **Compatible con tu hosting actual NEUBOX**
✅ **Sin necesidad de Node.js**
✅ **Sin dependencias externas (sin composer)**
✅ **Mismo MySQL que ya configuraste**
✅ **Misma funcionalidad que el backend Node.js**
✅ **Más fácil de mantener en hosting compartido**
✅ **Mejor performance en cPanel**

---

## 📞 Soporte

Si tienes problemas:

1. **Revisa los logs:**
   - cPanel → Error Log
   - Agrega `error_log()` en PHP para debug

2. **Verifica configuración:**
   - Credenciales MySQL correctas
   - CORS configurado
   - Permisos correctos

3. **Prueba con curl:**
   - Endpoint por endpoint
   - Revisa códigos HTTP de respuesta

---

## 🎉 ¡Listo!

Una vez completados todos los pasos, tu backend PHP estará corriendo en:

**🌐 https://saggarage.com/backend/**

Y tu frontend podrá comunicarse perfectamente con él usando la API REST.