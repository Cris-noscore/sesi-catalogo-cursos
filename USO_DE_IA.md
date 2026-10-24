# Registro do uso de Inteligência Artificial

Conforme o item 4.d das instruções, este documento registra como a IA foi usada no desenvolvimento,
o que foi aproveitado ou descartado, como o conteúdo foi validado e exemplos de erros identificados e corrigidos.

## 1. Ferramenta utilizada

| Ferramenta | Versão / modo | Uso |
|---|---|---|
| **Claude** (Anthropic), em **claude.ai** | Modelo Claude Opus, em modo agente com ambiente de execução (terminal, arquivos, navegador *headless*) | Assistente de desenvolvimento em todas as etapas, sob minha direção e revisão |

## 2. Objetivo do uso

A IA foi usada como **par de programação**: eu defini o problema, as prioridades e as decisões, e revisei os resultados. As finalidades, por etapa:

| Etapa | Finalidade |
|---|---|
| **Análise do enunciado** | Extrair os requisitos do PDF, do e-mail e do .zip e montar um checklist de entregáveis e riscos (prazo, hospedagem gratuita, falta da página de catálogo no Figma) |
| **Arquitetura** | Comparar opções de stack, banco e hospedagem gratuita (Supabase × Neon, Render, Vercel) |
| **Back-end** | Gerar a API .NET, o mapeamento EF Core, o migrador de scripts SQL e os testes xUnit |
| **Banco** | Modelar as tabelas e gerar os dados fictícios a partir dos textos do Figma, com script que valida a consistência das cargas horárias |
| **Front-end** | Transcrever o layout do Figma (a partir de capturas de tela) para componentes React/CSS, extraindo cores, ícones e tipografia dos arquivos fornecidos |
| **Qualidade** | Testes automatizados, CI no GitHub Actions, revisão de acessibilidade (contraste, ARIA, teclado) |
| **Documentação** | Primeira versão deste arquivo, do README e do LIMITACOES, revisadas por mim |

## 3. Prompts relevantes — o que foi aproveitado ou descartado

| # | Prompt (resumo fiel) | Aproveitado | Descartado / ajustado |
|---|---|---|---|
| 1 | *"Preciso fazer esse teste… Primeiro extraia toda a informação, analise o que precisa ser feito, o que será necessário e me passe a explicação antes de começarmos."* (com os 3 anexos) | Checklist de requisitos e entregáveis; proposta de stack (.NET + EF Core + PostgreSQL + React/Vite); plano de execução em etapas | A sugestão inicial de **Neon** para o banco foi trocada por **Supabase**, por preferência minha e familiaridade com a plataforma |
| 2 | *"Faremos o front em React igual você sugeriu, o banco dá para usar o Supabase?"* | Uso do Supabase só como PostgreSQL gerenciado (o front fala apenas com a API .NET); conexão pelo **Session Pooler**, porque a conexão direta é só IPv6 e o Render não suporta; workflow para evitar a pausa do projeto gratuito | Usar o SDK `supabase-js` direto no front foi descartado: quebraria o requisito de integração front → API → banco |
| 3 | Envio das capturas de tela do protótipo (o arquivo do Figma exigia permissão de edição para exportar) | Identificação das 3 telas do protótipo e de que **a página de catálogo com filtros não existe no Figma**; cores extraídas por amostragem dos pixels; textos e dados dos 6 cursos transcritos | O **primeiro conjunto de dados fictícios** gerado pela IA (8 cursos inventados) foi **descartado** e refeito com os 6 cursos do Figma + 4 complementares |
| 4 | Pedido de desenvolvimento da API e dos testes | Estrutura em camadas, DTOs, `ProblemDetails`, busca normalizada no banco, testes de integração com PostgreSQL real, inclusive testes que conferem os **mínimos do edital** | O pacote **Swashbuckle completo** (Swagger gerado por ele) foi trocado pelo **OpenAPI nativo do .NET 10** + só a interface Swagger UI, mais alinhado à versão atual |
| 5 | Pedido de desenvolvimento do front-end fiel ao Figma | Componentes, tokens de design e ícones convertidos dos SVGs fornecidos; busca e filtros guardados na URL | O uso de `AbortSignal.any()` no cliente HTTP foi substituído por uma combinação manual de sinais, porque a API não existe em navegadores mais antigos |

## 4. Como o conteúdo foi validado

Nenhum código gerado foi aceito sem verificação. Validações realizadas:

1. **Testes automatizados no CI** (GitHub Actions, a cada *push*):
   - 40 testes do back-end contra PostgreSQL real (busca, filtros, combinações, paginação, erros e requisitos mínimos de dados);
   - 6 testes de interface do catálogo (Vitest + Testing Library), ESLint e checagem de tipos do TypeScript;
   - teste ponta a ponta com `docker compose up` (banco + API + front-end via Nginx).
2. **Scripts SQL executados** em um PostgreSQL 16 local antes do *commit*, conferindo contagens e a coluna de busca.
3. **Comparação visual com o Figma**: capturas automatizadas (Playwright) das páginas em 1440 px e 390 px,
   comparadas lado a lado com as capturas do protótipo.
4. **Fluxos de interação** reproduzidos no navegador: filtrar, pesquisar, limpar, abrir detalhes, expandir módulos,
   navegar no AVA, menu mobile.
5. **Acessibilidade**: razões de contraste calculadas pela fórmula da WCAG; navegação por teclado; rótulos ARIA conferidos.
6. **Revisão manual** do código, dos textos e da documentação, e execução local na minha máquina com Docker.

## 5. Exemplo de erro ou inadequação identificado

**Problema:** na primeira versão do front-end gerada pela IA, a captura de tela da home mostrou três defeitos visuais:

1. o carrossel "Principais cursos" começava colado na borda esquerda da tela, desalinhado do título;
2. os ícones das redes sociais no rodapé apareciam empilhados na vertical;
3. o botão do menu "hambúrguer" (só para mobile) aparecia também no desktop.

**Causa (diagnosticada a partir das capturas):** conflito de **especificidade e ordem do CSS**. O reset global
`ul[role='list'] { padding: 0 }` tinha especificidade maior que as classes dos componentes, anulando o recuo do
carrossel e o `display: flex` do rodapé. Além disso, o CSS global era importado **depois** do CSS dos componentes,
e a regra genérica `.botao-icone { display: inline-grid }` sobrescrevia `display: none` do botão de menu.

**Inadequação adicional encontrada na revisão:** as cores de status (verde/laranja) definidas para a página de detalhe
"vazaram" para os cards do catálogo, deixando texto verde sobre fundo vermelho, ilegível e sem contraste.

## 6. Correção realizada

- O reset passou a usar `:where()` (`ul:where([role='list'])`), que tem especificidade zero, e as classes dos componentes voltaram a prevalecer.
- A importação do `global.css` foi movida para antes do `App` em `main.tsx`, com comentário explicando a ordem.
- As cores de status foram restritas ao escopo da ficha técnica (`.ficha .status--...`). Nos cards vermelhos, o
  status aparece em branco, com um marcador colorido.
- Novas capturas em desktop e mobile confirmaram a correção, e a experiência foi registrada aqui.

Outros ajustes feitos ao longo do processo:

| Situação | Correção |
|---|---|
| O cinza de texto do Figma (`#9E9E9E`) tem contraste 2,7:1, reprovado na WCAG AA | Trocado por `#6B6B70` (5,3:1) e registrado no LIMITACOES.md |
| Após trocar os dados fictícios pelos do Figma, um teste de busca ("análise dados") deixou de fazer sentido | Teste atualizado para "qualidade controle", mantendo a verificação de vários termos fora de ordem |
| O ambiente da IA não acessava o repositório de pacotes NuGet, então a API não podia ser compilada ali | A compilação e os testes passaram a rodar no GitHub Actions, o que virou um ganho: CI desde o primeiro *commit* |
| Proposta de tentar exportar as imagens pelo modo de edição do Figma | Não foi possível (exige permissão de acesso); a solução foi usar fotos livres equivalentes, registrada como diferença |

## 7. Considerações

A IA acelerou bastante a escrita de código repetitivo, a documentação e a verificação. As decisões de escopo, a escolha
das plataformas, a validação dos resultados e a responsabilidade pelo conteúdo entregue são minhas. Consigo explicar e
modificar qualquer parte da solução, e posso apresentá-la na entrevista técnica.
