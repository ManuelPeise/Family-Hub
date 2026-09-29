@echo off
rem Pulls the latest images, rebuilds the API and web app on fresh base images and recreates changed containers (data volumes are kept)
cd /d "%~dp0"

docker compose pull --ignore-buildable
if errorlevel 1 goto :error

docker compose build --pull
if errorlevel 1 goto :error

docker compose up -d --remove-orphans
if errorlevel 1 goto :error

docker image prune -f

echo.
docker compose ps
goto :end

:error
echo.
echo Updating the containers failed. Is Docker Desktop running?

:end
echo.
pause
