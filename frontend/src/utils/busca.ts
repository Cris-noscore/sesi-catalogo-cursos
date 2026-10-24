/** Minúsculas e sem acentos — mesma regra usada pela API (f_normalizar / TextoBusca). */
export function TextoBuscaNormalizado(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}
