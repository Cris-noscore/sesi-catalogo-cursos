import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { CursoResumo, Filtros, ResultadoPaginado } from '../api/types';
import { Catalogo } from './Catalogo';

const curso = (id: number, nome: string, categoria = 'matematica'): CursoResumo => ({
  id,
  nomeCompleto: nome,
  nomeBreve: `C-${id}`,
  resumo: 'Resumo do curso',
  categoria: { slug: categoria, nome: categoria === 'matematica' ? 'Matemática' : 'Linguagens', iconeUrl: '' },
  modalidade: { slug: 'ead-autoinstrucional', nome: 'EAD autoinstrucional' },
  status: { slug: 'inscricoes-abertas', nome: 'Inscrições abertas' },
  cargaHoraria: 20,
  publicoAlvo: 'Todos',
  imagemUrl: 'http://img/x.webp',
  imagemDescricao: 'imagem',
  dataDisponibilizacao: '2026-01-05',
  destaque: false,
  totalModulos: 3,
});

const filtros: Filtros = {
  categorias: [
    { slug: 'matematica', nome: 'Matemática', total: 2 },
    { slug: 'linguagens', nome: 'Linguagens', total: 1 },
  ],
  modalidades: [{ slug: 'ead-autoinstrucional', nome: 'EAD autoinstrucional', total: 3 }],
  status: [{ slug: 'inscricoes-abertas', nome: 'Inscrições abertas', total: 3 }],
};

const pagina = (itens: CursoResumo[]): ResultadoPaginado<CursoResumo> => ({
  itens,
  total: itens.length,
  pagina: 1,
  tamanhoPagina: 12,
  totalPaginas: itens.length ? 1 : 0,
});

function respostaJson(corpo: unknown, status = 200) {
  return Promise.resolve(new Response(JSON.stringify(corpo), { status, headers: { 'Content-Type': 'application/json' } }));
}

/** Simula a API: filtra por categoria e busca, como o back-end. */
function mockApi({ falhar = false } = {}) {
  const todos = [curso(1, 'Estatística na Produção'), curso(2, 'Geometria Têxtil'), curso(3, 'Inglês Técnico', 'linguagens')];
  return vi.spyOn(globalThis, 'fetch').mockImplementation((entrada) => {
    const url = new URL(String(entrada), 'http://localhost');
    if (url.pathname === '/api/filtros') return respostaJson(filtros);
    if (falhar) return respostaJson({ title: 'Falha simulada' }, 500);
    const categoria = url.searchParams.get('categoria');
    const busca = url.searchParams.get('busca')?.toLowerCase();
    const itens = todos.filter(
      (c) => (!categoria || categoria.split(',').includes(c.categoria.slug)) && (!busca || c.nomeCompleto.toLowerCase().includes(busca)),
    );
    return respostaJson(pagina(itens));
  });
}

function UrlAtual() {
  const l = useLocation();
  return <output data-testid="url">{l.search}</output>;
}

function renderizar(url = '/cursos') {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route
          path="/cursos"
          element={
            <>
              <Catalogo />
              <UrlAtual />
            </>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

afterEach(() => vi.restoreAllMocks());

describe('Catálogo de cursos', () => {
  it('lista os cursos da API e mostra a quantidade de resultados', async () => {
    mockApi();
    renderizar();
    expect(await screen.findByRole('heading', { name: /3 cursos encontrados/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Estatística na Produção' })).toHaveAttribute('href', '/cursos/1');
  });

  it('filtra por categoria, atualiza a URL e permite limpar os filtros', async () => {
    mockApi();
    const user = userEvent.setup();
    renderizar();
    await screen.findByRole('heading', { name: /3 cursos encontrados/ });

    await user.click(screen.getByRole('checkbox', { name: /Linguagens/ }));
    expect(await screen.findByRole('heading', { name: /1 curso encontrado/ })).toBeInTheDocument();
    expect(screen.getByTestId('url')).toHaveTextContent('categoria=linguagens');

    await user.click(screen.getAllByRole('button', { name: 'Limpar filtros' })[0]);
    expect(await screen.findByRole('heading', { name: /3 cursos encontrados/ })).toBeInTheDocument();
  });

  it('combina pesquisa (com debounce) e mostra mensagem quando nada é encontrado', async () => {
    mockApi();
    const user = userEvent.setup();
    renderizar('/cursos?categoria=matematica');
    await screen.findByRole('heading', { name: /2 cursos encontrados/ });

    await user.type(screen.getByRole('searchbox', { name: /Pesquisar cursos/ }), 'inexistente');
    expect(await screen.findByRole('heading', { name: 'Nenhum curso encontrado' }, { timeout: 2000 })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByTestId('url')).toHaveTextContent('busca=inexistente'));
    expect(screen.getByTestId('url')).toHaveTextContent('categoria=matematica');
  });

  it('exibe mensagem de erro e permite tentar novamente', async () => {
    const espiao = mockApi({ falhar: true });
    renderizar();
    expect(await screen.findByRole('alert')).toHaveTextContent('Falha simulada');

    espiao.mockRestore();
    mockApi();
    await userEvent.setup().click(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(await screen.findByRole('heading', { name: /3 cursos encontrados/ })).toBeInTheDocument();
  });

  it('mostra estado de carregamento enquanto aguarda a API', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(() => new Promise(() => {}));
    renderizar();
    expect(screen.getByRole('heading', { name: /Carregando cursos/ })).toBeInTheDocument();
  });
});
