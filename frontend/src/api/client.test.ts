import { describe, expect, it } from 'vitest';
import { montarQuery } from './client';

describe('montarQuery', () => {
  it('inclui apenas os parâmetros preenchidos', () => {
    const query = montarQuery({
      busca: '  estatística ',
      categorias: ['matematica', 'linguagens'],
      modalidades: [],
      status: ['inscricoes-abertas'],
      ordenacao: 'relevancia',
      pagina: 2,
    });
    const params = new URLSearchParams(query);
    expect(params.get('busca')).toBe('estatística');
    expect(params.get('categoria')).toBe('matematica,linguagens');
    expect(params.has('modalidade')).toBe(false);
    expect(params.get('status')).toBe('inscricoes-abertas');
    expect(params.has('ordenacao')).toBe(false);
    expect(params.get('pagina')).toBe('2');
  });
});
