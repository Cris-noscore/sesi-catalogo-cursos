import { useEffect, useState } from 'react';

/** Retorna o valor somente após `atraso` ms sem alterações (evita uma requisição por tecla). */
export function useDebounce<T>(valor: T, atraso = 350): T {
  const [atrasado, setAtrasado] = useState(valor);

  useEffect(() => {
    const timer = setTimeout(() => setAtrasado(valor), atraso);
    return () => clearTimeout(timer);
  }, [valor, atraso]);

  return atrasado;
}
