# Study-Hub

## Local infrastructure

MySQL, Mailpit and Seq for local development are defined in `docker/docker-compose.yml`.
The settings match `sources/Web.Api/appsettings.Development.json`.

On Windows, use the batch files in `docker/` (double-click or run from any folder):

- `start.bat`: create and start the containers
- `update.bat`: pull the latest images and recreate the containers (keeps data)
- `delete.bat`: remove the containers and ask whether to delete the data too

Or use Docker Compose directly:

```sh
docker compose -f docker/docker-compose.yml up -d   # start MySQL (localhost:3306), Mailpit (SMTP localhost:1025) and Seq
docker compose -f docker/docker-compose.yml ps      # check status (mysql should show "healthy")
docker compose -f docker/docker-compose.yml down    # stop, keep data
docker compose -f docker/docker-compose.yml down -v # stop and wipe the database and logs
```

- Mailpit web UI: http://localhost:8025
- Seq log UI: http://localhost:5341 (no login in development)
- Database: `StudyHubContextDb`, user `DevUser` / `DevPassword123!` (development only)
