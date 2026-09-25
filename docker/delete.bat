@echo off
rem Removes the containers. Optionally also deletes the data volumes (database and logs).
cd /d "%~dp0"

choice /C YN /N /M "Also delete all data (MySQL database, Seq logs)? [Y/N] "
if errorlevel 2 goto :keepdata

docker compose down -v
if errorlevel 1 goto :error
echo.
echo Containers and data removed.
goto :end

:keepdata
docker compose down
if errorlevel 1 goto :error
echo.
echo Containers removed, data kept.
goto :end

:error
echo.
echo Removing the containers failed. Is Docker Desktop running?

:end
echo.
pause
