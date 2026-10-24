import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Layout } from '../components/Layout';
import { cursoResumo, mockFetch, pagina } from '../test/fixtures';
import { Home } from './Home';

afterEach(() => vi.restoreAllMocks());

function renderizar() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="cursos" element={<p>Catálogo</p>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe('Home', () => {
  it('carrega a vitrine com os cursos em destaque da API', async () => {
    const espiao = mockFetch(() => [pagina([cursoResumo(1, 'Curso A'), cursoResumo(2, 'Curso B')])]);
    renderizar();

    expect(screen.getByRole('heading', { level: 1, name: 'Impulsione sua carreira na indústria' })).toBeInTheDocument();
    const vitrine = await screen.findByRole('list', { name: 'Principais cursos' });
    expect(await within(vitrine).findByRole('link', { name: 'Curso A' })).toHaveAttribute('href', '/cursos/1');
    expect(within(vitrine).getByRole('link', { name: /Todos os cursos/ })).toBeInTheDocument();
    expect(String(espiao.mock.calls[0][0])).toContain('destaque=true');
  });

  it('exibe números, benefícios e depoimentos com rótulos acessíveis', async () => {
    mockFetch(() => [pagina([])]);
    renderizar();
    expect(screen.getByText('25.000+')).toBeInTheDocument();
    expect(screen.getByText('4,8 de 5')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Certificação SESI' })).toBeInTheDocument();
    expect(screen.getAllByRole('img', { name: 'Avaliação: 5 de 5 estrelas' })).toHaveLength(5);
  });

  it('mostra erro na vitrine quando a API falha', async () => {
    mockFetch(() => [{ title: 'Falha' }, 500]);
    renderizar();
    expect(await screen.findByRole('alert')).toBeInTheDocument();
  });

  it('menu mobile abre e fecha com Esc', async () => {
    mockFetch(() => [pagina([])]);
    const user = userEvent.setup();
    renderizar();

    const botao = screen.getByRole('button', { name: 'Abrir menu' });
    await user.click(botao);
    expect(screen.getByRole('button', { name: 'Fechar menu' })).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard('{Escape}');
    expect(screen.getByRole('button', { name: 'Abrir menu' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('"Conhecer cursos" navega para o catálogo', async () => {
    mockFetch(() => [pagina([])]);
    const user = userEvent.setup();
    renderizar();
    await user.click(screen.getByRole('link', { name: /Conhecer cursos/ }));
    expect(screen.getByText('Catálogo')).toBeInTheDocument();
  });
});
