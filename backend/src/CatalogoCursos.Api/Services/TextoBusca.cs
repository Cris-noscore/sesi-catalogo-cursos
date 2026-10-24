using System.Globalization;
using System.Text;

namespace CatalogoCursos.Api.Services;

/// <summary>
/// Utilitários de normalização da busca. A mesma regra (minúsculas, sem acentos)
/// é aplicada no banco pela função f_normalizar, usada na coluna gerada nome_busca.
/// </summary>
public static class TextoBusca
{
    public const int TamanhoMaximoBusca = 100;
    private const int MaximoTermos = 10;

    /// <summary>Converte para minúsculas e remove acentos/diacríticos.</summary>
    public static string Normalizar(string texto)
    {
        var decomposto = texto.Normalize(NormalizationForm.FormD);
        var sb = new StringBuilder(decomposto.Length);
        foreach (var ch in decomposto)
        {
            if (CharUnicodeInfo.GetUnicodeCategory(ch) != UnicodeCategory.NonSpacingMark)
                sb.Append(ch);
        }
        return sb.ToString().Normalize(NormalizationForm.FormC).ToLowerInvariant();
    }

    /// <summary>
    /// Divide a busca em termos normalizados. Todos os termos precisam aparecer no nome
    /// (busca "estatistica dados" encontra "Estatística Básica e Análise de Dados").
    /// </summary>
    public static IReadOnlyList<string> Termos(string? busca)
    {
        if (string.IsNullOrWhiteSpace(busca)) return [];
        return Normalizar(busca)
            .Split((char[]?)null, StringSplitOptions.RemoveEmptyEntries)
            .Distinct()
            .Take(MaximoTermos)
            .ToList();
    }

    /// <summary>Escapa os curingas do LIKE (%, _ e a própria barra) para busca literal.</summary>
    public static string EscaparLike(string termo) =>
        termo.Replace("\\", "\\\\").Replace("%", "\\%").Replace("_", "\\_");

    /// <summary>Converte "a,b, c" em ["a","b","c"] (filtros com múltiplos valores).</summary>
    public static string[] Slugs(string? valor)
    {
        if (string.IsNullOrWhiteSpace(valor)) return [];
        return valor
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Select(s => s.ToLowerInvariant())
            .Distinct()
            .ToArray();
    }
}
