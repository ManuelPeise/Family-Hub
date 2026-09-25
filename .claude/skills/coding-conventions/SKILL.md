---
name: coding-conventions
description: StudyHub C# coding conventions (layout, naming, namespaces, DI registration, options, file format, Git line endings). Use before writing or modifying any C# code, csproj, or appsettings in this repository, including new projects, services, controllers, entities and options classes.
---

# StudyHub coding conventions

Follow these rules when writing or changing code in `sources/`. If existing code breaks a rule, match the rule, not the exception.

## Solution and projects

- Every project uses `net10.0`, `<Nullable>enable</Nullable>` and `<ImplicitUsings>enable</ImplicitUsings>`.
- Name projects `<Layer>.<Name>`, for example `Web.Api`, `Data.Database` or `Shared.Models`. Put each project in its layer folder in `sources/StudyHub.slnx`:
  - `/1 Web/`: hosts and the API.
  - `/2 Logic/`: business services.
  - `/3 Data/`: `Data.Database` holds the DbContext, entities and migrations. `Data.Accessor` holds data access.
  - `/4 Shared/`: `Shared.Models` holds DTOs and options. `Shared.Enums` holds enums.
  - `/5 Tests/`: test projects.
- Dependencies point downward only: Web → Logic → Data → Shared. Shared projects reference nothing else in the solution.
- Keep EF Core package versions the same in every project. They are currently `10.0.12`.

## C# style

- Use **block-scoped namespaces**, not file-scoped. The namespace equals the project name plus the folder path:
  ```csharp
  namespace Shared.Models.Options
  {
      public class EmailOptions
      {
      }
  }
  ```
- Put braces on their own line (Allman style) and indent with 4 spaces.
- Put `using` directives at the top, outside the namespace. Don't repeat usings that implicit usings already cover.
- Use `var` when the type is obvious from the right-hand side.
- Chain fluent calls with one call per line, aligned under the first call:
  ```csharp
  builder.AllowAnyOrigin()
         .AllowAnyMethod()
         .AllowAnyHeader();
  ```
- Throw a clear exception when required configuration is missing, and don't silently fall back to a default:
  ```csharp
  var connectionString = configuration.GetConnectionString(ConnectionStringName)
      ?? throw new InvalidOperationException($"Connection string '{ConnectionStringName}' not found.");
  ```
- Use `async`/`await` all the way down. Don't use `.Result` or `.Wait()`.

## Naming

- Private fields start with `_` followed by camelCase:
  ```csharp
  private readonly int _number;
  private readonly DatabaseContext _context;
  ```
- Public properties use PascalCase:
  ```csharp
  public string FromAddress { get; set; } = null!;
  ```

## Avoid duplication

- Before writing new code, search the solution for an existing method, extension or model that already does the job, and reuse it.
- When the same logic would appear a second time, extract it into a shared method, base class or extension method and use it in both places:
  - If it is used within one project, put it in that project.
  - If more than one project needs it, put it in the lowest layer that all of them reference, such as `Shared.*`.
- Put repeated literals such as config section names, connection string names and route prefixes in a `const` or options class. Don't repeat string literals.
- Only extract when the code really means the same thing. Code that looks alike but changes for different reasons can stay separate, and a trivial one-liner doesn't need its own abstraction.

## Dependency injection

- Every service must be resolved through DI. Never create a service with `new` inside another class. The same goes for repositories, accessors, `DbContext` and HTTP clients.
- Use **constructor injection**, and store each dependency in a `private readonly` field:
  ```csharp
  public class StudyService : IStudyService
  {
      private readonly IStudyAccessor _studyAccessor;

      public StudyService(IStudyAccessor studyAccessor)
      {
          _studyAccessor = studyAccessor;
      }
  }
  ```
- Register every service behind an interface (`IStudyService` → `StudyService`) in `AppServiceRegistration`, and inject the interface, not the concrete class.
- Choose lifetimes deliberately:
  - `Scoped` is the default for anything that uses `DatabaseContext`.
  - `Singleton` is only for stateless, thread-safe services.
  - `Transient` is for lightweight, stateless helpers.
  - A singleton must never depend on a scoped service.
- Read configuration through `IOptions<TOptions>` (see Configuration and options), not by injecting `IConfiguration` into services.
- Don't resolve services from `IServiceProvider` inside business code. The one exception is startup code that runs outside a request, such as `EnsureDatabaseUpToDate`, which uses `CreateScope()`.
- Don't use static classes for logic that has dependencies or state. Static is fine for extension methods and pure helpers.

## Web.Api startup (`Web.Api/Bundels/`)

- Keep `Program.cs` minimal. It should only call `builder.Services.AddAppServices(builder.Configuration)` and `await app.Configure()`.
- Register every service in `AppServiceRegistration.AddAppServices`. Group related registrations in a `private static void Add<Area>Services(this IServiceCollection services, ...)` extension method and call it from `AddAppServices`.
- Add middleware in `AppConfiguration.Configure`. Put any larger piece of setup in a `private static` extension method.
- Make the startup classes `internal static`. Only make them `public` when another project needs them.
- Use controllers (`MapControllers`), not minimal-API endpoints.

## Configuration and options

- Define options classes in `Shared.Models/Options/` with the name `<Section>Options`.
- Give options classes plain `{ get; set; }` properties. Initialize non-nullable reference properties with `= null!`.
- Bind options with `services.Configure<TOptions>(configuration.GetSection(<Const>))` in `AddOptionModels`. Keep each section name in a `private const string <Name>SectionName`.
- Every new setting in `appsettings.Development.json` must work with the local Docker containers (`docker/docker-compose.yml`). Keep the two files in sync.

## Data

- There is a single `DatabaseContext` in `Data.Database`.
- Change the schema only through EF Core migrations:
  ```sh
  dotnet ef migrations add <Name> --project Data.Database --startup-project Web.Api
  ```
  Migrations are applied automatically when the API starts, in `DatabaseConfiguration.EnsureDatabaseUpToDate`.

## File format

- Save `.cs` files as UTF-8 **with BOM**, which is what Visual Studio produces.
- Don't commit `bin/`, `obj/` or `*.csproj.user` changes.

## Line endings (Git)

- **The repository stores LF only.** Every text file in the Git index must have LF line endings. Never commit CRLF.
- **The working copy uses the platform's line endings.** On Windows, files are checked out with CRLF and converted back to LF on commit, as enforced by `.gitattributes` (`* text=auto`). Don't rely on the local `core.autocrlf` setting. Write `.cs`, `.csproj`, `.json` and `.slnx` files with CRLF in the working copy, matching the files around them.
- **Exceptions** (also enforced by `.gitattributes`; add new file types there):
  - `.bat` and `.cmd` files must stay CRLF in the working copy, or `cmd.exe` can misread labels and `goto`.
  - `.sh` files must stay LF in the working copy, or the shell in a Linux container fails.
- **One line ending per file.** Never mix CRLF and LF in the same file.
- **Only change the lines you edit.** Never reformat the line endings of a whole file as part of a code change. A line-ending-only change goes in its own commit.
- **Check before committing:**
  ```sh
  git ls-files --eol <files>     # index column must show i/lf
  git diff --cached --check      # flags trailing whitespace and stray CR characters
  ```
  If a staged file shows `i/crlf`, run `git add --renormalize <file>` before committing.
