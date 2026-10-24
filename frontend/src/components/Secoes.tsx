import { Link } from 'react-router-dom';
import { BENEFICIOS, DEPOIMENTOS, type ChaveBeneficio } from '../data/conteudo';
import { Carrossel } from './Carrossel';
import {
  Estrela,
  IconeCertificacao,
  IconeFlexibilidade,
  IconePlay,
  IconeProfessores,
  IconeSuporte,
  SetaDireita,
} from './Icones';
import './Secoes.css';

const ICONES_BENEFICIO: Record<ChaveBeneficio, typeof IconeCertificacao> = {
  certificacao: IconeCertificacao,
  professores: IconeProfessores,
  suporte: IconeSuporte,
  flexibilidade: IconeFlexibilidade,
};

/** Lista de diferenciais (Certificação, Professores...). Variante rosa (home) ou bege (detalhe). */
export function Beneficios({
  variante,
  quantidade = 4,
  nivelTitulo: Titulo = 'h3',
}: {
  variante: 'rosa' | 'bege';
  quantidade?: number;
  nivelTitulo?: 'h2' | 'h3';
}) {
  return (
    <ul role="list" className={`beneficios beneficios--${variante} beneficios--${quantidade}`}>
      {BENEFICIOS.slice(0, quantidade).map((b) => {
        const Icone = ICONES_BENEFICIO[b.chave];
        return (
          <li key={b.chave} className="beneficio">
            <span className="beneficio__icone">
              <Icone tamanho={40} />
            </span>
            <Titulo className="beneficio__titulo">{b.titulo}</Titulo>
            <p className="beneficio__texto">{b.texto}</p>
          </li>
        );
      })}
    </ul>
  );
}

/** Seção "Quem fez recomenda". Variante vermelha (home) ou bege (detalhe do curso). */
export function Depoimentos({ variante }: { variante: 'vermelho' | 'bege' }) {
  return (
    <section
      className={`depoimentos depoimentos--${variante} ${variante === 'vermelho' ? 'fundo-escuro' : ''}`}
      aria-labelledby="depoimentos-titulo"
    >
      <div className="container">
        <span className="sobretitulo">Depoimentos</span>
        <h2 id="depoimentos-titulo" className="titulo-secao">
          Quem fez recomenda
        </h2>
      </div>
      <Carrossel rotulo="Depoimentos de alunos" largura="depoimento">
        {DEPOIMENTOS.map((d) => (
          <figure key={d.nome} className="depoimento">
            <blockquote>“{d.texto}”</blockquote>
            <figcaption>
              <strong>{d.nome}</strong>
              <span>{d.cargo}</span>
              <span className="depoimento__nota" role="img" aria-label={`Avaliação: ${d.nota} de 5 estrelas`}>
                {Array.from({ length: d.nota }, (_, i) => (
                  <Estrela key={i} tamanho={20} />
                ))}
              </span>
            </figcaption>
          </figure>
        ))}
      </Carrossel>
    </section>
  );
}

/** Miniatura do vídeo institucional (o vídeo em si não foi fornecido nos materiais). */
export function MiniaturaVideo({ className = '' }: { className?: string }) {
  return (
    <figure className={`miniatura-video ${className}`.trim()}>
      <img
        src="/img/video-thumb-1920.webp"
        srcSet="/img/video-thumb-960.webp 960w, /img/video-thumb-1920.webp 1920w"
        sizes="(max-width: 900px) 100vw, 860px"
        alt="Dois profissionais com capacete e óculos de proteção analisando um equipamento industrial."
        width={1920}
        height={1080}
        loading="lazy"
      />
      <span className="miniatura-video__play" aria-hidden="true">
        <IconePlay tamanho={40} />
      </span>
      <figcaption className="sr-only">Vídeo institucional (indisponível nesta demonstração).</figcaption>
    </figure>
  );
}

/** Chamada final da home: "Pronto para transformar sua carreira?" */
export function ChamadaCarreira() {
  return (
    <section className="chamada-carreira fundo-escuro" aria-labelledby="chamada-titulo">
      <div className="container chamada-carreira__grade">
        <div className="chamada-carreira__texto">
          <h2 id="chamada-titulo" className="titulo-secao">
            Pronto para transformar sua carreira?
          </h2>
          <p>
            Junte-se a milhares de profissionais que já estão transformando a indústria através dos nossos cursos.
            Invista no seu futuro hoje mesmo!
          </p>
          <Link to="/cursos" className="botao botao--claro">
            Matricule-se <SetaDireita tamanho={24} />
          </Link>
        </div>
        <MiniaturaVideo />
      </div>
    </section>
  );
}

/** Faixa "Precisa de ajuda para decidir? Fale com a gente". */
export function FaleConosco() {
  return (
    <section className="fale-conosco fundo-escuro" aria-labelledby="fale-titulo">
      <div className="container">
        <span className="sobretitulo">Precisa de ajuda para decidir?</span>
        <h2 id="fale-titulo" className="titulo-secao">
          Fale com a gente
        </h2>
        <a className="botao botao--claro" href="mailto:contato@sesindustria.com.br?subject=D%C3%BAvida%20sobre%20cursos">
          Mandar uma mensagem <SetaDireita tamanho={24} />
        </a>
      </div>
    </section>
  );
}
