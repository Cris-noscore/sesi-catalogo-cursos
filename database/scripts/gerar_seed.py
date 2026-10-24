"""Gera database/migrations/V002__dados_ficticios.sql.

Os 6 primeiros cursos (nomes, categorias, resumos, data e descrição do curso 1)
foram transcritos do protótipo do Figma; os 4 últimos completam as categorias
Linguagens e Sustentabilidade (ícones fornecidos nos materiais do teste).
O script garante consistência: soma das cargas dos módulos == carga do curso.

Uso: python3 database/scripts/gerar_seed.py database/migrations/V002__dados_ficticios.sql
"""
import sys

categorias = [
    (1, "Ciências da Natureza", "ciencias-da-natureza", "icon-ciencias-natureza-20px.svg",
     "Física, química e ciência dos materiais aplicadas aos processos industriais."),
    (2, "Linguagens", "linguagens", "icon-linguagens-20px.svg",
     "Comunicação, leitura técnica e línguas estrangeiras no trabalho."),
    (3, "Matemática", "matematica", "icon-matematica-20px.svg",
     "Medidas, geometria, estatística e raciocínio quantitativo para a indústria."),
    (4, "Sustentabilidade", "sustentabilidade", "icon-sustentabilidade-20px.svg",
     "Uso consciente de recursos, economia circular e eficiência na produção."),
]
modalidades = [
    (1, "EAD autoinstrucional", "ead-autoinstrucional", "100% on-line, no seu ritmo, sem mediação de tutor."),
    (2, "EAD com tutoria", "ead-com-tutoria", "100% on-line, com acompanhamento de tutor e cronograma definido."),
    (3, "Semipresencial", "semipresencial", "Atividades on-line combinadas com encontros presenciais."),
]
status = [
    (1, "Inscrições abertas", "inscricoes-abertas", 1),
    (2, "Em breve", "em-breve", 2),
    (3, "Encerrado", "encerrado", 3),
]

BOAS_PRATICAS = (
    "Se você está interessado em se aprofundar em Matemática para a Precisão, especialmente em Medidas e "
    "Escalas na Metalurgia, aqui estão algumas dicas para maximizar sua experiência online. Primeiro, crie um "
    "espaço de estudo livre de distrações, onde você possa se concentrar totalmente no material.\n\n"
    "Estabeleça uma rotina de estudos, reservando horários específicos para assistir às aulas e realizar as "
    "atividades. Além disso, interaja com seus colegas e instrutores nos fóruns e chats disponíveis, pois isso "
    "enriquece o aprendizado e ajuda a esclarecer dúvidas. Não se esqueça de revisar o conteúdo regularmente e "
    "aplicar os conhecimentos em situações práticas sempre que possível.\n\n"
    "Por fim, mantenha-se atualizado sobre as novas técnicas e normas em medidas e escalas na metalurgia, já "
    "que essa área está sempre evoluindo. Com dedicação e as estratégias corretas, você estará preparado para "
    "se destacar no setor!"
)
RECOMENDACOES = (
    "Se você está interessado em se aprofundar na matemática aplicada à metalurgia, aqui estão algumas dicas "
    "valiosas. Primeiro, escolha um curso que ofereça uma abordagem prática, com aulas que incluam exercícios e "
    "estudos de caso. Isso ajudará a entender como aplicar medidas e escalas na prática. Além disso, verifique se "
    "o curso é reconhecido por instituições relevantes, pois isso pode impactar sua formação e carreira.\n\n"
    "Outro aspecto importante é a experiência dos instrutores. Procure cursos que tenham profissionais com "
    "experiência no setor, pois eles podem compartilhar insights valiosos que vão além da teoria.\n\n"
    "Considere também a carga horária e a flexibilidade do curso. Se você trabalha, um curso que ofereça aulas "
    "noturnas ou aos finais de semana pode ser mais conveniente.\n\n"
    "Por fim, não se esqueça de se conectar com outros alunos e profissionais da área. Isso pode abrir portas e "
    "proporcionar um aprendizado ainda mais enriquecedor. Investir em um bom curso de matemática para a "
    "metalurgia é essencial para garantir precisão e eficiência no trabalho."
)

# (nome, breve, resumo, descricao, cat, mod, status, carga, publico, imagem, alt, data, destaque, modulos)
# modulos: (titulo, descricao, carga, [(titulo, descricao, minutos)])
cursos = [
    # ------------------------------------------------------------------ Figma
    ("Matemática para a Precisão: Medidas e Escalas na Metalurgia", "MAT-PRECISAO-01",
     "Aplicação de grandezas, proporções e escalas em processos de corte, furação e usinagem.",
     "Explore nosso curso de Matemática para a Precisão: Medidas e Escalas na Metalurgia, perfeito para quem "
     "deseja se destacar nesse campo! Este programa abrangente foi desenvolvido para capacitar profissionais com "
     "as habilidades e conhecimentos fundamentais para garantir medições precisas e eficientes no ambiente metalúrgico.",
     3, 2, 1, 40, "Operadores de máquinas, técnicos em metalurgia e estudantes de cursos técnicos industriais.",
     "cursos/matematica-precisao.webp", "Mãos medindo uma peça metálica com um paquímetro em um torno.",
     "2026-01-05", True,
     [("Introdução", "Apresentação do curso, ambientação no AVA e orientações de estudo.", 2,
       [("Introdução", "Boas-vindas! Neste curso você vai aprender a aplicar grandezas, proporções e escalas em "
         "processos reais de corte, furação e usinagem. Conheça a estrutura dos módulos, as avaliações e os canais "
         "de suporte disponíveis no ambiente virtual.", 20),
        ("Boas práticas", BOAS_PRATICAS, 25),
        ("Extras", RECOMENDACOES, 25)]),
      ("Grandezas e unidades de medida", "Sistema Internacional, conversões e notação científica no chão de fábrica.", 6,
       [("Sistema Internacional de Unidades", "Unidades de base e derivadas usadas na metalurgia.", 45),
        ("Conversão de unidades", "Milímetros, polegadas e frações de polegada na prática.", 50),
        ("Algarismos significativos", "Como registrar medidas sem perder precisão.", 40)]),
      ("Instrumentos de medição", "Paquímetro, micrômetro e relógio comparador.", 8,
       [("Paquímetro", "Leitura do nônio em milímetros e polegadas.", 55),
        ("Micrômetro", "Leitura centesimal e milesimal.", 55),
        ("Erros de medição", "Paralaxe, temperatura e calibração dos instrumentos.", 45)]),
      ("Proporções e escalas", "Razões, proporções e escalas em desenho técnico.", 6,
       [("Razão e proporção", "Aplicações em misturas, velocidades e engrenagens.", 45),
        ("Escalas de ampliação e redução", "Leitura de desenhos técnicos em escala.", 50)]),
      ("Tolerâncias e ajustes", "Limites dimensionais e sistema ISO de ajustes.", 6,
       [("Tolerância dimensional", "Dimensão nominal, afastamentos e campo de tolerância.", 50),
        ("Ajustes com folga e interferência", "Seleção de ajustes para montagem de peças.", 50)]),
      ("Cálculos de usinagem", "Velocidade de corte, rotação e avanço.", 8,
       [("Velocidade de corte e rotação", "Cálculo da rotação ideal para cada material.", 55),
        ("Furação", "Cálculos de broca, avanço e tempo de furação.", 50),
        ("Torneamento e fresamento", "Parâmetros de corte em operações de usinagem.", 55)]),
      ("Projeto prático", "Planejamento dimensional de uma peça usinada.", 4,
       [("Estudo de caso", "Análise de um desenho técnico e definição do processo.", 60),
        ("Avaliação final", "Questionário e entrega do projeto.", 60)])]),

    ("Geometria e Modelagem no Design Têxtil", "MAT-GEOTEX-01",
     "Explora formas geométricas, simetria e padrões matemáticos presentes em tecidos e estampas.",
     "Descubra como a geometria está presente em cada tecido e estampa. O curso apresenta formas planas, "
     "simetrias, transformações geométricas e padrões de repetição, conectando a matemática ao processo criativo "
     "e produtivo da indústria têxtil, da modelagem de peças ao encaixe para corte com mínimo desperdício.",
     3, 1, 2, 24, "Estudantes, designers e profissionais da indústria têxtil e de confecção.",
     "cursos/geometria-textil.webp", "Tecidos coloridos com estampas geométricas empilhados.",
     "2026-12-07", True,
     [("Formas geométricas no tecido", "Polígonos, círculos e áreas aplicadas à modelagem.", 8,
       [("Polígonos e áreas", "Cálculo de áreas de moldes e retalhos.", 50),
        ("Perímetros e costuras", "Estimativa de linha e acabamentos.", 45),
        ("Encaixe de moldes", "Aproveitamento de tecido no corte.", 55)]),
      ("Simetria e transformações", "Reflexão, rotação e translação em estampas.", 8,
       [("Eixos de simetria", "Identificando simetrias em padrões têxteis.", 45),
        ("Transformações no plano", "Criando estampas por rotação e translação.", 55)]),
      ("Padrões e mosaicos", "Ladrilhamentos e repetições em estamparia.", 8,
       [("Mosaicos e ladrilhamentos", "Padrões que cobrem o plano sem falhas.", 50),
        ("Projeto de estampa", "Criação de uma estampa geométrica autoral.", 70)])]),

    ("Estatística e Controle de Qualidade na Produção", "MAT-ESTAT-01",
     "Leitura e interpretação de dados de controle de qualidade e produtividade.",
     "Aprenda a coletar, organizar e interpretar dados de produção para apoiar decisões. O curso aborda "
     "estatística descritiva, gráficos de controle, capacidade de processo e indicadores de produtividade. Os "
     "encontros presenciais são dedicados à análise de dados reais de uma linha produtiva.",
     3, 3, 1, 48, "Profissionais de qualidade, produção e gestão; estudantes de cursos técnicos.",
     "cursos/estatistica-qualidade.webp", "Tablet com painel de indicadores em frente a um braço robótico industrial.",
     "2026-09-14", True,
     [("Dados na produção", "Tipos de variáveis, amostragem e coleta de dados.", 10,
       [("Tipos de variáveis", "Variáveis qualitativas e quantitativas.", 45),
        ("Amostragem", "Como selecionar amostras representativas.", 50),
        ("Tabelas de frequência", "Organizando dados brutos.", 50)]),
      ("Estatística descritiva", "Medidas de tendência central e de dispersão.", 12,
       [("Média, mediana e moda", "Quando usar cada medida.", 55),
        ("Desvio padrão", "Medindo a variabilidade de um processo.", 60),
        ("Boxplot e histograma", "Visualizando a distribuição dos dados.", 55)]),
      ("Controle Estatístico de Processo", "Cartas de controle e capacidade.", 14,
       [("Cartas de controle", "Limites de controle e causas especiais.", 65),
        ("Capacidade do processo", "Índices Cp e Cpk.", 60),
        ("Ferramentas da qualidade", "Pareto, Ishikawa e 5 porquês.", 55)]),
      ("Indicadores e projeto", "KPIs de produtividade e projeto presencial.", 12,
       [("Indicadores de produtividade", "OEE, refugo e retrabalho.", 55),
        ("Projeto presencial", "Análise de dados reais de uma linha produtiva.", 120)])]),

    ("Física do Movimento e da Energia na Metalurgia", "CN-FISMET-01",
     "Estudo de forças, atrito, calor e energia em máquinas, fornos e prensas.",
     "Entenda os princípios físicos por trás dos equipamentos metalúrgicos. O curso trata de movimento, forças, "
     "atrito, trabalho, energia e transferência de calor, sempre com exemplos de máquinas, fornos e prensas, e "
     "conta com tutoria para acompanhar as atividades práticas e simulações.",
     1, 2, 2, 40, "Técnicos de manutenção, operadores de prensas e fornos e estudantes do Ensino Médio técnico.",
     "cursos/fisica-metalurgia.webp", "Faíscas saindo de uma peça de metal sendo esmerilhada.",
     "2026-11-16", True,
     [("Movimento e forças", "Cinemática e leis de Newton em sistemas mecânicos.", 10,
       [("Velocidade e aceleração", "Movimento de esteiras e pontes rolantes.", 50),
        ("Leis de Newton", "Forças em prensas e mecanismos.", 60)]),
      ("Atrito e máquinas simples", "Atrito, alavancas, polias e engrenagens.", 10,
       [("Atrito estático e dinâmico", "Desgaste e lubrificação de componentes.", 50),
        ("Máquinas simples", "Vantagem mecânica em equipamentos.", 55)]),
      ("Trabalho, energia e potência", "Transformações de energia e rendimento.", 10,
       [("Trabalho e energia", "Energia cinética e potencial em máquinas.", 55),
        ("Potência e rendimento", "Eficiência de motores e prensas.", 55)]),
      ("Calor e temperatura", "Transferência de calor em fornos e tratamentos térmicos.", 10,
       [("Condução, convecção e radiação", "Como o calor se propaga nos fornos.", 60),
        ("Dilatação térmica", "Efeitos da temperatura nas dimensões das peças.", 50),
        ("Tratamentos térmicos", "Têmpera, revenimento e recozimento.", 55)])]),

    ("Química e Sustentabilidade", "CN-QUISUS-01",
     "Estudo das reações químicas envolvidas na tinturaria e acabamento de tecidos.",
     "Conheça a química por trás do tingimento e do acabamento têxtil e como torná-los mais sustentáveis. O "
     "curso aborda corantes, pH, reações de fixação, tratamento de efluentes e alternativas de menor impacto "
     "ambiental para os processos de beneficiamento.",
     1, 1, 1, 20, "Profissionais de tinturaria e beneficiamento têxtil, estudantes e interessados em química verde.",
     "cursos/quimica-sustentabilidade.webp", "Frasco de laboratório com líquido vermelho sobre a bancada.",
     "2026-08-03", True,
     [("Fundamentos de química", "Substâncias, soluções e pH.", 6,
       [("Soluções e concentração", "Preparo de banhos de tingimento.", 45),
        ("Ácidos, bases e pH", "Controle de pH no processo têxtil.", 45)]),
      ("Química do tingimento", "Corantes, fibras e reações de fixação.", 8,
       [("Classes de corantes", "Corantes reativos, dispersos e ácidos.", 50),
        ("Fixação e solidez", "Como o corante se liga à fibra.", 50),
        ("Acabamentos químicos", "Amaciantes, resinas e repelentes.", 45)]),
      ("Processos sustentáveis", "Efluentes, reuso de água e química verde.", 6,
       [("Tratamento de efluentes", "Etapas e indicadores de qualidade da água.", 50),
        ("Química verde", "Princípios e alternativas de menor impacto.", 45)])]),

    ("Ciência dos Materiais na Metalurgia", "CN-MATMET-01",
     "Conceitos básicos de estrutura, resistência e propriedades dos metais.",
     "Estude a estrutura interna dos metais e como ela determina suas propriedades. O curso apresenta ligas, "
     "diagramas de fase, ensaios mecânicos e critérios de seleção de materiais, com aulas práticas presenciais "
     "em laboratório de ensaios.",
     1, 3, 3, 36, "Técnicos e tecnólogos em metalurgia, mecânica e manutenção industrial.",
     "cursos/ciencia-materiais.webp", "Volante e componentes metálicos de uma máquina industrial.",
     "2026-03-02", True,
     [("Estrutura dos metais", "Ligações metálicas e estruturas cristalinas.", 8,
       [("Ligação metálica", "Por que os metais conduzem e se deformam.", 50),
        ("Estruturas cristalinas", "CCC, CFC e HC.", 55)]),
      ("Ligas e diagramas de fase", "Aços, ferros fundidos e ligas não ferrosas.", 10,
       [("Diagrama ferro-carbono", "Fases e microestruturas dos aços.", 60),
        ("Ligas não ferrosas", "Alumínio, cobre e suas aplicações.", 50)]),
      ("Propriedades e ensaios", "Ensaios de tração, dureza e impacto.", 10,
       [("Ensaio de tração", "Limite de escoamento e resistência.", 55),
        ("Dureza e impacto", "Brinell, Rockwell e Charpy.", 55),
        ("Aula prática presencial", "Ensaios no laboratório de materiais.", 120)]),
      ("Seleção de materiais", "Critérios técnicos, custo e sustentabilidade.", 8,
       [("Critérios de seleção", "Resistência, usinabilidade e custo.", 50),
        ("Estudo de caso", "Escolha de material para um componente.", 60)])]),

    # ------------------------------------------------- complementares (Linguagens / Sustentabilidade)
    ("Comunicação Assertiva no Ambiente Industrial", "LIN-COMASS-01",
     "Expresse ideias com clareza e respeito em reuniões, turnos e equipes.",
     "Desenvolva uma comunicação clara, objetiva e respeitosa no dia a dia da indústria. O curso trabalha "
     "escuta ativa, feedback, comunicação em passagens de turno e redação de mensagens e relatórios curtos, "
     "com situações reais do chão de fábrica.",
     2, 1, 1, 16, "Líderes de equipe, supervisores e profissionais de qualquer área da indústria.",
     "cursos/comunicacao-assertiva.webp", "Equipe de trabalhadores conversando em uma reunião na fábrica.",
     "2026-07-01", False,
     [("Fundamentos da comunicação", "Elementos da comunicação e ruídos.", 4,
       [("O processo de comunicação", "Emissor, mensagem, canal e receptor.", 35),
        ("Ruídos e barreiras", "O que atrapalha a comunicação no trabalho.", 35)]),
      ("Assertividade na prática", "Escuta ativa, feedback e conflitos.", 6,
       [("Escuta ativa", "Técnicas para ouvir e compreender.", 40),
        ("Feedback construtivo", "Como dar e receber feedback.", 45),
        ("Gestão de conflitos", "Negociação e resolução de problemas.", 45)]),
      ("Comunicação escrita e de turno", "Mensagens, relatórios e passagem de turno.", 6,
       [("Passagem de turno", "Registro claro de ocorrências.", 40),
        ("E-mails e relatórios curtos", "Estrutura e linguagem profissional.", 45)])]),

    ("Inglês Técnico para a Indústria", "LIN-INGTEC-01",
     "Leia manuais, catálogos e normas técnicas em inglês com segurança.",
     "Curso de inglês instrumental voltado à leitura de materiais técnicos. Desenvolva estratégias de leitura, "
     "amplie o vocabulário técnico e pratique a interpretação de manuais de equipamentos, datasheets e "
     "procedimentos operacionais, com acompanhamento de tutor.",
     2, 2, 2, 60, "Técnicos, operadores e estudantes com conhecimento básico de inglês.",
     "cursos/ingles-tecnico.webp", "Profissional lendo um manual técnico ao lado de um equipamento.",
     "2027-02-01", False,
     [("Estratégias de leitura", "Skimming, scanning e cognatos.", 15,
       [("Cognatos e falsos cognatos", "Palavras parecidas com o português.", 50),
        ("Skimming e scanning", "Leitura rápida e localização de informações.", 60)]),
      ("Vocabulário técnico", "Mecânica, elétrica e segurança.", 15,
       [("Ferramentas e máquinas", "Vocabulário de oficina.", 60),
        ("Segurança do trabalho", "Sinalização e avisos.", 50)]),
      ("Manuais e procedimentos", "Imperativo, instruções e troubleshooting.", 15,
       [("Imperativo em instruções", "Install, check, replace.", 50),
        ("Troubleshooting", "Tabelas de solução de problemas.", 60)]),
      ("Normas e datasheets", "Especificações e normas internacionais.", 15,
       [("Datasheets", "Especificações e unidades.", 60),
        ("Avaliação final", "Interpretação de documentos técnicos.", 90)])]),

    ("Economia Circular na Indústria Têxtil", "SUS-CIRTEX-01",
     "Reduza, reutilize e recicle: transforme resíduos têxteis em valor.",
     "Conheça os princípios da economia circular aplicados à cadeia têxtil. O curso apresenta a Política "
     "Nacional de Resíduos Sólidos, logística reversa, reaproveitamento de retalhos, reciclagem de fibras e "
     "casos de empresas que reduziram custos e impactos ambientais.",
     4, 2, 1, 30, "Gestores, profissionais da indústria têxtil e interessados em sustentabilidade.",
     "cursos/economia-circular.webp", "Retalhos de tecido separados para reciclagem.",
     "2026-10-05", False,
     [("Da economia linear à circular", "Conceitos e modelos de negócio.", 10,
       [("Os limites do modelo linear", "Extrair, produzir e descartar.", 45),
        ("Princípios da economia circular", "Design sem resíduos e manutenção do valor.", 50)]),
      ("Resíduos têxteis", "Classificação, legislação e destinação.", 10,
       [("Política Nacional de Resíduos Sólidos", "Obrigações da indústria.", 55),
        ("Reaproveitamento de retalhos", "Upcycling e novos produtos.", 50),
        ("Reciclagem de fibras", "Processos mecânicos e químicos.", 50)]),
      ("Indicadores e casos", "Métricas de circularidade e estudo de caso.", 10,
       [("Indicadores de circularidade", "Como medir a evolução.", 45),
        ("Estudo de caso", "Plano de redução de resíduos.", 90)])]),

    ("Eficiência Energética na Indústria", "SUS-ENERG-01",
     "Identifique desperdícios e proponha melhorias no consumo de energia.",
     "Aprenda a diagnosticar e reduzir o consumo de energia em ambientes industriais. O curso aborda "
     "tarifação, motores de alto rendimento, iluminação, ar comprimido e energia solar, com visita técnica "
     "presencial para medições em campo.",
     4, 3, 3, 32, "Técnicos de manutenção, eletricistas e gestores de utilidades.",
     "cursos/eficiencia-energetica.webp", "Painéis solares instalados sobre o telhado de um galpão industrial.",
     "2026-04-06", False,
     [("Energia e tarifação", "Demanda, consumo e conta de energia.", 8,
       [("Conceitos de energia elétrica", "Demanda, consumo e fator de potência.", 50),
        ("Leitura da conta de energia", "Modalidades tarifárias.", 50)]),
      ("Diagnóstico energético", "Medições e indicadores.", 8,
       [("Instrumentos de medição", "Analisadores de energia.", 55),
        ("Visita técnica", "Medições em campo.", 180)]),
      ("Sistemas eficientes", "Motores, iluminação e ar comprimido.", 8,
       [("Motores de alto rendimento", "Substituição e inversores de frequência.", 55),
        ("Ar comprimido", "Vazamentos e dimensionamento.", 50)]),
      ("Energia solar", "Geração distribuída e viabilidade.", 8,
       [("Sistemas fotovoltaicos", "Componentes e funcionamento.", 55),
        ("Viabilidade econômica", "Payback e retorno do investimento.", 55)])]),
]


def q(s):
    return "NULL" if s is None else "'" + s.replace("'", "''") + "'"


out = ["""-- =============================================================================
-- V002 - Dados fictícios do catálogo
-- -----------------------------------------------------------------------------
-- Todos os dados são FICTÍCIOS e servem apenas para demonstração.
-- Os 6 cursos em destaque foram transcritos do protótipo do Figma; os demais
-- completam as categorias Linguagens e Sustentabilidade.
-- Requisitos mínimos do edital: 6 cursos, 3 categorias, 2 modalidades, 3 status.
-- Este conjunto: 10 cursos, 4 categorias, 3 modalidades e 3 status.
-- Arquivo gerado por database/scripts/gerar_seed.py (não editar manualmente).
-- =============================================================================
"""]
out.append("INSERT INTO categoria (id, nome, slug, icone, descricao) VALUES")
out.append(",\n".join(f"    ({i}, {q(n)}, {q(s)}, {q(ic)}, {q(d)})" for i, n, s, ic, d in categorias) + "\nON CONFLICT (id) DO NOTHING;\n")
out.append("INSERT INTO modalidade (id, nome, slug, descricao) VALUES")
out.append(",\n".join(f"    ({i}, {q(n)}, {q(s)}, {q(d)})" for i, n, s, d in modalidades) + "\nON CONFLICT (id) DO NOTHING;\n")
out.append("INSERT INTO status_curso (id, nome, slug, ordem) VALUES")
out.append(",\n".join(f"    ({i}, {q(n)}, {q(s)}, {o})" for i, n, s, o in status) + "\nON CONFLICT (id) DO NOTHING;\n")

curso_rows, mod_rows, aula_rows = [], [], []
mid = aid = 0
for cid, c in enumerate(cursos, 1):
    (nc, nb, res, desc, cat, mod, st, carga, pub, img, alt, data, dest, mods) = c
    total = sum(m[2] for m in mods)
    assert total == carga, f"{nc}: módulos somam {total}h, curso tem {carga}h"
    curso_rows.append(
        f"    ({cid}, {q(nc)}, {q(nb)}, {q(res)}, {q(desc)}, {cat}, {mod}, {st}, {carga}, {q(pub)}, "
        f"{q(img)}, {q(alt)}, {q(data)}, {'true' if dest else 'false'})")
    for mo, (mt, md, mc, aulas) in enumerate(mods, 1):
        mid += 1
        mod_rows.append(f"    ({mid}, {cid}, {mo}, {q(mt)}, {q(md)}, {mc})")
        for ao, (at, ad, am) in enumerate(aulas, 1):
            aid += 1
            aula_rows.append(f"    ({aid}, {mid}, {ao}, {q(at)}, {q(ad)}, {am})")

out.append("INSERT INTO curso (id, nome_completo, nome_breve, resumo, descricao, categoria_id, modalidade_id, status_id, "
           "carga_horaria, publico_alvo, imagem_url, imagem_descricao, data_disponibilizacao, destaque) VALUES")
out.append(",\n".join(curso_rows) + "\nON CONFLICT (id) DO NOTHING;\n")
out.append("INSERT INTO modulo (id, curso_id, ordem, titulo, descricao, carga_horaria) VALUES")
out.append(",\n".join(mod_rows) + "\nON CONFLICT (id) DO NOTHING;\n")
out.append("INSERT INTO aula (id, modulo_id, ordem, titulo, descricao, duracao_minutos) VALUES")
out.append(",\n".join(aula_rows) + "\nON CONFLICT (id) DO NOTHING;\n")
out.append("""-- Ajusta as sequências de identidade após inserir IDs explícitos.
SELECT setval(pg_get_serial_sequence('categoria', 'id'),    (SELECT MAX(id) FROM categoria));
SELECT setval(pg_get_serial_sequence('modalidade', 'id'),   (SELECT MAX(id) FROM modalidade));
SELECT setval(pg_get_serial_sequence('status_curso', 'id'), (SELECT MAX(id) FROM status_curso));
SELECT setval(pg_get_serial_sequence('curso', 'id'),        (SELECT MAX(id) FROM curso));
SELECT setval(pg_get_serial_sequence('modulo', 'id'),       (SELECT MAX(id) FROM modulo));
SELECT setval(pg_get_serial_sequence('aula', 'id'),         (SELECT MAX(id) FROM aula));
""")
with open(sys.argv[1], "w", encoding="utf-8", newline="\n") as f:
    f.write("\n".join(out))
print(f"ok: {len(cursos)} cursos, {mid} módulos, {aid} aulas")
