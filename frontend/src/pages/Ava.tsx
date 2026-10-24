import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import type { Aula, Modulo } from '../api/types';
import logoSesi from '../assets/icons/logo-sesi.svg';
import { Carregando, EstadoErro, EstadoVazio } from '../components/Estados';
import {
  IconeBusca,
  IconeCheckCirculo,
  IconeCirculo,
  IconeFechar,
  IconeMenu,
  IconePlayCirculo,
  IconeVoltar,
  SetaDireita,
  SetaEsquerda,
} from '../components/Icones';
import { useProgresso } from '../hooks/useProgresso';
import { useRequisicao } from '../hooks/useRequisicao';
import { useTituloPagina } from '../hooks/useTituloPagina';
import { formatarDuracao } from '../utils/formatacao';
import { TextoBuscaNormalizado } from '../utils/busca';
import './Ava.css';

interface AulaComModulo extends Aula {
  chave: string; // "modulo.aula" (ex.: "1.2")
  modulo: Modulo;
}

/**
 * Tela de aula no Ambiente Virtual de Aprendizagem (Figma: "03. AVA").
 * Demonstração navegável: lista de módulos/aulas vinda da API, busca nas aulas,
 * progresso salvo no navegador e navegação entre aulas.
 */
export function Ava() {
  const { id } = useParams();
  const cursoId = Number(id);
  const [params, setParams] = useSearchParams();
  const [menuAberto, setMenuAberto] = useState(false);
  const [filtro, setFiltro] = useState('');
  const idMenu = useId();
  const tituloRef = useRef<HTMLHeadingElement>(null);

  const curso = useRequisicao((signal) => api.obterCurso(cursoId, signal), [cursoId]);
  const { concluidas, alternar } = useProgresso(cursoId);

  const aulas = useMemo<AulaComModulo[]>(
    () =>
      curso.dados?.modulos.flatMap((m) => m.aulas.map((a) => ({ ...a, chave: `${m.ordem}.${a.ordem}`, modulo: m }))) ??
      [],
    [curso.dados],
  );

  const chaveAtual = params.get('aula') ?? aulas[0]?.chave;
  const indiceAtual = Math.max(0, aulas.findIndex((a) => a.chave === chaveAtual));
  const aulaAtual = aulas[indiceAtual];
  const progresso = aulas.length ? Math.round((aulas.filter((a) => concluidas.has(a.chave)).length / aulas.length) * 100) : 0;

  useTituloPagina(aulaAtual ? `${aulaAtual.titulo} — ${curso.dados?.nomeCompleto}` : 'Ambiente virtual');

  const irPara = (chave: string) => {
    setParams({ aula: chave });
    setMenuAberto(false);
  };

  // Ao trocar de aula: rola para o topo e leva o foco ao título (leitores de tela).
  useEffect(() => {
    if (!aulaAtual) return;
    window.scrollTo({ top: 0 });
    tituloRef.current?.focus({ preventScroll: true });
  }, [aulaAtual?.chave]); // eslint-disable-line react-hooks/exhaustive-deps

  const termo = TextoBuscaNormalizado(filtro);
  const modulosFiltrados = useMemo(() => {
    if (!curso.dados) return [];
    return curso.dados.modulos
      .map((m) => ({
        ...m,
        aulas: termo
          ? m.aulas.filter((a) => TextoBuscaNormalizado(`${m.titulo} ${a.titulo}`).includes(termo))
          : m.aulas,
      }))
      .filter((m) => m.aulas.length > 0);
  }, [curso.dados, termo]);

  if (curso.status === 'carregando' && !curso.dados) {
    return (
      <div className="ava-estado">
        <Carregando texto="Carregando ambiente virtual…" />
      </div>
    );
  }

  if (curso.status === 'erro' || !curso.dados) {
    return (
      <div className="ava-estado container">
        {curso.status === 'erro' && curso.erro !== 'Conteúdo não encontrado.' ? (
          <EstadoErro mensagem={curso.erro} aoTentarNovamente={curso.tentarNovamente} />
        ) : (
          <EstadoVazio
            titulo="Curso não encontrado"
            texto="Não foi possível abrir este curso no ambiente virtual."
            acao={
              <Link to="/cursos" className="botao botao--escuro">
                Ver todos os cursos
              </Link>
            }
          />
        )}
      </div>
    );
  }

  const c = curso.dados;
  const anterior = aulas[indiceAtual - 1];
  const proxima = aulas[indiceAtual + 1];
  const atualConcluida = aulaAtual ? concluidas.has(aulaAtual.chave) : false;

  return (
    <div className="ava">
      <a href="#conteudo-aula" className="pular-conteudo">
        Pular para o conteúdo da aula
      </a>

      {/* ---------- Barra lateral ---------- */}
      <aside className="ava__lateral" aria-label="Conteúdo do curso">
        <div className="ava__cabecalho fundo-escuro">
          <div className="ava__acoes-topo">
            <Link to={`/cursos/${c.id}`} className="botao-icone" aria-label="Voltar para a página do curso">
              <IconeVoltar tamanho={24} />
            </Link>
            <button
              type="button"
              className="botao-icone ava__alternar"
              aria-expanded={menuAberto}
              aria-controls={idMenu}
              onClick={() => setMenuAberto((v) => !v)}
              aria-label={menuAberto ? 'Fechar lista de aulas' : 'Abrir lista de aulas'}
            >
              {menuAberto ? <IconeFechar tamanho={24} /> : <IconeMenu tamanho={24} />}
            </button>
          </div>
          <span className="ava__sobretitulo">Certificação</span>
          <p className="ava__curso">{c.nomeCompleto}</p>
          <div className="ava__progresso">
            <div
              className="ava__barra"
              role="progressbar"
              aria-label="Progresso no curso"
              aria-valuenow={progresso}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <span style={{ width: `${progresso}%` }} />
            </div>
            <span aria-hidden="true">{progresso}%</span>
          </div>
        </div>

        <div id={idMenu} className={`ava__menu ${menuAberto ? 'ava__menu--aberto' : ''}`}>
          <div className="ava__busca">
            <label htmlFor="busca-aulas" className="sr-only">
              Pesquisar aulas
            </label>
            <input
              id="busca-aulas"
              type="search"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              placeholder="Pesquisar aulas"
            />
            <IconeBusca tamanho={20} />
          </div>

          <nav aria-label="Módulos e aulas">
            {modulosFiltrados.length === 0 && <p className="ava__sem-resultado">Nenhuma aula encontrada.</p>}
            <ol role="list" className="ava__modulos">
              {modulosFiltrados.map((m) => {
                const contemAtual = m.ordem === aulaAtual?.modulo.ordem;
                return (
                  <li key={m.ordem}>
                    <details className="ava__modulo" open={contemAtual || !!termo}>
                      <summary>
                        {m.ordem}. {m.titulo}
                      </summary>
                      <ol role="list">
                        {m.aulas.map((a) => {
                          const chave = `${m.ordem}.${a.ordem}`;
                          const atual = chave === aulaAtual?.chave;
                          const feita = concluidas.has(chave);
                          return (
                            <li key={chave}>
                              <button
                                type="button"
                                className={`ava__aula ${atual ? 'ava__aula--atual' : ''}`}
                                aria-current={atual ? 'page' : undefined}
                                onClick={() => irPara(chave)}
                              >
                                {feita ? (
                                  <IconeCheckCirculo tamanho={20} />
                                ) : atual ? (
                                  <IconePlayCirculo tamanho={20} />
                                ) : (
                                  <IconeCirculo tamanho={20} />
                                )}
                                <span>
                                  {chave} {a.titulo}
                                  <span className="sr-only">{feita ? ' (concluída)' : ' (não concluída)'}</span>
                                </span>
                              </button>
                            </li>
                          );
                        })}
                      </ol>
                    </details>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </aside>

      {/* ---------- Conteúdo da aula ---------- */}
      <main id="conteudo-aula" className="ava__conteudo">
        {aulaAtual && (
          <article className="ava__aula-conteudo">
            <figure className="ava__banner">
              <img src={c.imagemUrl} alt="" width={1280} height={320} />
              <img src={logoSesi} alt="SESI" className="ava__banner-logo" width={66} height={22} />
            </figure>

            <p className="ava__trilha">
              Módulo {aulaAtual.modulo.ordem} · {aulaAtual.modulo.titulo} · {formatarDuracao(aulaAtual.duracaoMinutos)}
            </p>
            <h1 ref={tituloRef} tabIndex={-1} className="ava__titulo">
              {aulaAtual.titulo}
            </h1>
            <div className="ava__texto">
              {aulaAtual.descricao.split('\n\n').map((paragrafo, i) => (
                <p key={i}>{paragrafo}</p>
              ))}
            </div>

            <div className="ava__rodape-aula">
              <button
                type="button"
                className={`botao ${atualConcluida ? 'botao--contorno' : 'botao--escuro'}`}
                aria-pressed={atualConcluida}
                onClick={() => {
                  alternar(aulaAtual.chave);
                  if (!atualConcluida && proxima) irPara(proxima.chave);
                }}
              >
                <IconeCheckCirculo tamanho={22} />
                {atualConcluida ? 'Aula concluída' : proxima ? 'Concluir e avançar' : 'Concluir aula'}
              </button>

              <div className="ava__navegacao">
                <button type="button" className="botao botao--contorno" disabled={!anterior} onClick={() => anterior && irPara(anterior.chave)}>
                  <SetaEsquerda tamanho={24} /> Anterior
                </button>
                <button type="button" className="botao botao--contorno" disabled={!proxima} onClick={() => proxima && irPara(proxima.chave)}>
                  Próxima <SetaDireita tamanho={24} />
                </button>
              </div>
            </div>
          </article>
        )}
      </main>
    </div>
  );
}
