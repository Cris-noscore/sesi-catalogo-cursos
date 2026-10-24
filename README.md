# Catálogo de Cursos — CTED / SESI Indústria

[![CI](https://github.com/Cris-noscore/sesi-catalogo-cursos/actions/workflows/ci.yml/badge.svg)](https://github.com/Cris-noscore/sesi-catalogo-cursos/actions/workflows/ci.yml)

Aplicação web para apresentar o **catálogo de cursos de um ambiente virtual de aprendizagem (Moodle)**,
desenvolvida como atividade prática do processo seletivo **Desenvolvedor de Sistemas I (519/2026)**.

| | |
|---|---|
| **Aplicação publicada** | https://sesi-catalogo-cursos.vercel.app |
| **API publicada (Swagger)** | https://sesi-catalogo-api.onrender.com/swagger |
| **Repositório** | https://github.com/Cris-noscore/sesi-catalogo-cursos |

> Todos os dados exibidos são **fictícios**. A API gratuita (Render) pode levar até ~50 s para "acordar"
> no primeiro acesso após um período sem uso; a interface mostra o estado de carregamento enquanto isso.
> Caso a hospedagem esteja indisponível, siga a seção [Instruções para execução](#5-instruções-para-execução).

**Documentos complementares:** [USO_DE_IA.md](USO_DE_IA.md) (registro do uso de IA) · [docs/TESTES.md](docs/TESTES.md) (estratégia e resultados dos testes) ·
[LIMITACOES.md](LIMITACOES.md) (limitações, itens não concluídos e diferenças em relação ao Figma).

---

## Sumário

1. [Objetivo da aplicação](#1-objetivo-da-aplicação)
2. [Tecnologias utilizadas](#2-tecnologias-utilizadas)
3. [Arquitetura da solução](#3-arquitetura-da-solução)
4. [Estrutura das pastas](#4-estrutura-das-pastas)
5. [Instruções para execução](#5-instruções-para-execução)
6. [Configuração do banco](#6-configuração-do-banco)
7. [Endpoints](#7-endpoints)
8. [Modelo de dados](#8-modelo-de-dados)
9. [Estratégia de responsividade](#9-estratégia-de-responsividade)
10. [Decisões de acessibilidade](#10-decisões-de-acessibilidade)
11. [Processo de publicação](#11-processo-de-publicação)
12. [Limitações conhecidas](#12-limitações-conhecidas)
13. [Testes e qualidade](#13-testes-e-qualidade)
14. [Atendimento aos requisitos](#14-atendimento-aos-requisitos)

---

## 1. Objetivo da aplicação

Permitir que o usuário **consulte, pesquise e filtre** os cursos disponíveis no ambiente educacional
e **visualize as informações detalhadas** de cada oferta (descrição, módulos, aulas, carga horária,
público-alvo, modalidade, status e data de disponibilização).

Telas implementadas (referência visual: protótipo do Figma `[TEST DEV] SESI Indústria`):

| Rota | Tela | Origem |
|---|---|---|
| `/` | **Home** — hero, carrossel "Principais cursos", números, depoimentos, chamada final | Figma "01. Landing page" |
| `/cursos` | **Catálogo** — pesquisa, filtros combináveis, contador, ordenação, paginação e estados | *Página adicional* no estilo do Figma |
| `/cursos/:id` | **Detalhes do curso** — apresentação, ficha técnica, módulos/aulas, dúvidas, matrícula | Figma "02. Detalhes curso" |
| `/cursos/:id/aula` | **AVA** — tela de aula com módulos, progresso e navegação | Figma "03. AVA" |
| `/area-do-aluno` | Página informativa (acesso simulado ao Moodle) | Adicional |

### Capturas de tela

| Home | Catálogo (filtros combinados) |
|---|---|
| ![Home](docs/capturas/home-desktop.webp) | ![Catálogo](docs/capturas/catalogo-desktop.webp) |
| **Detalhes do curso** | **AVA (tela de aula)** |
| ![Detalhes](docs/capturas/detalhe-desktop.webp) | ![AVA](docs/capturas/ava-desktop.webp) |
| **Nenhum curso encontrado** | **Mobile (home · catálogo · detalhe)** |
| ![Estado vazio](docs/capturas/vazio-desktop.webp) | <img src="docs/capturas/home-mobile.webp" width="32%"> <img src="docs/capturas/catalogo-mobile.webp" width="32%"> <img src="docs/capturas/detalhe-mobile.webp" width="32%"> |

---

## 2. Tecnologias utilizadas

| Camada | Tecnologia | Motivo da escolha |
|---|---|---|
| Back-end | **C# / .NET 10 (LTS)** — ASP.NET Core Minimal APIs | Requisito do teste; .NET 10 é a versão LTS vigente (o .NET 8 encerra o suporte em nov/2026) |
| Acesso a dados | **Entity Framework Core 10 + Npgsql** | Consultas LINQ traduzidas para SQL (filtros e paginação executados no banco) |
| Banco de dados | **PostgreSQL 16** (open source) — hospedado no **Supabase** | Banco de código aberto exigido; Supabase oferece PostgreSQL gerenciado gratuito |
| Migrações | **Scripts SQL versionados** + migrador próprio (`DatabaseMigrator`) | Scripts portáveis: rodam pela API, pelo Docker ou no SQL Editor do Supabase |
| Documentação da API | **OpenAPI nativo do .NET** + Swagger UI | Contrato navegável em `/swagger` |
| Front-end | **React 19 + TypeScript + Vite 6** + React Router 7 | Componentização, tipagem do contrato da API e build rápido |
| Estilos | **CSS puro** com *design tokens* (variáveis CSS) extraídos do Figma | Fidelidade ao protótipo sem dependências; fonte Open Sans fornecida, auto-hospedada (WOFF2) |
| Testes | **xUnit** + `WebApplicationFactory`, **Vitest** + Testing Library, **Playwright** + **axe-core** | Integração com banco real, interface, E2E em navegador e acessibilidade automatizada |
| Contêineres | **Docker** + **Docker Compose** + Nginx | Execução local com um comando, independente da hospedagem |
| CI/CD | **GitHub Actions** | Build, testes, lint, teste Docker ponta a ponta e geração do ZIP de publicação |
| Hospedagem (grátis) | **Vercel** (front-end) · **Render** (API em Docker) · **Supabase** (banco) | Planos gratuitos, sem custos |

---

## 3. Arquitetura da solução

```mermaid
flowchart LR
    U["Usuário<br/>(navegador)"] -->|HTTPS| F["Front-end React<br/>Vercel (CDN)"]
    F -->|"fetch JSON<br/>GET /api/..."| A["API ASP.NET Core .NET 10<br/>Render (Docker)"]
    U -->|"imagens /imagens/..."| A
    A -->|"EF Core / Npgsql<br/>SSL · Session Pooler"| D[("PostgreSQL 16<br/>Supabase")]
    GH["GitHub Actions"] -.->|"CI: build + testes"| A
    GH -.->|"/health a cada 14 min"| A
```

**Back-end (camadas dentro de um único projeto, adequado ao tamanho da solução):**

```
HTTP → Endpoints (Minimal APIs, validação, ProblemDetails)
     → Services   (regras de consulta: busca, filtros, ordenação, paginação)
     → Data       (EF Core DbContext, mapeamento snake_case)
     → PostgreSQL (esquema e dados criados pelos scripts SQL versionados)
```

Decisões principais:

- **Filtros e busca executados no banco** (`IQueryable` → SQL), não em memória — a solução escala com o volume.
- **Busca sem diferenciar acentos e maiúsculas**: o banco mantém a coluna gerada `nome_busca`
  (`f_normalizar(nome_completo || ' ' || nome_breve)`) e a API normaliza o termo da mesma forma.
  Vários termos são combinados com **E** ("qualidade controle" encontra "Estatística e **Controle** de **Qualidade**…").
  Curingas do `LIKE` (`%`, `_`) são escapados.
- **Filtros combináveis**: OU dentro do mesmo filtro (`categoria=matematica,linguagens`) e E entre filtros diferentes.
- **Contrato estável via DTOs** (`record`s) — as entidades do EF não são expostas.
- **Erros padronizados** com `ProblemDetails` (RFC 9457): 400 com detalhes de validação, 404, 429 e 500.
- **Robustez**: *rate limiting* por IP (120 req/min), *retry* de conexão, `/health` que verifica o banco,
  cabeçalhos de proxy (`X-Forwarded-*`), compressão de respostas e cache de imagens.
- **Modelo inspirado no Moodle**: `nome_completo`/`nome_breve`/`descricao`/`data_disponibilizacao` correspondem a
  `fullname`/`shortname`/`summary`/`startdate` da API do Moodle (`core_course_get_courses`), facilitando uma integração futura.

**Front-end:**

- `api/` — cliente HTTP tipado com *timeout* (70 s, cobre o "acordar" do Render), cancelamento de requisições
  obsoletas (`AbortController`) e mensagens de erro amigáveis.
- `hooks/` — `useRequisicao` (estados carregando/sucesso/erro + "tentar novamente"), `useConsultaUrl`
  (busca e filtros **na URL**: link compartilhável, botão voltar funciona, filtros preservados ao voltar do detalhe),
  `useDebounce` (pesquisa 350 ms após parar de digitar).
- `components/` — componentes reutilizáveis (card, carrossel, acordeão, selo de categoria, estados).
- `pages/` — uma página por rota.

---

## 4. Estrutura das pastas

```
sesi-catalogo-cursos/
├── backend/
│   ├── CatalogoCursos.sln
│   ├── Dockerfile                    # imagem da API (build multi-estágio)
│   ├── global.json                   # versão do SDK .NET
│   ├── src/CatalogoCursos.Api/
│   │   ├── Program.cs                # configuração: DI, CORS, rate limit, OpenAPI, migrações
│   │   ├── Endpoints/                # rotas HTTP (Minimal APIs)
│   │   ├── Services/                 # regras de consulta e normalização de busca
│   │   ├── Contracts/                # DTOs e parâmetros de consulta
│   │   ├── Domain/                   # entidades
│   │   ├── Data/                     # DbContext (EF Core)
│   │   ├── Infrastructure/           # migrador SQL, string de conexão, rate limit
│   │   └── wwwroot/imagens/          # imagens dos cursos e ícones das categorias
│   └── tests/CatalogoCursos.Api.Tests/   # testes unitários e de integração (xUnit)
├── database/
│   ├── migrations/                   # V001 (estrutura), V002 (dados fictícios), V003 (ajuste)
│   ├── scripts/gerar_seed.py         # gera o V002 a partir de dados estruturados
│   └── docker/                       # inicialização do Postgres no Docker
├── e2e/                              # testes E2E e de acessibilidade (Playwright + axe-core)
├── docs/                             # TESTES.md e capturas de tela
├── frontend/
│   ├── public/                       # fontes, imagens otimizadas (WebP), favicon
│   ├── src/
│   │   ├── api/                      # cliente HTTP e tipos do contrato
│   │   ├── components/               # componentes reutilizáveis + CSS
│   │   ├── data/                     # textos institucionais estáticos do Figma
│   │   ├── hooks/                    # hooks de dados, URL, debounce, progresso
│   │   ├── pages/                    # Home, Catalogo, CursoDetalhe, Ava...
│   │   ├── styles/global.css         # design tokens, reset, botões, selos
│   │   └── utils/
│   ├── Dockerfile, nginx.conf        # imagem do front (Nginx) para o Docker Compose
│   └── vercel.json                   # publicação na Vercel (SPA)
├── .github/workflows/                # CI, ZIP de publicação, manter ativo
├── docker-compose.yml                # banco + API + front com um comando
├── render.yaml                       # blueprint de publicação da API no Render
├── README.md · USO_DE_IA.md · LIMITACOES.md
```

---

## 5. Instruções para execução

### Opção A — Docker (recomendada, um comando)

Pré-requisito: Docker Desktop.

```bash
git clone https://github.com/Cris-noscore/sesi-catalogo-cursos.git
cd sesi-catalogo-cursos
docker compose up --build
```

| Serviço | Endereço |
|---|---|
| Front-end | http://localhost:8080 |
| API (Swagger) | http://localhost:5080/swagger |
| PostgreSQL | `localhost:5432` (usuário/senha `postgres`, banco `catalogo`) |

A API cria as tabelas e carrega os dados fictícios automaticamente na primeira execução.
Para recomeçar do zero: `docker compose down -v`.

### Opção B — Sem Docker para a aplicação (desenvolvimento)

Pré-requisitos: **.NET SDK 10**, **Node.js 22+** e um **PostgreSQL 14+** (pode ser só o banco via Docker:
`docker compose up -d db`).

```bash
# 1) API — http://localhost:5080/swagger
cd backend
dotnet run --project src/CatalogoCursos.Api
# string de conexão padrão: Host=localhost;Port=5432;Database=catalogo;Username=postgres;Password=postgres
# para outro banco:  dotnet user-secrets / variável ConnectionStrings__Default

# 2) Front-end — http://localhost:5173 (o Vite encaminha /api e /imagens para a API local)
cd frontend
npm install
npm run dev
```

### Testes

```bash
# Back-end (precisa do PostgreSQL; o docker compose já cria o banco "catalogo_testes")
cd backend && dotnet test

# Front-end
cd frontend && npm test -- --run && npm run lint
```

---

## 6. Configuração do banco

- **SGBD:** PostgreSQL 14+ (local: 16 via Docker; produção: Supabase).
- **Criação do esquema e dos dados:** scripts em [`database/migrations`](database/migrations):
  - `V001__estrutura_inicial.sql` — tabelas, chaves, índices, restrições e a função `f_normalizar`;
  - `V002__dados_ficticios.sql` — 10 cursos, 4 categorias, 3 modalidades, 3 status, 39 módulos e 91 aulas;
  - `V003__textos_alternativos_imagens.sql` — atualiza os textos alternativos após a troca das fotos
    (exemplo de evolução do banco por nova migração, sem editar scripts já aplicados).
- **Aplicação automática:** ao iniciar, a API executa o `DatabaseMigrator`, que aplica em ordem os scripts
  ainda não executados (embutidos na DLL), registra versão e *checksum* na tabela `schema_migrations`,
  roda cada script em transação e usa *advisory lock* para evitar execução concorrente.
  Pode ser desligado com `Database__ApplyMigrationsOnStartup=false`.
- **Aplicação manual (alternativa):** executar os arquivos, em ordem, com `psql -f` ou colando no
  **SQL Editor do Supabase**.
- **Configuração da conexão** (`ConnectionStrings__Default` ou `DATABASE_URL`): aceita o formato do Npgsql
  (`Host=...;Database=...`) **ou** URI (`postgresql://usuario:senha@host:5432/postgres`), formato exibido pelo Supabase.
  Para hosts remotos sem `sslmode`, a API usa SSL (`Require`) automaticamente.
- **Supabase:** usar a string do **Session Pooler** (porta 5432). A conexão direta do Supabase é somente IPv6,
  não suportada pelo Render; o *Transaction Pooler* (6543) não é recomendado com EF Core.
- **Regenerar os dados fictícios:** `python3 database/scripts/gerar_seed.py database/migrations/V002__dados_ficticios.sql`
  (o script valida que a soma das cargas dos módulos é igual à carga horária do curso).

---

## 7. Endpoints

Base: `/api`. Respostas em JSON (camelCase). Documentação interativa: **`/swagger`** · contrato: **`/openapi/v1.json`**.

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/cursos` | Lista cursos com pesquisa, filtros, ordenação e paginação |
| `GET` | `/api/cursos/{id}` | Detalhes de um curso, com módulos e aulas ordenados |
| `GET` | `/api/filtros` | Categorias, modalidades e status, com a quantidade de cursos em cada |
| `GET` | `/health` | Saúde da API e do acesso ao banco |

**Parâmetros de `GET /api/cursos`** (todos opcionais e combináveis):

| Parâmetro | Exemplo | Descrição |
|---|---|---|
| `busca` | `estatistica` | Pesquisa no nome completo e no nome breve (ignora acentos/maiúsculas; vários termos = E) |
| `categoria` | `matematica,linguagens` | Slug(s) de categoria |
| `modalidade` | `ead-com-tutoria` | Slug(s) de modalidade |
| `status` | `inscricoes-abertas` | Slug(s) de status |
| `destaque` | `true` | Apenas cursos da vitrine "Principais cursos" |
| `ordenacao` | `nome` | `relevancia` (padrão), `nome`, `carga-horaria`, `recentes` |
| `pagina` / `tamanhoPagina` | `1` / `12` | Paginação (tamanho de 1 a 50) |

Exemplo: `GET /api/cursos?busca=metalurgia&categoria=ciencias-da-natureza&status=em-breve`

```json
{
  "itens": [
    {
      "id": 4,
      "nomeCompleto": "Física do Movimento e da Energia na Metalurgia",
      "nomeBreve": "CN-FISMET-01",
      "resumo": "Estudo de forças, atrito, calor e energia em máquinas, fornos e prensas.",
      "categoria": { "slug": "ciencias-da-natureza", "nome": "Ciências da Natureza", "iconeUrl": "https://.../imagens/icones/icon-ciencias-natureza-20px.svg" },
      "modalidade": { "slug": "ead-com-tutoria", "nome": "EAD com tutoria" },
      "status": { "slug": "em-breve", "nome": "Em breve" },
      "cargaHoraria": 40,
      "publicoAlvo": "Técnicos de manutenção, operadores de prensas e fornos e estudantes do Ensino Médio técnico.",
      "imagemUrl": "https://.../imagens/cursos/fisica-metalurgia.webp",
      "imagemDescricao": "Faíscas saindo de uma peça de metal sendo esmerilhada.",
      "dataDisponibilizacao": "2026-11-16",
      "destaque": true,
      "totalModulos": 4
    }
  ],
  "total": 1,
  "pagina": 1,
  "tamanhoPagina": 12,
  "totalPaginas": 1
}
```

**Erros** (`application/problem+json`):

| Status | Quando |
|---|---|
| `400` | Parâmetros inválidos (ex.: `pagina=0`, `tamanhoPagina=500`, `ordenacao` desconhecida) — com o campo `errors` |
| `404` | Curso inexistente em `/api/cursos/{id}` |
| `429` | Limite de requisições por IP excedido |
| `500` / `503` | Erro inesperado / banco indisponível (`/health`) |

---

## 8. Modelo de dados

```mermaid
erDiagram
    CATEGORIA ||--o{ CURSO : classifica
    MODALIDADE ||--o{ CURSO : define
    STATUS_CURSO ||--o{ CURSO : situa
    CURSO ||--|{ MODULO : possui
    MODULO ||--|{ AULA : possui

    CATEGORIA { int id PK; varchar nome; varchar slug UK; varchar icone; varchar descricao }
    MODALIDADE { int id PK; varchar nome; varchar slug UK; varchar descricao }
    STATUS_CURSO { int id PK; varchar nome; varchar slug UK; smallint ordem }
    CURSO {
        int id PK
        varchar nome_completo "Moodle fullname"
        varchar nome_breve UK "Moodle shortname"
        varchar resumo
        text descricao "Moodle summary"
        int categoria_id FK
        int modalidade_id FK
        int status_id FK
        smallint carga_horaria "CHECK > 0"
        varchar publico_alvo
        varchar imagem_url
        varchar imagem_descricao "texto alternativo"
        date data_disponibilizacao "Moodle startdate (opcional)"
        boolean destaque
        timestamptz criado_em
        text nome_busca "coluna gerada (busca)"
    }
    MODULO { int id PK; int curso_id FK; smallint ordem; varchar titulo; varchar descricao; smallint carga_horaria }
    AULA { int id PK; int modulo_id FK; smallint ordem; varchar titulo; text descricao; smallint duracao_minutos }
```

- Categoria, modalidade e status são **tabelas de domínio** (normalização, filtros com contagem e *slugs* estáveis na URL).
- `UNIQUE (curso_id, ordem)` e `UNIQUE (modulo_id, ordem)` garantem a ordenação de módulos e aulas.
- `imagem_descricao` existe para acessibilidade (texto alternativo da imagem de apresentação).

**Dados fictícios (requisitos mínimos × entregue):**

| Requisito | Mínimo | Entregue |
|---|---|---|
| Cursos | 6 | **10** (6 transcritos do Figma + 4 complementares) |
| Categorias | 3 | **4** (Ciências da Natureza, Linguagens, Matemática, Sustentabilidade — ícones fornecidos) |
| Modalidades | 2 | **3** (EAD autoinstrucional, EAD com tutoria, Semipresencial) |
| Status | 3 | **3** (Inscrições abertas, Em breve, Encerrado) |
| Variedade | cargas, módulos, aulas e públicos diferentes | 16 h a 60 h; 3 a 7 módulos; 91 aulas; públicos distintos |

---

## 9. Estratégia de responsividade

- **Mobile-first na prática, fluido entre pontos de quebra**: tipografia e espaçamentos com `clamp()`
  (ex.: título do hero de 40 px a 80 px), contêiner de largura máxima 1200 px com respiro lateral fluido.
- **Grids adaptativos**: `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))` no catálogo —
  1, 2 ou 3 colunas conforme o espaço, sem *media queries* específicas.
- **Pontos de quebra principais**: 560 px (celular), 860–960 px (tablet), acima disso desktop.
  - **Menu**: links horizontais no desktop; menu "hambúrguer" em painel no mobile.
  - **Filtros**: barra lateral fixa (*sticky*) no desktop; painel recolhível ("Filtros (n)") no mobile.
  - **Detalhe**: duas colunas → uma coluna, imagem acima do título; ficha técnica 4 → 2 → 1 colunas.
  - **AVA**: barra lateral fixa → cabeçalho compacto com lista de aulas recolhível.
- **Carrosséis com rolagem nativa** (`scroll-snap`): funcionam com toque, trackpad, mouse e teclado; as setas
  avançam uma "página" e são desabilitadas no início/fim.
- **Imagens otimizadas**: WebP, versões 960/1920 px com `srcset`/`<picture>`, `loading="lazy"` fora da primeira dobra,
  dimensões declaradas (evita *layout shift*).
- Verificado em 390 px, 768 px, 1024 px e 1440 px de largura.

---

## 10. Decisões de acessibilidade

Referência: **WCAG 2.1 nível AA**.

- **Semântica**: `header`, `nav`, `main`, `aside`, `footer`, `article`, `figure/blockquote` (depoimentos),
  `dl` (ficha técnica e números), hierarquia de títulos coerente em todas as páginas.
- **Teclado**: todos os controles são nativos (`button`, `a`, `input`, `select`); link **"Pular para o conteúdo"**;
  foco visível de alto contraste (`:focus-visible`); menu mobile fecha com **Esc**; carrossel rolável por teclado.
- **Leitores de tela**:
  - contador de resultados em `aria-live="polite"` (anuncia "3 cursos encontrados" ao filtrar);
  - erros em `role="alert"`, carregamento em `role="status"` / `aria-busy`;
  - acordeões no padrão WAI-ARIA (`aria-expanded`, `aria-controls`, `role="region"`);
  - estrelas com `role="img"` e rótulo "Avaliação: 5 de 5 estrelas"; "4.8/5" lido como "4,8 de 5";
  - botões só com ícone têm `aria-label` ("Abrir menu", "Próximo — Principais cursos", "Remover filtro: Matemática");
  - trilha de navegação com `aria-current="page"`; título da aba (`document.title`) atualizado a cada página;
  - ao trocar de rota, o foco vai para o conteúdo principal (comportamento esperado em SPA).
- **Cards clicáveis sem poluição**: o card inteiro é clicável ("link esticado"), mas só o título é anunciado como link.
- **Imagens**: textos alternativos descritivos vindos do banco (`imagem_descricao`); imagens decorativas com `alt=""`.
- **Contraste**: o cinza de texto secundário do Figma (`#9E9E9E`, contraste 2,7:1) foi escurecido para `#6B6B70`
  (5,3:1) — diferença registrada em [LIMITACOES.md](LIMITACOES.md). Texto branco sobre os vermelhos da marca supera 5:1.
- **Formulários**: rótulos visíveis e associados (`label for`), `fieldset/legend` nos grupos de filtros,
  alvos de toque ≥ 44 px.
- **Movimento**: `prefers-reduced-motion` desativa animações e rolagem suave.
- **Idioma**: `lang="pt-BR"`.

---

## 11. Processo de publicação

Tudo em planos **gratuitos**, sem cartão de crédito e sem custos para o SESI-SP.

1. **Banco — Supabase**: projeto criado na região *East US (North Virginia)* (mesma região da API, menor latência).
   O esquema e os dados são criados automaticamente pela API no primeiro *deploy* (ou manualmente pelo SQL Editor).
2. **API — Render** (*Web Service* com Docker, região Virginia), configurado pelo [`render.yaml`](render.yaml):
   - `Dockerfile`: `backend/Dockerfile`, contexto: raiz do repositório; *health check*: `/health`;
   - variáveis: `ConnectionStrings__Default` (Session Pooler do Supabase) e `Cors__AllowedOrigins__0` (URL da Vercel);
   - *deploy* automático a cada *push* na `main`.
3. **Front-end — Vercel**: projeto importado do GitHub com *Root Directory* `frontend`,
   *preset* Vite e variável `VITE_API_URL` = URL da API no Render. O `vercel.json` trata as rotas da SPA.
4. **Integração contínua — GitHub Actions** ([`ci.yml`](.github/workflows/ci.yml)):
   build + testes da API contra PostgreSQL real · lint + testes + build do front · `docker compose up`
   com verificação ponta a ponta (API, banco e front-end via Nginx).
5. **Manter ativo** ([`manter-ativo.yml`](.github/workflows/manter-ativo.yml)): chama `/health` a cada 14 min em horário
   comercial, evitando a hibernação do Render e a pausa do Supabase (variável de repositório `API_URL`).
6. **Pacote de publicação** ([`publicacao.yml`](.github/workflows/publicacao.yml)): gera o **ZIP** com a API compilada,
   o front-end compilado, os scripts do banco e a documentação, anexado à
   [Release do GitHub](https://github.com/Cris-noscore/sesi-catalogo-cursos/releases).

---

## 12. Limitações conhecidas

Resumo (detalhes, itens não concluídos e diferenças em relação ao Figma em **[LIMITACOES.md](LIMITACOES.md)**):

- **Sem integração real com o Moodle** (diferencial opcional): o modelo de dados espelha os campos do Moodle,
  mas os dados vêm do banco próprio.
- **Hospedagem gratuita**: a API pode levar ~50 s no primeiro acesso após inatividade (mitigado pelo workflow
  "manter ativo" e pela tela de carregamento); limites de uso dos planos gratuitos.
- **Sem autenticação**: "Matricule-se" e "Área do aluno" levam a uma demonstração do AVA; o progresso das aulas é
  salvo apenas no navegador.
- **Sem cadastro/edição/exclusão de cursos** (fora do escopo, conforme o enunciado).
- **Fotos dos cursos** não fornecidas nos materiais: foram usadas imagens livres equivalentes (Pexels).

---

## 13. Testes e qualidade

Detalhes completos em **[docs/TESTES.md](docs/TESTES.md)**. Tudo roda no GitHub Actions a cada *push*.

| Suíte | Ferramentas | Resultado |
|---|---|---|
| Back-end — unidade e integração (API ↔ PostgreSQL real) | xUnit, `WebApplicationFactory`, coverlet, ReportGenerator | **40/40** · cobertura 84% das linhas |
| Front-end — unidade e interface | Vitest, Testing Library, user-event | **27/27** · cobertura 92% das linhas |
| E2E em navegador real (desktop e mobile) | Playwright + Docker Compose | **46/46** cenários |
| Acessibilidade automatizada (WCAG 2.1 A/AA, 6 páginas) | axe-core (Deque) | **0 violações** |
| Qualidade estática | ESLint, TypeScript estrito | sem erros |

Os testes de requisitos verificam **cada funcionalidade obrigatória do enunciado**, incluindo os estados de carregamento
e de erro (simulados na rede) e os mínimos de dados fictícios. Os testes também encontraram problemas reais,
documentados e corrigidos: contraste insuficiente e ordem de foco do teclado.

---

## 14. Atendimento aos requisitos

| Requisito do enunciado | Onde |
|---|---|
| Front-end baseado no Figma, responsivo e acessível | `frontend/` · seções [9](#9-estratégia-de-responsividade) e [10](#10-decisões-de-acessibilidade) |
| Back-end em C#/.NET + API de consulta | `backend/` · seção [7](#7-endpoints) |
| Banco de código aberto | PostgreSQL · seção [6](#6-configuração-do-banco) |
| Integração front ↔ API ↔ banco | Cliente `frontend/src/api` → API → EF Core → PostgreSQL |
| Listar via API · pesquisar por nome · filtrar por categoria/modalidade/status · combinar | Página `/cursos` · `GET /api/cursos` |
| Quantidade de resultados · limpar filtros · detalhes do curso | Página `/cursos` e `/cursos/:id` |
| Mensagem de nenhum resultado · carregamento · erro | Componentes `Estados`, esqueletos e `aria-live` |
| Publicação · documentação · registro de IA | Seção [11](#11-processo-de-publicação) · este README · [USO_DE_IA.md](USO_DE_IA.md) |
| Scripts/migrations do banco | `database/migrations` |
| ZIP com os arquivos de publicação | [Releases](https://github.com/Cris-noscore/sesi-catalogo-cursos/releases) |
| Limitações e diferenças em relação ao Figma | [LIMITACOES.md](LIMITACOES.md) |

---

<sub>Projeto desenvolvido por Cristiano Silveira para o processo seletivo 519/2026 — Desenvolvedor de Sistemas I.
Marcas e identidade visual pertencem aos seus titulares e foram usadas apenas conforme os materiais fornecidos para o teste.
Fonte Open Sans sob licença SIL OFL 1.1.</sub>
