using System.Net;
using System.Net.Http.Json;
using CatalogoCursos.Api.Contracts;
using Microsoft.AspNetCore.Mvc;

namespace CatalogoCursos.Api.Tests;

/// <summary>
/// Testes de integração ponta a ponta (HTTP → API → EF Core → PostgreSQL).
/// Também verificam os requisitos mínimos de dados do edital.
/// </summary>
[Collection(ApiCollection.Nome)]
public sealed class CursosEndpointsTests(ApiFactory factory)
{
    private readonly HttpClient _client = factory.CreateClient();

    private async Task<ResultadoPaginado<CursoResumoDto>> ListarAsync(string query = "")
    {
        var resposta = await _client.GetAsync($"/api/cursos{query}");
        Assert.Equal(HttpStatusCode.OK, resposta.StatusCode);
        return (await resposta.Content.ReadFromJsonAsync<ResultadoPaginado<CursoResumoDto>>())!;
    }

    // ---------- Requisitos mínimos de dados (item 4.b do edital) ----------

    [Fact]
    public async Task Catalogo_atende_quantidades_minimas_do_edital()
    {
        var cursos = await ListarAsync("?tamanhoPagina=50");
        var filtros = (await _client.GetFromJsonAsync<FiltrosDto>("/api/filtros"))!;

        Assert.True(cursos.Total >= 6, "mínimo de 6 cursos");
        Assert.True(filtros.Categorias.Count(c => c.Total > 0) >= 3, "mínimo de 3 categorias em uso");
        Assert.True(filtros.Modalidades.Count(m => m.Total > 0) >= 2, "mínimo de 2 modalidades em uso");
        Assert.True(filtros.Status.Count(s => s.Total > 0) >= 3, "mínimo de 3 status em uso");
        Assert.True(cursos.Itens.Select(c => c.CargaHoraria).Distinct().Count() > 1, "cargas horárias diferentes");
        Assert.True(cursos.Itens.Select(c => c.PublicoAlvo).Distinct().Count() > 1, "públicos-alvo diferentes");
    }

    [Fact]
    public async Task Todos_os_cursos_possuem_campos_obrigatorios()
    {
        var cursos = await ListarAsync("?tamanhoPagina=50");
        Assert.All(cursos.Itens, c =>
        {
            Assert.False(string.IsNullOrWhiteSpace(c.NomeCompleto));
            Assert.False(string.IsNullOrWhiteSpace(c.NomeBreve));
            Assert.False(string.IsNullOrWhiteSpace(c.Categoria.Nome));
            Assert.False(string.IsNullOrWhiteSpace(c.Modalidade.Nome));
            Assert.False(string.IsNullOrWhiteSpace(c.Status.Nome));
            Assert.True(c.CargaHoraria > 0);
            Assert.False(string.IsNullOrWhiteSpace(c.PublicoAlvo));
            Assert.StartsWith("http", c.ImagemUrl);
            Assert.Matches(@"\?v=[0-9a-f]{8}$", c.ImagemUrl); // cache busting pelo hash do arquivo
            Assert.False(string.IsNullOrWhiteSpace(c.ImagemDescricao));
            Assert.True(c.TotalModulos > 0);
        });
    }

    // ---------- Pesquisa ----------

    [Theory]
    [InlineData("estatistica")]   // sem acento
    [InlineData("ESTATÍSTICA")]   // maiúsculas e com acento
    [InlineData("qualidade controle")] // múltiplos termos, fora de ordem
    [InlineData("mat-estat")]     // nome breve
    public async Task Busca_por_nome_ignora_acentos_e_maiusculas(string busca)
    {
        var resultado = await ListarAsync($"?busca={Uri.EscapeDataString(busca)}");
        Assert.Contains(resultado.Itens, c => c.NomeBreve == "MAT-ESTAT-01");
    }

    [Fact]
    public async Task Busca_com_caracteres_curinga_e_tratada_como_texto()
    {
        var resultado = await ListarAsync("?busca=%25");
        Assert.Equal(0, resultado.Total);
    }

    // ---------- Filtros e combinação ----------

    [Fact]
    public async Task Filtro_por_categoria_retorna_somente_a_categoria()
    {
        var resultado = await ListarAsync("?categoria=matematica");
        Assert.NotEmpty(resultado.Itens);
        Assert.All(resultado.Itens, c => Assert.Equal("matematica", c.Categoria.Slug));
    }

    [Fact]
    public async Task Filtro_aceita_multiplos_valores()
    {
        var resultado = await ListarAsync("?status=em-breve,encerrado&tamanhoPagina=50");
        Assert.NotEmpty(resultado.Itens);
        Assert.All(resultado.Itens, c => Assert.Contains(c.Status.Slug, new[] { "em-breve", "encerrado" }));
    }

    [Fact]
    public async Task Busca_e_filtros_podem_ser_combinados()
    {
        var resultado = await ListarAsync("?busca=industria&categoria=sustentabilidade&modalidade=semipresencial&status=encerrado");
        Assert.Equal(1, resultado.Total);
        Assert.Equal("SUS-ENERG-01", resultado.Itens[0].NomeBreve);
    }

    [Fact]
    public async Task Total_reflete_a_quantidade_de_resultados_filtrados()
    {
        var todos = await ListarAsync("?tamanhoPagina=50");
        var filtros = (await _client.GetFromJsonAsync<FiltrosDto>("/api/filtros"))!;
        var somaPorCategoria = 0;
        foreach (var categoria in filtros.Categorias)
        {
            var r = await ListarAsync($"?categoria={categoria.Slug}");
            Assert.Equal(categoria.Total, r.Total);
            somaPorCategoria += r.Total;
        }
        Assert.Equal(todos.Total, somaPorCategoria);
    }

    [Fact]
    public async Task Nenhum_resultado_retorna_lista_vazia_com_total_zero()
    {
        var resultado = await ListarAsync("?busca=curso-que-nao-existe");
        Assert.Equal(0, resultado.Total);
        Assert.Empty(resultado.Itens);
        Assert.Equal(0, resultado.TotalPaginas);
    }

    [Fact]
    public async Task Filtro_de_destaque_retorna_os_cursos_da_vitrine()
    {
        var resultado = await ListarAsync("?destaque=true&tamanhoPagina=50");
        Assert.Equal(6, resultado.Total);
        Assert.All(resultado.Itens, c => Assert.True(c.Destaque));
    }

    // ---------- Paginação, ordenação e validação ----------

    [Fact]
    public async Task Paginacao_respeita_tamanho_da_pagina()
    {
        var pagina1 = await ListarAsync("?tamanhoPagina=3&pagina=1&ordenacao=nome");
        var pagina2 = await ListarAsync("?tamanhoPagina=3&pagina=2&ordenacao=nome");
        Assert.Equal(3, pagina1.Itens.Count);
        Assert.Empty(pagina1.Itens.Select(c => c.Id).Intersect(pagina2.Itens.Select(c => c.Id)));
        Assert.Equal((int)Math.Ceiling(pagina1.Total / 3.0), pagina1.TotalPaginas);
    }

    [Fact]
    public async Task Ordenacao_por_carga_horaria_e_crescente()
    {
        var resultado = await ListarAsync("?ordenacao=carga-horaria&tamanhoPagina=50");
        var cargas = resultado.Itens.Select(c => c.CargaHoraria).ToList();
        Assert.Equal(cargas.Order().ToList(), cargas);
    }

    [Theory]
    [InlineData("?pagina=0")]
    [InlineData("?tamanhoPagina=500")]
    [InlineData("?ordenacao=aleatoria")]
    public async Task Parametros_invalidos_retornam_400_com_problem_details(string query)
    {
        var resposta = await _client.GetAsync($"/api/cursos{query}");
        Assert.Equal(HttpStatusCode.BadRequest, resposta.StatusCode);
        Assert.Equal("application/problem+json", resposta.Content.Headers.ContentType?.MediaType);
    }

    // ---------- Detalhes ----------

    [Fact]
    public async Task Detalhe_retorna_modulos_e_aulas_ordenados()
    {
        var curso = await _client.GetFromJsonAsync<CursoDetalheDto>("/api/cursos/1");
        Assert.NotNull(curso);
        Assert.False(string.IsNullOrWhiteSpace(curso.Descricao));
        Assert.NotEmpty(curso.Modulos);
        Assert.Equal(curso.Modulos.Select(m => m.Ordem).Order(), curso.Modulos.Select(m => m.Ordem));
        Assert.All(curso.Modulos, m =>
        {
            Assert.NotEmpty(m.Aulas);
            Assert.Equal(m.Aulas.Select(a => a.Ordem).Order(), m.Aulas.Select(a => a.Ordem));
        });
        Assert.Equal(curso.CargaHoraria, curso.Modulos.Sum(m => m.CargaHoraria));
        Assert.Equal(curso.TotalAulas, curso.Modulos.Sum(m => m.Aulas.Count));
    }

    [Fact]
    public async Task Detalhe_de_curso_inexistente_retorna_404()
    {
        var resposta = await _client.GetAsync("/api/cursos/999999");
        Assert.Equal(HttpStatusCode.NotFound, resposta.StatusCode);
        var problema = await resposta.Content.ReadFromJsonAsync<ProblemDetails>();
        Assert.Equal(404, problema?.Status);
    }

    // ---------- Infraestrutura ----------

    [Fact]
    public async Task Health_confirma_acesso_ao_banco()
    {
        var resposta = await _client.GetAsync("/health");
        Assert.Equal(HttpStatusCode.OK, resposta.StatusCode);
    }

    [Fact]
    public async Task Documento_openapi_esta_disponivel()
    {
        var resposta = await _client.GetAsync("/openapi/v1.json");
        Assert.Equal(HttpStatusCode.OK, resposta.StatusCode);
    }

    [Fact]
    public async Task Icones_das_categorias_sao_servidos()
    {
        var filtros = (await _client.GetFromJsonAsync<FiltrosDto>("/api/filtros"))!;
        var icone = new Uri(filtros.Categorias[0].IconeUrl!).PathAndQuery;
        var resposta = await _client.GetAsync(icone);
        Assert.Equal(HttpStatusCode.OK, resposta.StatusCode);
    }

    [Fact]
    public async Task Migracoes_sao_idempotentes()
    {
        var migrator = new Infrastructure.DatabaseMigrator(
            Infrastructure.ConnectionStringHelper.Normalizar(ApiFactory.ConnectionString),
            Microsoft.Extensions.Logging.Abstractions.NullLogger<Infrastructure.DatabaseMigrator>.Instance);
        Assert.Equal(0, await migrator.MigrarAsync());
    }
}
