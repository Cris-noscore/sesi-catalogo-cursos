import { useEffect } from 'react';

/** Atualiza o título da aba (importante para leitores de tela e histórico do navegador). */
export function useTituloPagina(titulo: string | null | undefined) {
  useEffect(() => {
    if (titulo) document.title = `${titulo} | SESI Indústria`;
  }, [titulo]);
}
