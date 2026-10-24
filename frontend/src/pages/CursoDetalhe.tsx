import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, ApiError } from '../api/client';
import type { CursoDetalhe as Curso } from '../api/types';
import { ItemAcordeao } from '../components/Acordeao';
import { Carregando, EstadoErro, EstadoVazio } from '../components/Estados';
import {
  IconeCalendario,
  IconeCertificacao,
  IconeLivro,
  IconePessoas,
  IconeRelogio,
  IconeEtiqueta,
  SetaDireita,
} from '../components/Icones';
import { SeloCategoria } from '../components/SeloCategoria';
import { Beneficios, Depoimentos, FaleConosco } from '../components/Secoes';
import { DUVIDAS_FREQUENTES } from '../data/conteudo';
import { useRequisicao } from '../hooks/useRequisicao';
import { useTituloPagina } from '../hooks/useTituloPagina';
import { formatarCargaHoraria, formatarData, formatarDataExtenso, formatarDuracao, pluralizar } from '../utils/formatacao';
import './CursoDetalhe.css';

const TEXTO_MODALIDADE: Record<string, string> = {
  'ead-autoinstrucional':
    'Curso 100% on-line e autoinstrucional: você estuda no seu ritmo, com videoaulas, materiais de leitura e exercícios com correção automática. As avaliações ficam disponíveis no ambiente virtual ao final de cada módulo.',
  'ead-com-tutoria':
    'Curso 100% on-line com acompanhamento de tutor. As aulas seguem um cronograma com atividades semanais, fóruns de discussão e avaliações com feedback do tutor.',
  semipresencial:
    'Curso semipresencial: as aulas teóricas acontecem no ambiente virtual e as atividades práticas em encontros presenciais nas unidades SESI. As avaliações combinam questionários on-line e atividades práticas.',
};

/** Botão de matrícula conforme o status do curso. */
function BotaoMatricula({ curso, variante = 'escuro' }: { curso: Curso; variante?: 'escuro' | 'claro' }) {
  if (curso.status.slug === 'inscricoes-abertas') {
    return (
      <Link to={`/cursos/${curso.id}/aula`} className={`botao botao--${variante}`}>
        Matricule-se <SetaDireita tamanho={24} />
      </Link>
    );
  }
  const texto = curso.status.slug === 'em-breve' ? 'Inscrições em breve' : 'Inscrições encerradas';
  return (
    <span className={`botao botao--${variante}`} aria-disabled="true" role="button" tabIndex={-1}>
      {texto}
    </span>
  );
}

export function CursoDetalhe() {
  const { id } = useParams();
  const idNumerico = Number(id);
  const curso = useRequisicao(
    (signal) =>
      Number.isInteger(idNumerico) && idNumerico > 0
        ? api.obterCurso(idNumerico, signal)
        : Promise.reject(new ApiError('Conteúdo não encontrado.', 404)),
    [idNumerico],
  );
  useTituloPagina(curso.status === 'sucesso' ? curso.dados.nomeCompleto : 'Detalhes do curso');

  // A barra fixa de matrícula precisa de espaço extra no fim da página.
  useEffect(() => {
    document.body.classList.add('com-barra-fixa');
    return () => document.body.classList.remove('com-barra-fixa');
  }, []);

  if (curso.status === 'carregando' && !curso.dados) {
    return (
      <div className="pagina-estado">
        <Carregando texto="Carregando informações do curso…" />
      </div>
    );
  }

  if (curso.status === 'erro') {
    return (
      <div className="pagina-estado container">
        {curso.erro === 'Conteúdo não encontrado.' ? (
          <EstadoVazio
            titulo="Curso não encontrado"
            texto="O curso que você procura não existe ou foi removido do catálogo."
            acao={
              <Link to="/cursos" className="botao botao--escuro">
                Ver todos os cursos
              </Link>
            }
          />
        ) : (
          <EstadoErro mensagem={curso.erro} aoTentarNovamente={curso.tentarNovamente} />
        )}
      </div>
    );
  }

  const c = curso.dados!;
  const data = formatarData(c.dataDisponibilizacao);
  const rotuloData = c.status.slug === 'encerrado' ? 'Curso iniciado em' : 'Início do curso';

  return (
    <>
      {/* ---------- Apresentação ---------- */}
      <section className="detalhe-topo" aria-labelledby="curso-titulo">
        <div className="container detalhe-topo__grade">
          <div className="detalhe-topo__texto">
            <nav aria-label="Trilha de navegação" className="trilha">
              <ol role="list">
                <li>
                  <Link to="/">Início</Link>
                </li>
                <li>
                  <Link to="/cursos">Cursos</Link>
                </li>
                <li aria-current="page">{c.nomeBreve}</li>
              </ol>
            </nav>
            <SeloCategoria categoria={c.categoria} />
            <h1 id="curso-titulo" className="detalhe-topo__titulo">
              {c.nomeCompleto}
            </h1>
            <ul role="list" className="detalhe-topo__meta">
              {data && (
                <li>
                  <IconeCalendario tamanho={22} />
                  <span>
                    {rotuloData}:{' '}
                    <strong>
                      <time dateTime={c.dataDisponibilizacao!} aria-label={formatarDataExtenso(c.dataDisponibilizacao) ?? undefined}>
                        {data}
                      </time>
                    </strong>
                  </span>
                </li>
              )}
              <li>
                <IconeCertificacao tamanho={22} viewBox="10 10 28 28" />
                <span>
                  Certificação: <strong>SESI</strong>
                </span>
              </li>
            </ul>
            <BotaoMatricula curso={c} />
          </div>

          <figure className="detalhe-topo__midia">
            <img src={c.imagemUrl} alt={c.imagemDescricao} width={1280} height={720} />
          </figure>
        </div>
      </section>

      {/* ---------- Ficha técnica (campos obrigatórios do curso) ---------- */}
      <section className="container ficha" aria-labelledby="ficha-titulo">
        <h2 id="ficha-titulo" className="sr-only">
          Informações do curso
        </h2>
        <dl className="ficha__grade">
          <div className="ficha__item">
            <dt>
              <IconeRelogio tamanho={20} /> Carga horária
            </dt>
            <dd>{formatarCargaHoraria(c.cargaHoraria)}</dd>
          </div>
          <div className="ficha__item">
            <dt>
              <IconeLivro tamanho={20} /> Modalidade
            </dt>
            <dd>{c.modalidade.nome}</dd>
          </div>
          <div className="ficha__item">
            <dt>
              <IconeEtiqueta tamanho={20} /> Status
            </dt>
            <dd>
              <span className={`status status--${c.status.slug}`}>{c.status.nome}</span>
            </dd>
          </div>
          <div className="ficha__item">
            <dt>
              <IconeLivro tamanho={20} /> Conteúdo
            </dt>
            <dd>
              {pluralizar(c.modulos.length, 'módulo', 'módulos')} · {pluralizar(c.totalAulas, 'aula', 'aulas')}
            </dd>
          </div>
          <div className="ficha__item ficha__item--largo">
            <dt>
              <IconePessoas tamanho={20} /> Público-alvo
            </dt>
            <dd>{c.publicoAlvo}</dd>
          </div>
          <div className="ficha__item">
            <dt>
              <IconeEtiqueta tamanho={20} /> Nome breve
            </dt>
            <dd>
              <code>{c.nomeBreve}</code>
            </dd>
          </div>
        </dl>
      </section>

      {/* ---------- Benefícios ---------- */}
      <section className="container detalhe-beneficios" aria-label="Diferenciais">
        <Beneficios variante="bege" />
      </section>

      {/* ---------- Sobre o curso ---------- */}
      <section className="container sobre-curso" aria-labelledby="sobre-titulo">
        <div className="sobre-curso__texto">
          <h2 id="sobre-titulo" className="titulo-secao">
            Sobre o curso
          </h2>
          <p>{c.descricao}</p>
        </div>

        <div className="acordeao">
          <ItemAcordeao titulo="Módulos">
            <ol role="list" className="modulos">
              {c.modulos.map((m) => (
                <li key={m.ordem} className="modulo">
                  <ItemAcordeao
                    titulo={`${m.ordem}. ${m.titulo}`}
                    variante="compacto"
                    nivelTitulo="h4"
                  >
                    <p className="modulo__descricao">
                      {m.descricao} <span className="modulo__carga">({formatarCargaHoraria(m.cargaHoraria)})</span>
                    </p>
                    <ol role="list" className="aulas">
                      {m.aulas.map((a) => (
                        <li key={a.ordem} className="aula">
                          <span className="aula__numero" aria-hidden="true">
                            {m.ordem}.{a.ordem}
                          </span>
                          <div>
                            <strong>{a.titulo}</strong>
                            <p>{a.descricao.length > 160 ? `${a.descricao.slice(0, 157).trimEnd()}…` : a.descricao}</p>
                          </div>
                          <span className="aula__duracao">{formatarDuracao(a.duracaoMinutos)}</span>
                        </li>
                      ))}
                    </ol>
                  </ItemAcordeao>
                </li>
              ))}
            </ol>
          </ItemAcordeao>

          <ItemAcordeao titulo="Aulas online e avaliações">
            <p className="acordeao__texto">{TEXTO_MODALIDADE[c.modalidade.slug] ?? c.modalidade.nome}</p>
          </ItemAcordeao>

          <ItemAcordeao titulo="Dúvidas frequentes">
            {DUVIDAS_FREQUENTES.map((d) => (
              <ItemAcordeao key={d.pergunta} titulo={d.pergunta} variante="compacto" nivelTitulo="h4">
                <p className="acordeao__texto">{d.resposta}</p>
              </ItemAcordeao>
            ))}
          </ItemAcordeao>
        </div>
      </section>

      <Depoimentos variante="bege" />
      <FaleConosco />

      {/* ---------- Barra fixa de matrícula ---------- */}
      <aside className="barra-matricula" aria-label="Matrícula">
        <div className="barra-matricula__conteudo">
          <p className="barra-matricula__nome">{c.nomeCompleto}</p>
          <BotaoMatricula curso={c} variante="claro" />
        </div>
      </aside>
    </>
  );
}
