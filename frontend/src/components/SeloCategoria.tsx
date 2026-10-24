import type { Opcao } from '../api/types';
import { IconeCienciasNatureza, IconeLinguagens, IconeMatematica, IconeSustentabilidade, IconeEtiqueta } from './Icones';

const ICONES: Record<string, typeof IconeMatematica> = {
  matematica: IconeMatematica,
  'ciencias-da-natureza': IconeCienciasNatureza,
  linguagens: IconeLinguagens,
  sustentabilidade: IconeSustentabilidade,
};

export function IconeDaCategoria({ slug, tamanho = 16 }: { slug: string; tamanho?: number }) {
  const Icone = ICONES[slug] ?? IconeEtiqueta;
  return <Icone tamanho={tamanho} />;
}

/** Selo colorido da categoria, como no protótipo (ícone + nome em caixa alta). */
export function SeloCategoria({ categoria, className = '' }: { categoria: Opcao; className?: string }) {
  return (
    <span className={`selo selo--${categoria.slug} ${className}`.trim()}>
      <IconeDaCategoria slug={categoria.slug} />
      <span>
        <span className="sr-only">Categoria: </span>
        {categoria.nome}
      </span>
    </span>
  );
}
