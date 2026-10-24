import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { SetaDireita, SetaEsquerda } from './Icones';
import './Carrossel.css';

interface Props {
  /** Nome acessível da região (ex.: "Principais cursos"). */
  rotulo: string;
  children: ReactNode;
  /** Conteúdo exibido à esquerda das setas (ex.: botão "Ver todos os cursos"). */
  acoes?: ReactNode;
  largura?: 'card' | 'depoimento';
}

/**
 * Carrossel horizontal acessível: rolagem nativa com scroll-snap (funciona com
 * toque, trackpad e teclado) e setas que avançam uma "página" de itens.
 * As setas são desabilitadas no início/fim da lista.
 */
export function Carrossel({ rotulo, children, acoes, largura = 'card' }: Props) {
  const trilho = useRef<HTMLUListElement>(null);
  const [noInicio, setNoInicio] = useState(true);
  const [noFim, setNoFim] = useState(false);

  const atualizarSetas = useCallback(() => {
    const el = trilho.current;
    if (!el) return;
    setNoInicio(el.scrollLeft <= 4);
    setNoFim(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = trilho.current;
    if (!el) return;
    atualizarSetas();
    el.addEventListener('scroll', atualizarSetas, { passive: true });
    const observador = new ResizeObserver(atualizarSetas);
    observador.observe(el);
    return () => {
      el.removeEventListener('scroll', atualizarSetas);
      observador.disconnect();
    };
  }, [atualizarSetas, children]);

  const rolar = (direcao: 1 | -1) => {
    const el = trilho.current;
    if (!el) return;
    const item = el.querySelector('li');
    const passo = item ? item.getBoundingClientRect().width + 18 : el.clientWidth * 0.8;
    const itensVisiveis = Math.max(1, Math.floor(el.clientWidth / passo));
    el.scrollBy({ left: direcao * passo * itensVisiveis, behavior: 'smooth' });
  };

  return (
    <div className={`carrossel carrossel--${largura}`}>
      <ul ref={trilho} className="carrossel__trilho" role="list" aria-label={rotulo} tabIndex={0}>
        {Children.map(children, (filho) => (
          <li className="carrossel__item">{filho}</li>
        ))}
      </ul>

      <div className="container carrossel__controles">
        <div>{acoes}</div>
        <div className="carrossel__setas">
          <button type="button" className="botao-icone" onClick={() => rolar(-1)} disabled={noInicio} aria-label={`Anterior — ${rotulo}`}>
            <SetaEsquerda tamanho={44} />
          </button>
          <button type="button" className="botao-icone" onClick={() => rolar(1)} disabled={noFim} aria-label={`Próximo — ${rotulo}`}>
            <SetaDireita tamanho={44} />
          </button>
        </div>
      </div>
    </div>
  );
}
