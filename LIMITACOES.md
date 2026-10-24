# Limitações, itens não concluídos e diferenças em relação ao Figma

Este documento atende aos itens 9 dos entregáveis ("Relação das limitações ou itens não concluídos") e à
observação "Eventuais diferenças entre o Figma e a aplicação deverão ser identificadas e justificadas".

## 1. Diferenças em relação ao Figma (com justificativa)

O protótipo possui três fluxos: **01. Landing page**, **02. Detalhes curso** e **03. AVA**, apenas em versão desktop.

| # | Diferença | Justificativa |
|---|---|---|
| 1 | **Página "Todos os cursos" (`/cursos`) criada** — não existe no Figma | As funcionalidades obrigatórias (pesquisa, filtros, contador, limpar filtros, estados de vazio/carregamento/erro) não aparecem em nenhuma tela do protótipo, e os botões "Ver todos os cursos" e "Todos os cursos →" apontam para uma página não desenhada. Conforme o enunciado ("o Figma será a referência visual para qualquer página adicional"), a página foi criada reutilizando os componentes do protótipo: cards vermelhos, selos de categoria, botões, tipografia e paleta. |
| 2 | **Versão mobile/tablet criada** | O Figma tem apenas desktop; a responsividade é requisito. As adaptações (menu hambúrguer, filtros recolhíveis, colunas empilhadas) seguem o mesmo estilo. |
| 3 | **Cards do catálogo exibem status, modalidade, carga horária e data** | Os cards da home seguem o Figma (selo, título e resumo). No catálogo, essas informações são necessárias para o usuário comparar cursos e entender o efeito dos filtros. |
| 4 | **Detalhe do curso: imagem do curso no lugar da miniatura de vídeo** | O vídeo não foi fornecido e a "imagem de apresentação" é um campo obrigatório do curso; cada curso mostra a própria imagem, com texto alternativo. A miniatura com botão *play* foi mantida na home (seção "Pronto para transformar sua carreira?") como elemento decorativo. |
| 5 | **Detalhe do curso: ficha técnica adicionada** (carga horária, modalidade, status, conteúdo, público-alvo, nome breve) | O enunciado exige esses campos e o Figma não os exibe. A ficha fica entre a apresentação e os benefícios, sem alterar o restante do layout. |
| 6 | **Botão "Matricule-se" muda conforme o status** ("Inscrições em breve" / "Inscrições encerradas", desabilitado) | Evita oferecer matrícula em cursos indisponíveis. Para cursos com inscrições abertas, abre a tela do AVA (demonstração). |
| 7 | **Acordeão "Módulos" com submódulos e aulas** | O Figma mostra o acordeão fechado. O conteúdo (módulos → aulas com duração) vem da API e atende ao requisito de "módulos e descrições de aulas". "Aulas online e avaliações" varia conforme a modalidade, e "Dúvidas frequentes" traz perguntas fictícias. |
| 8 | **Cinza dos textos secundários escurecido** (`#9E9E9E` → `#6B6B70`) | O cinza original tem contraste de 2,7:1 sobre branco, abaixo do mínimo WCAG AA (4,5:1). O novo tom tem 5,3:1. |
| 9 | **Cores dos selos de Linguagens (azul-claro) e Sustentabilidade (verde-claro)** | O Figma define apenas Matemática (bege) e Ciências da Natureza (lilás). As novas cores seguem o mesmo tom pastel. |
| 10 | **Fotos dos cards diferentes das do protótipo** | As fotos dos cards não estavam nos materiais fornecidos (o zip trazia apenas *hero*, *banner* do AVA e miniatura de vídeo) e o arquivo de design não estava disponível para exportação. Foram usadas fotos de banco de imagens gratuito com temas equivalentes, sob o mesmo tratamento vermelho do protótipo. O curso "Matemática para a Precisão" usa a foto original (paquímetro). |
| 11 | **Vídeo institucional não reproduz** | O arquivo de vídeo não foi fornecido; a miniatura é apenas ilustrativa. |
| 12 | **AVA: progresso salvo no navegador; busca filtra as aulas** | Não há autenticação nem integração com o Moodle. O progresso (barra e ícones de concluída/atual) usa `localStorage` só para demonstrar a interação. |
| 13 | **Links do rodapé sem destino real** ("Blog", "Termos de Uso", cursos populares etc.) aparecem como texto | Esses destinos não fazem parte do escopo; texto não clicável evita links quebrados. "Início", "Cursos", "Sobre" e "Certificação" funcionam. |
| 14 | **Ordem dos cursos em destaque** | A vitrine é ordenada por relevância (destaque → inscrições abertas → em breve → encerrado → nome), vinda da API, e não pela ordem fixa do protótipo. |
| 15 | **Dados complementares** | O Figma traz 6 cursos de 2 categorias; foram criados mais 4 cursos (Linguagens e Sustentabilidade, categorias com ícones fornecidos) para atender ao mínimo de 3 categorias. Datas, cargas, modalidades, status, módulos e aulas também são fictícios e criados para o teste. |

## 2. Limitações conhecidas

- **Integração com o Moodle não implementada** (diferencial opcional). O modelo espelha os campos de curso do
  Moodle (`fullname`, `shortname`, `summary`, `startdate`, categoria), então uma integração futura exigiria
  apenas um serviço que consuma `core_course_get_courses_by_field` / `core_course_get_categories` e preencha as mesmas tabelas.
- **Hospedagem gratuita**:
  - Render: a API hiberna após 15 min sem acesso, e o primeiro acesso seguinte leva ~50 s. Mitigado pelo
    workflow "Manter aplicação ativa" (07h–21h, horário de Brasília), pelo *timeout* de 70 s no front-end e pela tela de carregamento;
  - Supabase: projetos gratuitos pausam após 7 dias sem uso (o mesmo workflow mantém o banco ativo);
  - Indisponibilidade temporária: usar a execução local (`docker compose up --build`, ver README).
- **Sem autenticação/matrícula real**: "Área do aluno" e "Matricule-se" são demonstrações.
- **Sem gerenciamento de cursos (CRUD)**: fora do escopo, conforme o enunciado.
- **Contagens dos filtros são globais** (total de cursos por opção), não recalculadas a cada combinação de filtros.
- **Paginação**: implementada na API e no front (12 por página); com 10 cursos fictícios, a navegação entre
  páginas só aparece com menos itens por página.
- **Busca apenas no nome** (completo e breve), como pede o enunciado; não pesquisa a descrição nem as aulas.
- **Sem SSR/SEO avançado**: SPA renderizada no cliente (adequada a um catálogo dentro do AVA).
- **Testes de interface automatizados** cobrem a página de catálogo (fluxos obrigatórios); as demais páginas foram
  verificadas manualmente e por capturas de tela em vários tamanhos.

## 3. Itens não concluídos

- Integração real com o Moodle (opcional).
- Reprodução do vídeo institucional (arquivo não fornecido).
