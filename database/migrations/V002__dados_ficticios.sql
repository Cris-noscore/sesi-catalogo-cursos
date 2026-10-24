-- =============================================================================
-- V002 - Dados fictícios do catálogo
-- -----------------------------------------------------------------------------
-- Todos os dados são FICTÍCIOS e servem apenas para demonstração.
-- Os 6 cursos em destaque foram transcritos do protótipo do Figma; os demais
-- completam as categorias Linguagens e Sustentabilidade.
-- Requisitos mínimos do edital: 6 cursos, 3 categorias, 2 modalidades, 3 status.
-- Este conjunto: 10 cursos, 4 categorias, 3 modalidades e 3 status.
-- Arquivo gerado por database/scripts/gerar_seed.py (não editar manualmente).
-- =============================================================================

INSERT INTO categoria (id, nome, slug, icone, descricao) VALUES
    (1, 'Ciências da Natureza', 'ciencias-da-natureza', 'icon-ciencias-natureza-20px.svg', 'Física, química e ciência dos materiais aplicadas aos processos industriais.'),
    (2, 'Linguagens', 'linguagens', 'icon-linguagens-20px.svg', 'Comunicação, leitura técnica e línguas estrangeiras no trabalho.'),
    (3, 'Matemática', 'matematica', 'icon-matematica-20px.svg', 'Medidas, geometria, estatística e raciocínio quantitativo para a indústria.'),
    (4, 'Sustentabilidade', 'sustentabilidade', 'icon-sustentabilidade-20px.svg', 'Uso consciente de recursos, economia circular e eficiência na produção.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO modalidade (id, nome, slug, descricao) VALUES
    (1, 'EAD autoinstrucional', 'ead-autoinstrucional', '100% on-line, no seu ritmo, sem mediação de tutor.'),
    (2, 'EAD com tutoria', 'ead-com-tutoria', '100% on-line, com acompanhamento de tutor e cronograma definido.'),
    (3, 'Semipresencial', 'semipresencial', 'Atividades on-line combinadas com encontros presenciais.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO status_curso (id, nome, slug, ordem) VALUES
    (1, 'Inscrições abertas', 'inscricoes-abertas', 1),
    (2, 'Em breve', 'em-breve', 2),
    (3, 'Encerrado', 'encerrado', 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO curso (id, nome_completo, nome_breve, resumo, descricao, categoria_id, modalidade_id, status_id, carga_horaria, publico_alvo, imagem_url, imagem_descricao, data_disponibilizacao, destaque) VALUES
    (1, 'Matemática para a Precisão: Medidas e Escalas na Metalurgia', 'MAT-PRECISAO-01', 'Aplicação de grandezas, proporções e escalas em processos de corte, furação e usinagem.', 'Explore nosso curso de Matemática para a Precisão: Medidas e Escalas na Metalurgia, perfeito para quem deseja se destacar nesse campo! Este programa abrangente foi desenvolvido para capacitar profissionais com as habilidades e conhecimentos fundamentais para garantir medições precisas e eficientes no ambiente metalúrgico.', 3, 2, 1, 40, 'Operadores de máquinas, técnicos em metalurgia e estudantes de cursos técnicos industriais.', 'cursos/matematica-precisao.webp', 'Mãos medindo uma peça metálica com um paquímetro em um torno.', '2026-01-05', true),
    (2, 'Geometria e Modelagem no Design Têxtil', 'MAT-GEOTEX-01', 'Explora formas geométricas, simetria e padrões matemáticos presentes em tecidos e estampas.', 'Descubra como a geometria está presente em cada tecido e estampa. O curso apresenta formas planas, simetrias, transformações geométricas e padrões de repetição, conectando a matemática ao processo criativo e produtivo da indústria têxtil, da modelagem de peças ao encaixe para corte com mínimo desperdício.', 3, 1, 2, 24, 'Estudantes, designers e profissionais da indústria têxtil e de confecção.', 'cursos/geometria-textil.webp', 'Tecidos coloridos com estampas geométricas empilhados.', '2026-12-07', true),
    (3, 'Estatística e Controle de Qualidade na Produção', 'MAT-ESTAT-01', 'Leitura e interpretação de dados de controle de qualidade e produtividade.', 'Aprenda a coletar, organizar e interpretar dados de produção para apoiar decisões. O curso aborda estatística descritiva, gráficos de controle, capacidade de processo e indicadores de produtividade. Os encontros presenciais são dedicados à análise de dados reais de uma linha produtiva.', 3, 3, 1, 48, 'Profissionais de qualidade, produção e gestão; estudantes de cursos técnicos.', 'cursos/estatistica-qualidade.webp', 'Tablet com painel de indicadores em frente a um braço robótico industrial.', '2026-09-14', true),
    (4, 'Física do Movimento e da Energia na Metalurgia', 'CN-FISMET-01', 'Estudo de forças, atrito, calor e energia em máquinas, fornos e prensas.', 'Entenda os princípios físicos por trás dos equipamentos metalúrgicos. O curso trata de movimento, forças, atrito, trabalho, energia e transferência de calor, sempre com exemplos de máquinas, fornos e prensas, e conta com tutoria para acompanhar as atividades práticas e simulações.', 1, 2, 2, 40, 'Técnicos de manutenção, operadores de prensas e fornos e estudantes do Ensino Médio técnico.', 'cursos/fisica-metalurgia.webp', 'Faíscas saindo de uma peça de metal sendo esmerilhada.', '2026-11-16', true),
    (5, 'Química e Sustentabilidade', 'CN-QUISUS-01', 'Estudo das reações químicas envolvidas na tinturaria e acabamento de tecidos.', 'Conheça a química por trás do tingimento e do acabamento têxtil e como torná-los mais sustentáveis. O curso aborda corantes, pH, reações de fixação, tratamento de efluentes e alternativas de menor impacto ambiental para os processos de beneficiamento.', 1, 1, 1, 20, 'Profissionais de tinturaria e beneficiamento têxtil, estudantes e interessados em química verde.', 'cursos/quimica-sustentabilidade.webp', 'Frasco de laboratório com líquido vermelho sobre a bancada.', '2026-08-03', true),
    (6, 'Ciência dos Materiais na Metalurgia', 'CN-MATMET-01', 'Conceitos básicos de estrutura, resistência e propriedades dos metais.', 'Estude a estrutura interna dos metais e como ela determina suas propriedades. O curso apresenta ligas, diagramas de fase, ensaios mecânicos e critérios de seleção de materiais, com aulas práticas presenciais em laboratório de ensaios.', 1, 3, 3, 36, 'Técnicos e tecnólogos em metalurgia, mecânica e manutenção industrial.', 'cursos/ciencia-materiais.webp', 'Volante e componentes metálicos de uma máquina industrial.', '2026-03-02', true),
    (7, 'Comunicação Assertiva no Ambiente Industrial', 'LIN-COMASS-01', 'Expresse ideias com clareza e respeito em reuniões, turnos e equipes.', 'Desenvolva uma comunicação clara, objetiva e respeitosa no dia a dia da indústria. O curso trabalha escuta ativa, feedback, comunicação em passagens de turno e redação de mensagens e relatórios curtos, com situações reais do chão de fábrica.', 2, 1, 1, 16, 'Líderes de equipe, supervisores e profissionais de qualquer área da indústria.', 'cursos/comunicacao-assertiva.webp', 'Equipe de trabalhadores conversando em uma reunião na fábrica.', '2026-07-01', false),
    (8, 'Inglês Técnico para a Indústria', 'LIN-INGTEC-01', 'Leia manuais, catálogos e normas técnicas em inglês com segurança.', 'Curso de inglês instrumental voltado à leitura de materiais técnicos. Desenvolva estratégias de leitura, amplie o vocabulário técnico e pratique a interpretação de manuais de equipamentos, datasheets e procedimentos operacionais, com acompanhamento de tutor.', 2, 2, 2, 60, 'Técnicos, operadores e estudantes com conhecimento básico de inglês.', 'cursos/ingles-tecnico.webp', 'Profissional lendo um manual técnico ao lado de um equipamento.', '2027-02-01', false),
    (9, 'Economia Circular na Indústria Têxtil', 'SUS-CIRTEX-01', 'Reduza, reutilize e recicle: transforme resíduos têxteis em valor.', 'Conheça os princípios da economia circular aplicados à cadeia têxtil. O curso apresenta a Política Nacional de Resíduos Sólidos, logística reversa, reaproveitamento de retalhos, reciclagem de fibras e casos de empresas que reduziram custos e impactos ambientais.', 4, 2, 1, 30, 'Gestores, profissionais da indústria têxtil e interessados em sustentabilidade.', 'cursos/economia-circular.webp', 'Retalhos de tecido separados para reciclagem.', '2026-10-05', false),
    (10, 'Eficiência Energética na Indústria', 'SUS-ENERG-01', 'Identifique desperdícios e proponha melhorias no consumo de energia.', 'Aprenda a diagnosticar e reduzir o consumo de energia em ambientes industriais. O curso aborda tarifação, motores de alto rendimento, iluminação, ar comprimido e energia solar, com visita técnica presencial para medições em campo.', 4, 3, 3, 32, 'Técnicos de manutenção, eletricistas e gestores de utilidades.', 'cursos/eficiencia-energetica.webp', 'Painéis solares instalados sobre o telhado de um galpão industrial.', '2026-04-06', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO modulo (id, curso_id, ordem, titulo, descricao, carga_horaria) VALUES
    (1, 1, 1, 'Introdução', 'Apresentação do curso, ambientação no AVA e orientações de estudo.', 2),
    (2, 1, 2, 'Grandezas e unidades de medida', 'Sistema Internacional, conversões e notação científica no chão de fábrica.', 6),
    (3, 1, 3, 'Instrumentos de medição', 'Paquímetro, micrômetro e relógio comparador.', 8),
    (4, 1, 4, 'Proporções e escalas', 'Razões, proporções e escalas em desenho técnico.', 6),
    (5, 1, 5, 'Tolerâncias e ajustes', 'Limites dimensionais e sistema ISO de ajustes.', 6),
    (6, 1, 6, 'Cálculos de usinagem', 'Velocidade de corte, rotação e avanço.', 8),
    (7, 1, 7, 'Projeto prático', 'Planejamento dimensional de uma peça usinada.', 4),
    (8, 2, 1, 'Formas geométricas no tecido', 'Polígonos, círculos e áreas aplicadas à modelagem.', 8),
    (9, 2, 2, 'Simetria e transformações', 'Reflexão, rotação e translação em estampas.', 8),
    (10, 2, 3, 'Padrões e mosaicos', 'Ladrilhamentos e repetições em estamparia.', 8),
    (11, 3, 1, 'Dados na produção', 'Tipos de variáveis, amostragem e coleta de dados.', 10),
    (12, 3, 2, 'Estatística descritiva', 'Medidas de tendência central e de dispersão.', 12),
    (13, 3, 3, 'Controle Estatístico de Processo', 'Cartas de controle e capacidade.', 14),
    (14, 3, 4, 'Indicadores e projeto', 'KPIs de produtividade e projeto presencial.', 12),
    (15, 4, 1, 'Movimento e forças', 'Cinemática e leis de Newton em sistemas mecânicos.', 10),
    (16, 4, 2, 'Atrito e máquinas simples', 'Atrito, alavancas, polias e engrenagens.', 10),
    (17, 4, 3, 'Trabalho, energia e potência', 'Transformações de energia e rendimento.', 10),
    (18, 4, 4, 'Calor e temperatura', 'Transferência de calor em fornos e tratamentos térmicos.', 10),
    (19, 5, 1, 'Fundamentos de química', 'Substâncias, soluções e pH.', 6),
    (20, 5, 2, 'Química do tingimento', 'Corantes, fibras e reações de fixação.', 8),
    (21, 5, 3, 'Processos sustentáveis', 'Efluentes, reuso de água e química verde.', 6),
    (22, 6, 1, 'Estrutura dos metais', 'Ligações metálicas e estruturas cristalinas.', 8),
    (23, 6, 2, 'Ligas e diagramas de fase', 'Aços, ferros fundidos e ligas não ferrosas.', 10),
    (24, 6, 3, 'Propriedades e ensaios', 'Ensaios de tração, dureza e impacto.', 10),
    (25, 6, 4, 'Seleção de materiais', 'Critérios técnicos, custo e sustentabilidade.', 8),
    (26, 7, 1, 'Fundamentos da comunicação', 'Elementos da comunicação e ruídos.', 4),
    (27, 7, 2, 'Assertividade na prática', 'Escuta ativa, feedback e conflitos.', 6),
    (28, 7, 3, 'Comunicação escrita e de turno', 'Mensagens, relatórios e passagem de turno.', 6),
    (29, 8, 1, 'Estratégias de leitura', 'Skimming, scanning e cognatos.', 15),
    (30, 8, 2, 'Vocabulário técnico', 'Mecânica, elétrica e segurança.', 15),
    (31, 8, 3, 'Manuais e procedimentos', 'Imperativo, instruções e troubleshooting.', 15),
    (32, 8, 4, 'Normas e datasheets', 'Especificações e normas internacionais.', 15),
    (33, 9, 1, 'Da economia linear à circular', 'Conceitos e modelos de negócio.', 10),
    (34, 9, 2, 'Resíduos têxteis', 'Classificação, legislação e destinação.', 10),
    (35, 9, 3, 'Indicadores e casos', 'Métricas de circularidade e estudo de caso.', 10),
    (36, 10, 1, 'Energia e tarifação', 'Demanda, consumo e conta de energia.', 8),
    (37, 10, 2, 'Diagnóstico energético', 'Medições e indicadores.', 8),
    (38, 10, 3, 'Sistemas eficientes', 'Motores, iluminação e ar comprimido.', 8),
    (39, 10, 4, 'Energia solar', 'Geração distribuída e viabilidade.', 8)
ON CONFLICT (id) DO NOTHING;

INSERT INTO aula (id, modulo_id, ordem, titulo, descricao, duracao_minutos) VALUES
    (1, 1, 1, 'Introdução', 'Boas-vindas! Neste curso você vai aprender a aplicar grandezas, proporções e escalas em processos reais de corte, furação e usinagem. Conheça a estrutura dos módulos, as avaliações e os canais de suporte disponíveis no ambiente virtual.', 20),
    (2, 1, 2, 'Boas práticas', 'Se você está interessado em se aprofundar em Matemática para a Precisão, especialmente em Medidas e Escalas na Metalurgia, aqui estão algumas dicas para maximizar sua experiência online. Primeiro, crie um espaço de estudo livre de distrações, onde você possa se concentrar totalmente no material.

Estabeleça uma rotina de estudos, reservando horários específicos para assistir às aulas e realizar as atividades. Além disso, interaja com seus colegas e instrutores nos fóruns e chats disponíveis, pois isso enriquece o aprendizado e ajuda a esclarecer dúvidas. Não se esqueça de revisar o conteúdo regularmente e aplicar os conhecimentos em situações práticas sempre que possível.

Por fim, mantenha-se atualizado sobre as novas técnicas e normas em medidas e escalas na metalurgia, já que essa área está sempre evoluindo. Com dedicação e as estratégias corretas, você estará preparado para se destacar no setor!', 25),
    (3, 1, 3, 'Extras', 'Se você está interessado em se aprofundar na matemática aplicada à metalurgia, aqui estão algumas dicas valiosas. Primeiro, escolha um curso que ofereça uma abordagem prática, com aulas que incluam exercícios e estudos de caso. Isso ajudará a entender como aplicar medidas e escalas na prática. Além disso, verifique se o curso é reconhecido por instituições relevantes, pois isso pode impactar sua formação e carreira.

Outro aspecto importante é a experiência dos instrutores. Procure cursos que tenham profissionais com experiência no setor, pois eles podem compartilhar insights valiosos que vão além da teoria.

Considere também a carga horária e a flexibilidade do curso. Se você trabalha, um curso que ofereça aulas noturnas ou aos finais de semana pode ser mais conveniente.

Por fim, não se esqueça de se conectar com outros alunos e profissionais da área. Isso pode abrir portas e proporcionar um aprendizado ainda mais enriquecedor. Investir em um bom curso de matemática para a metalurgia é essencial para garantir precisão e eficiência no trabalho.', 25),
    (4, 2, 1, 'Sistema Internacional de Unidades', 'Unidades de base e derivadas usadas na metalurgia.', 45),
    (5, 2, 2, 'Conversão de unidades', 'Milímetros, polegadas e frações de polegada na prática.', 50),
    (6, 2, 3, 'Algarismos significativos', 'Como registrar medidas sem perder precisão.', 40),
    (7, 3, 1, 'Paquímetro', 'Leitura do nônio em milímetros e polegadas.', 55),
    (8, 3, 2, 'Micrômetro', 'Leitura centesimal e milesimal.', 55),
    (9, 3, 3, 'Erros de medição', 'Paralaxe, temperatura e calibração dos instrumentos.', 45),
    (10, 4, 1, 'Razão e proporção', 'Aplicações em misturas, velocidades e engrenagens.', 45),
    (11, 4, 2, 'Escalas de ampliação e redução', 'Leitura de desenhos técnicos em escala.', 50),
    (12, 5, 1, 'Tolerância dimensional', 'Dimensão nominal, afastamentos e campo de tolerância.', 50),
    (13, 5, 2, 'Ajustes com folga e interferência', 'Seleção de ajustes para montagem de peças.', 50),
    (14, 6, 1, 'Velocidade de corte e rotação', 'Cálculo da rotação ideal para cada material.', 55),
    (15, 6, 2, 'Furação', 'Cálculos de broca, avanço e tempo de furação.', 50),
    (16, 6, 3, 'Torneamento e fresamento', 'Parâmetros de corte em operações de usinagem.', 55),
    (17, 7, 1, 'Estudo de caso', 'Análise de um desenho técnico e definição do processo.', 60),
    (18, 7, 2, 'Avaliação final', 'Questionário e entrega do projeto.', 60),
    (19, 8, 1, 'Polígonos e áreas', 'Cálculo de áreas de moldes e retalhos.', 50),
    (20, 8, 2, 'Perímetros e costuras', 'Estimativa de linha e acabamentos.', 45),
    (21, 8, 3, 'Encaixe de moldes', 'Aproveitamento de tecido no corte.', 55),
    (22, 9, 1, 'Eixos de simetria', 'Identificando simetrias em padrões têxteis.', 45),
    (23, 9, 2, 'Transformações no plano', 'Criando estampas por rotação e translação.', 55),
    (24, 10, 1, 'Mosaicos e ladrilhamentos', 'Padrões que cobrem o plano sem falhas.', 50),
    (25, 10, 2, 'Projeto de estampa', 'Criação de uma estampa geométrica autoral.', 70),
    (26, 11, 1, 'Tipos de variáveis', 'Variáveis qualitativas e quantitativas.', 45),
    (27, 11, 2, 'Amostragem', 'Como selecionar amostras representativas.', 50),
    (28, 11, 3, 'Tabelas de frequência', 'Organizando dados brutos.', 50),
    (29, 12, 1, 'Média, mediana e moda', 'Quando usar cada medida.', 55),
    (30, 12, 2, 'Desvio padrão', 'Medindo a variabilidade de um processo.', 60),
    (31, 12, 3, 'Boxplot e histograma', 'Visualizando a distribuição dos dados.', 55),
    (32, 13, 1, 'Cartas de controle', 'Limites de controle e causas especiais.', 65),
    (33, 13, 2, 'Capacidade do processo', 'Índices Cp e Cpk.', 60),
    (34, 13, 3, 'Ferramentas da qualidade', 'Pareto, Ishikawa e 5 porquês.', 55),
    (35, 14, 1, 'Indicadores de produtividade', 'OEE, refugo e retrabalho.', 55),
    (36, 14, 2, 'Projeto presencial', 'Análise de dados reais de uma linha produtiva.', 120),
    (37, 15, 1, 'Velocidade e aceleração', 'Movimento de esteiras e pontes rolantes.', 50),
    (38, 15, 2, 'Leis de Newton', 'Forças em prensas e mecanismos.', 60),
    (39, 16, 1, 'Atrito estático e dinâmico', 'Desgaste e lubrificação de componentes.', 50),
    (40, 16, 2, 'Máquinas simples', 'Vantagem mecânica em equipamentos.', 55),
    (41, 17, 1, 'Trabalho e energia', 'Energia cinética e potencial em máquinas.', 55),
    (42, 17, 2, 'Potência e rendimento', 'Eficiência de motores e prensas.', 55),
    (43, 18, 1, 'Condução, convecção e radiação', 'Como o calor se propaga nos fornos.', 60),
    (44, 18, 2, 'Dilatação térmica', 'Efeitos da temperatura nas dimensões das peças.', 50),
    (45, 18, 3, 'Tratamentos térmicos', 'Têmpera, revenimento e recozimento.', 55),
    (46, 19, 1, 'Soluções e concentração', 'Preparo de banhos de tingimento.', 45),
    (47, 19, 2, 'Ácidos, bases e pH', 'Controle de pH no processo têxtil.', 45),
    (48, 20, 1, 'Classes de corantes', 'Corantes reativos, dispersos e ácidos.', 50),
    (49, 20, 2, 'Fixação e solidez', 'Como o corante se liga à fibra.', 50),
    (50, 20, 3, 'Acabamentos químicos', 'Amaciantes, resinas e repelentes.', 45),
    (51, 21, 1, 'Tratamento de efluentes', 'Etapas e indicadores de qualidade da água.', 50),
    (52, 21, 2, 'Química verde', 'Princípios e alternativas de menor impacto.', 45),
    (53, 22, 1, 'Ligação metálica', 'Por que os metais conduzem e se deformam.', 50),
    (54, 22, 2, 'Estruturas cristalinas', 'CCC, CFC e HC.', 55),
    (55, 23, 1, 'Diagrama ferro-carbono', 'Fases e microestruturas dos aços.', 60),
    (56, 23, 2, 'Ligas não ferrosas', 'Alumínio, cobre e suas aplicações.', 50),
    (57, 24, 1, 'Ensaio de tração', 'Limite de escoamento e resistência.', 55),
    (58, 24, 2, 'Dureza e impacto', 'Brinell, Rockwell e Charpy.', 55),
    (59, 24, 3, 'Aula prática presencial', 'Ensaios no laboratório de materiais.', 120),
    (60, 25, 1, 'Critérios de seleção', 'Resistência, usinabilidade e custo.', 50),
    (61, 25, 2, 'Estudo de caso', 'Escolha de material para um componente.', 60),
    (62, 26, 1, 'O processo de comunicação', 'Emissor, mensagem, canal e receptor.', 35),
    (63, 26, 2, 'Ruídos e barreiras', 'O que atrapalha a comunicação no trabalho.', 35),
    (64, 27, 1, 'Escuta ativa', 'Técnicas para ouvir e compreender.', 40),
    (65, 27, 2, 'Feedback construtivo', 'Como dar e receber feedback.', 45),
    (66, 27, 3, 'Gestão de conflitos', 'Negociação e resolução de problemas.', 45),
    (67, 28, 1, 'Passagem de turno', 'Registro claro de ocorrências.', 40),
    (68, 28, 2, 'E-mails e relatórios curtos', 'Estrutura e linguagem profissional.', 45),
    (69, 29, 1, 'Cognatos e falsos cognatos', 'Palavras parecidas com o português.', 50),
    (70, 29, 2, 'Skimming e scanning', 'Leitura rápida e localização de informações.', 60),
    (71, 30, 1, 'Ferramentas e máquinas', 'Vocabulário de oficina.', 60),
    (72, 30, 2, 'Segurança do trabalho', 'Sinalização e avisos.', 50),
    (73, 31, 1, 'Imperativo em instruções', 'Install, check, replace.', 50),
    (74, 31, 2, 'Troubleshooting', 'Tabelas de solução de problemas.', 60),
    (75, 32, 1, 'Datasheets', 'Especificações e unidades.', 60),
    (76, 32, 2, 'Avaliação final', 'Interpretação de documentos técnicos.', 90),
    (77, 33, 1, 'Os limites do modelo linear', 'Extrair, produzir e descartar.', 45),
    (78, 33, 2, 'Princípios da economia circular', 'Design sem resíduos e manutenção do valor.', 50),
    (79, 34, 1, 'Política Nacional de Resíduos Sólidos', 'Obrigações da indústria.', 55),
    (80, 34, 2, 'Reaproveitamento de retalhos', 'Upcycling e novos produtos.', 50),
    (81, 34, 3, 'Reciclagem de fibras', 'Processos mecânicos e químicos.', 50),
    (82, 35, 1, 'Indicadores de circularidade', 'Como medir a evolução.', 45),
    (83, 35, 2, 'Estudo de caso', 'Plano de redução de resíduos.', 90),
    (84, 36, 1, 'Conceitos de energia elétrica', 'Demanda, consumo e fator de potência.', 50),
    (85, 36, 2, 'Leitura da conta de energia', 'Modalidades tarifárias.', 50),
    (86, 37, 1, 'Instrumentos de medição', 'Analisadores de energia.', 55),
    (87, 37, 2, 'Visita técnica', 'Medições em campo.', 180),
    (88, 38, 1, 'Motores de alto rendimento', 'Substituição e inversores de frequência.', 55),
    (89, 38, 2, 'Ar comprimido', 'Vazamentos e dimensionamento.', 50),
    (90, 39, 1, 'Sistemas fotovoltaicos', 'Componentes e funcionamento.', 55),
    (91, 39, 2, 'Viabilidade econômica', 'Payback e retorno do investimento.', 55)
ON CONFLICT (id) DO NOTHING;

-- Ajusta as sequências de identidade após inserir IDs explícitos.
SELECT setval(pg_get_serial_sequence('categoria', 'id'),    (SELECT MAX(id) FROM categoria));
SELECT setval(pg_get_serial_sequence('modalidade', 'id'),   (SELECT MAX(id) FROM modalidade));
SELECT setval(pg_get_serial_sequence('status_curso', 'id'), (SELECT MAX(id) FROM status_curso));
SELECT setval(pg_get_serial_sequence('curso', 'id'),        (SELECT MAX(id) FROM curso));
SELECT setval(pg_get_serial_sequence('modulo', 'id'),       (SELECT MAX(id) FROM modulo));
SELECT setval(pg_get_serial_sequence('aula', 'id'),         (SELECT MAX(id) FROM aula));
