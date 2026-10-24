// Contratos da API (espelham os DTOs do back-end .NET).

export interface Opcao {
  slug: string;
  nome: string;
}

export interface Categoria extends Opcao {
  iconeUrl: string;
}

export interface OpcaoFiltro extends Opcao {
  total: number;
  iconeUrl?: string | null;
  descricao?: string | null;
}

export interface Filtros {
  categorias: OpcaoFiltro[];
  modalidades: OpcaoFiltro[];
  status: OpcaoFiltro[];
}

export interface CursoResumo {
  id: number;
  nomeCompleto: string;
  nomeBreve: string;
  resumo: string;
  categoria: Categoria;
  modalidade: Opcao;
  status: Opcao;
  cargaHoraria: number;
  publicoAlvo: string;
  imagemUrl: string;
  imagemDescricao: string;
  dataDisponibilizacao: string | null; // ISO yyyy-MM-dd
  destaque: boolean;
  totalModulos: number;
}

export interface Aula {
  ordem: number;
  titulo: string;
  descricao: string;
  duracaoMinutos: number;
}

export interface Modulo {
  ordem: number;
  titulo: string;
  descricao: string;
  cargaHoraria: number;
  aulas: Aula[];
}

export interface CursoDetalhe extends Omit<CursoResumo, 'totalModulos'> {
  descricao: string;
  totalAulas: number;
  modulos: Modulo[];
}

export interface ResultadoPaginado<T> {
  itens: T[];
  total: number;
  pagina: number;
  tamanhoPagina: number;
  totalPaginas: number;
}

export type Ordenacao = 'relevancia' | 'nome' | 'carga-horaria' | 'recentes';

export interface ConsultaCursos {
  busca: string;
  categorias: string[];
  modalidades: string[];
  status: string[];
  ordenacao: Ordenacao;
  pagina: number;
}
