# 🚀 INSTRUCCIONES FINALES DE DEPLOY - SAG GARAGE

## ✅ LO QUE YA ESTÁ LISTO

1. ✅ Backend PHP completo subido a GitHub
2. ✅ Frontend actualizado para usar la API
3. ✅ Script SQL para crear la base de datos
4. ✅ Todo el código sincronizado en GitHub
5. ✅ Workflow de GitHub Actions configurado

---

## 📋 PASOS QUE DEBES COMPLETAR

### PASO 1: Crear Base de Datos en cPanel

1. **Entra a phpMyAdmin** en tu cPanel
2. **Crea una nueva base de datos** llamada: `markiiak_sag_garage`
3. **Crea un usuario** con los siguientes datos:
   - Usuario: `markiiak_saguser`
   - Contraseña: `SagGarage2024!Secure`
4. **Asigna todos los privilegios** al usuario sobre la base de datos

### PASO 2: Ejecutar el Script SQL

1. **Abre phpMyAdmin**
2. **Selecciona la base de datos** `markiiak_sag_garage`
3. **Ve a la pestaña SQL**
4. **Copia y pega** el siguiente script:

```sql
-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'mecanico') DEFAULT 'mecanico',
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla de órdenes
CREATE TABLE IF NOT EXISTS ordenes (
    id VARCHAR(36) PRIMARY KEY,
    folio VARCHAR(50) UNIQUE NOT NULL,
    taller JSON NOT NULL,
    cliente JSON NOT NULL,
    vehiculo JSON NOT NULL,
    inspeccion JSON NOT NULL,
    problemaReportado TEXT NOT NULL,
    diagnosticoTecnico TEXT NOT NULL,
    servicios JSON NOT NULL,
    refacciones JSON NOT NULL,
    manoDeObra JSON NOT NULL,
    resumen JSON NOT NULL,
    estado ENUM('abierta', 'cerrada') DEFAULT 'abierta',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_folio (folio),
    INDEX idx_estado (estado),
    INDEX idx_fecha_creacion (fecha_creacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar usuario admin
INSERT INTO usuarios (nombre, email, password, rol) 
VALUES (
    'Administrador SAG',
    'admin@saggarage.com',
    '$2y$10$aJZPQXmM5vKxTJ3L8yN7XO5qvKzH3N8YqW9xZmL6oR4jT2nP1sQ5e',
    'admin'
) ON DUPLICATE KEY UPDATE nombre=nombre;
```

5. **Ejecuta el script** haciendo clic en "Continuar"
6. **Verifica** que las tablas `usuarios` y `ordenes` se crearon correctamente

### PASO 3: Configurar Variables de Entorno en cPanel

1. **Accede a tu cPanel**
2. **Busca "File Manager"** (Administrador de Archivos)
3. **Navega a** `public_html/backend-php/`
4. **Crea un archivo** llamado `.env` (si no existe)
5. **Edita el archivo `.env`** con este contenido:

```env
# Configuración de Base de Datos
DB_HOST=localhost
DB_NAME=markiiak_sag_garage
DB_USER=markiiak_saguser
DB_PASS=SagGarage2024!Secure
DB_CHARSET=utf8mb4

# JWT Configuration
JWT_SECRET=tu_clave_secreta_super_segura_aqui_cambiarla
JWT_ALGORITHM=HS256
JWT_EXPIRATION=86400

# CORS Configuration
CORS_ORIGIN=https://presupuestoprotallermecánico.quadrisistemas.com
CORS_METHODS=GET,POST,PUT,DELETE,OPTIONS
CORS_HEADERS=Content-Type,Authorization

# Environment
ENV=production
DEBUG=false
```

6. **IMPORTANTE**: Cambia `JWT_SECRET` por una cadena aleatoria larga y segura

### PASO 4: Configurar GitHub Actions Secret

1. **Ve a tu repositorio** en GitHub
2. **Settings → Secrets and variables → Actions**
3. **New repository secret**
4. Nombre: `CPANEL_TOKEN`
5. Valor: Tu token de API de cPanel (si aún no lo tienes, créalo en cPanel)

### PASO 5: Hacer Deploy

1. **Haz un push** a la rama `main` (ya está hecho, los cambios están sincronizados)
2. **GitHub Actions** automáticamente:
   - Construirá el frontend
   - Subirá todo a cPanel
   - Configurará los permisos correctos

---

## 🔐 CREDENCIALES DE ACCESO

Una vez completado el deploy, podrás acceder con:

- **URL**: https://presupuestoprotallermecánico.quadrisistemas.com
- **Usuario**: admin@saggarage.com
- **Contraseña**: Admin123!

---

## 🧪 VERIFICAR QUE TODO FUNCIONA

1. **Abre la URL** en tu navegador
2. **Inicia sesión** con las credenciales de admin
3. **Crea una nueva orden** de prueba
4. **Verifica** que se guarda correctamente en el dashboard
5. **Abre los DevTools** (F12) y ve a la consola
6. **Verifica** que los logs muestren:
   - ✅ "Órdenes cargadas: X"
   - ✅ "Orden guardada exitosamente"

---

## 🐛 SI ALGO NO FUNCIONA

### Error de conexión a base de datos

**Verifica que:**
1. La base de datos existe en phpMyAdmin
2. El usuario tiene los privilegios correctos
3. Las credenciales en `.env` son correctas
4. El archivo `.htaccess` está en `backend-php/`

### Error 404 en las peticiones API

**Verifica que:**
1. El `.htaccess` está configurado correctamente
2. `mod_rewrite` está habilitado en tu hosting
3. La ruta del backend es `public_html/backend-php/`

### No se guardan las órdenes

**Abre DevTools (F12) y:**
1. Ve a la pestaña Network
2. Crea una orden
3. Busca la petición POST a `/ordenes`
4. Ve la respuesta del servidor
5. Copia el error y consúltame

---

## 📁 ESTRUCTURA FINAL EN cPanel

```
public_html/
├── backend-php/          ← Backend PHP
│   ├── index.php
│   ├── .htaccess
│   ├── .env             ← CREAR ESTE ARCHIVO
│   ├── config/
│   └── controllers/
├── index.html           ← Frontend (React compilado)
├── assets/
└── garantia.pdf
```

---

## 🎉 ¡LISTO!

Una vez completados estos pasos, tu sistema estará 100% funcional y en producción.

**¿Necesitas ayuda?** Revisa los logs en:
- Console del navegador (F12)
- phpMyAdmin → Base de datos → Tabla ordenes
- cPanel → Error Logs

---

**Fecha de última actualización**: 26 de enero de 2026
**Versión del sistema**: 1.0 - Producción Ready