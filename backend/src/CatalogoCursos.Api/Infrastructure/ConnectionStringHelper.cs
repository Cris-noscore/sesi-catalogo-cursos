using Npgsql;

namespace CatalogoCursos.Api.Infrastructure;

/// <summary>
/// Aceita a string de conexão tanto no formato do Npgsql (Host=...;Database=...)
/// quanto no formato URI (postgresql://usuario:senha@host:5432/banco), que é o
/// formato exibido por provedores como Supabase, Neon e Render.
/// </summary>
public static class ConnectionStringHelper
{
    public static string Normalizar(string valor)
    {
        valor = valor.Trim();
        if (!valor.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase) &&
            !valor.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase))
            return valor;

        var uri = new Uri(valor);
        var credenciais = uri.UserInfo.Split(':', 2);

        var builder = new NpgsqlConnectionStringBuilder
        {
            Host = uri.Host,
            Port = uri.Port > 0 ? uri.Port : 5432,
            Database = Uri.UnescapeDataString(uri.AbsolutePath.TrimStart('/')),
            Username = Uri.UnescapeDataString(credenciais[0]),
            Password = credenciais.Length > 1 ? Uri.UnescapeDataString(credenciais[1]) : null,
        };

        // Repassa parâmetros da query (?sslmode=require etc.).
        var query = uri.Query.TrimStart('?');
        foreach (var par in query.Split('&', StringSplitOptions.RemoveEmptyEntries))
        {
            var kv = par.Split('=', 2);
            var chave = Uri.UnescapeDataString(kv[0]);
            var valorParam = kv.Length > 1 ? Uri.UnescapeDataString(kv[1]) : string.Empty;
            if (chave.Equals("sslmode", StringComparison.OrdinalIgnoreCase))
                builder.SslMode = Enum.Parse<SslMode>(valorParam.Replace("-", string.Empty), ignoreCase: true);
        }

        // Provedores gerenciados exigem SSL; se não especificado, usa "Require" para hosts remotos.
        if (!query.Contains("sslmode", StringComparison.OrdinalIgnoreCase) && !EhLocal(uri.Host))
            builder.SslMode = SslMode.Require;

        return builder.ConnectionString;
    }

    private static bool EhLocal(string host) =>
        host is "localhost" or "127.0.0.1" or "db" or "postgres" or "::1";
}
