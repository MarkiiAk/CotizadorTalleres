# 🚀 CONFIGURAR BACKEND EN CPANEL CON MYSQL

## ❗ PROBLEMA ACTUAL

El sistema en producción (saggarage.com) **NO está usando MySQL** porque:
1. El backend no se está desplegando automáticamente (solo el frontend React)
2. El archivo `.env` del backend no está configurado en el servidor
3. El backend necesita estar corriendo como aplicación Node.js en cPanel

## ✅ SOLUCIÓN: Configurar Backend en cPanel

### PASO 1: Acceder a cPanel

1. Ve a tu cPanel: https://saggarage.com:2083
2. Usuario: Tu usuario de cPanel
3. Contraseña: Tu contraseña de cPanel

---

### PASO 2: Crear Aplicación Node.js

1. En cPanel, busca **"Setup Node.js App"** o **"Aplicaciones Node.js"**
2. Click en **"Create Application"**
3. Configura:
   - **Node.js version**: 18.x o superior
   - **Application mode**: Production
   - **Application root**: `/home/saggarag/backend` (o donde quieras el backend)
   - **Application URL**: `backend` o `api`
   - **Application startup file**: `dist/index.js`
   - **Passenger log file**: Deja por defecto

4. Click **"Create"**

---

### PASO 3: Subir el Código del Backend

**Opción A - Via FTP:**

1. Conecta a tu servidor FTP (usando FileZilla o el File Manager de cPanel)
2. Navega a la carpeta que creaste (ej: `/home/saggarag/backend/`)
3. Sube TODOS estos archivos/carpetas del backend:
   ```
   backend/
   ├── src/
   ├── package.json
   ├── package-lock.json
   ├── tsconfig.json
   └── .env  ← ¡IMPORTANTE!
   ```

**Opción B - Via cPanel File Manager:**

1. En cPanel → File Manager
2. Navega a `/home/saggarag/backend/`
3. Comprime la carpeta `backend` local en un .zip
4. Sube el .zip y extráelo

---

### PASO 4: Crear el Archivo .env en el Servidor

1. En cPanel → File Manager
2. Navega a `/home/saggarag/backend/`
3. Click en **"+ File"** → Nombre: `.env`
4. Edita el archivo y pega esto:

```env
PORT=3001
JWT_SECRET=sag-garage-secret-key-2026-change-in-production
JWT_EXPIRES_IN=24h
NODE_ENV=production
FRONTEND_URL=https://saggarage.com

# MySQL Database Configuration (PRODUCCIÓN)
DB_HOST=localhost
DB_PORT=3306
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_password_segura_aqui
DB_NAME=tu_base_de_datos
```

5. **Guarda el archivo**

---

### PASO 5: Instalar Dependencias y Compilar

1. En cPanel, vuelve a **"Setup Node.js App"**
2. Click en tu aplicación (backend)
3. En la sección **"Run NPM Install"**, click el botón
4. Espera a que termine (puede tomar 1-2 minutos)
5. Luego, en la terminal de la aplicación, ejecuta:

```bash
npm run build
```

---

### PASO 6: Verificar MySQL

1. Asegúrate que las tablas estén creadas (ya lo hiciste antes en phpMyAdmin)
2. Verifica que el usuario `saggarag_admin` tenga permisos

---

### PASO 7: Reiniciar la Aplicación

1. En **"Setup Node.js App"**
2. Click en **"Restart"** junto a tu aplicación backend
3. Verifica que el estado sea **"Running"**

---

### PASO 8: Configurar Proxy/Subdominio (Opcional)

Para acceder al backend en `https://saggarage.com/backend`:

1. En cPanel → **Subdomains** o **"Redirects"**
2. Crea una redirección:
   - De: `https://saggarage.com/backend`
   - A: `http://localhost:3001` (puerto donde corre Node.js)

O configura un `.htaccess` en la raíz:

```apache
# Proxy para backend
RewriteEngine On
RewriteRule ^backend/(.*)$ http://localhost:3001/$1 [P,L]
```

---

### PASO 9: Probar la Conexión

1. Abre: `https://saggarage.com/backend/api/health` (o la ruta que definas)
2. Deberías ver algo como:
   ```json
   {
     "status": "ok",
     "database": "MySQL conectado"
   }
   ```

---

### PASO 10: Actualizar el Frontend

Cambia la URL del backend en el frontend:

1. Edita `sag-garage-presupuestos/.env`:
   ```env
   VITE_API_URL=https://saggarage.com/backend
   ```

2. Haz un nuevo push a GitHub para desplegar el frontend actualizado:
   ```bash
   git add .
   git commit -m "config: actualizar URL del backend a producción"
   git push origin main
   ```

---

## 🎯 VERIFICACIÓN FINAL

Después de configurar todo:

1. ✅ Backend corriendo en cPanel (Node.js App)
2. ✅ Archivo `.env` configurado con credenciales de MySQL
3. ✅ Dependencias instaladas (`npm install`)
4. ✅ Proyecto compilado (`npm run build`)
5. ✅ MySQL conectado (10 tablas creadas)
6. ✅ Frontend apuntando a la URL del backend

Crea una nueva orden y verifica en phpMyAdmin que aparezca en la tabla `ordenes`.

---

## 🆘 PROBLEMAS COMUNES

### "Cannot find module"
→ Ejecuta `npm install` en la aplicación Node.js

### "MySQL connection refused"
→ Verifica que `DB_HOST=localhost` en el `.env` del servidor

### "502 Bad Gateway"
→ La aplicación Node.js no está corriendo, reiníciala en cPanel

### "CORS error"
→ Verifica que `FRONTEND_URL` en `.env` sea correcto

---

## 📝 NOTAS IMPORTANTES

- El `.env` del servidor es DIFERENTE al `.env` local
- En producción usa `DB_HOST=localhost` (no saggarage.com)
- El puerto del backend (3001) debe estar disponible
- Necesitas configurar un proxy o subdominio para acceder al backend

---

## ⚡ ALTERNATIVA MÁS SIMPLE

Si cPanel no soporta aplicaciones Node.js, considera:

1. **Vercel** - Desplegar el backend ahí (gratis)
2. **Railway** - Hosting de Node.js con MySQL
3. **Heroku** - Otra opción popular

Todos estos servicios soportan Node.js + MySQL fácilmente.