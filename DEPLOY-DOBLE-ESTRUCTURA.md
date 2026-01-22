# 🚀 Deploy con Doble Estructura - SAG Garage

## 📋 Descripción General

El sitio web de SAG Garage ahora tiene una **estructura dual**:

1. **Sitio Público** → Raíz del dominio (`https://saggarage.com.mx`)
2. **Sistema de Gestión** → Subfolder `/gestion/` (`https://saggarage.com.mx/gestion`)

---

## 🗂️ Estructura de Archivos en cPanel

```
public_html/
├── index.html          ← Página pública "En construcción" con logo
├── logo.jpg            ← Logo de SAG Garage desde Facebook
└── gestion/            ← Sistema React completo
    ├── index.html
    ├── Garantia.pdf
    └── assets/
        ├── index-*.css
        ├── index-*.js
        ├── vendor-*.js
        ├── forms-*.js
        ├── animations-*.js
        └── pdf-*.js
```

---

## 🔧 Cambios Técnicos Realizados

### 1. Vite Configuration (`vite.config.ts`)
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/gestion/',  // ← Nuevo: todos los assets apuntan a /gestion/
  // ... resto de configuración
})
```

### 2. React Router (`src/App.tsx`)
```typescript
<BrowserRouter basename="/gestion">  {/* ← Nuevo basename */}
  <AuthProvider>
    <Routes>
      {/* Todas las rutas ahora funcionan bajo /gestion/ */}
    </Routes>
  </AuthProvider>
</BrowserRouter>
```

### 3. GitHub Actions Workflow (`.github/workflows/deploy-cpanel.yml`)

El workflow ahora realiza **dos deploys separados**:

#### **Deploy 1: Sitio Público** (index.html + logo)
- **Origen**: `public-site/`
- **Destino**: Raíz de `public_html/`
- **Archivos**: `index.html`, `logo.jpg`
- **Clean slate**: ❌ No (para no borrar la carpeta `/gestion/`)

#### **Deploy 2: Sistema de Gestión** (aplicación React)
- **Origen**: `dist/` (compilado por Vite)
- **Destino**: `public_html/gestion/`
- **Archivos**: Todo el build de React
- **Clean slate**: ✅ Sí (solo limpia `/gestion/`, no toda la raíz)

---

## 🌐 URLs de Acceso

| Página | URL | Descripción |
|--------|-----|-------------|
| **Sitio Público** | `https://saggarage.com.mx` | Página "En construcción" con logo |
| **Sistema de Gestión** | `https://saggarage.com.mx/gestion` | Sistema completo de órdenes de servicio |
| **Login** | `https://saggarage.com.mx/gestion/login` | Página de inicio de sesión |
| **Dashboard** | `https://saggarage.com.mx/gestion/dashboard` | Panel principal |
| **Nueva Orden** | `https://saggarage.com.mx/gestion/nueva-orden` | Crear orden de servicio |

---

## ⚙️ Proceso de Deploy Automático

### Activación del Deploy
El deploy se activa automáticamente cuando:
- Haces `git push` a la rama `main`
- O ejecutas manualmente el workflow desde GitHub Actions

### Pasos del Workflow

1. **📥 Checkout**: Descarga código del repositorio
2. **⚙️ Setup Node.js**: Configura Node.js v18
3. **📦 Instalar dependencias**: `npm ci`
4. **🏗️ Build React**: `npm run build` → genera `dist/` con base `/gestion/`
5. **✅ Verificar build**: Confirma que `dist/` existe
6. **📁 Preparar estructura**:
   ```bash
   deploy-temp/
   ├── index.html      (desde public-site/)
   ├── logo.jpg        (desde public-site/)
   └── gestion/        (desde dist/)
   ```
7. **🚀 Deploy sitio público**: Sube `index.html` y `logo.jpg` a raíz
8. **🚀 Deploy sistema React**: Sube `gestion/` completo
9. **✅ Notificación**: Confirma éxito o error

---

## 🧪 Pruebas Locales

### Probar el Build
```bash
# Compilar con base /gestion/
npm run build

# Verificar que se generó dist/
dir dist
```

### Probar Localmente con Preview
```bash
# Vite sirve el build con la configuración correcta
npm run preview

# La app estará en: http://localhost:4173/gestion/
```

### Simular Estructura de Deploy
```bash
# Crear estructura temporal
mkdir deploy-temp
copy public-site\index.html deploy-temp\
copy public-site\logo.jpg deploy-temp\
xcopy dist deploy-temp\gestion\ /E /I

# Verificar estructura
dir deploy-temp
dir deploy-temp\gestion
```

---

## 📝 Archivo de Sitio Público

**Ubicación**: `public-site/index.html`

Página HTML estática que muestra:
- Logo de SAG Garage
- Mensaje "En construcción"
- Diseño responsive
- Sin dependencias externas

**Logo**: Descargado desde Facebook (`public-site/logo.jpg`)

---

## 🔐 Secretos de GitHub (Ya Configurados)

Los siguientes secretos están configurados en GitHub:

- `FTP_SERVER`: Servidor FTP de cPanel
- `FTP_USERNAME`: Usuario FTP
- `FTP_PASSWORD`: Contraseña FTP
- `FTP_PORT`: Puerto FTP (21)

---

## ✅ Checklist de Deploy

Antes de hacer deploy a producción:

- [x] Build local exitoso (`npm run build`)
- [x] Sitio público creado en `public-site/`
- [x] Logo descargado (`public-site/logo.jpg`)
- [x] `vite.config.ts` con `base: '/gestion/'`
- [x] `App.tsx` con `basename="/gestion"`
- [x] Workflow actualizado para doble deploy
- [x] Secretos de GitHub configurados
- [ ] Primera prueba en servidor real

---

## 🚨 Troubleshooting

### Problema: Assets no cargan (404)
**Causa**: La aplicación no encuentra los archivos CSS/JS

**Solución**: Verifica que:
- `vite.config.ts` tenga `base: '/gestion/'`
- El deploy colocó los archivos en `public_html/gestion/`

### Problema: Rutas de React no funcionan
**Causa**: El router no tiene el basename correcto

**Solución**: Verifica que:
- `App.tsx` tenga `<BrowserRouter basename="/gestion">`
- El servidor está redirigiendo correctamente

### Problema: Sitio público no se muestra
**Causa**: El archivo index.html no está en la raíz

**Solución**: 
- Verifica que `public-site/index.html` exista
- Revisa los logs del workflow en GitHub Actions

---

## 📊 Monitoreo del Deploy

### Ver Logs en GitHub
1. Ve a tu repositorio en GitHub
2. Click en la pestaña **Actions**
3. Click en el último workflow ejecutado
4. Expande cada paso para ver detalles

### Verificar Deploy Exitoso
Visita estas URLs después del deploy:
- ✅ `https://saggarage.com.mx` → Debe mostrar página pública
- ✅ `https://saggarage.com.mx/gestion` → Debe cargar el sistema
- ✅ `https://saggarage.com.mx/gestion/login` → Debe mostrar login

---

## 🔄 Rollback (Reversión)

Si algo sale mal, puedes revertir fácilmente:

1. **Revertir commit en Git**:
   ```bash
   git revert HEAD
   git push origin main
   ```

2. **O ejecutar workflow de commit anterior**:
   - Ve a GitHub Actions
   - Selecciona un workflow exitoso anterior
   - Click en "Re-run all jobs"

---

## 📞 Soporte

Para problemas con el deploy, revisa:
1. Logs de GitHub Actions
2. Archivos en cPanel File Manager
3. Consola del navegador (F12) para errores de assets

---

**Última actualización**: Enero 2026
**Versión**: 2.0 - Doble Estructura
