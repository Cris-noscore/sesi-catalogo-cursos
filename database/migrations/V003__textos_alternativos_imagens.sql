-- =============================================================================
-- V003 - Atualiza os textos alternativos das imagens de apresentação
-- -----------------------------------------------------------------------------
-- As fotos definitivas dos cursos (banco de imagens gratuito Pexels) substituíram
-- as provisórias; os textos alternativos passam a descrever as novas imagens.
-- Exemplo de evolução do banco por nova migração, sem alterar scripts já aplicados.
-- =============================================================================
UPDATE curso SET imagem_descricao = v.texto
FROM (VALUES
    ('MAT-PRECISAO-01', 'Mãos medindo uma peça metálica com um paquímetro em um torno.'),
    ('MAT-GEOTEX-01',   'Rolos de tecidos estampados armazenados em prateleiras de uma fábrica têxtil.'),
    ('MAT-ESTAT-01',    'Operadoras de uniforme e touca conferindo e embalando produtos em uma linha de produção.'),
    ('CN-FISMET-01',    'Faíscas saindo de uma esmerilhadeira durante o corte de metal.'),
    ('CN-QUISUS-01',    'Balão volumétrico com líquido laranja sobre uma bancada de laboratório.'),
    ('CN-MATMET-01',    'Detalhe de articulações e peças metálicas de uma máquina industrial.'),
    ('LIN-COMASS-01',   'Profissionais reunidos em volta de notebooks discutindo um projeto.'),
    ('LIN-INGTEC-01',   'Técnico de capacete fazendo anotações ao lado de um painel elétrico industrial.'),
    ('SUS-CIRTEX-01',   'Calças jeans enroladas e empilhadas para reaproveitamento.'),
    ('SUS-ENERG-01',    'Vista aérea de um complexo industrial com painéis solares nos telhados.')
) AS v(nome_breve, texto)
WHERE curso.nome_breve = v.nome_breve;
