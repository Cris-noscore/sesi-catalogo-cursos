import { Link } from 'react-router-dom';
import logoBranco from '../assets/icons/logo-sesi-industria-white.svg';
import logoSesi from '../assets/icons/logo-sesi.svg';
import { RODAPE } from '../data/conteudo';
import { IconeFacebook, IconeInstagram, IconeLinkedIn } from './Icones';
import './Footer.css';

/** Rodapé institucional, transcrito do protótipo. Links sem destino real não são clicáveis. */
export function Footer() {
  return (
    <footer className="rodape fundo-escuro">
      <div className="container">
        <div className="rodape__grade">
          <div className="rodape__marca">
            <img src={logoBranco} alt="SESI Indústria" width={216} height={22} />
            <address>
              <a href={`mailto:${RODAPE.email}`}>{RODAPE.email}</a>
              <span>{RODAPE.endereco}</span>
            </address>
          </div>

          <nav aria-labelledby="rodape-navegacao">
            <h2 id="rodape-navegacao" className="rodape__titulo">
              Navegação
            </h2>
            <ul role="list">
              {RODAPE.navegacao.map((item) => (
                <li key={item.rotulo}>
                  {item.para ? <Link to={item.para}>{item.rotulo}</Link> : <span>{item.rotulo}</span>}
                </li>
              ))}
            </ul>
          </nav>

          <div className="rodape__coluna">
            <h2 id="rodape-cursos" className="rodape__titulo">
              Cursos populares
            </h2>
            <ul role="list">
              {RODAPE.cursosPopulares.map((nome) => (
                <li key={nome}>
                  <span>{nome}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rodape__coluna">
            <h2 id="rodape-suporte" className="rodape__titulo">
              Suporte
            </h2>
            <ul role="list">
              {RODAPE.suporte.map((item) => (
                <li key={item}>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rodape__base">
          <p>
            <img src={logoSesi} alt="SESI" width={66} height={22} className="rodape__selo" />
            <span>Todos os direitos reservados. Projeto fictício para processo seletivo.</span>
          </p>
          <ul role="list" className="rodape__sociais" aria-label="Redes sociais">
            <li>
              <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn (abre em nova aba)">
                <IconeLinkedIn tamanho={28} />
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram (abre em nova aba)">
                <IconeInstagram tamanho={28} />
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook (abre em nova aba)">
                <IconeFacebook tamanho={28} />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
