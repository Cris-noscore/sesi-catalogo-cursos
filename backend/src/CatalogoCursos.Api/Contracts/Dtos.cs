namespace CatalogoCursos.Api.Contracts;

/// <summary>Item simples de domínio (categoria, modalidade ou status) exposto pela API.</summary>
public sealed record OpcaoDto(string Slug, string Nome);

/// <summary>Categoria com ícone, usada nos cards e filtros.</summary>
public sealed record CategoriaDto(string Slug, string Nome, string IconeUrl);

/// <summary>Opção de filtro acompanhada da quantidade de cursos.</summary>
public sealed record OpcaoFiltroDto(string Slug, string Nome, int Total, string? IconeUrl = null, string? Descricao = null);

/// <summary>Opções disponíveis para os filtros do catálogo.</summary>
public sealed record FiltrosDto(
    IReadOnlyList<OpcaoFiltroDto> Categorias,
    IReadOnlyList<OpcaoFiltroDto> Modalidades,
    IReadOnlyList<OpcaoFiltroDto> Status);

/// <summary>Resumo do curso exibido na listagem (card).</summary>
public sealed record CursoResumoDto(
    int Id,
    string NomeCompleto,
    string NomeBreve,
    string Resumo,
    CategoriaDto Categoria,
    OpcaoDto Modalidade,
    OpcaoDto Status,
    int CargaHoraria,
    string PublicoAlvo,
    string ImagemUrl,
    string ImagemDescricao,
    DateOnly? DataDisponibilizacao,
    bool Destaque,
    int TotalModulos);

public sealed record AulaDto(int Ordem, string Titulo, string Descricao, int DuracaoMinutos);

public sealed record ModuloDto(int Ordem, string Titulo, string Descricao, int CargaHoraria, IReadOnlyList<AulaDto> Aulas);

/// <summary>Detalhes completos de um curso, incluindo módulos e aulas.</summary>
public sealed record CursoDetalheDto(
    int Id,
    string NomeCompleto,
    string NomeBreve,
    string Resumo,
    string Descricao,
    CategoriaDto Categoria,
    OpcaoDto Modalidade,
    OpcaoDto Status,
    int CargaHoraria,
    string PublicoAlvo,
    string ImagemUrl,
    string ImagemDescricao,
    DateOnly? DataDisponibilizacao,
    bool Destaque,
    int TotalAulas,
    IReadOnlyList<ModuloDto> Modulos);

/// <summary>Resultado paginado da listagem.</summary>
public sealed record ResultadoPaginado<T>(
    IReadOnlyList<T> Itens,
    int Total,
    int Pagina,
    int TamanhoPagina,
    int TotalPaginas);
