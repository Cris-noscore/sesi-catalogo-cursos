import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { ConsultaCursos, Ordenacao } from '../api/types';

const ORDENACOES: Ordenacao[] = ['relevancia', 'nome', 'carga-horaria', 'recentes'];

const lista = (valor: string | null) => (valor ? valor.split(',').filter(Boolean) : []);

/**
 * Mantém a busca e os filtros na URL (?busca=...&categoria=...).
 * Assim o usuário pode compartilhar o link, usar voltar/avançar do navegador
 * e não perde os filtros ao retornar da página de detalhes.
 */
export function useConsultaUrl() {
  const [params, setParams] = useSearchParams();

  const consulta = useMemo<ConsultaCursos>(() => {
    const ordenacao = params.get('ordenacao') as Ordenacao | null;
    const pagina = Number(params.get('pagina'));
    return {
      busca: params.get('busca') ?? '',
      categorias: lista(params.get('categoria')),
      modalidades: lista(params.get('modalidade')),
      status: lista(params.get('status')),
      ordenacao: ordenacao && ORDENACOES.includes(ordenacao) ? ordenacao : 'relevancia',
      pagina: Number.isInteger(pagina) && pagina > 0 ? pagina : 1,
    };
  }, [params]);

  const atualizar = useCallback(
    (mudancas: Partial<ConsultaCursos>) => {
      const nova = { ...consulta, pagina: 1, ...mudancas };
      const p = new URLSearchParams();
      if (nova.busca) p.set('busca', nova.busca);
      if (nova.categorias.length) p.set('categoria', nova.categorias.join(','));
      if (nova.modalidades.length) p.set('modalidade', nova.modalidades.join(','));
      if (nova.status.length) p.set('status', nova.status.join(','));
      if (nova.ordenacao !== 'relevancia') p.set('ordenacao', nova.ordenacao);
      if (nova.pagina > 1) p.set('pagina', String(nova.pagina));
      // Digitação na busca substitui a entrada do histórico em vez de criar uma por tecla.
      setParams(p, { replace: 'busca' in mudancas });
    },
    [consulta, setParams],
  );

  const limpar = useCallback(() => setParams(new URLSearchParams()), [setParams]);

  const quantidadeFiltros =
    consulta.categorias.length + consulta.modalidades.length + consulta.status.length + (consulta.busca ? 1 : 0);

  return { consulta, atualizar, limpar, quantidadeFiltros };
}
