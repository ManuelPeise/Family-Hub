@echo off
rem Builds the API and web app images and starts all containers (MySQL, Mailpit, Seq, API, web app).
rem Run it again after code changes: only changed images are rebuilt.
cd /d "%~dp0"

docker compose up -d --build
if errorlevel 1 goto :error

echo.
docker compose ps
echo.
echo Web app: http://localhost:8080
echo API:     http://localhost:5080/swagger
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
