# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

StudyHub is an early-stage ASP.NET Core Web API on .NET 10 (`net10.0`) with EF Core and MySQL. All .NET code is in `sources/`, and the solution file is `sources/StudyHub.slnx`, which uses the new XML solution format.

Coding conventions are in the `coding-conventions` skill (`.claude/skills/coding-conventions/SKILL.md`). Load it before writing or changing C# code.

## Commands

Run these from `sources/`:

```sh
dotnet build StudyHub.slnx
dotnet run --project Web.Api                    # http://localhost:5069 (launch profile "http")
dotnet run --project Web.Api --launch-profile https   # https://localhost:7150

# EF Core migrations: DbContext lives in Data.Database, Web.Api is the startup project
dotnet ef migrations add <Name> --project Data.Database --startup-project Web.Api
dotnet ef database update --project Data.Database --startup-project Web.Api
```

There are no test projects yet. The `/5 Tests/` solution folder is empty.

### Local infrastructure (Docker)

Docker files are in `docker/`. Start them before running the API:

- `docker/start.bat`: starts the containers with `docker compose up -d`.
- `docker/update.bat`: pulls new images and recreates the containers. Data is kept.
- `docker/delete.bat`: runs `down`, and asks whether to also remove the volumes.
- Without the batch files, use `docker compose -f docker/docker-compose.yml up -d` from the repo root.

| Service | Address | Matches config key |
|---|---|---|
| MySQL 8.4 | `localhost:3306`, DB `StudyHubContextDb`, user `DevUser` / `DevPassword123!` | `ConnectionStrings:StudyHubContext` |
| Mailpit | SMTP `localhost:1025`, UI http://localhost:8025 | `Email` |
| Seq | UI + ingestion http://localhost:5341 | `Seq:ServerUrl` |

The compose values mirror `Web.Api/appsettings.Development.json`. If you change one, change the other too.

## Architecture

The solution folders define the layers. Projects are named `<Layer>.<Name>`:

- `1 Web`: `Web.Api` is the host.
- `2 Logic`: business services. `Logic.Shared` holds cross-cutting services such as `IPasswordHasher` (bcrypt, registered in `AddLogicServices`).
- `3 Data`: `Data.Database` holds the EF Core `DatabaseContext`, entities and migrations. `Data.Accessor` is the data-access layer on top of the context: generic `RepositoryBase<TEntity>` / `IRepositoryBase<TEntity>` for any `AEntityBase` entity, registered as an open generic (scoped). Repository methods only stage changes; call `SaveChangesAsync` to write. Entity-specific repositories derive from `RepositoryBase` and use the protected `DbSet` / `Query()` for custom queries (e.g. `Include`). The MySQL provider package lives in `Data.Database`.
- `4 Shared`: `Shared.Models` holds DTOs and options classes (`Options/JwtOptions`, `Options/EmailOptions`). `Shared.Enums` holds enums.
- `5 Tests`: empty.

### Web.Api startup

The startup code is split into extension methods under `Web.Api/Bundels/`. The folder name is spelled that way.

- `Program.cs` calls only `AddAppServices(configuration)` and `await app.Configure()`.
- `AppServiceRegistration.cs` registers all DI services: the DbContext with `UseMySQL` and connection string `StudyHubContext`, the options bindings (`Jwt` → `JwtOptions`, `Email` → `EmailOptions`), CORS, controllers and OpenAPI. New services and options bindings belong here, and section names are kept as private consts.
- Logging uses Serilog, registered in `AddLoggingServices`. It writes to the console and to Seq (`Seq:ServerUrl`, bound to `SeqOptions`). Log levels come from the `Serilog:MinimumLevel` section in `appsettings.json`. The standard `Logging` section is not used.
- `AppConfiguration.cs` builds the middleware pipeline. It is controller-based (`MapControllers`), and OpenAPI is only exposed in Development.
- `DatabaseConfiguration.EnsureDatabaseUpToDate()` applies pending EF migrations automatically on startup. You don't need to run `dotnet ef database update` manually when running the API. MySQL must be running before the API starts.

### Config not wired up yet

- The CORS policy is `AllowAnyOrigin`. The `Cors:AllowedOrigins` section in appsettings is not read.
- JWT settings are bound to options, but authentication middleware is not registered yet. Only `UseAuthorization` is present.
