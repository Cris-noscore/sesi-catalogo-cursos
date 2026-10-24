using CatalogoCursos.Api.Contracts;
using CatalogoCursos.Api.Data;
using CatalogoCursos.Api.Infrastructure;
using CatalogoCursos.Api.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace CatalogoCursos.Api.Endpoints;

/// <summary>Mapeamento dos endpoints REST do catálogo (Minimal APIs).</summary>
public static class CatalogoEndpoints
{
    public static IEndpointRouteBuilder MapCatalogoEndpoints(this IEndpointRouteBuilder app)
    {
        var api = app.MapGroup("/api")
            .WithTags("Catálogo")
            .RequireRateLimiting(RateLimitPolicies.Api);

        api.MapGet("/cursos", ListarCursos)
            .WithName("ListarCursos")
            .WithSummary("Lista os cursos do catálogo")
            .WithDescription("Permite pesquisar pelo nome e filtrar por categoria, modalidade e status (combináveis). " +
                             "Filtros aceitam múltiplos slugs separados por vírgula. Retorna o total de resultados e a página solicitada.");

        api.MapGet("/cursos/{id:int}", ObterCurso)
            .WithName("ObterCurso")
            .WithSummary("Detalhes de um curso")
            .WithDescription("Retorna os dados completos do curso, incluindo módulos e aulas em ordem.");

        api.MapGet("/filtros", ObterFiltros)
            .WithName("ObterFiltros")
            .WithSummary("Opções de filtro")
            .WithDescription("Categorias, modalidades e status disponíveis, com a quantidade de cursos em cada opção.");

        app.MapGet("/health", VerificarSaude)
            .WithTags("Infraestrutura")
            .WithName("Health")
            .WithSummary("Verificação de saúde")
            .WithDescription("Confirma que a API está no ar e consegue acessar o banco de dados.");

        return app;
    }

    internal static async Task<Results<Ok<ResultadoPaginado<CursoResumoDto>>, ValidationProblem>> ListarCursos(
        [AsParameters] CursoConsulta consulta,
        ICursoService service,
        CancellationToken ct)
    {
        var erros = consulta.Validar();
        if (erros.Count > 0)
            return TypedResults.ValidationProblem(erros, title: "Parâmetros de consulta inválidos.");

        return TypedResults.Ok(await service.ListarAsync(consulta, ct));
    }

    internal static async Task<Results<Ok<CursoDetalheDto>, ProblemHttpResult>> ObterCurso(
        int id,
        ICursoService service,
        CancellationToken ct)
    {
        var curso = await service.ObterPorIdAsync(id, ct);
        return curso is null
            ? TypedResults.Problem(
                statusCode: StatusCodes.Status404NotFound,
                title: "Curso não encontrado.",
                detail: $"Não existe curso com o identificador {id}.")
            : TypedResults.Ok(curso);
    }

    internal static async Task<Ok<FiltrosDto>> ObterFiltros(ICursoService service, CancellationToken ct) =>
        TypedResults.Ok(await service.ObterFiltrosAsync(ct));

    internal static async Task<Results<Ok<SaudeDto>, ProblemHttpResult>> VerificarSaude(CatalogoDbContext db, CancellationToken ct)
    {
        var bancoOk = await db.Database.CanConnectAsync(ct);
        return bancoOk
            ? TypedResults.Ok(new SaudeDto("ok", "ok", DateTimeOffset.UtcNow))
            : TypedResults.Problem(statusCode: StatusCodes.Status503ServiceUnavailable, title: "Banco de dados indisponível.");
    }
}

public sealed record SaudeDto(string Status, string Banco, DateTimeOffset VerificadoEm);
