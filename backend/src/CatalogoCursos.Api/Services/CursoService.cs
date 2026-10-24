using CatalogoCursos.Api.Contracts;
using CatalogoCursos.Api.Data;
using CatalogoCursos.Api.Domain;
using Microsoft.EntityFrameworkCore;

namespace CatalogoCursos.Api.Services;

public interface ICursoService
{
    Task<ResultadoPaginado<CursoResumoDto>> ListarAsync(CursoConsulta consulta, CancellationToken ct);
    Task<CursoDetalheDto?> ObterPorIdAsync(int id, CancellationToken ct);
    Task<FiltrosDto> ObterFiltrosAsync(CancellationToken ct);
}

/// <summary>
/// Regras de consulta do catálogo. Busca, filtros, ordenação e paginação são
/// executados no banco (IQueryable traduzido para SQL pelo EF Core).
/// </summary>
public sealed class CursoService(CatalogoDbContext db, IUrlImagens urlImagens) : ICursoService
{
    public async Task<ResultadoPaginado<CursoResumoDto>> ListarAsync(CursoConsulta consulta, CancellationToken ct)
    {
        var pagina = consulta.Pagina ?? 1;
        var tamanho = consulta.TamanhoPagina ?? CursoConsulta.TamanhoPaginaPadrao;

        IQueryable<Curso> query = db.Cursos.AsNoTracking();

        // Busca pelo nome: cada termo precisa aparecer na coluna normalizada (AND).
        foreach (var termo in TextoBusca.Termos(consulta.Busca))
        {
            var padrao = $"%{TextoBusca.EscaparLike(termo)}%";
            query = query.Where(c => EF.Functions.Like(c.NomeBusca, padrao, "\\"));
        }

        // Filtros combináveis: OR dentro do mesmo filtro, AND entre filtros diferentes.
        var categorias = TextoBusca.Slugs(consulta.Categoria);
        if (categorias.Length > 0)
            query = query.Where(c => categorias.Contains(c.Categoria.Slug));

        var modalidades = TextoBusca.Slugs(consulta.Modalidade);
        if (modalidades.Length > 0)
            query = query.Where(c => modalidades.Contains(c.Modalidade.Slug));

        var status = TextoBusca.Slugs(consulta.Status);
        if (status.Length > 0)
            query = query.Where(c => status.Contains(c.Status.Slug));

        var total = await query.CountAsync(ct);

        query = (consulta.Ordenacao?.ToLowerInvariant()) switch
        {
            "nome" => query.OrderBy(c => c.NomeCompleto),
            "carga-horaria" => query.OrderBy(c => c.CargaHoraria).ThenBy(c => c.NomeCompleto),
            "recentes" => query
                .OrderBy(c => c.DataDisponibilizacao == null)
                .ThenByDescending(c => c.DataDisponibilizacao)
                .ThenBy(c => c.NomeCompleto),
            // relevância: destaques primeiro, depois cursos com inscrições abertas.
            _ => query
                .OrderByDescending(c => c.Destaque)
                .ThenBy(c => c.Status.Ordem)
                .ThenBy(c => c.NomeCompleto),
        };

        var linhas = await query
            .Skip((pagina - 1) * tamanho)
            .Take(tamanho)
            .Select(c => new
            {
                c.Id,
                c.NomeCompleto,
                c.NomeBreve,
                c.Resumo,
                CategoriaSlug = c.Categoria.Slug,
                CategoriaNome = c.Categoria.Nome,
                CategoriaIcone = c.Categoria.Icone,
                ModalidadeSlug = c.Modalidade.Slug,
                ModalidadeNome = c.Modalidade.Nome,
                StatusSlug = c.Status.Slug,
                StatusNome = c.Status.Nome,
                c.CargaHoraria,
                c.PublicoAlvo,
                c.ImagemUrl,
                c.ImagemDescricao,
                c.DataDisponibilizacao,
                c.Destaque,
                TotalModulos = c.Modulos.Count,
            })
            .ToListAsync(ct);

        var itens = linhas.Select(c => new CursoResumoDto(
                c.Id,
                c.NomeCompleto,
                c.NomeBreve,
                c.Resumo,
                new CategoriaDto(c.CategoriaSlug, c.CategoriaNome, urlImagens.Montar($"icones/{c.CategoriaIcone}")),
                new OpcaoDto(c.ModalidadeSlug, c.ModalidadeNome),
                new OpcaoDto(c.StatusSlug, c.StatusNome),
                c.CargaHoraria,
                c.PublicoAlvo,
                urlImagens.Montar(c.ImagemUrl),
                c.ImagemDescricao,
                c.DataDisponibilizacao,
                c.Destaque,
                c.TotalModulos))
            .ToList();

        var totalPaginas = total == 0 ? 0 : (int)Math.Ceiling(total / (double)tamanho);
        return new ResultadoPaginado<CursoResumoDto>(itens, total, pagina, tamanho, totalPaginas);
    }

    public async Task<CursoDetalheDto?> ObterPorIdAsync(int id, CancellationToken ct)
    {
        var curso = await db.Cursos
            .AsNoTracking()
            .AsSplitQuery()
            .Include(c => c.Categoria)
            .Include(c => c.Modalidade)
            .Include(c => c.Status)
            .Include(c => c.Modulos.OrderBy(m => m.Ordem))
                .ThenInclude(m => m.Aulas.OrderBy(a => a.Ordem))
            .FirstOrDefaultAsync(c => c.Id == id, ct);

        if (curso is null) return null;

        var modulos = curso.Modulos
            .Select(m => new ModuloDto(
                m.Ordem,
                m.Titulo,
                m.Descricao,
                m.CargaHoraria,
                m.Aulas.Select(a => new AulaDto(a.Ordem, a.Titulo, a.Descricao, a.DuracaoMinutos)).ToList()))
            .ToList();

        return new CursoDetalheDto(
            curso.Id,
            curso.NomeCompleto,
            curso.NomeBreve,
            curso.Resumo,
            curso.Descricao,
            new CategoriaDto(curso.Categoria.Slug, curso.Categoria.Nome, urlImagens.Montar($"icones/{curso.Categoria.Icone}")),
            new OpcaoDto(curso.Modalidade.Slug, curso.Modalidade.Nome),
            new OpcaoDto(curso.Status.Slug, curso.Status.Nome),
            curso.CargaHoraria,
            curso.PublicoAlvo,
            urlImagens.Montar(curso.ImagemUrl),
            curso.ImagemDescricao,
            curso.DataDisponibilizacao,
            curso.Destaque,
            modulos.Sum(m => m.Aulas.Count),
            modulos);
    }

    public async Task<FiltrosDto> ObterFiltrosAsync(CancellationToken ct)
    {
        var categorias = await db.Categorias
            .AsNoTracking()
            .OrderBy(x => x.Nome)
            .Select(x => new { x.Slug, x.Nome, x.Icone, x.Descricao, Total = db.Cursos.Count(c => c.CategoriaId == x.Id) })
            .ToListAsync(ct);

        var modalidades = await db.Modalidades
            .AsNoTracking()
            .OrderBy(x => x.Nome)
            .Select(x => new OpcaoFiltroDto(x.Slug, x.Nome, db.Cursos.Count(c => c.ModalidadeId == x.Id), null, x.Descricao))
            .ToListAsync(ct);

        var status = await db.Status
            .AsNoTracking()
            .OrderBy(x => x.Ordem)
            .Select(x => new OpcaoFiltroDto(x.Slug, x.Nome, db.Cursos.Count(c => c.StatusId == x.Id), null, null))
            .ToListAsync(ct);

        return new FiltrosDto(
            categorias.Select(x => new OpcaoFiltroDto(x.Slug, x.Nome, x.Total, urlImagens.Montar($"icones/{x.Icone}"), x.Descricao)).ToList(),
            modalidades,
            status);
    }
}
