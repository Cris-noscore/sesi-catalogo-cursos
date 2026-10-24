import { vi } from 'vitest';
import type { CursoDetalhe, CursoResumo, ResultadoPaginado } from '../api/types';

export const cursoDetalhe = (sobrescrever: Partial<CursoDetalhe> = {}): CursoDetalhe => ({
  id: 1,
  nomeCompleto: 'Matemática para a Precisão',
  nomeBreve: 'MAT-PRECISAO-01',
  resumo: 'Resumo',
  descricao: 'Descrição completa do curso.',
  categoria: { slug: 'matematica', nome: 'Matemática', iconeUrl: '' },
  modalidade: { slug: 'ead-com-tutoria', nome: 'EAD com tutoria' },
  status: { slug: 'inscricoes-abertas', nome: 'Inscrições abertas' },
  cargaHoraria: 40,
  publicoAlvo: 'Operadores de máquinas',
  imagemUrl: 'http://img/curso.webp',
  imagemDescricao: 'Paquímetro medindo uma peça',
  dataDisponibilizacao: '2026-01-05',
  destaque: true,
  totalAulas: 3,
  modulos: [
    {
      ordem: 1,
      titulo: 'Introdução',
      descricao: 'Boas-vindas',
      cargaHoraria: 2,
      aulas: [
        { ordem: 1, titulo: 'Apresentação', descricao: 'Primeiro parágrafo.\n\nSegundo parágrafo.', duracaoMinutos: 20 },
        { ordem: 2, titulo: 'Boas práticas', descricao: 'Dicas de estudo.', duracaoMinutos: 75 },
      ],
    },
    {
      ordem: 2,
      titulo: 'Grandezas',
      descricao: 'Unidades de medida',
      cargaHoraria: 38,
      aulas: [{ ordem: 1, titulo: 'Sistema Internacional', descricao: 'Unidades de base.', duracaoMinutos: 45 }],
    },
  ],
  ...sobrescrever,
});

export const cursoResumo = (id: number, nome: string): CursoResumo => {
  const { modulos, totalAulas, descricao, ...resto } = cursoDetalhe({ id, nomeCompleto: nome });
  void totalAulas;
  void descricao;
  return { ...resto, totalModulos: modulos.length };
};

export const pagina = (itens: CursoResumo[]): ResultadoPaginado<CursoResumo> => ({
  itens,
  total: itens.length,
  pagina: 1,
  tamanhoPagina: 12,
  totalPaginas: itens.length ? 1 : 0,
});

export function respostaJson(corpo: unknown, status = 200) {
  return Promise.resolve(
    new Response(JSON.stringify(corpo), { status, headers: { 'Content-Type': 'application/json' } }),
  );
}

/** Mock simples de fetch: recebe a URL e devolve [corpo, status]. */
export function mockFetch(responder: (url: URL) => [unknown, number?]) {
  return vi.spyOn(globalThis, 'fetch').mockImplementation((entrada) => {
    const url = new URL(String(entrada), 'http://localhost');
    const [corpo, status = 200] = responder(url);
    return respostaJson(corpo, status);
  });
}
