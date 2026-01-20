# 📦 Guía de Deployment - SAG Garage

Esta guía te ayudará a desplegar tu aplicación de presupuestos en diferentes plataformas.

## 🌐 Deployment en Neubox

### Paso 1: Preparar el Build
```bash
cd sag-garage-presupuestos
npm run build
```

Este comando generará una carpeta `dist/` con todos los archivos optimizados para producción.

### Paso 2: Subir Archivos
1. Accede al panel de control de Neubox
2. Ve a la sección de "Administrador de Archivos"
3. Navega a la carpeta `public_html` o la carpeta raíz de tu dominio
4. Sube TODO el contenido de la carpeta `dist/` (no la carpeta en sí, sino su contenido)

### Paso 3: Configuración del Dominio
Asegúrate de que tu dominio apunte correctamente a la carpeta donde subiste los archivos.

### Estructura de Archivos en el Servidor
```
public_html/
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
├── index.html
└── (otros archivos)
```

## 🔧 Configuración Opcional

### Archivo .htaccess para Apache
Si Neubox usa Apache, crea un archivo `.htaccess` en la raíz con:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Habilitar compresión
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Cache de archivos estáticos
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
</IfModule>
```

## 🚀 Otras Opciones de Deployment

### Netlify (Alternativa Recomendada)
```bash
# Instalar CLI de Netlify
npm install -g netlify-cli

# Deploy
npm run build
netlify deploy --prod --dir=dist
```

### Vercel
```bash
# Instalar CLI de Vercel
npm install -g vercel

# Deploy
vercel --prod
```

### GitHub Pages
1. Instala gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Agrega al `package.json`:
```json
{
  "homepage": "https://[tu-usuario].github.io/[tu-repo]",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Deploy:
```bash
npm run deploy
```

## ✅ Verificación Post-Deployment

Después de hacer el deployment, verifica:

1. ✓ La página carga correctamente
2. ✓ El tema oscuro/claro funciona
3. ✓ Puedes agregar servicios, refacciones y mano de obra
4. ✓ Los cálculos se realizan correctamente
5. ✓ El autoguardado funciona (localStorage)
6. ✓ La garantía se puede aceptar/revocar
7. ✓ El diseño responsive funciona en móviles

## 🔄 Actualizaciones Futuras

Para actualizar la aplicación:

1. Haz los cambios en tu código local
2. Ejecuta `npm run build`
3. Sube los nuevos archivos de `dist/` reemplazando los anteriores
4. Limpia el caché del navegador (Ctrl + F5)

## 🐛 Solución de Problemas

### La página muestra "404 Not Found"
- Verifica que subiste el `index.html` a la carpeta correcta
- Asegúrate de que el dominio apunta a la carpeta correcta

### Los estilos no se cargan
- Verifica que la carpeta `assets/` se subió correctamente
- Limpia el caché del navegador

### El localStorage no funciona
- Asegúrate de que el sitio use HTTPS
- Verifica la configuración de privacidad del navegador

### Errores de CORS
- No deberías tener problemas de CORS ya que todo es estático
- Si usas APIs externas en el futuro, configura los headers CORS

## 📊 Monitoreo

### Google Analytics (Opcional)
Agrega a `index.html` antes de `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=TU-ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'TU-ID');
</script>
```

## 🔐 Seguridad

Recomendaciones:
- ✓ Usa HTTPS (Neubox lo proporciona con Let's Encrypt)
- ✓ Los datos se guardan localmente en el navegador del usuario
- ✓ No se envía información sensible a servidores externos
- ✓ Mantén las dependencias actualizadas: `npm audit fix`

## 💡 Tips de Performance

1. **Caché del navegador**: Ya configurado en el build de Vite
2. **Compresión**: Configurada en `.htaccess` (si usas Apache)
3. **CDN**: Considera usar Cloudflare para mejorar velocidad global
4. **Lazy Loading**: Ya implementado por Vite automáticamente

---

¿Necesitas ayuda? Revisa los logs del servidor o contacta al soporte de tu hosting.
