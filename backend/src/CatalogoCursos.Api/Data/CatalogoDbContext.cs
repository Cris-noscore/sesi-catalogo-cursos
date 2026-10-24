using CatalogoCursos.Api.Domain;
using Microsoft.EntityFrameworkCore;

namespace CatalogoCursos.Api.Data;

/// <summary>
/// Contexto do EF Core. O esquema é criado pelos scripts SQL versionados em
/// /database/migrations (aplicados pelo <see cref="Infrastructure.DatabaseMigrator"/>);
/// aqui fica apenas o mapeamento objeto-relacional (tabelas e colunas em snake_case).
/// </summary>
public class CatalogoDbContext(DbContextOptions<CatalogoDbContext> options) : DbContext(options)
{
    public DbSet<Curso> Cursos => Set<Curso>();
    public DbSet<Categoria> Categorias => Set<Categoria>();
    public DbSet<Modalidade> Modalidades => Set<Modalidade>();
    public DbSet<StatusCurso> Status => Set<StatusCurso>();
    public DbSet<Modulo> Modulos => Set<Modulo>();
    public DbSet<Aula> Aulas => Set<Aula>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Categoria>(e =>
        {
            e.ToTable("categoria");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id");
            e.Property(x => x.Nome).HasColumnName("nome").HasMaxLength(80);
            e.Property(x => x.Slug).HasColumnName("slug").HasMaxLength(80);
            e.Property(x => x.Icone).HasColumnName("icone").HasMaxLength(120);
            e.Property(x => x.Descricao).HasColumnName("descricao").HasMaxLength(300);
            e.HasIndex(x => x.Slug).IsUnique();
        });

        modelBuilder.Entity<Modalidade>(e =>
        {
            e.ToTable("modalidade");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id");
            e.Property(x => x.Nome).HasColumnName("nome").HasMaxLength(80);
            e.Property(x => x.Slug).HasColumnName("slug").HasMaxLength(80);
            e.Property(x => x.Descricao).HasColumnName("descricao").HasMaxLength(300);
            e.HasIndex(x => x.Slug).IsUnique();
        });

        modelBuilder.Entity<StatusCurso>(e =>
        {
            e.ToTable("status_curso");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id");
            e.Property(x => x.Nome).HasColumnName("nome").HasMaxLength(80);
            e.Property(x => x.Slug).HasColumnName("slug").HasMaxLength(80);
            e.Property(x => x.Ordem).HasColumnName("ordem");
            e.HasIndex(x => x.Slug).IsUnique();
        });

        modelBuilder.Entity<Curso>(e =>
        {
            e.ToTable("curso");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id");
            e.Property(x => x.NomeCompleto).HasColumnName("nome_completo").HasMaxLength(200);
            e.Property(x => x.NomeBreve).HasColumnName("nome_breve").HasMaxLength(60);
            e.Property(x => x.Resumo).HasColumnName("resumo").HasMaxLength(400);
            e.Property(x => x.Descricao).HasColumnName("descricao");
            e.Property(x => x.CategoriaId).HasColumnName("categoria_id");
            e.Property(x => x.ModalidadeId).HasColumnName("modalidade_id");
            e.Property(x => x.StatusId).HasColumnName("status_id");
            e.Property(x => x.CargaHoraria).HasColumnName("carga_horaria");
            e.Property(x => x.PublicoAlvo).HasColumnName("publico_alvo").HasMaxLength(300);
            e.Property(x => x.ImagemUrl).HasColumnName("imagem_url").HasMaxLength(300);
            e.Property(x => x.ImagemDescricao).HasColumnName("imagem_descricao").HasMaxLength(300);
            e.Property(x => x.DataDisponibilizacao).HasColumnName("data_disponibilizacao");
            e.Property(x => x.Destaque).HasColumnName("destaque");
            e.Property(x => x.CriadoEm).HasColumnName("criado_em");
            e.Property(x => x.NomeBusca)
                .HasColumnName("nome_busca")
                .HasComputedColumnSql("f_normalizar(nome_completo || ' ' || nome_breve)", stored: true)
                .ValueGeneratedOnAddOrUpdate();

            e.HasIndex(x => x.NomeBreve).IsUnique();
            e.HasOne(x => x.Categoria).WithMany().HasForeignKey(x => x.CategoriaId);
            e.HasOne(x => x.Modalidade).WithMany().HasForeignKey(x => x.ModalidadeId);
            e.HasOne(x => x.Status).WithMany().HasForeignKey(x => x.StatusId);
            e.HasMany(x => x.Modulos).WithOne().HasForeignKey(x => x.CursoId);
        });

        modelBuilder.Entity<Modulo>(e =>
        {
            e.ToTable("modulo");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id");
            e.Property(x => x.CursoId).HasColumnName("curso_id");
            e.Property(x => x.Ordem).HasColumnName("ordem");
            e.Property(x => x.Titulo).HasColumnName("titulo").HasMaxLength(200);
            e.Property(x => x.Descricao).HasColumnName("descricao").HasMaxLength(600);
            e.Property(x => x.CargaHoraria).HasColumnName("carga_horaria");
            e.HasMany(x => x.Aulas).WithOne().HasForeignKey(x => x.ModuloId);
        });

        modelBuilder.Entity<Aula>(e =>
        {
            e.ToTable("aula");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id");
            e.Property(x => x.ModuloId).HasColumnName("modulo_id");
            e.Property(x => x.Ordem).HasColumnName("ordem");
            e.Property(x => x.Titulo).HasColumnName("titulo").HasMaxLength(200);
            e.Property(x => x.Descricao).HasColumnName("descricao").HasMaxLength(600);
            e.Property(x => x.DuracaoMinutos).HasColumnName("duracao_minutos");
        });
    }
}
