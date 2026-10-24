using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;

namespace CatalogoCursos.Api.Tests;

/// <summary>
/// Sobe a API em memória apontando para um PostgreSQL real.
/// Banco usado: variável TEST_DATABASE_URL, ou o PostgreSQL do docker-compose
/// (localhost:5432, banco catalogo_testes). No GitHub Actions, um container de
/// serviço PostgreSQL é criado para cada execução.
/// </summary>
public sealed class ApiFactory : WebApplicationFactory<Program>
{
    public static string ConnectionString =>
        Environment.GetEnvironmentVariable("TEST_DATABASE_URL")
        ?? "Host=localhost;Port=5432;Database=catalogo_testes;Username=postgres;Password=postgres";

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.UseSetting("ConnectionStrings:Default", ConnectionString);
        builder.UseSetting("Database:ApplyMigrationsOnStartup", "true");
        builder.UseSetting("RateLimit:PermitLimit", "10000");
    }
}

[CollectionDefinition(Nome)]
public sealed class ApiCollection : ICollectionFixture<ApiFactory>
{
    public const string Nome = "api";
}
