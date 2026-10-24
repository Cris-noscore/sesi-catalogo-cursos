namespace CatalogoCursos.Api.Domain;

/// <summary>Área de conhecimento do curso (equivalente à "categoria" do Moodle).</summary>
public class Categoria
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Icone { get; set; } = string.Empty;
    public string? Descricao { get; set; }
}

/// <summary>Forma de oferta do curso (ex.: EAD autoinstrucional, EAD com tutoria).</summary>
public class Modalidade
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Descricao { get; set; }
}

/// <summary>Situação da oferta (ex.: Inscrições abertas, Em breve, Encerrado).</summary>
public class StatusCurso
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public short Ordem { get; set; }
}

/// <summary>Curso do catálogo. Campos inspirados no Moodle (fullname, shortname, summary, startdate).</summary>
public class Curso
{
    public int Id { get; set; }
    public string NomeCompleto { get; set; } = string.Empty;
    public string NomeBreve { get; set; } = string.Empty;
    public string Resumo { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;

    public int CategoriaId { get; set; }
    public Categoria Categoria { get; set; } = null!;

    public int ModalidadeId { get; set; }
    public Modalidade Modalidade { get; set; } = null!;

    public int StatusId { get; set; }
    public StatusCurso Status { get; set; } = null!;

    public short CargaHoraria { get; set; }
    public string PublicoAlvo { get; set; } = string.Empty;
    public string ImagemUrl { get; set; } = string.Empty;
    public string ImagemDescricao { get; set; } = string.Empty;
    public DateOnly? DataDisponibilizacao { get; set; }
    public bool Destaque { get; set; }
    public DateTimeOffset CriadoEm { get; set; }

    /// <summary>Coluna gerada no banco: nome completo + nome breve, minúsculo e sem acentos.</summary>
    public string NomeBusca { get; private set; } = string.Empty;

    public List<Modulo> Modulos { get; set; } = [];
}

public class Modulo
{
    public int Id { get; set; }
    public int CursoId { get; set; }
    public short Ordem { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public short CargaHoraria { get; set; }
    public List<Aula> Aulas { get; set; } = [];
}

public class Aula
{
    public int Id { get; set; }
    public int ModuloId { get; set; }
    public short Ordem { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public short DuracaoMinutos { get; set; }
}
