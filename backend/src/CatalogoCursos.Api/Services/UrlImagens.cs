using System.Collections.Concurrent;
using System.Security.Cryptography;

namespace CatalogoCursos.Api.Services;

/// <summary>
/// Monta URLs absolutas para as imagens servidas pela própria API (wwwroot/imagens).
/// Se "Imagens:BaseUrl" estiver configurado (ex.: uma CDN), ele é usado; caso
/// contrário, a URL é montada a partir do host da requisição atual.
/// Cada URL recebe "?v=" + hash do conteúdo do arquivo (cache busting): as imagens
/// têm cache longo no navegador, e trocar uma foto muda a URL automaticamente.
/// </summary>
public interface IUrlImagens
{
    string Montar(string caminhoRelativo);
}

public sealed class UrlImagens(
    IConfiguration configuration,
    IHttpContextAccessor httpContextAccessor,
    IWebHostEnvironment ambiente) : IUrlImagens
{
    private readonly string? _baseConfigurada = configuration["Imagens:BaseUrl"]?.TrimEnd('/');
    private readonly ConcurrentDictionary<string, string> _versoes = new();

    public string Montar(string caminhoRelativo)
    {
        if (Uri.TryCreate(caminhoRelativo, UriKind.Absolute, out _))
            return caminhoRelativo;

        var caminho = caminhoRelativo.TrimStart('/');
        var versao = ObterVersao(caminho);
        var sufixo = versao is null ? string.Empty : $"?v={versao}";

        if (!string.IsNullOrEmpty(_baseConfigurada))
            return $"{_baseConfigurada}/{caminho}{sufixo}";

        var request = httpContextAccessor.HttpContext?.Request;
        return request is null
            ? $"/imagens/{caminho}{sufixo}"
            : $"{request.Scheme}://{request.Host}{request.PathBase}/imagens/{caminho}{sufixo}";
    }

    /// <summary>Hash curto (8 caracteres) do conteúdo do arquivo, calculado uma vez e mantido em memória.</summary>
    private string? ObterVersao(string caminho) =>
        _versoes.GetOrAdd(caminho, c =>
        {
            var arquivo = ambiente.WebRootFileProvider.GetFileInfo($"imagens/{c}");
            if (!arquivo.Exists) return string.Empty;
            using var stream = arquivo.CreateReadStream();
            return Convert.ToHexString(SHA256.HashData(stream))[..8].ToLowerInvariant();
        }) is { Length: > 0 } v ? v : null;
}
