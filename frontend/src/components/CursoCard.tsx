import { Link } from 'react-router-dom';
import type { CursoResumo } from '../api/types';
import { formatarData } from '../utils/formatacao';
import { IconeCalendario, IconeRelogio } from './Icones';
import { SeloCategoria } from './SeloCategoria';
import './CursoCard.css';

interface Props {
  curso: CursoResumo;
  /** Exibe modalidade, status e carga horária (usado no catálogo). */
  detalhado?: boolean;
  nivelTitulo?: 'h2' | 'h3';
}

/**
 * Card de curso no estilo do protótipo: foto com sobreposição vermelha, selo da
 * categoria, nome e resumo. O card inteiro é clicável (link "esticado" sobre o
 * card), mas apenas o título é anunciado como link pelos leitores de tela.
 */
export function CursoCard({ curso, detalhado = false, nivelTitulo: Titulo = 'h3' }: Props) {
  const data = formatarData(curso.dataDisponibilizacao);

  return (
    <article className={`curso-card ${detalhado ? 'curso-card--detalhado' : ''}`}>
      <img
        className="curso-card__imagem"
        src={curso.imagemUrl}
        alt=""
        loading="lazy"
        decoding="async"
        width={640}
        height={480}
      />
      <div className="curso-card__sobreposicao" aria-hidden="true" />

      <div className="curso-card__topo">
        <SeloCategoria categoria={curso.categoria} />
      </div>

      <div className="curso-card__corpo">
        <Titulo className="curso-card__titulo">
          <Link to={`/cursos/${curso.id}`} className="curso-card__link">
            {curso.nomeCompleto}
          </Link>
        </Titulo>
        <p className="curso-card__resumo">{curso.resumo}</p>

        {detalhado && (
          <dl className="curso-card__meta">
            <div>
              <dt className="sr-only">Status</dt>
              <dd className={`status status--${curso.status.slug}`}>{curso.status.nome}</dd>
            </div>
            <div>
              <dt className="sr-only">Modalidade</dt>
              <dd>{curso.modalidade.nome}</dd>
            </div>
            <div>
              <dt className="sr-only">Carga horária</dt>
              <dd>
                <IconeRelogio tamanho={16} />
                {curso.cargaHoraria}h
              </dd>
            </div>
            {data && (
              <div>
                <dt className="sr-only">Data de disponibilização</dt>
                <dd>
                  <IconeCalendario tamanho={16} />
                  {data}
                </dd>
              </div>
            )}
          </dl>
        )}
      </div>
    </article>
  );
}

/** Versão "esqueleto" exibida enquanto os cursos carregam. */
export function CursoCardEsqueleto({ detalhado = false }: { detalhado?: boolean }) {
  return (
    <div className={`curso-card curso-card--esqueleto esqueleto ${detalhado ? 'curso-card--detalhado' : ''}`} aria-hidden="true">
      <div className="curso-card__corpo">
        <span className="esqueleto-linha" style={{ width: '40%' }} />
        <span className="esqueleto-linha esqueleto-linha--grande" style={{ width: '90%' }} />
        <span className="esqueleto-linha esqueleto-linha--grande" style={{ width: '70%' }} />
        <span className="esqueleto-linha" style={{ width: '95%' }} />
        <span className="esqueleto-linha" style={{ width: '80%' }} />
      </div>
    </div>
  );
}
