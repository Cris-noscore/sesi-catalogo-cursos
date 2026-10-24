import { useId, useState, type ReactNode } from 'react';
import { Mais, Menos } from './Icones';
import './Acordeao.css';

interface ItemProps {
  titulo: string;
  children: ReactNode;
  abertoInicialmente?: boolean;
  nivelTitulo?: 'h2' | 'h3' | 'h4';
  variante?: 'grande' | 'compacto';
}

/**
 * Item de acordeão seguindo o padrão WAI-ARIA (botão com aria-expanded +
 * região com aria-labelledby). Ícones +/− do protótipo.
 */
export function ItemAcordeao({
  titulo,
  children,
  abertoInicialmente = false,
  nivelTitulo: Titulo = 'h3',
  variante = 'grande',
}: ItemProps) {
  const [aberto, setAberto] = useState(abertoInicialmente);
  const id = useId();

  return (
    <div className={`acordeao__item acordeao__item--${variante} ${aberto ? 'acordeao__item--aberto' : ''}`}>
      <Titulo className="acordeao__titulo">
        <button
          type="button"
          id={`${id}-botao`}
          className="acordeao__botao"
          aria-expanded={aberto}
          aria-controls={`${id}-painel`}
          onClick={() => setAberto((v) => !v)}
        >
          <span>{titulo}</span>
          {aberto ? <Menos tamanho={28} /> : <Mais tamanho={28} />}
        </button>
      </Titulo>
      <div id={`${id}-painel`} role="region" aria-labelledby={`${id}-botao`} className="acordeao__painel" hidden={!aberto}>
        {children}
      </div>
    </div>
  );
}
