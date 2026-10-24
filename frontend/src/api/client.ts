import type { ConsultaCursos, CursoDetalhe, CursoResumo, Filtros, ResultadoPaginado } from './types';

/**
 * URL base da API. Em desenvolvimento, o Vite faz proxy de /api para a API local
 * (vite.config.ts); em produção, VITE_API_URL aponta para a API publicada.
 */
const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

/** Tempo máximo de espera. A API gratuita pode "acordar" em ~50 s no primeiro acesso. */
const TIMEOUT_MS = 70_000;

export const TAMANHO_PAGINA = 12;

/** Erro de API com mensagem pronta para o usuário. */
export class ApiError extends Error {
  readonly status?: number;

  constructor(mensagem: string, status?: number) {
    super(mensagem);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function requisitar<T>(caminho: string, signal?: AbortSignal): Promise<T> {
  // Combina o cancelamento externo com um timeout (sem depender de AbortSignal.any,
  // indisponível em navegadores mais antigos).
  const controlador = new AbortController();
  let expirou = false;
  const timer = setTimeout(() => {
    expirou = true;
    controlador.abort();
  }, TIMEOUT_MS);
  const repassarCancelamento = () => controlador.abort();
  signal?.addEventListener('abort', repassarCancelamento);

  let resposta: Response;
  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      headers: { Accept: 'application/json' },
      signal: controlador.signal,
    });
  } catch (erro) {
    // Cancelamento intencional (nova busca digitada, componente desmontado): repassa.
    if (signal?.aborted) throw erro;
    if (expirou) {
      throw new ApiError('O servidor demorou demais para responder. Tente novamente em instantes.');
    }
    throw new ApiError('Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.');
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', repassarCancelamento);
  }

  if (!resposta.ok) {
    if (resposta.status === 404) throw new ApiError('Conteúdo não encontrado.', 404);
    if (resposta.status === 429) {
      throw new ApiError('Muitas requisições em sequência. Aguarde um momento e tente novamente.', 429);
    }
    let detalhe = '';
    try {
      const problema = (await resposta.json()) as { title?: string };
      detalhe = problema.title ?? '';
    } catch {
      /* corpo não é JSON */
    }
    throw new ApiError(detalhe || 'Ocorreu um erro ao carregar os dados. Tente novamente.', resposta.status);
  }

  return (await resposta.json()) as T;
}

/** Monta a query string a partir do estado de busca/filtros. */
export function montarQuery(consulta: ConsultaCursos, tamanhoPagina = TAMANHO_PAGINA): string {
  const params = new URLSearchParams();
  const busca = consulta.busca.trim();
  if (busca) params.set('busca', busca);
  if (consulta.categorias.length) params.set('categoria', consulta.categorias.join(','));
  if (consulta.modalidades.length) params.set('modalidade', consulta.modalidades.join(','));
  if (consulta.status.length) params.set('status', consulta.status.join(','));
  if (consulta.ordenacao !== 'relevancia') params.set('ordenacao', consulta.ordenacao);
  params.set('pagina', String(consulta.pagina));
  params.set('tamanhoPagina', String(tamanhoPagina));
  return params.toString();
}

export const api = {
  listarCursos: (consulta: ConsultaCursos, signal?: AbortSignal) =>
    requisitar<ResultadoPaginado<CursoResumo>>(`/api/cursos?${montarQuery(consulta)}`, signal),

  obterCurso: (id: number, signal?: AbortSignal) => requisitar<CursoDetalhe>(`/api/cursos/${id}`, signal),

  obterFiltros: (signal?: AbortSignal) => requisitar<Filtros>('/api/filtros', signal),
};
