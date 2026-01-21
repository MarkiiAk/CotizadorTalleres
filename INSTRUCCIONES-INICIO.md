# 🚀 INSTRUCCIONES DE INICIO - SAG GARAGE

## ⚡ MÉTODO RÁPIDO (RECOMENDADO)

### Opción 1: Solo Frontend (Más Simple)
Si no necesitas sincronización entre dispositivos o bases de datos:

1. **Doble clic en:** `start-frontend-only.bat`
2. **Espera** a que se abra el navegador automáticamente
3. **Credenciales:**
   - Usuario: `admin`
   - Contraseña: `admin123`

✅ **Ventajas:**
- Inicio instantáneo
- No requiere backend
- Datos guardados en el navegador (localStorage)
- Perfecto para uso en un solo equipo

---

## 🔧 MÉTODO COMPLETO (Con Backend)

### Opción 2: Frontend + Backend
Si necesitas guardar datos en archivos JSON o acceder desde múltiples dispositivos:

1. **Doble clic en:** `start-dev.bat`
2. **Espera** a que se inicien ambos servicios
3. El navegador se abrirá automáticamente
4. **Credenciales:**
   - Usuario: `admin`
   - Contraseña: `admin123`

✅ **Ventajas:**
- Datos persistentes en archivos
- Acceso desde múltiples dispositivos en red local
- Backup automático de ordenes

---

## 🔍 SOLUCIÓN DE PROBLEMAS

### ❌ Si el backend no inicia:
1. Cierra todas las ventanas de terminal
2. Ejecuta: `restart-backend.bat`
3. Si persiste, usa `start-frontend-only.bat`

### ❌ Si aparece error de puerto ocupado:
1. Cierra todas las aplicaciones Node.js
2. Abre el Administrador de Tareas
3. Busca procesos "Node.js" y termínalos
4. Vuelve a ejecutar el script

### ❌ Si no se instalan las dependencias:
```bash
# Ejecuta en terminal:
npm install

# Si falla, intenta:
npm cache clean --force
npm install
```

---

## 📊 COMPARACIÓN DE MÉTODOS

| Característica | Solo Frontend | Frontend + Backend |
|---------------|---------------|-------------------|
| Velocidad inicio | ⚡ Muy rápida | 🔄 Media |
| Complejidad | ✅ Mínima | ⚙️ Media |
| Persistencia datos | 💾 Navegador | 📁 Archivos JSON |
| Multi-dispositivo | ❌ No | ✅ Sí |
| Requiere internet | ❌ No | ❌ No (solo red local) |
| Backup automático | ❌ No | ✅ Sí |

---

## 💡 RECOMENDACIONES

### Para uso personal en un solo equipo:
👉 Usa `start-frontend-only.bat`

### Para taller con varios usuarios:
👉 Usa `start-dev.bat`

### Para desarrollo o pruebas:
👉 Usa `start-dev.bat`

---

## 🎯 PRIMERA VEZ

1. Ejecuta el método que prefieras
2. Inicia sesión con las credenciales predeterminadas
3. Comienza a crear órdenes de servicio
4. Los datos se guardarán automáticamente

---

## 📞 SOPORTE

Si tienes problemas:
1. Revisa esta guía
2. Verifica que Node.js esté instalado
3. Intenta el método "Solo Frontend" primero
4. Si persiste, contacta al equipo de desarrollo

---

**Última actualización:** Enero 2026
**Versión:** 2.0.0
