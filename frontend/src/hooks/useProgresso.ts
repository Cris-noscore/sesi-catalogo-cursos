import { useCallback, useState } from 'react';

/**
 * Progresso das aulas salvo no navegador (localStorage), apenas para demonstrar
 * a tela do AVA. Em produção, viria do Moodle (completion API).
 * Leitura/escrita protegidas por try/catch (modo privado, armazenamento bloqueado).
 */
export function useProgresso(cursoId: number) {
  const chave = `catalogo-sesi:progresso:${cursoId}`;

  const [concluidas, setConcluidas] = useState<Set<string>>(() => {
    try {
      const salvo = localStorage.getItem(chave);
      return new Set<string>(salvo ? (JSON.parse(salvo) as string[]) : []);
    } catch {
      return new Set<string>();
    }
  });

  const alternar = useCallback(
    (aula: string, concluida?: boolean) => {
      setConcluidas((atual) => {
        const nova = new Set(atual);
        const marcar = concluida ?? !nova.has(aula);
        if (marcar) nova.add(aula);
        else nova.delete(aula);
        try {
          localStorage.setItem(chave, JSON.stringify([...nova]));
        } catch {
          /* armazenamento indisponível: mantém só em memória */
        }
        return nova;
      });
    },
    [chave],
  );

  return { concluidas, alternar };
}
