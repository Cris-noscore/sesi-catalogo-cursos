using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using Npgsql;

namespace CatalogoCursos.Api.Infrastructure;

/// <summary>
/// Migrador simples e versionado: aplica, em ordem, os scripts SQL de
/// /database/migrations (embutidos na DLL) e registra cada versão aplicada na
/// tabela schema_migrations. Cada script roda em uma transação própria e um
/// advisory lock evita execuções concorrentes (ex.: duas instâncias subindo).
/// Os mesmos scripts podem ser executados manualmente (psql / SQL Editor do Supabase).
/// </summary>
public sealed class DatabaseMigrator(string connectionString, ILogger<DatabaseMigrator> logger)
{
    private const long LockId = 5_192_026; // identificador arbitrário do advisory lock
    private const string PrefixoRecurso = "Migrations.";

    public sealed record Script(string Versao, string Nome, string Sql, string Checksum);

    public async Task<int> MigrarAsync(CancellationToken ct = default)
    {
        var scripts = CarregarScripts();
        if (scripts.Count == 0)
            throw new InvalidOperationException("Nenhum script de migração embutido foi encontrado.");

        await using var conexao = new NpgsqlConnection(connectionString);
        await conexao.OpenAsync(ct);

        await ExecutarAsync(conexao, $"SELECT pg_advisory_lock({LockId})", ct);
        try
        {
            await ExecutarAsync(conexao, """
                CREATE TABLE IF NOT EXISTS schema_migrations (
                    versao       varchar(50)  PRIMARY KEY,
                    nome         varchar(200) NOT NULL,
                    checksum     char(64)     NOT NULL,
                    aplicado_em  timestamptz  NOT NULL DEFAULT now()
                )
                """, ct);

            var aplicadas = new Dictionary<string, string>();
            await using (var cmd = new NpgsqlCommand("SELECT versao, checksum FROM schema_migrations", conexao))
            await using (var leitor = await cmd.ExecuteReaderAsync(ct))
            {
                while (await leitor.ReadAsync(ct))
                    aplicadas[leitor.GetString(0)] = leitor.GetString(1).Trim();
            }

            var novas = 0;
            foreach (var script in scripts)
            {
                if (aplicadas.TryGetValue(script.Versao, out var checksum))
                {
                    if (!string.Equals(checksum, script.Checksum, StringComparison.OrdinalIgnoreCase))
                        logger.LogWarning("O script {Versao} foi alterado após ser aplicado (checksum diferente).", script.Versao);
                    continue;
                }

                await using var transacao = await conexao.BeginTransactionAsync(ct);
                await using (var cmd = new NpgsqlCommand(script.Sql, conexao, transacao))
                {
                    cmd.CommandTimeout = 120;
                    await cmd.ExecuteNonQueryAsync(ct);
                }
                await using (var cmd = new NpgsqlCommand(
                    "INSERT INTO schema_migrations (versao, nome, checksum) VALUES (@versao, @nome, @checksum)",
                    conexao, transacao))
                {
                    cmd.Parameters.AddWithValue("versao", script.Versao);
                    cmd.Parameters.AddWithValue("nome", script.Nome);
                    cmd.Parameters.AddWithValue("checksum", script.Checksum);
                    await cmd.ExecuteNonQueryAsync(ct);
                }
                await transacao.CommitAsync(ct);

                novas++;
                logger.LogInformation("Migração aplicada: {Versao} ({Nome}).", script.Versao, script.Nome);
            }

            if (novas == 0)
                logger.LogInformation("Banco de dados já está atualizado ({Total} migrações).", scripts.Count);

            return novas;
        }
        finally
        {
            await ExecutarAsync(conexao, $"SELECT pg_advisory_unlock({LockId})", CancellationToken.None);
        }
    }

    /// <summary>Lê os scripts embutidos (Migrations.V001__nome.sql), em ordem de versão.</summary>
    public static IReadOnlyList<Script> CarregarScripts()
    {
        var assembly = Assembly.GetExecutingAssembly();
        return assembly.GetManifestResourceNames()
            .Where(n => n.StartsWith(PrefixoRecurso, StringComparison.Ordinal) && n.EndsWith(".sql", StringComparison.OrdinalIgnoreCase))
            .Order(StringComparer.Ordinal)
            .Select(n =>
            {
                using var stream = assembly.GetManifestResourceStream(n)!;
                using var reader = new StreamReader(stream, Encoding.UTF8);
                // Normaliza quebras de linha para o checksum não variar entre Windows e Linux.
                var sql = reader.ReadToEnd().Replace("\r\n", "\n");
                var arquivo = Path.GetFileNameWithoutExtension(n[PrefixoRecurso.Length..]);
                var partes = arquivo.Split("__", 2);
                var checksum = Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(sql))).ToLowerInvariant();
                return new Script(partes[0], partes.Length > 1 ? partes[1] : arquivo, sql, checksum);
            })
            .ToList();
    }

    private static async Task ExecutarAsync(NpgsqlConnection conexao, string sql, CancellationToken ct)
    {
        await using var cmd = new NpgsqlCommand(sql, conexao);
        await cmd.ExecuteNonQueryAsync(ct);
    }
}
