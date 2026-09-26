# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

FamilyHub is an early-stage ASP.NET Core Web API on .NET 10 (`net10.0`) with EF Core and MySQL. All .NET code is in `sources/`, and the solution file is `sources/FamilyHub.slnx`, which uses the new XML solution format.

Coding conventions are in the `coding-conventions` skill (`.claude/skills/coding-conventions/SKILL.md`). Load it before writing or changing C# code.

## Commands

Run these from `sources/`:

```sh
dotnet build FamilyHub.slnx
dotnet run --project Web.Api                    # http://localhost:5069 (launch profile "http")
dotnet run --project Web.Api --launch-profile https   # https://localhost:7150

# EF Core migrations: the contexts live in Data.Database, Web.Api is the startup project
dotnet ef migrations add <Name> --context IdentityDbContext --project Data.Database --startup-project Web.Api -o Identity/Migrations
dotnet ef migrations add <Name> --context FamilyHubDbContext --project Data.Database --startup-project Web.Api -o FamilyHub/Migrations
```

There are no test projects yet. The `/5 Tests/` solution folder is empty.

Web.IdentityServer (https://localhost:5001) has its own contexts. Pass the context and output folder:

```sh
dotnet run --project Web.IdentityServer
dotnet ef migrations add <Name> --context IdentityServerDbContext              --project Data.Database --startup-project Web.IdentityServer -o IdentityServer/Migrations/Identity
dotnet ef migrations add <Name> --context IdentityServerConfigurationDbContext --project Data.Database --startup-project Web.IdentityServer -o IdentityServer/Migrations/Configuration
dotnet ef migrations add <Name> --context PersistedGrantDbContext              --project Data.Database --startup-project Web.IdentityServer -o IdentityServer/Migrations/PersistedGrant
```

### Local infrastructure (Docker)

Docker files are in `docker/`. Start them before running the API:

- `docker/start.bat`: starts the containers with `docker compose up -d`.
- `docker/update.bat`: pulls new images and recreates the containers. Data is kept.
- `docker/delete.bat`: runs `down`, and asks whether to also remove the volumes.
- Without the batch files, use `docker compose -f docker/docker-compose.yml up -d` from the repo root.

| Service | Address | Matches config key |
|---|---|---|
| MySQL 8.4 | `localhost:3306`, DBs `FamilyHubContextDb` and `IdentityContextDb` (created by `docker/mysql-init/` on first start), user `DevUser` / `DevPassword123!` | `ConnectionStrings:FamilyHubContext`, `ConnectionStrings:IdentityContext` |
| Mailpit | SMTP `localhost:1025`, UI http://localhost:8025 | `Email` |
| Seq | UI + ingestion http://localhost:5341 | `Seq:ServerUrl` |

The compose values mirror `Web.Api/appsettings.Development.json`. If you change one, change the other too.

## Architecture

The solution folders define the layers. Projects are named `<Layer>.<Name>`:

- `1 Web`: `Web.Api` is the API host. `Web.IdentityServer` is the headless token server, and `Web.IdentityServerUi` is its React UI.
- `2 Logic`: business services. `Logic.Shared` holds cross-cutting services such as `IPasswordHasher` (bcrypt, registered in `AddLogicServices`), `IEmailSender` (MailKit) and `ServiceResult`. `Logic.IdentityServer` holds the account and admin services.
- `3 Data`: `Data.Database` holds the EF Core `DatabaseContext`, entities and migrations. `Data.Accessor` is the data-access layer on top of the context: abstract `RepositoryBase<TContext, TEntity>` implements `IRepositoryBase<TEntity>` for any `AEntityBase` entity. Each context has a generic repository registered as an open generic (scoped): `IIdentityRepository<TEntity>` → `IdentityRepository<TEntity>` (`IdentityDbContext`) and `IFamilyHubRepository<TEntity>` → `FamilyHubRepository<TEntity>` (`FamilyHubDbContext`). Repository methods only stage changes; call `SaveChangesAsync` to write. Entity-specific repositories derive from `RepositoryBase<TContext, TEntity>` and use the protected `Context` / `DbSet` / `Query()` for custom queries (e.g. `Include`). The MySQL provider package lives in `Data.Database`.
- `4 Shared`: `Shared.Models` holds DTOs and options classes (`Options/JwtOptions`, `Options/EmailOptions`). `Shared.Enums` holds enums.
- `5 Tests`: empty.

### Web.Api startup

The startup code is split into extension methods under `Web.Api/Bundels/`. The folder name is spelled that way.

- `Program.cs` calls only `AddAppServices(configuration)` and `await app.Configure()`.
- `AppServiceRegistration.cs` registers all DI services: the DbContext with `UseMySQL` and connection string `FamilyHubContext`, the options bindings (`Jwt` → `JwtOptions`, `Email` → `EmailOptions`), CORS, controllers and OpenAPI. New services and options bindings belong here, and section names are kept as private consts.
- Logging uses Serilog, registered in `AddLoggingServices`. It writes to the console and to Seq (`Seq:ServerUrl`, bound to `SeqOptions`). Log levels come from the `Serilog:MinimumLevel` section in `appsettings.json`. The standard `Logging` section is not used.
- `AppConfiguration.cs` builds the middleware pipeline. It is controller-based (`MapControllers`; controllers derive from `ApiControllerBase`, which carries `[ApiController]` so they appear in OpenAPI). In Development only, the built-in OpenAPI document is served at `/openapi/v1.json` and Swagger UI at `/swagger`, which `/` redirects to and the launch profiles open (Swashbuckle UI only; the document comes from `AddOpenApi`, with the transformers in `Web.Api/Service/OpenApi/`).
- `DatabaseConfiguration.EnsureDatabasesUpToDate()` applies pending EF migrations automatically on startup. You don't need to run `dotnet ef database update` manually when running the API. MySQL must be running before the API starts.
- `DatabaseConfiguration.SeedDefaultAdmin()` runs after the migrations and calls `IDefaultAdminSeeder` (`Logic.Authentication`). If no user has the Admin role, it creates one from the `Admin` section (`AdminOptions`), and startup fails if that section is incomplete. Once an admin exists, the section is not needed.

### Web.IdentityServer (headless Duende IdentityServer)

- It has no server-rendered UI. The React app `Web.IdentityServerUi` (https://localhost:53838, not built yet) provides the screens. `UserInteraction.LoginUrl`/`LogoutUrl`/`ErrorUrl` are absolute URLs into that app, built from the `IdentityServerUi` section. Duende passes an absolute `ReturnUrl` query parameter (`AllowOriginInReturnUrl` is on).
- The UI calls JSON controllers with `credentials: 'include'`. The `IdentityServerUi` CORS policy lives on `ApiControllerBase`:
  - `api/account`: `login` returns `{ redirectUrl }` for the UI to navigate to, plus `logout` (GET context / POST), `register`, `confirm-email`, `forgot-password` and `reset-password`. Mails go out through `IEmailSender` (Mailpit in dev).
  - `api/admin/clients|api-scopes|identity-resources`: CRUD, protected by the `Admin` policy (role `admin`). `POST clients/{id}/secrets` adds a hashed secret.
- Errors come back as ProblemDetails with an `errorCode` extension (see `AccountErrorCodes`). Services return `ServiceResult` (`Logic.Shared/Results`).
- Users are stored with ASP.NET Core Identity (`ApplicationUser`, `IdentityServerDbContext`). Clients, scopes and grants use Duende's EF stores (`IdentityServerConfigurationDbContext`, which stores a primitive list as JSON for the MySQL provider, and `PersistedGrantDbContext`). All three share connection string `IdentityServerContext` (the same DB as the API for now), with one migrations history table each.
- On startup it migrates all three contexts, seeds identity resources, the `familyhub.api` scope and the `WebClient` client when their tables are empty, and seeds role `admin` plus the `Admin` user.
- Startup follows the Web.Api pattern: `Bundels/AppServiceRegistration.cs`, `AppConfiguration.cs`, `DatabaseConfiguration.cs`. Admin controllers and services derive from the generic `ConfigurationAdmin*Base` classes, and the accessors from `ConfigurationAccessorBase`.

### Config not wired up yet

- The CORS policy is `AllowAnyOrigin`. The `Cors:AllowedOrigins` section in appsettings is not read.
- JWT bearer authentication is wired up (`AddJwtAuthentication`, `UseAuthentication`). Protect endpoints with `[ApiAuthentication]` (any valid token) or `[ApiAuthentication(UserRoleEnum.User)]` (role, Admin always passes). Token creation and validation share `Logic.Authentication/JwtTokenParameters`.
