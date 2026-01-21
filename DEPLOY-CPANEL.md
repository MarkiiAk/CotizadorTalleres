# 🚀 Guía de Deploy Automático a cPanel

Esta guía te explica cómo configurar el deploy automático desde GitHub a tu hosting cPanel.

## 📋 Tabla de Contenidos

1. [¿Cómo funciona?](#cómo-funciona)
2. [Requisitos previos](#requisitos-previos)
3. [Configuración paso a paso](#configuración-paso-a-paso)
4. [Primer deploy](#primer-deploy)
5. [Troubleshooting](#troubleshooting)

---

## 🎯 ¿Cómo funciona?

El sistema funciona así:

```
📝 Haces cambios en tu código
    ↓
💾 Git commit & push a GitHub
    ↓
🤖 GitHub Actions detecta el push
    ↓
📦 Instala dependencias y compila el proyecto
    ↓
🚀 Sube archivos compilados a tu cPanel vía FTP
    ↓
✅ ¡Tu sitio está actualizado!
```

**Todo esto es 100% automático** después de la configuración inicial.

---

## ✅ Requisitos previos

Antes de empezar, asegúrate de tener:

- ✅ Un dominio comprado y propagado
- ✅ Hosting con cPanel activo
- ✅ Acceso FTP habilitado en tu cPanel
- ✅ Este repositorio en GitHub

---

## 🔧 Configuración paso a paso

### Paso 1: Obtener credenciales FTP de cPanel

1. **Ingresa a tu cPanel** (normalmente en `tudominio.com/cpanel`)

2. **Busca la sección "Archivos"** y haz clic en **"Cuentas FTP"** (FTP Accounts)

3. **Anota estos datos**:
   ```
   📍 FTP Server: ftp.tudominio.com (o la IP que aparezca)
   👤 Username: tu_usuario_ftp
   🔢 Port: 21 (normalmente)
   📁 Directory: /public_html/ (o la carpeta que uses)
   ```

4. **Si no tienes cuenta FTP**, créala:
   - Haz clic en "Agregar cuenta FTP"
   - Usuario: el que quieras (ej: `deploy`)
   - Contraseña: genera una segura
   - Directorio: `/public_html/` (o donde quieras el sitio)
   - Guarda y anota los datos

---

### Paso 2: Configurar GitHub Secrets

Los **Secrets** son variables seguras que GitHub usa sin exponerlas en el código.

1. **Ve a tu repositorio en GitHub**
   - URL: https://github.com/MarkiiAk/CotizadorTalleres

2. **Haz clic en "Settings"** (Configuración)

3. **En el menú lateral**, busca **"Secrets and variables"** → **"Actions"**

4. **Haz clic en "New repository secret"** y agrega estos secrets uno por uno:

   #### Secret 1: FTP_SERVER
   ```
   Name: FTP_SERVER
   Value: ftp.tudominio.com
   ```
   *(o la IP de tu servidor FTP)*

   #### Secret 2: FTP_USERNAME
   ```
   Name: FTP_USERNAME
   Value: tu_usuario_ftp
   ```

   #### Secret 3: FTP_PASSWORD
   ```
   Name: FTP_PASSWORD
   Value: tu_contraseña_ftp
   ```
   ⚠️ **IMPORTANTE**: Nunca compartas esta contraseña

   #### Secret 4: FTP_PORT (opcional)
   ```
   Name: FTP_PORT
   Value: 21
   ```
   *(solo si tu cPanel usa un puerto diferente)*

   #### Secret 5: FTP_SERVER_DIR (opcional)
   ```
   Name: FTP_SERVER_DIR
   Value: /public_html/
   ```
   *(o la ruta donde quieres el sitio)*

5. **Verifica** que todos los secrets estén creados correctamente

---

### Paso 3: Verificar el workflow

El workflow ya está creado en `.github/workflows/deploy-cpanel.yml`.

Puedes verlo en GitHub:
- Ve a tu repositorio
- Click en la pestaña **"Actions"**
- Deberías ver el workflow "Deploy to cPanel"

---

## 🚀 Primer deploy

### Opción A: Deploy manual (Recomendado para probar)

1. Ve a tu repositorio en GitHub
2. Click en **"Actions"**
3. Click en **"Deploy to cPanel"** (en el menú izquierdo)
4. Click en **"Run workflow"**
5. Selecciona la rama **"main"**
6. Click en **"Run workflow"** (el botón verde)
7. ¡Espera 2-3 minutos y listo!

### Opción B: Deploy automático

Simplemente haz un cambio en tu código y haz push:

```bash
git add .
git commit -m "test: activar deploy automático"
git push
```

GitHub Actions lo detectará y desplegará automáticamente.

---

## 📊 Monitorear el deploy

1. Ve a **Actions** en GitHub
2. Verás cada deploy con su estado:
   - 🟡 Amarillo = En progreso
   - ✅ Verde = Exitoso
   - ❌ Rojo = Error

3. Haz click en cualquier deploy para ver los detalles paso a paso

---

## 🔍 Troubleshooting

### ❌ Error: "Failed to connect to FTP server"

**Solución:**
- Verifica que el `FTP_SERVER` sea correcto
- Verifica que el `FTP_PORT` sea correcto (normalmente 21)
- Asegúrate que tu hosting permita conexiones FTP desde IPs externas
- Contacta a tu hosting para verificar que FTP está habilitado

### ❌ Error: "Authentication failed"

**Solución:**
- Verifica que `FTP_USERNAME` y `FTP_PASSWORD` sean correctos
- Prueba las credenciales con un cliente FTP (FileZilla)
- Regenera la contraseña en cPanel si es necesario

### ❌ Error: "Permission denied"

**Solución:**
- Verifica que el usuario FTP tenga permisos de escritura
- Verifica que `FTP_SERVER_DIR` exista y sea correcto
- En cPanel, verifica los permisos de la carpeta

### ❌ El build falla

**Solución:**
- Verifica que el proyecto compile localmente con `npm run build`
- Revisa los logs en GitHub Actions para ver el error específico
- Asegúrate que todas las dependencias estén en `package.json`

### ❌ Los archivos se suben pero el sitio no se ve

**Solución:**
- Verifica que `FTP_SERVER_DIR` apunte a la carpeta correcta
- Normalmente debe ser `/public_html/` para el dominio principal
- Para subdominios puede ser `/public_html/subdominio/`
- Verifica con tu hosting la ruta correcta

---

## 📝 Configuración avanzada

### Cambiar la rama de deploy

Por defecto se despliega la rama `main`. Para cambiar:

Edita `.github/workflows/deploy-cpanel.yml`:

```yaml
on:
  push:
    branches:
      - main  # ← Cambia esto por tu rama
```

### Excluir archivos del deploy

Si quieres excluir archivos adicionales:

Edita `.github/workflows/deploy-cpanel.yml`:

```yaml
exclude: |
  **/.git*
  **/.git*/**
  **/node_modules/**
  **/.vscode/**
  **/.DS_Store
  **/archivo-que-quieras-excluir.txt  # ← Agrega aquí
```

### Deploy a múltiples carpetas

Si quieres desplegar a varias carpetas (ej: producción y staging):

Crea múltiples secrets:
- `FTP_SERVER_DIR_PROD` → `/public_html/`
- `FTP_SERVER_DIR_STAGING` → `/public_html/staging/`

Y crea workflows separados para cada ambiente.

---

## 🎉 ¡Listo!

Ahora cada vez que hagas push a GitHub, tu sitio se actualizará automáticamente en tu dominio.

### Flujo de trabajo normal:

```bash
# 1. Hacer cambios en tu código
# 2. Guardar y hacer commit
git add .
git commit -m "feat: nueva funcionalidad"

# 3. Subir a GitHub
git push

# 4. ¡GitHub Actions hace el resto!
# En 2-3 minutos tu sitio estará actualizado
```

---

## 📞 Soporte

Si tienes problemas:

1. Revisa la sección de [Troubleshooting](#troubleshooting)
2. Verifica los logs en GitHub Actions
3. Verifica que tus credenciales FTP funcionen con FileZilla
4. Contacta al soporte de tu hosting si el problema persiste

---

## 🔒 Seguridad

- ✅ Las contraseñas están protegidas en GitHub Secrets
- ✅ Solo se suben archivos compilados (carpeta `dist/`)
- ✅ No se sube código fuente ni dependencias
- ✅ Conexión FTP con timeout configurado
- ✅ No se borran todos los archivos antes de subir (más seguro)

---

**¡Felicidades!** Ya tienes deploy automático a tu dominio propio. 🚀
