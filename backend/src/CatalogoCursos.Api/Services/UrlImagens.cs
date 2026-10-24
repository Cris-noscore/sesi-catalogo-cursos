namespace CatalogoCursos.Api.Services;

/// <summary>
/// Monta URLs absolutas para as imagens servidas pela própria API (wwwroot/imagens).
/// Se "Imagens:BaseUrl" estiver configurado (ex.: uma CDN), ele é usado; caso
/// contrário, a URL é montada a partir do host da requisição atual.
/// </summary>
public interface IUrlImagens
{
    string Montar(string caminhoRelativo);
}

public sealed class UrlImagens(IConfiguration configuration, IHttpContextAccessor httpContextAccessor) : IUrlImagens
{
    private readonly string? _baseConfigurada = configuration["Imagens:BaseUrl"]?.TrimEnd('/');

    public string Montar(string caminhoRelativo)
    {
        if (Uri.TryCreate(caminhoRelativo, UriKind.Absolute, out _))
            return caminhoRelativo;

        var caminho = caminhoRelativo.TrimStart('/');
        if (!string.IsNullOrEmpty(_baseConfigurada))
            return $"{_baseConfigurada}/{caminho}";

        var request = httpContextAccessor.HttpContext?.Request;
        return request is null
            ? $"/imagens/{caminho}"
            : $"{request.Scheme}://{request.Host}{request.PathBase}/imagens/{caminho}";
    }
}
