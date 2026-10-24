using System.Threading.RateLimiting;
using CatalogoCursos.Api.Data;
using CatalogoCursos.Api.Endpoints;
using CatalogoCursos.Api.Infrastructure;
using CatalogoCursos.Api.Services;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Plataformas como o Render informam a porta pela variável PORT.
var porta = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrWhiteSpace(porta))
    builder.WebHost.UseUrls($"http://0.0.0.0:{porta}");

// ---------------------------------------------------------------------------
// Banco de dados (PostgreSQL via EF Core / Npgsql)
// ---------------------------------------------------------------------------
var connectionStringBruta = builder.Configuration.GetConnectionString("Default")
    ?? Environment.GetEnvironmentVariable("DATABASE_URL")
    ?? throw new InvalidOperationException(
        "Configure a string de conexão em ConnectionStrings:Default (ou na variável DATABASE_URL).");
var connectionString = ConnectionStringHelper.Normalizar(connectionStringBruta);

builder.Services.AddDbContext<CatalogoDbContext>(options =>
    options.UseNpgsql(connectionString, npgsql => npgsql.EnableRetryOnFailure(3)));

// ---------------------------------------------------------------------------
// Serviços da aplicação
// ---------------------------------------------------------------------------
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICursoService, CursoService>();
builder.Services.AddSingleton<IUrlImagens, UrlImagens>();
builder.Services.AddProblemDetails();
builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer((document, _, _) =>
    {
        document.Info.Title = "API Catálogo de Cursos — CTED";
        document.Info.Version = "v1";
        document.Info.Description =
            "API REST para consulta do catálogo de cursos do ambiente virtual de aprendizagem (Moodle). " +
            "Projeto desenvolvido para o processo seletivo de Desenvolvedor de Sistemas I. Todos os dados são fictícios.";
        return Task.CompletedTask;
    });
});

// CORS: origens permitidas configuráveis (ex.: Cors__AllowedOrigins__0=https://meu-front.vercel.app)
var origensPermitidas = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        if (origensPermitidas.Length == 0 || origensPermitidas.Contains("*"))
            policy.AllowAnyOrigin();
        else
            policy.WithOrigins(origensPermitidas);

        policy.WithMethods("GET").AllowAnyHeader();
    });
});

// Limite de requisições por IP para proteger a API pública.
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddPolicy(RateLimitPolicies.Api, httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            httpContext.Connection.RemoteIpAddress?.ToString() ?? "desconhecido",
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = builder.Configuration.GetValue("RateLimit:PermitLimit", 120),
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0,
            }));
});

// Atrás de proxy reverso (Render, Docker), respeita X-Forwarded-For / X-Forwarded-Proto.
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownIPNetworks.Clear();
    options.KnownProxies.Clear();
});

builder.Services.AddResponseCompression(options => options.EnableForHttps = true);

var app = builder.Build();

// ---------------------------------------------------------------------------
// Migrações (scripts SQL versionados) na inicialização
// ---------------------------------------------------------------------------
if (app.Configuration.GetValue("Database:ApplyMigrationsOnStartup", true))
{
    var migrator = new DatabaseMigrator(connectionString, app.Services.GetRequiredService<ILogger<DatabaseMigrator>>());
    await migrator.MigrarAsync();
}

// ---------------------------------------------------------------------------
// Pipeline HTTP
// ---------------------------------------------------------------------------
app.UseForwardedHeaders();
app.UseExceptionHandler();
app.UseStatusCodePages();
app.UseResponseCompression();
app.UseCors();
app.UseRateLimiter();

// Imagens dos cursos e ícones das categorias (wwwroot/imagens), com cache de 7 dias.
app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
        ctx.Context.Response.Headers.CacheControl = "public,max-age=604800";
        ctx.Context.Response.Headers.AccessControlAllowOrigin = "*";
    },
});

app.MapOpenApi();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/openapi/v1.json", "Catálogo de Cursos v1");
    options.RoutePrefix = "swagger";
    options.DocumentTitle = "API Catálogo de Cursos — CTED";
});

app.MapGet("/", () => Results.Redirect("/swagger")).ExcludeFromDescription();
app.MapCatalogoEndpoints();

app.Run();

/// <summary>Exposto para os testes de integração (WebApplicationFactory).</summary>
public partial class Program;
