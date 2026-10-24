import { expect, test, type Page } from '@playwright/test';

/** Abre os filtros no mobile (no desktop eles já ficam visíveis na lateral). */
async function abrirFiltros(page: Page) {
  const alternar = page.getByRole('button', { name: /^Filtros/ });
  if (await alternar.isVisible()) await alternar.click();
}

const contador = (page: Page) => page.locator('#resultados-titulo');

test.describe('Catálogo de cursos — requisitos funcionais', () => {
  test('lista os cursos vindos da API e mostra a quantidade de resultados', async ({ page }) => {
    await page.goto('/cursos');
    await expect(contador(page)).toHaveText(/10 cursos encontrados/);
    await expect(page.locator('.grade-cursos > li')).toHaveCount(10);
  });

  test('pesquisa pelo nome ignorando acentos e maiúsculas', async ({ page }) => {
    await page.goto('/cursos');
    await page.getByRole('searchbox', { name: 'Pesquisar cursos pelo nome' }).fill('ESTATISTICA');
    await expect(contador(page)).toHaveText(/1 curso encontrado/);
    await expect(page.getByRole('link', { name: 'Estatística e Controle de Qualidade na Produção' })).toBeVisible();
    await expect(page).toHaveURL(/busca=ESTATISTICA/);
  });

  test('filtra por categoria, modalidade e status', async ({ page }) => {
    await page.goto('/cursos');
    await expect(contador(page)).toHaveText(/10 cursos/);
    await abrirFiltros(page);

    await page.getByRole('checkbox', { name: /Ciências da Natureza/ }).click();
    await expect(contador(page)).toHaveText(/3 cursos encontrados/);

    await page.getByRole('checkbox', { name: /Semipresencial/ }).click();
    await expect(contador(page)).toHaveText(/1 curso encontrado/);
    await expect(page.getByRole('link', { name: 'Ciência dos Materiais na Metalurgia' })).toBeVisible();

    await page.getByRole('checkbox', { name: /Inscrições abertas/ }).click();
    await expect(contador(page)).toHaveText(/0 cursos encontrados/);
  });

  test('combina pesquisa e filtros e permite limpar tudo', async ({ page }) => {
    await page.goto('/cursos?categoria=sustentabilidade');
    await expect(contador(page)).toHaveText(/2 cursos encontrados/);

    await page.getByRole('searchbox', { name: 'Pesquisar cursos pelo nome' }).fill('energetica');
    await expect(contador(page)).toHaveText(/1 curso encontrado/);
    await expect(page.getByRole('link', { name: 'Eficiência Energética na Indústria' })).toBeVisible();

    await page.getByRole('button', { name: 'Limpar filtros' }).first().click();
    await expect(contador(page)).toHaveText(/10 cursos encontrados/);
    await expect(page.getByRole('searchbox', { name: 'Pesquisar cursos pelo nome' })).toHaveValue('');
    await expect(page).toHaveURL(/\/cursos$/);
  });

  test('mostra mensagem quando nenhum curso é encontrado', async ({ page }) => {
    await page.goto('/cursos?busca=robotica');
    await expect(page.getByRole('heading', { name: 'Nenhum curso encontrado' })).toBeVisible();
    await expect(contador(page)).toHaveText(/0 cursos encontrados/);
  });

  test('mostra o estado de carregamento enquanto a API responde', async ({ page }) => {
    await page.route('**/api/cursos?**', async (rota) => {
      await new Promise((r) => setTimeout(r, 1500));
      await rota.continue();
    });
    await page.goto('/cursos');
    await expect(contador(page)).toHaveText(/Carregando cursos/);
    await expect(contador(page)).toHaveText(/10 cursos encontrados/);
  });

  test('mostra mensagem de erro e permite tentar novamente', async ({ page }) => {
    let falhar = true;
    await page.route('**/api/cursos?**', (rota) =>
      falhar
        ? rota.fulfill({ status: 500, contentType: 'application/problem+json', body: '{"title":"Erro interno simulado."}' })
        : rota.continue(),
    );
    await page.goto('/cursos');
    await expect(page.getByRole('alert')).toContainText('Não foi possível carregar os cursos');

    falhar = false;
    await page.getByRole('button', { name: 'Tentar novamente' }).click();
    await expect(contador(page)).toHaveText(/10 cursos encontrados/);
  });

  test('preserva os filtros ao voltar da página de detalhes', async ({ page }) => {
    await page.goto('/cursos?categoria=linguagens');
    await expect(contador(page)).toHaveText(/2 cursos encontrados/);
    await page.getByRole('link', { name: 'Inglês Técnico para a Indústria' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Inglês Técnico para a Indústria' })).toBeVisible();
    await page.goBack();
    await expect(contador(page)).toHaveText(/2 cursos encontrados/);
  });
});

test.describe('Detalhes do curso e AVA', () => {
  test('abre os detalhes com ficha técnica, módulos e aulas', async ({ page }) => {
    await page.goto('/cursos');
    await page.getByRole('link', { name: /Matemática para a Precisão/ }).click();

    await expect(page).toHaveURL(/\/cursos\/1$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Matemática para a Precisão/);
    await expect(page.getByText('40 horas')).toBeVisible();
    await expect(page.getByText('05/01/2026').first()).toBeVisible();

    await page.getByRole('button', { name: 'Módulos' }).click();
    await page.getByRole('button', { name: /2\. Grandezas e unidades de medida/ }).click();
    await expect(page.getByText('Sistema Internacional de Unidades')).toBeVisible();
  });

  test('curso inexistente mostra mensagem amigável', async ({ page }) => {
    await page.goto('/cursos/99999');
    await expect(page.getByRole('heading', { name: 'Curso não encontrado' })).toBeVisible();
  });

  test('"Matricule-se" abre o AVA e permite concluir e avançar aulas', async ({ page }) => {
    await page.goto('/cursos/1');
    await page.getByRole('link', { name: /Matricule-se/ }).first().click();

    await expect(page).toHaveURL(/\/cursos\/1\/aula/);
    await expect(page.getByRole('heading', { level: 1, name: 'Introdução' })).toBeVisible();
    await page.getByRole('button', { name: 'Concluir e avançar' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Boas práticas' })).toBeVisible();
    await expect(page.getByRole('progressbar', { name: 'Progresso no curso' })).toHaveAttribute('aria-valuenow', '6');
  });

  test('cursos encerrados não oferecem matrícula', async ({ page }) => {
    await page.goto('/cursos/6');
    await expect(page.getByText('Inscrições encerradas').first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Matricule-se/ })).toHaveCount(0);
  });
});

test.describe('Home e navegação', () => {
  test('vitrine "Principais cursos" carrega os destaques da API', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Impulsione sua carreira/);
    const vitrine = page.getByRole('list', { name: 'Principais cursos' });
    await expect(vitrine.locator('article')).toHaveCount(6);
  });

  test('menu leva ao catálogo (inclusive no mobile)', async ({ page }) => {
    await page.goto('/');
    const abrirMenu = page.getByRole('button', { name: 'Abrir menu' });
    if (await abrirMenu.isVisible()) await abrirMenu.click();
    await page.getByRole('navigation', { name: 'Principal' }).getByRole('link', { name: 'Cursos' }).click();
    await expect(page).toHaveURL(/\/cursos$/);
    await expect(page).toHaveTitle(/Todos os cursos/);
  });

  test('a página não tem rolagem horizontal (responsividade)', async ({ page }) => {
    for (const rota of ['/', '/cursos', '/cursos/1']) {
      await page.goto(rota);
      await page.waitForLoadState('networkidle');
      const excesso = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(excesso, `rolagem horizontal em ${rota}`).toBeLessThanOrEqual(1);
    }
  });
});
