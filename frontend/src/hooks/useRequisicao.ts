import { useCallback, useEffect, useState } from 'react';

export type EstadoRequisicao<T> =
  | { status: 'carregando'; dados?: T }
  | { status: 'sucesso'; dados: T }
  | { status: 'erro'; erro: string; dados?: T };

/**
 * Executa uma requisição assíncrona e expõe os estados de carregamento, sucesso e erro.
 * Requisições anteriores são canceladas (AbortController) quando as dependências mudam,
 * evitando que uma resposta antiga sobrescreva uma mais recente.
 */
export function useRequisicao<T>(
  executar: (signal: AbortSignal) => Promise<T>,
  dependencias: readonly unknown[],
): EstadoRequisicao<T> & { tentarNovamente: () => void } {
  const [estado, setEstado] = useState<EstadoRequisicao<T>>({ status: 'carregando' });
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    const controlador = new AbortController();
    // Mantém os dados anteriores durante o novo carregamento (evita "piscar" a lista).
    setEstado((anterior) => ({ status: 'carregando', dados: anterior.dados }));

    executar(controlador.signal)
      .then((dados) => {
        if (!controlador.signal.aborted) setEstado({ status: 'sucesso', dados });
      })
      .catch((erro: unknown) => {
        if (controlador.signal.aborted) return;
        const mensagem = erro instanceof Error ? erro.message : 'Erro inesperado.';
        setEstado((anterior) => ({ status: 'erro', erro: mensagem, dados: anterior.dados }));
      });

    return () => controlador.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencias, tentativa]);

  const tentarNovamente = useCallback(() => setTentativa((t) => t + 1), []);

  return { ...estado, tentarNovamente };
}
