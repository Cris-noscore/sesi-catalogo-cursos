using CatalogoCursos.Api.Services;

namespace CatalogoCursos.Api.Contracts;

/// <summary>Parâmetros de consulta da listagem de cursos (query string).</summary>
public sealed class CursoConsulta
{
    public const int TamanhoPaginaPadrao = 12;
    public const int TamanhoPaginaMaximo = 50;
    public static readonly string[] OrdenacoesValidas = ["relevancia", "nome", "carga-horaria", "recentes"];

    /// <summary>Texto pesquisado no nome completo e no nome breve (sem diferenciar acentos/maiúsculas).</summary>
    public string? Busca { get; set; }

    /// <summary>Slug(s) de categoria separados por vírgula. Ex.: matematica,linguagens</summary>
    public string? Categoria { get; set; }

    /// <summary>Slug(s) de modalidade separados por vírgula. Ex.: ead-com-tutoria</summary>
    public string? Modalidade { get; set; }

    /// <summary>Slug(s) de status separados por vírgula. Ex.: inscricoes-abertas</summary>
    public string? Status { get; set; }

    /// <summary>Quando true, retorna apenas cursos em destaque (vitrine "Principais cursos").</summary>
    public bool? Destaque { get; set; }

    /// <summary>relevancia (padrão), nome, carga-horaria ou recentes.</summary>
    public string? Ordenacao { get; set; }

    /// <summary>Página (a partir de 1). Padrão: 1.</summary>
    public int? Pagina { get; set; }

    /// <summary>Itens por página (1 a 50). Padrão: 12.</summary>
    public int? TamanhoPagina { get; set; }

    /// <summary>Valida os parâmetros e devolve os erros no formato do ValidationProblem.</summary>
    public Dictionary<string, string[]> Validar()
    {
        var erros = new Dictionary<string, string[]>();

        if (Pagina is < 1)
            erros["pagina"] = ["A página deve ser maior ou igual a 1."];

        if (TamanhoPagina is < 1 or > TamanhoPaginaMaximo)
            erros["tamanhoPagina"] = [$"O tamanho da página deve estar entre 1 e {TamanhoPaginaMaximo}."];

        if (Busca is { Length: > TextoBusca.TamanhoMaximoBusca })
            erros["busca"] = [$"A busca deve ter no máximo {TextoBusca.TamanhoMaximoBusca} caracteres."];

        if (!string.IsNullOrWhiteSpace(Ordenacao) && !OrdenacoesValidas.Contains(Ordenacao.ToLowerInvariant()))
            erros["ordenacao"] = [$"Ordenação inválida. Valores aceitos: {string.Join(", ", OrdenacoesValidas)}."];

        return erros;
    }
}
