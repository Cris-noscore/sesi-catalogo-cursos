import { describe, expect, it } from 'vitest';
import { TextoBuscaNormalizado } from './busca';
import { formatarCargaHoraria, formatarData, formatarDataExtenso, formatarDuracao, pluralizar } from './formatacao';

describe('formatação', () => {
  it('formata datas ISO sem conversão de fuso', () => {
    expect(formatarData('2026-01-05')).toBe('05/01/2026');
    expect(formatarData(null)).toBeNull();
    expect(formatarDataExtenso('2026-11-16')).toBe('16 de novembro de 2026');
  });

  it('formata carga horária e duração', () => {
    expect(formatarCargaHoraria(1)).toBe('1 hora');
    expect(formatarCargaHoraria(40)).toBe('40 horas');
    expect(formatarDuracao(45)).toBe('45 min');
    expect(formatarDuracao(60)).toBe('1h');
    expect(formatarDuracao(75)).toBe('1h15');
  });

  it('pluraliza', () => {
    expect(pluralizar(1, 'curso', 'cursos')).toBe('1 curso');
    expect(pluralizar(0, 'curso', 'cursos')).toBe('0 cursos');
  });
});

describe('busca', () => {
  it('normaliza acentos e maiúsculas como a API', () => {
    expect(TextoBuscaNormalizado('  Ciência AÇÃO ')).toBe('ciencia acao');
  });
});
