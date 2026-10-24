import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { Carrossel } from '../components/Carrossel';
import { CursoCard, CursoCardEsqueleto } from '../components/CursoCard';
import { EstadoErro } from '../components/Estados';
import { SetaDireita } from '../components/Icones';
import { Beneficios, ChamadaCarreira, Depoimentos } from '../components/Secoes';
import { ESTATISTICAS } from '../data/conteudo';
import { useRequisicao } from '../hooks/useRequisicao';
import { useTituloPagina } from '../hooks/useTituloPagina';
import './Home.css';

const CONSULTA_DESTAQUES = {
  busca: '',
  categorias: [],
  modalidades: [],
  status: [],
  ordenacao: 'relevancia' as const,
  pagina: 1,
};

export function Home() {
  useTituloPagina('Impulsione sua carreira na indústria');
  const destaques = useRequisicao(
    (signal) => api.listarCursos(CONSULTA_DESTAQUES, signal, { destaque: true }),
    [],
  );

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="hero fundo-escuro" aria-labelledby="hero-titulo">
        <picture>
          <source media="(max-width: 960px)" srcSet="/img/hero-image-960.webp" />
          <img
            className="hero__imagem"
            src="/img/hero-image-1920.webp"
            alt=""
            width={1920}
            height={1080}
            fetchPriority="high"
          />
        </picture>
        <div className="container hero__conteudo">
          <h1 id="hero-titulo" className="hero__titulo">
            Impulsione sua carreira na indústria
          </h1>
          <p className="hero__texto">
            Amplie seus conhecimentos com excelência na melhor plataforma de estudos da indústria brasileira
          </p>
          <Link to="/cursos" className="botao botao--claro">
            Conhecer cursos <SetaDireita tamanho={24} />
          </Link>
        </div>
      </section>

      {/* ---------- Principais cursos ---------- */}
      <section className="principais" aria-labelledby="principais-titulo">
        <div className="container">
          <h2 id="principais-titulo" className="titulo-secao principais__titulo">
            Principais cursos
          </h2>
        </div>

        {destaques.status === 'erro' && !destaques.dados ? (
          <div className="container">
            <EstadoErro mensagem={destaques.erro} aoTentarNovamente={destaques.tentarNovamente} />
          </div>
        ) : (
          <div aria-busy={destaques.status === 'carregando'}>
            {destaques.status === 'carregando' && !destaques.dados && (
              <span className="sr-only" role="status">
                Carregando os principais cursos…
              </span>
            )}
            <Carrossel
              rotulo="Principais cursos"
              acoes={
                <Link to="/cursos" className="botao botao--contorno">
                  Ver todos os cursos
                </Link>
              }
            >
              {destaques.dados
                ? [
                    ...destaques.dados.itens.map((curso) => <CursoCard key={curso.id} curso={curso} />),
                    <Link key="todos" to="/cursos" className="card-todos">
                      <span>Todos os cursos</span>
                      <SetaDireita tamanho={36} />
                    </Link>,
                  ]
                : Array.from({ length: 5 }, (_, i) => <CursoCardEsqueleto key={i} />)}
            </Carrossel>
          </div>
        )}
      </section>

      {/* ---------- Impacto transformador ---------- */}
      <section id="sobre" className="impacto" aria-labelledby="impacto-titulo">
        <div className="container impacto__grade">
          <div className="impacto__intro">
            <h2 id="impacto-titulo" className="titulo-secao">
              Impacto transformador
            </h2>
            <p>Resultados que demonstram o sucesso da nossa metodologia de capacitação contínua para a indústria</p>
          </div>
          <div className="impacto__dados">
            <dl className="impacto__numeros">
              {ESTATISTICAS.map((e) => (
                <div key={e.rotulo} className="impacto__numero">
                  <dt>{e.rotulo}</dt>
                  <dd>
                    <span aria-hidden={e.descricaoAcessivel ? true : undefined}>{e.valor}</span>
                    {e.descricaoAcessivel && <span className="sr-only">{e.descricaoAcessivel}</span>}
                  </dd>
                </div>
              ))}
            </dl>
            <Beneficios variante="rosa" quantidade={3} />
          </div>
        </div>
      </section>

      <Depoimentos variante="vermelho" />
      <ChamadaCarreira />
    </>
  );
}
