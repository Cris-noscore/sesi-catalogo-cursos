import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import type { ConsultaCursos, OpcaoFiltro, Ordenacao } from '../api/types';
import { CursoCard, CursoCardEsqueleto } from '../components/CursoCard';
import { EstadoErro, EstadoVazio } from '../components/Estados';
import { IconeBusca, IconeFechar, IconeFiltro, SetaDireita, SetaEsquerda } from '../components/Icones';
import { IconeDaCategoria } from '../components/SeloCategoria';
import { useConsultaUrl } from '../hooks/useConsultaUrl';
import { useDebounce } from '../hooks/useDebounce';
import { useRequisicao } from '../hooks/useRequisicao';
import { useTituloPagina } from '../hooks/useTituloPagina';
import { pluralizar } from '../utils/formatacao';
import './Catalogo.css';

type ChaveFiltro = 'categorias' | 'modalidades' | 'status';

const ORDENACOES: { valor: Ordenacao; rotulo: string }[] = [
  { valor: 'relevancia', rotulo: 'Relevância' },
  { valor: 'nome', rotulo: 'Nome (A–Z)' },
  { valor: 'carga-horaria', rotulo: 'Menor carga horária' },
  { valor: 'recentes', rotulo: 'Mais recentes' },
];

/**
 * Página "Todos os cursos" (não existe no Figma; criada seguindo o mesmo estilo visual).
 * Reúne as funcionalidades obrigatórias: listagem via API, pesquisa por nome,
 * filtros combináveis, contador de resultados, limpar filtros, estados de
 * carregamento, vazio e erro, e layout responsivo.
 */
export function Catalogo() {
  useTituloPagina('Todos os cursos');
  const { consulta, atualizar, limpar, quantidadeFiltros } = useConsultaUrl();
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  const idPainel = useId();

  // ----- Busca com debounce (a URL só muda 350 ms após o usuário parar de digitar)
  const [textoBusca, setTextoBusca] = useState(consulta.busca);
  const buscaAtrasada = useDebounce(textoBusca, 350);
  const ultimaBuscaUrl = useRef(consulta.busca);

  useEffect(() => {
    // URL mudou por fora (voltar do navegador, "limpar filtros"): sincroniza o campo.
    if (consulta.busca !== ultimaBuscaUrl.current) {
      ultimaBuscaUrl.current = consulta.busca;
      setTextoBusca(consulta.busca);
    }
  }, [consulta.busca]);

  useEffect(() => {
    const valor = buscaAtrasada.trim();
    if (valor !== consulta.busca) {
      ultimaBuscaUrl.current = valor;
      atualizar({ busca: valor });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buscaAtrasada]);

  // ----- Dados da API
  const filtros = useRequisicao((signal) => api.obterFiltros(signal), []);
  const chaveConsulta = JSON.stringify(consulta);
  const resultado = useRequisicao((signal) => api.listarCursos(consulta, signal), [chaveConsulta]);

  const alternarFiltro = (chave: ChaveFiltro, slug: string) => {
    const atuais = consulta[chave];
    atualizar({ [chave]: atuais.includes(slug) ? atuais.filter((s) => s !== slug) : [...atuais, slug] });
  };

  const limparTudo = () => {
    setTextoBusca('');
    ultimaBuscaUrl.current = '';
    limpar();
  };

  const nomeDoFiltro = (chave: ChaveFiltro, slug: string) =>
    filtros.dados?.[chave].find((o) => o.slug === slug)?.nome ?? slug;

  const chips: { chave: ChaveFiltro; slug: string }[] = [
    ...consulta.categorias.map((slug) => ({ chave: 'categorias' as const, slug })),
    ...consulta.modalidades.map((slug) => ({ chave: 'modalidades' as const, slug })),
    ...consulta.status.map((slug) => ({ chave: 'status' as const, slug })),
  ];

  const carregandoPrimeiraVez = resultado.status === 'carregando' && !resultado.dados;
  const atualizando = resultado.status === 'carregando' && !!resultado.dados;
  const dados = resultado.dados;
  const temFiltros = quantidadeFiltros > 0;

  return (
    <>
      <section className="catalogo-topo" aria-labelledby="catalogo-titulo">
        <div className="container">
          <nav aria-label="Trilha de navegação" className="trilha">
            <ol role="list">
              <li>
                <Link to="/">Início</Link>
              </li>
              <li aria-current="page">Cursos</li>
            </ol>
          </nav>
          <h1 id="catalogo-titulo" className="catalogo-topo__titulo">
            Todos os cursos
          </h1>
          <p className="catalogo-topo__texto">
            Pesquise pelo nome e combine filtros para encontrar a capacitação ideal para a sua carreira.
          </p>

          <form className="busca" role="search" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="campo-busca" className="busca__rotulo">
              Pesquisar cursos pelo nome
            </label>
            <div className="busca__campo">
              <IconeBusca tamanho={24} />
              <input
                id="campo-busca"
                type="search"
                inputMode="search"
                autoComplete="off"
                maxLength={100}
                placeholder="Ex.: estatística, metalurgia, química…"
                value={textoBusca}
                onChange={(e) => setTextoBusca(e.target.value)}
              />
              {textoBusca && (
                <button type="button" className="busca__limpar" onClick={() => setTextoBusca('')} aria-label="Limpar pesquisa">
                  <IconeFechar tamanho={22} />
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      <div className="container catalogo">
        {/* ---------- Filtros ---------- */}
        <aside className="catalogo__filtros" aria-label="Filtros">
          <button
            type="button"
            className="botao botao--contorno catalogo__alternar-filtros"
            aria-expanded={filtrosAbertos}
            aria-controls={idPainel}
            onClick={() => setFiltrosAbertos((v) => !v)}
          >
            <IconeFiltro tamanho={22} />
            Filtros{chips.length > 0 && ` (${chips.length})`}
          </button>

          <div id={idPainel} className={`filtros ${filtrosAbertos ? 'filtros--aberto' : ''}`}>
            {filtros.status === 'erro' && !filtros.dados && (
              <p className="filtros__erro" role="alert">
                Não foi possível carregar os filtros.{' '}
                <button type="button" className="link-botao" onClick={filtros.tentarNovamente}>
                  Tentar novamente
                </button>
              </p>
            )}
            {!filtros.dados && filtros.status === 'carregando' && (
              <div aria-hidden="true">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="esqueleto filtros__esqueleto" />
                ))}
              </div>
            )}
            {filtros.dados && (
              <>
                <GrupoFiltro
                  titulo="Categoria"
                  opcoes={filtros.dados.categorias}
                  selecionados={consulta.categorias}
                  aoAlternar={(slug) => alternarFiltro('categorias', slug)}
                  comIcone
                />
                <GrupoFiltro
                  titulo="Modalidade"
                  opcoes={filtros.dados.modalidades}
                  selecionados={consulta.modalidades}
                  aoAlternar={(slug) => alternarFiltro('modalidades', slug)}
                />
                <GrupoFiltro
                  titulo="Status"
                  opcoes={filtros.dados.status}
                  selecionados={consulta.status}
                  aoAlternar={(slug) => alternarFiltro('status', slug)}
                />
              </>
            )}
            {temFiltros && (
              <button type="button" className="botao botao--escuro filtros__limpar" onClick={limparTudo}>
                Limpar filtros
              </button>
            )}
          </div>
        </aside>

        {/* ---------- Resultados ---------- */}
        <section className="catalogo__resultados" aria-labelledby="resultados-titulo" aria-busy={resultado.status === 'carregando'}>
          <div className="resultados__barra">
            <h2 id="resultados-titulo" className="resultados__contador" aria-live="polite" aria-atomic="true">
              {carregandoPrimeiraVez || (!dados && resultado.status === 'erro')
                ? carregandoPrimeiraVez
                  ? 'Carregando cursos…'
                  : 'Cursos'
                : pluralizar(dados?.total ?? 0, 'curso encontrado', 'cursos encontrados')}
              {atualizando && <span className="resultados__atualizando"> · atualizando…</span>}
            </h2>

            <div className="resultados__ordenacao">
              <label htmlFor="ordenacao">Ordenar por</label>
              <select
                id="ordenacao"
                value={consulta.ordenacao}
                onChange={(e) => atualizar({ ordenacao: e.target.value as Ordenacao })}
              >
                {ORDENACOES.map((o) => (
                  <option key={o.valor} value={o.valor}>
                    {o.rotulo}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {(chips.length > 0 || consulta.busca) && (
            <div className="chips" aria-label="Filtros aplicados">
              {consulta.busca && (
                <button type="button" className="chip" onClick={() => setTextoBusca('')}>
                  <span>
                    <span className="sr-only">Remover pesquisa: </span>“{consulta.busca}”
                  </span>
                  <IconeFechar tamanho={18} />
                </button>
              )}
              {chips.map(({ chave, slug }) => (
                <button key={`${chave}-${slug}`} type="button" className="chip" onClick={() => alternarFiltro(chave, slug)}>
                  <span>
                    <span className="sr-only">Remover filtro: </span>
                    {nomeDoFiltro(chave, slug)}
                  </span>
                  <IconeFechar tamanho={18} />
                </button>
              ))}
              <button type="button" className="link-botao" onClick={limparTudo}>
                Limpar filtros
              </button>
            </div>
          )}

          {resultado.status === 'erro' && !dados ? (
            <EstadoErro mensagem={resultado.erro} aoTentarNovamente={resultado.tentarNovamente} />
          ) : (
            <>
              {resultado.status === 'erro' && dados && (
                <p className="resultados__aviso" role="alert">
                  {resultado.erro}{' '}
                  <button type="button" className="link-botao" onClick={resultado.tentarNovamente}>
                    Tentar novamente
                  </button>
                </p>
              )}

              {carregandoPrimeiraVez && (
                <ul role="list" className="grade-cursos">
                  {Array.from({ length: 6 }, (_, i) => (
                    <li key={i}>
                      <CursoCardEsqueleto detalhado />
                    </li>
                  ))}
                </ul>
              )}

              {dados && dados.total === 0 && (
                <EstadoVazio
                  titulo="Nenhum curso encontrado"
                  texto={
                    consulta.busca
                      ? `Não encontramos cursos para “${consulta.busca}” com os filtros selecionados. Tente outros termos ou remova alguns filtros.`
                      : 'Nenhum curso corresponde aos filtros selecionados. Tente remover alguns filtros.'
                  }
                  acao={
                    temFiltros && (
                      <button type="button" className="botao botao--escuro" onClick={limparTudo}>
                        Limpar filtros
                      </button>
                    )
                  }
                />
              )}

              {dados && dados.total > 0 && (
                <ul role="list" className={`grade-cursos ${atualizando ? 'grade-cursos--atualizando' : ''}`}>
                  {dados.itens.map((curso) => (
                    <li key={curso.id}>
                      <CursoCard curso={curso} detalhado />
                    </li>
                  ))}
                </ul>
              )}

              {dados && dados.totalPaginas > 1 && (
                <Paginacao
                  pagina={consulta.pagina}
                  total={dados.totalPaginas}
                  aoMudar={(pagina) => {
                    atualizar({ pagina } as Partial<ConsultaCursos>);
                    document.getElementById('resultados-titulo')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                />
              )}
            </>
          )}
        </section>
      </div>
    </>
  );
}

function GrupoFiltro({
  titulo,
  opcoes,
  selecionados,
  aoAlternar,
  comIcone = false,
}: {
  titulo: string;
  opcoes: OpcaoFiltro[];
  selecionados: string[];
  aoAlternar: (slug: string) => void;
  comIcone?: boolean;
}) {
  return (
    <fieldset className="filtro">
      <legend className="filtro__titulo">{titulo}</legend>
      <ul role="list">
        {opcoes.map((o) => {
          const marcado = selecionados.includes(o.slug);
          return (
            <li key={o.slug}>
              <label className={`filtro__opcao ${marcado ? 'filtro__opcao--marcada' : ''}`}>
                <input type="checkbox" checked={marcado} onChange={() => aoAlternar(o.slug)} />
                {comIcone && (
                  <span className={`filtro__icone selo--${o.slug}`}>
                    <IconeDaCategoria slug={o.slug} tamanho={18} />
                  </span>
                )}
                <span className="filtro__nome">{o.nome}</span>
                <span className="filtro__total" aria-label={`${o.total} cursos`}>
                  {o.total}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}

function Paginacao({ pagina, total, aoMudar }: { pagina: number; total: number; aoMudar: (p: number) => void }) {
  return (
    <nav className="paginacao" aria-label="Paginação">
      <button type="button" className="botao-icone" disabled={pagina <= 1} onClick={() => aoMudar(pagina - 1)} aria-label="Página anterior">
        <SetaEsquerda tamanho={32} />
      </button>
      <ol role="list">
        {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
          <li key={p}>
            <button
              type="button"
              className={`paginacao__pagina ${p === pagina ? 'paginacao__pagina--atual' : ''}`}
              aria-current={p === pagina ? 'page' : undefined}
              aria-label={`Página ${p}`}
              onClick={() => aoMudar(p)}
            >
              {p}
            </button>
          </li>
        ))}
      </ol>
      <button type="button" className="botao-icone" disabled={pagina >= total} onClick={() => aoMudar(pagina + 1)} aria-label="Próxima página">
        <SetaDireita tamanho={32} />
      </button>
    </nav>
  );
}
