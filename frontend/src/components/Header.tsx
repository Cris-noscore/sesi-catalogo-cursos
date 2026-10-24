import { useEffect, useId, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import logoPrimario from '../assets/icons/logo-sesi-industria-primary.svg';
import logoBranco from '../assets/icons/logo-sesi-industria-white.svg';
import { IconeFechar, IconeMenu } from './Icones';
import './Header.css';

const LINKS = [
  { para: '/', rotulo: 'Início', fim: true },
  { para: '/cursos', rotulo: 'Cursos', fim: false },
  { para: '/#sobre', rotulo: 'Sobre', fim: true },
];

/**
 * Menu fixo no topo (como no protótipo). Na home, começa transparente sobre o
 * banner vermelho e fica branco ao rolar a página. Em telas pequenas, vira um
 * menu "hambúrguer" acessível (aria-expanded, fecha com Esc).
 */
export function Header() {
  const { pathname, hash } = useLocation();
  const [rolou, setRolou] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const idMenu = useId();

  const sobreBanner = pathname === '/' && !rolou && !menuAberto;

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 24);
    aoRolar();
    window.addEventListener('scroll', aoRolar, { passive: true });
    return () => window.removeEventListener('scroll', aoRolar);
  }, []);

  // Fecha o menu ao navegar.
  useEffect(() => setMenuAberto(false), [pathname, hash]);

  useEffect(() => {
    if (!menuAberto) return;
    const aoTeclar = (e: KeyboardEvent) => e.key === 'Escape' && setMenuAberto(false);
    document.addEventListener('keydown', aoTeclar);
    return () => document.removeEventListener('keydown', aoTeclar);
  }, [menuAberto]);

  return (
    <header className={`header ${sobreBanner ? 'header--transparente fundo-escuro' : 'header--solido'}`}>
      <div className="container header__conteudo">
        <Link to="/" className="header__logo" aria-label="SESI Indústria — página inicial">
          <img src={sobreBanner ? logoBranco : logoPrimario} alt="" width={216} height={22} />
        </Link>

        <button
          type="button"
          className="botao-icone header__alternar"
          aria-expanded={menuAberto}
          aria-controls={idMenu}
          aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setMenuAberto((v) => !v)}
        >
          {menuAberto ? <IconeFechar tamanho={28} /> : <IconeMenu tamanho={28} />}
        </button>

        <nav id={idMenu} className={`header__nav ${menuAberto ? 'header__nav--aberto' : ''}`} aria-label="Principal">
          <ul role="list" className="header__links">
            {LINKS.map((link) => (
              <li key={link.rotulo}>
                <NavLink
                  to={link.para}
                  end={link.fim}
                  className={({ isActive }) =>
                    `header__link ${isActive && !(link.para === '/' && hash) && !link.para.includes('#') ? 'header__link--ativo' : ''}`
                  }
                >
                  {link.rotulo}
                </NavLink>
              </li>
            ))}
          </ul>
          <Link
            to="/area-do-aluno"
            className={`botao header__aluno ${sobreBanner ? 'botao--contorno-claro' : 'botao--contorno'}`}
          >
            Área do aluno
          </Link>
        </nav>
      </div>
    </header>
  );
}
