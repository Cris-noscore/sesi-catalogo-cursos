import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cursoDetalhe, mockFetch } from '../test/fixtures';
import { Ava } from './Ava';

function renderizar(rota = '/cursos/1/aula') {
  return render(
    <MemoryRouter initialEntries={[rota]}>
      <Routes>
        <Route path="/cursos/:id/aula" element={<Ava />} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());

describe('AVA (tela de aula)', () => {
  it('abre a primeira aula e exibe os parágrafos do conteúdo', async () => {
    mockFetch(() => [cursoDetalhe()]);
    renderizar();
    expect(await screen.findByRole('heading', { level: 1, name: 'Apresentação' })).toBeInTheDocument();
    expect(screen.getByText('Primeiro parágrafo.')).toBeInTheDocument();
    expect(screen.getByText('Segundo parágrafo.')).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'Progresso no curso' })).toHaveAttribute('aria-valuenow', '0');
  });

  it('concluir avança para a próxima aula, atualiza e salva o progresso', async () => {
    mockFetch(() => [cursoDetalhe()]);
    const user = userEvent.setup();
    renderizar();

    await user.click(await screen.findByRole('button', { name: 'Concluir e avançar' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Boas práticas' })).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'Progresso no curso' })).toHaveAttribute('aria-valuenow', '33');
    expect(JSON.parse(localStorage.getItem('catalogo-sesi:progresso:1') ?? '[]')).toEqual(['1.1']);
  });

  it('navega por anterior/próxima e pela lista lateral', async () => {
    mockFetch(() => [cursoDetalhe()]);
    const user = userEvent.setup();
    renderizar('/cursos/1/aula?aula=1.2');

    expect(await screen.findByRole('heading', { level: 1, name: 'Boas práticas' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Anterior/ }));
    expect(screen.getByRole('heading', { level: 1, name: 'Apresentação' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /2\.1 Sistema Internacional/ }));
    expect(screen.getByRole('heading', { level: 1, name: 'Sistema Internacional' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Próxima/ })).toBeDisabled();
  });

  it('pesquisa filtra a lista de aulas', async () => {
    mockFetch(() => [cursoDetalhe()]);
    const user = userEvent.setup();
    renderizar();

    await user.type(await screen.findByRole('searchbox', { name: 'Pesquisar aulas' }), 'pratica');
    expect(screen.getByRole('button', { name: /1\.2 Boas práticas/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /2\.1 Sistema Internacional/ })).not.toBeInTheDocument();

    await user.clear(screen.getByRole('searchbox', { name: 'Pesquisar aulas' }));
    await user.type(screen.getByRole('searchbox', { name: 'Pesquisar aulas' }), 'xyz');
    expect(screen.getByText('Nenhuma aula encontrada.')).toBeInTheDocument();
  });

  it('curso inexistente mostra mensagem amigável', async () => {
    mockFetch(() => [{ title: 'Curso não encontrado.' }, 404]);
    renderizar('/cursos/99/aula');
    expect(await screen.findByRole('heading', { name: 'Curso não encontrado' })).toBeInTheDocument();
  });
});
