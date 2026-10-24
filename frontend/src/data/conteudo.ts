// Conteúdo institucional estático transcrito do protótipo do Figma.
// (Não faz parte do catálogo; por isso não vem da API.)

export const ESTATISTICAS = [
  { valor: '25.000+', rotulo: 'Profissionais Capacitados' },
  { valor: '500+', rotulo: 'Empresas parceiras' },
  { valor: '4.8/5', rotulo: 'Avaliação média', descricaoAcessivel: '4,8 de 5' },
  { valor: '2.5M+', rotulo: 'Horas de capacitação', descricaoAcessivel: 'mais de 2,5 milhões' },
];

export type ChaveBeneficio = 'certificacao' | 'professores' | 'suporte' | 'flexibilidade';

export const BENEFICIOS: { chave: ChaveBeneficio; titulo: string; texto: string }[] = [
  {
    chave: 'certificacao',
    titulo: 'Certificação SESI',
    texto: 'Cursos com a melhor certificação do mercado industrial reconhecidos pelo SESI.',
  },
  {
    chave: 'professores',
    titulo: 'Professores especialistas',
    texto: 'Contamos com professores reconhecidos por sua excelência no mercado.',
  },
  {
    chave: 'suporte',
    titulo: 'Suporte contínuo',
    texto: 'Você não está sozinho! Acompanhamento online durante todo o curso.',
  },
  {
    chave: 'flexibilidade',
    titulo: 'Flexibilidade',
    texto: 'Turmas presenciais e online com horários que se adaptam à sua rotina.',
  },
];

export const DEPOIMENTOS = [
  {
    texto:
      'A experiência do curso foi incrível! As aulas foram muito bem estruturadas e o cronograma foi cuidadosamente planejado, facilitando muito o aprendizado.',
    nome: 'Lucas Pereira',
    cargo: 'Analista na Empresa X',
    nota: 5,
  },
  {
    texto:
      'Concluir o curso foi uma jornada enriquecedora. As aulas eram dinâmicas e o horário foi organizado para maximizar nosso tempo de estudo.',
    nome: 'Mariana Costa',
    cargo: 'Gestora na Empresa X',
    nota: 5,
  },
  {
    texto:
      'O curso superou minhas expectativas! As aulas eram bem elaboradas e o planejamento do horário ajudou a manter o foco e a produtividade.',
    nome: 'Thiago Almeida',
    cargo: 'Técnico na Empresa X',
    nota: 5,
  },
  {
    texto:
      'Finalizar o curso foi uma experiência motivadora. As aulas foram muito bem preparadas e o cronograma foi ideal para o aprendizado.',
    nome: 'Fernanda Silva',
    cargo: 'Analista na Empresa X',
    nota: 5,
  },
  {
    texto:
      'A conclusão do curso foi uma etapa muito gratificante. As aulas eram bem organizadas e o horário foi pensado para facilitar nosso aprendizado.',
    nome: 'Gabriel Santos',
    cargo: 'Analista na Empresa X',
    nota: 5,
  },
];

export const DUVIDAS_FREQUENTES = [
  {
    pergunta: 'Preciso pagar para fazer os cursos?',
    resposta:
      'Os cursos deste catálogo são oferecidos gratuitamente aos trabalhadores da indústria e estudantes da rede SESI. (Informação fictícia para demonstração.)',
  },
  {
    pergunta: 'Recebo certificado ao concluir?',
    resposta:
      'Sim. Ao concluir todas as aulas e atingir a nota mínima nas avaliações, o certificado SESI fica disponível para download no ambiente virtual.',
  },
  {
    pergunta: 'Como acesso as aulas?',
    resposta:
      'Após a matrícula, as aulas ficam disponíveis no Ambiente Virtual de Aprendizagem (Moodle), acessível pelo botão "Área do aluno", em computador ou celular.',
  },
  {
    pergunta: 'Posso estudar no meu ritmo?',
    resposta:
      'Nos cursos EAD autoinstrucionais, sim. Cursos com tutoria e semipresenciais seguem um cronograma com datas de entrega e encontros definidos.',
  },
];

export const RODAPE = {
  email: 'contato@sesindustria.com.br',
  endereco: 'Av. Paulista, 1313',
  navegacao: [
    { rotulo: 'Início', para: '/' },
    { rotulo: 'Certificação', para: '/#sobre' },
    { rotulo: 'Cursos', para: '/cursos' },
    { rotulo: 'Sobre', para: '/#sobre' },
    { rotulo: 'Blog', para: null },
  ],
  cursosPopulares: [
    'Cultura Organizacional',
    'Ferramentas Google para Produtividade',
    'Excel Básico ao Avançado',
    'Trabalho em Equipe e Colaboração',
    'Gestão do Tempo e Produtividade',
    'Comunicação Assertiva',
    'Inteligência Emocional no Trabalho',
  ],
  suporte: ['Termos de Uso', 'Política de Privacidade', 'Trabalhe Conosco', 'Fale Conosco', 'Central de Ajuda'],
};
