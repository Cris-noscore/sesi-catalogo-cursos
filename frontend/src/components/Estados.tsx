import type { ReactNode } from 'react';
import { IconeAlerta, IconeBusca } from './Icones';
import './Estados.css';

/** Mensagem de erro com opção de tentar novamente (role="alert" para leitores de tela). */
export function EstadoErro({ mensagem, aoTentarNovamente }: { mensagem: string; aoTentarNovamente?: () => void }) {
  return (
    <div className="estado estado--erro" role="alert">
      <span className="estado__icone">
        <IconeAlerta tamanho={32} />
      </span>
      <h2 className="estado__titulo">Não foi possível carregar os cursos</h2>
      <p className="estado__texto">{mensagem}</p>
      {aoTentarNovamente && (
        <button type="button" className="botao botao--escuro" onClick={aoTentarNovamente}>
          Tentar novamente
        </button>
      )}
    </div>
  );
}

/** Estado vazio (nenhum curso encontrado). */
export function EstadoVazio({ titulo, texto, acao }: { titulo: string; texto: ReactNode; acao?: ReactNode }) {
  return (
    <div className="estado">
      <span className="estado__icone">
        <IconeBusca tamanho={32} />
      </span>
      <h2 className="estado__titulo">{titulo}</h2>
      <p className="estado__texto">{texto}</p>
      {acao}
    </div>
  );
}

/** Indicador de carregamento textual (com spinner) para áreas sem esqueleto. */
export function Carregando({ texto = 'Carregando…' }: { texto?: string }) {
  return (
    <div className="carregando" role="status">
      <span className="carregando__spinner" aria-hidden="true" />
      <span>{texto}</span>
    </div>
  );
}
