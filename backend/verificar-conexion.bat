@echo off
chcp 65001 >nul
color 0A
cls

echo.
echo ╔════════════════════════════════════════╗
echo ║   VERIFICADOR DE CONEXIÓN A MYSQL     ║
echo ╚════════════════════════════════════════╝
echo.
echo Este script te mostrará:
echo  ✓ Si MySQL está conectado o no
echo  ✓ Cuántos registros hay en cada fuente
echo  ✓ De dónde está tomando los datos
echo.
echo ════════════════════════════════════════
echo.

cd /d "%~dp0"

node -e "const mysql = require('mysql2/promise'); const dotenv = require('dotenv'); const fs = require('fs'); dotenv.config(); async function verificar() { console.log('🔍 Verificando conexión...'); console.log(''); console.log('📋 Configuración del .env:'); console.log('   DB_HOST:', process.env.DB_HOST); console.log('   DB_USER:', process.env.DB_USER); console.log('   DB_NAME:', process.env.DB_NAME); console.log(''); try { const connection = await mysql.createConnection({ host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME, connectTimeout: 5000 }); console.log('✅ MYSQL CONECTADO'); console.log(''); const [users] = await connection.execute('SELECT COUNT(*) as count FROM users'); const [ordenes] = await connection.execute('SELECT COUNT(*) as count FROM ordenes'); console.log('📊 Registros en MySQL:'); console.log('   Users:', users[0].count); console.log('   Ordenes:', ordenes[0].count); await connection.end(); } catch (error) { console.log('❌ MYSQL NO CONECTADO'); console.log('   Razón:', error.code || error.message); console.log(''); console.log('📁 Usando archivos JSON como fallback'); } console.log(''); const jsonPath = './data/ordenes.json'; if (fs.existsSync(jsonPath)) { const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8')); console.log('📊 Registros en JSON:'); console.log('   Users:', data.users?.length || 0); console.log('   Ordenes:', data.ordenes?.length || 0); } console.log(''); console.log('════════════════════════════════════════'); console.log(''); console.log('💡 CONCLUSIÓN:'); if (process.env.DB_HOST === 'localhost') { console.log('   Estás en modo DESARROLLO LOCAL'); console.log('   MySQL local no está corriendo'); console.log('   → Sistema usando JSON (normal)'); } else { console.log('   Estás configurado para PRODUCCIÓN'); console.log('   Intenta conectar a:', process.env.DB_HOST); } console.log(''); } verificar();"

echo.
echo.
pause