@echo off
echo ========================================
echo   SAG GARAGE - MODO FRONTEND SOLO
echo ========================================
echo.
echo Iniciando aplicacion sin backend...
echo Los datos se guardaran en localStorage
echo.
echo IMPORTANTE:
echo - No cerrar esta ventana
echo - La aplicacion se abrira en http://localhost:5173
echo - Usuario: admin
echo - Password: admin123
echo.

cd /d "%~dp0"

echo Verificando dependencias...
if not exist "node_modules" (
    echo Instalando dependencias...
    call npm install
    if errorlevel 1 (
        echo.
        echo ERROR: No se pudieron instalar las dependencias
        pause
        exit /b 1
    )
)

echo.
echo Iniciando servidor de desarrollo...
echo.

start "" "http://localhost:5173"
npm run dev

pause
