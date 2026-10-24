# Estratégia de testes e qualidade

A solução segue a **pirâmide de testes**: muitos testes rápidos de unidade e integração, e uma camada menor de
testes ponta a ponta (E2E) em navegador real, além de auditoria automática de acessibilidade.
Tudo roda no **GitHub Actions** a cada *push*
([workflow CI](../.github/workflows/ci.yml) · [execuções](https://github.com/Cris-noscore/sesi-catalogo-cursos/actions/workflows/ci.yml)).

```
                    ┌───────────────────────────────┐
                    │  E2E · Playwright + axe-core  │  46 cenários (23 × desktop e mobile)
                    │  navegador real, app completa │  inclui auditoria WCAG 2.1 AA
                ┌───┴───────────────────────────────┴───┐
                │  Integração · xUnit + WebApplication  │  API ↔ EF Core ↔ PostgreSQL real
                │  Factory  ·  Interface · Vitest + RTL │  telas com API simulada
            ┌───┴───────────────────────────────────────┴───┐
            │  Unidade · xUnit / Vitest                     │  regras puras (busca, validação…)
            └───────────────────────────────────────────────┘
```

## 1. Ferramentas

| Camada | Ferramenta | Por que é padrão de mercado |
|---|---|---|
| Back-end — unidade e integração | **xUnit** + **Microsoft.AspNetCore.Mvc.Testing** (`WebApplicationFactory`) | Framework de testes mais usado no ecossistema .NET; sobe a API em memória e faz requisições HTTP reais |
| Back-end — banco | **PostgreSQL 16** real (container de serviço no CI / Docker local) | Evita falsos positivos de bancos "em memória"; testa o SQL e as migrações de verdade |
| Back-end — cobertura | **coverlet** + **ReportGenerator** | Padrão do `dotnet test`; relatório HTML e resumo no CI |
| Front-end — unidade e interface | **Vitest** + **Testing Library** + **user-event** | Testa o comportamento do ponto de vista do usuário (papéis ARIA, textos), não detalhes de implementação |
| Front-end — cobertura | **@vitest/coverage-v8** | Cobertura nativa do V8 |
| E2E | **Playwright** (Microsoft) | Navegador real (Chromium), *traces*, capturas em falhas, emulação de dispositivos móveis |
| Acessibilidade | **axe-core** (Deque) via `@axe-core/playwright` | Motor de regras WCAG usado no Lighthouse, no Chrome DevTools e em auditorias profissionais |
| Qualidade estática | **ESLint** + **TypeScript** estrito | Evita erros comuns e garante tipagem do contrato da API |
| Integração contínua | **GitHub Actions** | Executa todas as camadas acima a cada alteração |

## 2. O que é testado

### Back-end (40 testes — `backend/tests`)

| Grupo | Cenários |
|---|---|
| **Requisitos do edital** | ≥ 6 cursos, ≥ 3 categorias, ≥ 2 modalidades, ≥ 3 status em uso; cargas horárias e públicos diferentes; todos os campos obrigatórios preenchidos |
| Pesquisa | Sem acento, maiúsculas e acento, vários termos fora de ordem, nome breve, curingas `%`/`_` tratados como texto |
| Filtros | Por categoria; vários valores no mesmo filtro; busca + 3 filtros combinados; total por categoria = total geral; destaque |
| Listagem | Paginação sem sobreposição; ordenação por carga horária; nenhum resultado → lista vazia e total 0 |
| Detalhe | Módulos e aulas em ordem; soma das cargas dos módulos = carga do curso; 404 com `ProblemDetails` |
| Validação | `pagina=0`, `tamanhoPagina=500`, `ordenacao` inválida → 400 `application/problem+json` |
| Infraestrutura | `/health`, documento OpenAPI, ícones servidos, migrações idempotentes, scripts em ordem |
| Unidade | Normalização da busca, escape do LIKE, *slugs*, validação de parâmetros, conversão de string de conexão (URI → Npgsql) |

### Front-end (27 testes — `frontend/src/**/*.test.ts(x)`)

| Tela | Cenários |
|---|---|
| Catálogo | Lista e contador; filtro + URL + limpar; pesquisa com *debounce* + estado vazio; erro + tentar novamente; carregamento |
| Detalhes | Campos obrigatórios e título da aba; acordeão de módulos/aulas; matrícula → AVA; curso encerrado sem matrícula; 404; erro 500; id inválido não chama a API |
| AVA | Conteúdo da aula; concluir e avançar + progresso salvo; navegação anterior/próxima/lateral; pesquisa de aulas; curso inexistente |
| Home | Vitrine com `destaque=true`; números e estrelas com rótulos acessíveis; erro na vitrine; menu mobile (abre/fecha com Esc); navegação |
| Utilitários | Datas sem fuso, durações, pluralização, normalização da busca, montagem da query string |

### E2E e acessibilidade (46 execuções — `e2e/tests`)

Cada cenário roda em **desktop (1440 × 900)** e **mobile (Pixel 7)**, contra a aplicação completa
(Docker Compose: PostgreSQL + API + front-end no Nginx):

- todas as **funcionalidades obrigatórias** do enunciado: listar via API, pesquisar, filtrar por categoria/modalidade/status,
  combinar, contador, limpar, detalhes, nenhum resultado, **carregamento** (atraso simulado na rede) e **erro**
  (falha 500 simulada + "Tentar novamente");
- filtros preservados ao voltar da página de detalhes; curso inexistente; matrícula → AVA → concluir aula → progresso;
  cursos encerrados sem matrícula; vitrine da home; navegação pelo menu (inclusive mobile);
- **responsividade**: nenhuma página com rolagem horizontal;
- **acessibilidade (axe-core, WCAG 2.0/2.1 A e AA)** em 6 páginas: Home, Catálogo, Catálogo sem resultados, Detalhes, AVA
  e Área do aluno — **zero violações**; foco do teclado no link "Pular para o conteúdo"; contador com `aria-live`.

## 3. Resultados

Os números abaixo são da [execução de referência no CI](https://github.com/Cris-noscore/sesi-catalogo-cursos/actions/runs/40119326247). Cada execução mostra os números atualizados nas
anotações e no resumo do *job*, e os relatórios ficam disponíveis como artefatos.

| Suíte | Resultado | Cobertura |
|---|---|---|
| Back-end (xUnit) | 40/40 aprovados | 84,1% das linhas · 58,8% dos ramos |
| Front-end (Vitest) | 27/27 aprovados | 91,7% das linhas · 86,1% dos ramos |
| E2E + acessibilidade (Playwright + axe) | 46/46 aprovados | 0 violações WCAG A/AA |

Artefatos publicados em cada execução: `backend-testes-e-cobertura` (TRX + HTML do ReportGenerator),
`frontend-cobertura` (HTML do Vitest) e `relatorio-playwright` (relatório HTML com *traces* e capturas das falhas).

## 4. Problemas reais encontrados pelos testes

| Teste | Problema encontrado | Correção |
|---|---|---|
| axe-core (Home) | Cargo dos depoimentos em branco 85% sobre vermelho: contraste **4,09:1** (< 4,5:1) | Texto em branco sólido (5,37:1) |
| Playwright (teclado) | O foco era movido para o `<main>` já no carregamento inicial, então o primeiro *Tab* pulava o link "Pular para o conteúdo" | O foco só é movido em trocas de página |
| xUnit (busca) | Após trocar os dados fictícios pelos do Figma, um termo de teste deixou de existir | Teste atualizado para outro termo de vários termos |

## 5. Como executar

```bash
# Back-end (precisa de PostgreSQL: docker compose up -d db)
cd backend
dotnet test                                         # testes
dotnet test --collect:"XPlat Code Coverage"         # + cobertura (coverage.cobertura.xml)

# Front-end
cd frontend
npm test -- --run          # testes
npm run test:cobertura     # + cobertura (frontend/coverage/index.html)
npm run lint

# E2E + acessibilidade (com a aplicação no ar via Docker)
docker compose up -d --build
cd e2e
npm ci
npx playwright install --with-deps chromium
npm test                   # relatório: npx playwright show-report

# E2E contra a versão publicada
BASE_URL=https://sesi-catalogo-cursos.vercel.app npm test
```
