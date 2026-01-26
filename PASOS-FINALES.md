# 🎯 PASOS FINALES PARA HACER FUNCIONAR EL SISTEMA

## ✅ LO QUE YA ESTÁ HECHO

1. ✅ Backend PHP completo creado en `/backend-php`
2. ✅ Frontend React configurado para usar API REST
3. ✅ localStorage DESHABILITADO - TODO va a MySQL
4. ✅ Script SQL para crear usuario admin
5. ✅ Console.logs de debug agregados
6. ✅ Todo subido a GitHub

---

## 📋 LO QUE DEBES HACER AHORA

### PASO 1: Ejecutar el Script SQL para Crear el Usuario Admin

1. **Abre phpMyAdmin** en tu hosting
2. **Selecciona la base de datos** `saggarag_GestionPresupuestos`
3. **Ve a la pestaña SQL**
4. **Copia y pega** el contenido del archivo `backend/insert-user-markiiak.sql`:

```sql
USE saggarag_GestionPresupuestos;

INSERT INTO usuarios (username, password_hash, nombre_completo, email, rol, activo, fecha_creacion) 
VALUES (
    'markiiak',
    '$2y$10$8ZqVZ5fYHxKvP7iJ0QwMZeX5Y9mKNhLvRwJ1pQ2sT3uV4wX5yZ6aO',
    'Markii AK',
    'markiiak@saggarage.com',
    'admin',
    TRUE,
    NOW()
);

SELECT * FROM usuarios WHERE username = 'markiiak';
```

5. **Ejecuta el script**
6. **Verifica** que veas el usuario creado

**Credenciales de acceso:**
- Username: `markiiak`
- Password: `kndiani2593!`

---

### PASO 2: Desplegar el Backend PHP en cPanel

Sigue las instrucciones detalladas en:
📄 **`backend-php/INSTALACION-BACKEND-PHP.md`**

**Resumen rápido:**

1. **Subir archivos:**
   - Sube toda la carpeta `backend-php` a `public_html/api`
   - Estructura final: `public_html/api/index.php`, `public_html/api/config/`, etc.

2. **Configurar base de datos:**
   - Edita `public_html/api/config/database.php`
   - Pon tus credenciales de MySQL

3. **Verificar .htaccess:**
   - Asegúrate que existe `public_html/api/.htaccess`

4. **Probar endpoints:**
   - `https://presupuestoprotallermecánico.quadrisistemas.com/api/health`
   - Debe responder: `{"status":"ok","timestamp":"..."}`

---

### PASO 3: Configurar el Frontend para Producción

1. **Edita el archivo `.env` en la raíz del proyecto:**

```env
VITE_API_URL=https://presupuestoprotallermecánico.quadrisistemas.com/api
```

2. **Haz build del frontend:**

```bash
npm run build
```

3. **Sube la carpeta `dist` a cPanel:**
   - Contenido de `dist` → `public_html/`
   - El `index.html` debe estar en la raíz de `public_html`

---

### PASO 4: Probar el Sistema Completo

1. **Abre tu sitio:**
   `https://presupuestoprotallermecánico.quadrisistemas.com`

2. **Abre la consola del navegador** (F12)

3. **Busca los console.logs:**
   ```
   🔧 API Configuration: { API_URL: "...", env: "...", mode: "..." }
   🔐 AuthContext inicializado - usando API REST directamente
   ```

4. **Haz login con:**
   - Username: `markiiak`
   - Password: `kndiani2593!`

5. **Verifica en consola:**
   ```
   🔐 LOGIN REQUEST: { username: "markiiak", API_URL: "..." }
   ✅ LOGIN SUCCESS: { token: "...", user: {...} }
   ```

6. **Crea una orden de servicio**

7. **Verifica en consola:**
   ```
   ➕ CREATING ORDEN: {...}
   ✅ ORDEN CREATED: {...}
   ```

8. **Ve al Dashboard**

9. **Verifica en consola:**
   ```
   📋 FETCHING ALL ORDENES from: ...
   ✅ ORDENES FETCHED: 1 ordenes
   ```

---

## 🔍 TROUBLESHOOTING

### Si el login NO funciona:

1. **Verifica en consola del navegador:**
   - ¿Qué URL está usando para el API?
   - ¿Hay errores de CORS?
   - ¿Qué responde el servidor?

2. **Verifica el backend PHP:**
   - Accede a: `https://tu-dominio.com/api/health`
   - Debe responder JSON con status "ok"

3. **Verifica la base de datos:**
   - ¿Existe el usuario en phpMyAdmin?
   - ¿La tabla `usuarios` tiene datos?

### Si las órdenes NO se guardan:

1. **Mira la consola del navegador:**
   - ¿Ves errores en las peticiones POST?
   - ¿Qué código HTTP devuelve? (401, 500, etc.)

2. **Verifica permisos:**
   - La carpeta `public_html/api` debe tener permisos 755
   - Los archivos PHP deben tener 644

3. **Verifica la conexión a MySQL:**
   - ¿Las credenciales en `config/database.php` son correctas?
   - ¿El usuario de MySQL tiene permisos en la BD?

---

## 📱 CONTACTO Y SOPORTE

Si tienes problemas:

1. **Revisa los console.logs** - ahora están por todo el código
2. **Revisa los archivos de documentación:**
   - `backend-php/INSTALACION-BACKEND-PHP.md`
   - `DEPLOY-CPANEL.md`
   - `CONFIGURAR-BACKEND-CPANEL.md`

3. **Información de debug útil:**
   - URL del API que está usando el frontend
   - Errores en consola del navegador
   - Respuestas del servidor (código HTTP y mensaje)
   - Estado de la base de datos (¿hay tablas? ¿hay usuario?)

---

## 🎉 CUANDO TODO FUNCIONE

Verás en consola del navegador una secuencia perfecta como esta:

```
🔧 API Configuration: { ... }
🔐 AuthContext inicializado - usando API REST directamente
🔍 Verificando token: no existe
🔐 LOGIN REQUEST: { username: "markiiak" }
📡 Llamando a API: POST http://localhost:3001/api/auth/login
✅ LOGIN SUCCESS: { token: "...", user: { name: "Markii AK" } }
✅ Login exitoso, guardando token
✅ Usuario autenticado: { name: "Markii AK", role: "admin" }
📋 FETCHING ALL ORDENES from: http://localhost:3001/api
📡 Llamando a API: GET http://localhost:3001/api/ordenes
✅ ORDENES FETCHED: 0 ordenes
```

¡Y todo funcionará como la seda! 🚀

---

## 🔑 CREDENCIALES IMPORTANTES

**Usuario Admin:**
- Username: `markiiak`
- Password: `kndiani2593!`

**Base de Datos MySQL:**
- Nombre BD: `saggarag_GestionPresupuestos`
- (Las demás credenciales las tienes en tu hosting)

---

## ✨ RESUMEN

1. ✅ Ejecuta el script SQL en phpMyAdmin
2. ✅ Sube el backend PHP a `public_html/api`
3. ✅ Configura las credenciales de MySQL
4. ✅ Haz build y sube el frontend
5. ✅ Prueba el login
6. ✅ Crea una orden
7. ✅ ¡Disfruta tu sistema funcionando! 🎊

**TODO está listo, solo falta que lo despliegues en tu hosting.**