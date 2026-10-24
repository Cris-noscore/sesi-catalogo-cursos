import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cursoDetalhe, mockFetch } from '../test/fixtures';
import { CursoDetalhe } from './CursoDetalhe';

function renderizar(rota = '/cursos/1') {
  return render(
    <MemoryRouter initialEntries={[rota]}>
      <Routes>
        <Route path="/cursos/:id" element={<CursoDetalhe />} />
        <Route path="/cursos/:id/aula" element={<p>AVA aberto</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

afterEach(() => vi.restoreAllMocks());

describe('Detalhes do curso', () => {
  it('exibe os campos obrigatórios do curso', async () => {
    mockFetch(() => [cursoDetalhe()]);
    renderizar();

    expect(await screen.findByRole('heading', { level: 1, name: 'Matemática para a Precisão' })).toBeInTheDocument();
    expect(screen.getByText('40 horas')).toBeInTheDocument();
    expect(screen.getByText('EAD com tutoria')).toBeInTheDocument();
    expect(screen.getByText('Operadores de máquinas')).toBeInTheDocument();
    expect(screen.getAllByText('MAT-PRECISAO-01').length).toBeGreaterThan(0);
    expect(screen.getByText('05/01/2026')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Paquímetro medindo uma peça' })).toBeInTheDocument();
    expect(screen.getByText('2 módulos · 3 aulas')).toBeInTheDocument();
    expect(document.title).toContain('Matemática para a Precisão');
  });

  it('expande módulos e aulas no acordeão', async () => {
    mockFetch(() => [cursoDetalhe()]);
    const user = userEvent.setup();
    renderizar();

    const modulos = await screen.findByRole('button', { name: 'Módulos' });
    expect(modulos).toHaveAttribute('aria-expanded', 'false');
    await user.click(modulos);
    expect(modulos).toHaveAttribute('aria-expanded', 'true');

    await user.click(screen.getByRole('button', { name: '2. Grandezas' }));
    expect(screen.getByText('Sistema Internacional')).toBeVisible();
    expect(screen.getByText('45 min')).toBeInTheDocument();
  });

  it('"Matricule-se" leva ao AVA quando as inscrições estão abertas', async () => {
    mockFetch(() => [cursoDetalhe()]);
    const user = userEvent.setup();
    renderizar();

    const botoes = await screen.findAllByRole('link', { name: /Matricule-se/ });
    await user.click(botoes[0]);
    expect(screen.getByText('AVA aberto')).toBeInTheDocument();
  });

  it('desabilita a matrícula em cursos encerrados', async () => {
    mockFetch(() => [cursoDetalhe({ status: { slug: 'encerrado', nome: 'Encerrado' } })]);
    renderizar();

    expect((await screen.findAllByText('Inscrições encerradas'))[0]).toHaveAttribute('aria-disabled', 'true');
    expect(screen.queryByRole('link', { name: /Matricule-se/ })).not.toBeInTheDocument();
    expect(screen.getByText(/Curso iniciado em/)).toBeInTheDocument();
  });

  it('mostra "Curso não encontrado" para 404', async () => {
    mockFetch(() => [{ title: 'Curso não encontrado.' }, 404]);
    renderizar('/cursos/999');
    expect(await screen.findByRole('heading', { name: 'Curso não encontrado' })).toBeInTheDocument();
  });

  it('mostra erro com opção de tentar novamente em falhas do servidor', async () => {
    mockFetch(() => [{ title: 'Falha' }, 500]);
    renderizar();
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tentar novamente' })).toBeInTheDocument();
  });

  it('identificador inválido não chama a API', async () => {
    const espiao = mockFetch(() => [cursoDetalhe()]);
    renderizar('/cursos/abc');
    expect(await screen.findByRole('heading', { name: 'Curso não encontrado' })).toBeInTheDocument();
    expect(espiao).not.toHaveBeenCalled();
  });
});
