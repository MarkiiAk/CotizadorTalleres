@echo off
echo ========================================
echo SAG Garage - Inicio Simple
echo ========================================
echo.

REM Iniciar backend en segundo plano
echo Iniciando backend...
cd backend
start /B npm run dev > backend.log 2>&1
cd ..

echo Esperando 5 segundos para que el backend inicie...
timeout /t 5 /nobreak

echo.
echo Iniciando frontend...
npm run dev

pause
