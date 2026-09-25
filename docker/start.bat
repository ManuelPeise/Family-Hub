@echo off
rem Starts MySQL, Mailpit and Seq (creates the containers if they don't exist yet)
cd /d "%~dp0"

docker compose up -d
if errorlevel 1 goto :error

echo.
docker compose ps
echo.
echo MySQL:   localhost:3306
echo Mailpit: http://localhost:8025  (SMTP localhost:1025)
echo Seq:     http://localhost:5341
goto :end

:error
echo.
echo Starting the containers failed. Is Docker Desktop running?

:end
echo.
pause
