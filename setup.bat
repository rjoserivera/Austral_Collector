@echo off
SETLOCAL EnableDelayedExpansion

:: ============================================================
:: AUSTRAL COLLECTOR - Automated Setup Script
:: ============================================================
:: Este script automatiza la instalacion de dependencias y
:: prepara el entorno tras clonar el repositorio.
:: ============================================================

echo [1/4] Verificando entorno de Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no esta instalado. Por favor instalalo desde https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js detectado.

echo.
echo [2/4] Instalando dependencias del Frontend (NPM)...
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo [ERROR] Hubo un problema instalando las dependencias de Node.
    pause
    exit /b 1
)
echo [OK] Dependencias de Frontend listas.

echo.
echo [3/4] Verificando entorno de Python (para Tests)...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [AVISO] Python no detectado. Si planeas correr tests, instala Python y corre:
    echo        pip install -r requirements.txt
) else (
    echo [OK] Python detectado. Instalando requerimientos...
    pip install -r requirements.txt
    if !errorlevel! neq 0 (
        echo [AVISO] Hubo un problema con pip install. Verifica tu instalacion de Python.
    ) else (
        echo [OK] Requerimientos de Python instalados.
    )
)

echo.
echo [4/4] Instrucciones de Base de Datos...
echo ============================================================
echo IMPORTANTE: Para que el sistema funcione al 100%%, debes:
echo 1. Abrir XAMPP Control Panel e iniciar MySQL.
echo 2. Entrar a phpMyAdmin y crear una DB vacia: austral_collector_db
echo 3. Importar el archivo: austral_collector_backup.sql
echo.
echo TIP: Puedes intentar importar la DB directamente con este comando:
echo "C:\xampp\mysql\bin\mysql.exe" -u root austral_collector_db ^< austral_collector_backup.sql
echo ============================================================

echo.
echo [FINALIZADO] El entorno base esta listo.
echo Para iniciar la plataforma, escribe: npm run dev
echo.
pause
