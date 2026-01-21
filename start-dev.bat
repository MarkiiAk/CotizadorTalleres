@echo off
echo ========================================
echo SAG Garage - Sistema de Presupuestos
echo Iniciando en modo desarrollo...
echo ========================================
echo.

REM Verificar si node está instalado
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js no está instalado
    echo Por favor instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)

REM Verificar si las dependencias del frontend están instaladas
if not exist "node_modules" (
    echo Instalando dependencias del frontend...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: No se pudieron instalar las dependencias del frontend
        pause
        exit /b 1
    )
)

REM Verificar si las dependencias del backend están instaladas
if not exist "backend\node_modules" (
    echo Instalando dependencias del backend...
    cd backend
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: No se pudieron instalar las dependencias del backend
        pause
        exit /b 1
    )
    cd ..
)

echo.
echo Iniciando servidor backend en puerto 3001...
start "SAG Backend" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak >nul

echo Iniciando aplicación frontend en puerto 5173...
start "SAG Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo Sistema iniciado correctamente!
echo ========================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:5173
echo.
echo Credenciales de prueba:
echo Usuario: admin@saggarage.com
echo Password: admin123
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
echo (Los servidores seguirán ejecutándose en sus ventanas)
pause >nul
