"""Gera database/migrations/V002__dados_ficticios.sql a partir de uma estrutura Python.
Garante consistência: soma das cargas dos módulos == carga horária do curso."""
import sys

categorias = [
    (1, "Ciências da Natureza", "ciencias-da-natureza", "icon-ciencias-natureza-20px.svg", "Química, física e biologia aplicadas ao mundo do trabalho."),
    (2, "Linguagens", "linguagens", "icon-linguagens-20px.svg", "Comunicação, leitura, escrita e línguas estrangeiras."),
    (3, "Matemática", "matematica", "icon-matematica-20px.svg", "Raciocínio lógico, estatística e matemática aplicada."),
    (4, "Sustentabilidade", "sustentabilidade", "icon-sustentabilidade-20px.svg", "Práticas sustentáveis, ESG e uso consciente de recursos."),
]
modalidades = [
    (1, "EAD autoinstrucional", "ead-autoinstrucional", "Estudo 100% on-line, no seu ritmo, sem mediação de tutor."),
    (2, "EAD com tutoria", "ead-com-tutoria", "Estudo on-line com acompanhamento de tutor e prazos definidos."),
    (3, "Semipresencial", "semipresencial", "Atividades on-line combinadas com encontros presenciais."),
]
status = [
    (1, "Inscrições abertas", "inscricoes-abertas", 1),
    (2, "Em breve", "em-breve", 2),
    (3, "Encerrado", "encerrado", 3),
]

# (nome_completo, nome_breve, resumo, descricao, cat, mod, status, publico, imagem, alt, data, destaque, modulos)
# modulos: (titulo, descricao, carga, [(titulo, descricao, minutos)])
cursos = [
    ("Química no Cotidiano Industrial", "QUI-COTID-01",
     "Entenda as reações químicas presentes nos processos industriais e no seu dia a dia.",
     "Curso introdutório que conecta conceitos de química às situações reais da indústria: tratamento de água, produção de alimentos, materiais e segurança no manuseio de produtos. Ao final, você será capaz de interpretar rótulos e fichas de segurança (FISPQ) e reconhecer as principais reações envolvidas em processos produtivos.",
     1, 1, 1, "Estudantes do Ensino Médio e trabalhadores da indústria interessados em ciências.",
     "cursos/quimica-cotidiano.webp", "Laboratório com vidrarias e soluções coloridas sobre a bancada.", "2026-08-03", True,
     [("Fundamentos da matéria", "Estrutura atômica, tabela periódica e ligações químicas de forma prática.", 6,
       [("O que é matéria?", "Estados físicos, propriedades e transformações da matéria.", 40),
        ("Tabela periódica sem mistério", "Como ler a tabela periódica e prever o comportamento dos elementos.", 50),
        ("Ligações químicas", "Ligações iônicas, covalentes e metálicas em materiais do cotidiano.", 45)]),
      ("Reações químicas na indústria", "Tipos de reações e sua aplicação em processos produtivos.", 8,
       [("Balanceamento de equações", "Conservação das massas aplicada a processos industriais.", 50),
        ("Ácidos, bases e pH", "Controle de pH no tratamento de água e efluentes.", 55),
        ("Oxidação e corrosão", "Como a corrosão afeta equipamentos e como evitá-la.", 45)]),
      ("Segurança química", "Manuseio, armazenamento e descarte seguro de produtos químicos.", 6,
       [("Lendo a FISPQ", "Interpretação da Ficha de Informações de Segurança de Produtos Químicos.", 40),
        ("EPIs e boas práticas", "Equipamentos de proteção e procedimentos de emergência.", 35)])]),

    ("Física Aplicada à Automação Industrial", "FIS-AUTOM-01",
     "Cinemática, eletricidade e sensores: a física por trás das máquinas automatizadas.",
     "Explore os princípios físicos que fazem a automação industrial funcionar. O curso aborda movimento, forças, energia, eletricidade e o funcionamento de sensores e atuadores, sempre com exemplos de linhas de produção reais e simulações interativas no ambiente virtual.",
     1, 2, 2, "Estudantes de cursos técnicos e profissionais de manutenção industrial.",
     "cursos/fisica-automacao.webp", "Braço robótico industrial em uma linha de montagem.", "2026-11-16", False,
     [("Movimento e forças", "Cinemática e dinâmica aplicadas a esteiras e robôs.", 10,
       [("Velocidade e aceleração", "Grandezas do movimento em esteiras transportadoras.", 50),
        ("Leis de Newton", "Forças atuando em sistemas mecânicos.", 60),
        ("Atrito e máquinas simples", "Alavancas, polias e engrenagens.", 50)]),
      ("Energia e potência", "Conservação de energia e eficiência de motores.", 10,
       [("Trabalho e energia", "Transformações de energia em equipamentos.", 55),
        ("Potência e rendimento", "Cálculo de eficiência de motores elétricos.", 55)]),
      ("Eletricidade básica", "Circuitos elétricos, Lei de Ohm e segurança elétrica.", 10,
       [("Tensão, corrente e resistência", "Lei de Ohm com exemplos práticos.", 60),
        ("Circuitos série e paralelo", "Montagem e análise de circuitos simples.", 60),
        ("NR-10 em linguagem simples", "Noções de segurança em instalações elétricas.", 40)]),
      ("Sensores e atuadores", "Como as máquinas percebem e agem sobre o ambiente.", 10,
       [("Sensores indutivos e ópticos", "Princípios físicos de detecção.", 55),
        ("Atuadores pneumáticos", "Pressão, vazão e cilindros.", 55),
        ("Projeto final", "Proposta de automação de uma etapa produtiva.", 90)])]),

    ("Comunicação Escrita no Ambiente Profissional", "LIN-COMUN-01",
     "Escreva e-mails, relatórios e comunicados com clareza, objetividade e correção.",
     "Aprenda a produzir textos profissionais claros e eficientes. O curso trabalha planejamento textual, coesão, coerência, revisão gramatical e adequação de linguagem a diferentes públicos, com modelos prontos de e-mails, atas, relatórios técnicos e comunicados internos.",
     2, 1, 1, "Profissionais de qualquer área e estudantes em preparação para o mercado de trabalho.",
     "cursos/comunicacao-escrita.webp", "Pessoa escrevendo em um caderno ao lado de um notebook.", "2026-07-01", True,
     [("Planejando o texto", "Objetivo, público e estrutura antes de escrever.", 4,
       [("Para quem estou escrevendo?", "Definição de público e objetivo do texto.", 30),
        ("Estrutura e roteiro", "Organização de ideias em tópicos.", 35)]),
      ("Clareza e concisão", "Técnicas para textos diretos e fáceis de ler.", 6,
       [("Frases curtas, ideias claras", "Eliminando redundâncias e ambiguidades.", 40),
        ("Coesão e coerência", "Conectivos e progressão de ideias.", 45),
        ("Revisão gramatical essencial", "Os erros mais comuns em textos profissionais.", 50)]),
      ("Gêneros profissionais", "Modelos de e-mail, ata, relatório e comunicado.", 6,
       [("E-mail profissional", "Assunto, saudação, corpo e fechamento.", 35),
        ("Relatório técnico", "Estrutura e linguagem de relatórios.", 50),
        ("Atas e comunicados", "Registro de reuniões e avisos internos.", 35)])]),

    ("Inglês Técnico para a Indústria", "LIN-INGTEC-01",
     "Leia manuais, catálogos e normas técnicas em inglês com segurança.",
     "Curso de inglês instrumental voltado à leitura e compreensão de materiais técnicos da indústria. Você vai desenvolver estratégias de leitura, ampliar o vocabulário técnico e praticar a interpretação de manuais de equipamentos, fichas técnicas e procedimentos operacionais, com apoio de tutor.",
     2, 2, 1, "Técnicos, operadores e estudantes com conhecimento básico de inglês.",
     "cursos/ingles-tecnico.webp", "Manual técnico em inglês aberto sobre uma bancada com ferramentas.", "2026-09-14", False,
     [("Estratégias de leitura", "Skimming, scanning e inferência pelo contexto.", 12,
       [("Cognatos e falsos cognatos", "Palavras parecidas com o português.", 50),
        ("Skimming e scanning", "Leitura rápida e busca de informações específicas.", 60),
        ("Grupos nominais", "Como interpretar sequências de substantivos.", 60)]),
      ("Vocabulário técnico", "Termos de mecânica, elétrica e segurança.", 16,
       [("Ferramentas e máquinas", "Vocabulário de oficina e chão de fábrica.", 60),
        ("Elétrica e eletrônica", "Termos de circuitos e componentes.", 60),
        ("Segurança do trabalho", "Sinalização e avisos de segurança.", 50)]),
      ("Manuais e procedimentos", "Leitura de instruções e verbos no imperativo.", 16,
       [("Imperativo em instruções", "Install, check, replace: verbos de procedimento.", 50),
        ("Lendo um manual de operação", "Estudo de caso com um manual real adaptado.", 70),
        ("Troubleshooting", "Tabelas de solução de problemas.", 60)]),
      ("Normas e fichas técnicas", "Datasheets, normas e catálogos de fornecedores.", 16,
       [("Datasheets", "Especificações e unidades de medida.", 60),
        ("Normas internacionais", "Estrutura de normas ISO e IEC.", 60),
        ("Avaliação final", "Interpretação de um conjunto de documentos técnicos.", 90)])]),

    ("Matemática Financeira para o Dia a Dia", "MAT-FIN-01",
     "Juros, porcentagem e planejamento: decisões financeiras mais conscientes.",
     "Domine os conceitos de matemática financeira usados na vida pessoal e profissional: porcentagem, juros simples e compostos, financiamentos, inflação e investimentos. O curso usa planilhas eletrônicas e simuladores para transformar fórmulas em decisões práticas.",
     3, 1, 3, "Jovens e adultos interessados em organizar as finanças pessoais.",
     "cursos/matematica-financeira.webp", "Calculadora, moedas e um gráfico financeiro impresso.", "2026-03-02", False,
     [("Porcentagem e proporção", "Base para todos os cálculos financeiros.", 6,
       [("Porcentagem na prática", "Descontos, acréscimos e variações.", 40),
        ("Regra de três", "Proporcionalidade direta e inversa.", 40)]),
      ("Juros simples e compostos", "Como o dinheiro cresce ao longo do tempo.", 8,
       [("Juros simples", "Fórmula e aplicações.", 45),
        ("Juros compostos", "O efeito dos juros sobre juros.", 55),
        ("Usando planilhas", "Cálculos financeiros em planilhas eletrônicas.", 60)]),
      ("Crédito e financiamentos", "Parcelas, CET e sistemas de amortização.", 6,
       [("Tabela Price e SAC", "Comparando sistemas de amortização.", 55),
        ("Custo Efetivo Total", "Como comparar propostas de crédito.", 40)]),
      ("Planejamento financeiro", "Orçamento, reserva e investimentos básicos.", 4,
       [("Orçamento pessoal", "Organização de receitas e despesas.", 35),
        ("Primeiros investimentos", "Renda fixa, inflação e rentabilidade real.", 45)])]),

    ("Estatística Básica e Análise de Dados", "MAT-ESTAT-01",
     "Organize, analise e apresente dados para apoiar decisões na indústria.",
     "Aprenda a coletar, organizar e interpretar dados com estatística descritiva, gráficos e noções de probabilidade. Os encontros presenciais são dedicados a projetos práticos com dados de produção, e as atividades on-line trazem exercícios em planilhas e introdução a ferramentas de visualização.",
     3, 3, 2, "Profissionais de qualidade, produção e gestão; estudantes do Ensino Médio e técnico.",
     "cursos/estatistica-dados.webp", "Tela de computador exibindo gráficos de barras e de linhas.", "2027-02-01", True,
     [("Coleta e organização de dados", "Tipos de variáveis, amostragem e tabelas.", 10,
       [("Tipos de variáveis", "Variáveis qualitativas e quantitativas.", 45),
        ("Amostragem", "Como selecionar amostras representativas.", 50),
        ("Tabelas de frequência", "Organização de dados brutos.", 50)]),
      ("Estatística descritiva", "Medidas de tendência central e de dispersão.", 14,
       [("Média, mediana e moda", "Quando usar cada medida.", 55),
        ("Desvio padrão", "Medindo a variabilidade de um processo.", 60),
        ("Quartis e boxplot", "Identificando outliers.", 55)]),
      ("Visualização de dados", "Gráficos que comunicam com clareza.", 12,
       [("Escolhendo o gráfico certo", "Barras, linhas, setores e dispersão.", 50),
        ("Dashboards simples", "Painéis em planilhas eletrônicas.", 70)]),
      ("Probabilidade e controle de qualidade", "Noções de probabilidade e CEP.", 12,
       [("Probabilidade básica", "Eventos, espaço amostral e regras.", 55),
        ("Controle Estatístico de Processo", "Cartas de controle na produção.", 65),
        ("Projeto presencial", "Análise de dados reais de uma linha produtiva.", 120)])]),

    ("Economia Circular e Gestão de Resíduos", "SUS-CIRC-01",
     "Reduza, reutilize e recicle: como a indústria transforma resíduos em valor.",
     "Conheça os princípios da economia circular e as ferramentas de gestão de resíduos sólidos aplicadas à indústria. O curso apresenta a Política Nacional de Resíduos Sólidos, logística reversa, análise de ciclo de vida e casos de empresas que reduziram custos e impactos ambientais.",
     4, 2, 1, "Profissionais da indústria, gestores ambientais e estudantes interessados em sustentabilidade.",
     "cursos/economia-circular.webp", "Contêineres coloridos de coleta seletiva em um pátio industrial.", "2026-10-05", True,
     [("Da economia linear à circular", "Conceitos, princípios e modelos de negócio.", 8,
       [("O modelo linear e seus limites", "Extrair, produzir e descartar.", 45),
        ("Princípios da economia circular", "Design sem resíduos e manutenção do valor.", 50),
        ("Modelos de negócio circulares", "Produto como serviço e remanufatura.", 45)]),
      ("Gestão de resíduos sólidos", "Classificação, legislação e destinação.", 12,
       [("Política Nacional de Resíduos Sólidos", "Principais obrigações da indústria.", 55),
        ("Classificação de resíduos", "Classes de resíduos e destinação adequada.", 50),
        ("Logística reversa", "Responsabilidade compartilhada pelo ciclo de vida.", 50)]),
      ("Indicadores e casos práticos", "Medindo resultados e aprendendo com exemplos.", 10,
       [("Análise de ciclo de vida", "Avaliando impactos do berço ao túmulo.", 60),
        ("Indicadores de circularidade", "Métricas para acompanhar a evolução.", 45),
        ("Estudo de caso", "Plano de redução de resíduos para uma empresa fictícia.", 90)])]),

    ("Eficiência Energética na Indústria", "SUS-ENERG-01",
     "Identifique desperdícios e proponha melhorias no consumo de energia.",
     "Curso voltado ao diagnóstico e à redução do consumo de energia em ambientes industriais. Aborda tarifação, qualidade de energia, motores de alto rendimento, iluminação, ar comprimido e fontes renováveis, com uma visita técnica presencial para medições em campo.",
     4, 3, 3, "Técnicos de manutenção, eletricistas e gestores de utilidades.",
     "cursos/eficiencia-energetica.webp", "Painéis solares instalados sobre o telhado de um galpão industrial.", "2026-04-06", False,
     [("Energia e tarifação", "Como a energia é cobrada e onde estão os custos.", 8,
       [("Conceitos de energia elétrica", "Demanda, consumo e fator de potência.", 50),
        ("Leitura da conta de energia", "Modalidades tarifárias e horários de ponta.", 50)]),
      ("Diagnóstico energético", "Medições, indicadores e oportunidades.", 10,
       [("Instrumentos de medição", "Analisadores de energia e medidores.", 55),
        ("Indicadores de desempenho", "Consumo específico por unidade produzida.", 50),
        ("Visita técnica", "Medições em campo em um ambiente industrial.", 180)]),
      ("Sistemas eficientes", "Motores, iluminação e ar comprimido.", 10,
       [("Motores de alto rendimento", "Substituição e acionamento com inversores.", 55),
        ("Iluminação eficiente", "Retrofit para LED e automação.", 45),
        ("Ar comprimido", "Vazamentos e dimensionamento.", 50)]),
      ("Fontes renováveis", "Geração distribuída e viabilidade.", 8,
       [("Energia solar fotovoltaica", "Componentes e funcionamento.", 55),
        ("Viabilidade econômica", "Payback e retorno de investimento.", 55)])]),
]

cargas = {0: 20, 1: 40, 2: 16, 3: 60, 4: 24, 5: 48, 6: 30, 7: 36}

def q(s):
    return "NULL" if s is None else "'" + s.replace("'", "''") + "'"

out = []
out.append("""-- =============================================================================
-- V002 - Dados fictícios do catálogo
-- -----------------------------------------------------------------------------
-- Todos os dados são FICTÍCIOS e servem apenas para demonstração.
-- Requisitos mínimos do edital: 6 cursos, 3 categorias, 2 modalidades, 3 status.
-- Este conjunto possui 8 cursos, 4 categorias, 3 modalidades e 3 status.
-- Gerado por database/scripts/gerar_seed.py (garante que a soma das cargas dos módulos
-- seja igual à carga horária de cada curso).
-- =============================================================================
""")
out.append("INSERT INTO categoria (id, nome, slug, icone, descricao) VALUES")
out.append(",\n".join(f"    ({i}, {q(n)}, {q(s)}, {q(ic)}, {q(d)})" for i, n, s, ic, d in categorias) + "\nON CONFLICT (id) DO NOTHING;\n")
out.append("INSERT INTO modalidade (id, nome, slug, descricao) VALUES")
out.append(",\n".join(f"    ({i}, {q(n)}, {q(s)}, {q(d)})" for i, n, s, d in modalidades) + "\nON CONFLICT (id) DO NOTHING;\n")
out.append("INSERT INTO status_curso (id, nome, slug, ordem) VALUES")
out.append(",\n".join(f"    ({i}, {q(n)}, {q(s)}, {o})" for i, n, s, o in status) + "\nON CONFLICT (id) DO NOTHING;\n")

curso_rows, mod_rows, aula_rows = [], [], []
mid = aid = 0
for idx, c in enumerate(cursos):
    (nc, nb, res, desc, cat, mod, st, pub, img, alt, data, dest, mods) = c
    cid = idx + 1
    total = sum(m[2] for m in mods)
    assert total == cargas[idx], (nc, total)
    curso_rows.append(f"    ({cid}, {q(nc)}, {q(nb)}, {q(res)}, {q(desc)}, {cat}, {mod}, {st}, {total}, {q(pub)}, {q(img)}, {q(alt)}, {q(data)}, {'true' if dest else 'false'})")
    for mo, (mt, md, mc, aulas) in enumerate(mods, 1):
        mid += 1
        mod_rows.append(f"    ({mid}, {cid}, {mo}, {q(mt)}, {q(md)}, {mc})")
        for ao, (at, ad, am) in enumerate(aulas, 1):
            aid += 1
            aula_rows.append(f"    ({aid}, {mid}, {ao}, {q(at)}, {q(ad)}, {am})")

out.append("INSERT INTO curso (id, nome_completo, nome_breve, resumo, descricao, categoria_id, modalidade_id, status_id, carga_horaria, publico_alvo, imagem_url, imagem_descricao, data_disponibilizacao, destaque) VALUES")
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
open(sys.argv[1], "w", encoding="utf-8").write("\n".join(out))
print("ok", len(cursos), "cursos", mid, "modulos", aid, "aulas")
