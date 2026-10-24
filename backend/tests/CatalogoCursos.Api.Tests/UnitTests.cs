using CatalogoCursos.Api.Contracts;
using CatalogoCursos.Api.Infrastructure;
using CatalogoCursos.Api.Services;

namespace CatalogoCursos.Api.Tests;

/// <summary>Testes unitários (não dependem de banco).</summary>
public sealed class TextoBuscaTests
{
    [Theory]
    [InlineData("Ciência", "ciencia")]
    [InlineData("AÇÃO", "acao")]
    [InlineData("Inglês Técnico", "ingles tecnico")]
    [InlineData("Matemática Financeira", "matematica financeira")]
    public void Normalizar_remove_acentos_e_converte_para_minusculas(string entrada, string esperado) =>
        Assert.Equal(esperado, TextoBusca.Normalizar(entrada));

    [Fact]
    public void Termos_divide_por_espacos_e_remove_duplicados() =>
        Assert.Equal(new[] { "analise", "dados" }, TextoBusca.Termos("  Análise   dados DADOS "));

    [Fact]
    public void Termos_de_busca_vazia_retorna_lista_vazia() =>
        Assert.Empty(TextoBusca.Termos("   "));

    [Fact]
    public void EscaparLike_neutraliza_curingas() =>
        Assert.Equal("100\\%\\_a\\\\b", TextoBusca.EscaparLike("100%_a\\b"));

    [Fact]
    public void Slugs_aceita_lista_separada_por_virgula() =>
        Assert.Equal(new[] { "matematica", "linguagens" }, TextoBusca.Slugs(" Matematica, linguagens,,matematica "));
}

public sealed class CursoConsultaTests
{
    [Fact]
    public void Consulta_padrao_e_valida() => Assert.Empty(new CursoConsulta().Validar());

    [Fact]
    public void Busca_muito_longa_e_invalida() =>
        Assert.Contains("busca", new CursoConsulta { Busca = new string('a', 101) }.Validar().Keys);

    [Theory]
    [InlineData("nome")]
    [InlineData("CARGA-HORARIA")]
    [InlineData("recentes")]
    public void Ordenacoes_validas_sao_aceitas(string ordenacao) =>
        Assert.Empty(new CursoConsulta { Ordenacao = ordenacao }.Validar());
}

public sealed class ConnectionStringHelperTests
{
    [Fact]
    public void Converte_uri_postgres_para_formato_npgsql()
    {
        var resultado = ConnectionStringHelper.Normalizar(
            "postgresql://postgres.abc:s%40nha@aws-0-sa-east-1.pooler.supabase.com:5432/postgres");

        Assert.Contains("Host=aws-0-sa-east-1.pooler.supabase.com", resultado);
        Assert.Contains("Username=postgres.abc", resultado);
        Assert.Contains("Password=s@nha", resultado);
        Assert.Contains("SSL Mode=Require", resultado);
    }

    [Fact]
    public void Mantem_string_no_formato_npgsql() =>
        Assert.Equal("Host=localhost;Database=x", ConnectionStringHelper.Normalizar("Host=localhost;Database=x"));
}

public sealed class DatabaseMigratorTests
{
    [Fact]
    public void Scripts_embutidos_estao_em_ordem_e_com_versao()
    {
        var scripts = DatabaseMigrator.CarregarScripts();
        Assert.True(scripts.Count >= 2);
        Assert.Equal(scripts.Select(s => s.Versao).Order(StringComparer.Ordinal), scripts.Select(s => s.Versao));
        Assert.All(scripts, s => Assert.Matches("^V\\d{3}$", s.Versao));
    }
}
