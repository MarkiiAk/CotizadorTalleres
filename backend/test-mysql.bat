@echo off
echo ========================================
echo   PRUEBA DE BACKEND CON MYSQL
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] Compilando TypeScript...
call npm run build
if errorlevel 1 (
    echo.
    echo ❌ Error al compilar TypeScript
    pause
    exit /b 1
)

echo.
echo [2/3] Iniciando servidor backend...
echo.
echo ✅ Si ves "MySQL conectado" = Todo funciona perfecto
echo ⚠️  Si ves "MySQL no disponible" = Usando JSON como fallback
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

call npm run dev

pause
