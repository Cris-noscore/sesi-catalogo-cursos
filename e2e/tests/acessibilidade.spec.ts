import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/**
 * Auditoria automática de acessibilidade com axe-core (Deque), regras WCAG 2.0/2.1 A e AA.
 * Qualquer violação faz o teste falhar e é listada no relatório.
 */
const PAGINAS = [
  { nome: 'Home', rota: '/', pronto: 'Principais cursos' },
  { nome: 'Catálogo', rota: '/cursos', pronto: /10 cursos encontrados/ },
  { nome: 'Catálogo sem resultados', rota: '/cursos?busca=robotica', pronto: 'Nenhum curso encontrado' },
  { nome: 'Detalhes do curso', rota: '/cursos/1', pronto: 'Sobre o curso' },
  { nome: 'AVA', rota: '/cursos/1/aula', pronto: 'Introdução' },
  { nome: 'Área do aluno', rota: '/area-do-aluno', pronto: 'Área do aluno' },
];

for (const { nome, rota, pronto } of PAGINAS) {
  test(`${nome} não possui violações WCAG A/AA`, async ({ page }, info) => {
    await page.goto(rota);
    // Aguarda o título principal da página (conteúdo vindo da API já renderizado).
    await expect(page.getByRole('heading', { name: pronto }).first()).toBeVisible();
    await page.waitForLoadState('networkidle');

    const resultado = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    await info.attach(`axe-${nome}.json`, { body: JSON.stringify(resultado.violations, null, 2), contentType: 'application/json' });

    const resumo = resultado.violations.map((v) => `${v.id} (${v.impact}): ${v.help} — ${v.nodes.length} elemento(s)`);
    expect(resumo, `Violações de acessibilidade em ${rota}`).toEqual([]);
  });
}

test('navegação por teclado: link "Pular para o conteúdo" é o primeiro foco', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Pular para o conteúdo' })).toBeFocused();
});

test('contador de resultados é anunciado a leitores de tela (aria-live)', async ({ page }) => {
  await page.goto('/cursos');
  await expect(page.locator('#resultados-titulo')).toHaveAttribute('aria-live', 'polite');
});
