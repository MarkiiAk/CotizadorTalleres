@echo off
echo Iniciando servidor backend...
echo.
cd /d "%~dp0"
call npm run dev
pause
