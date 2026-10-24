import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Footer } from './Footer';
import { Header } from './Header';

/**
 * Estrutura comum: link "pular para o conteúdo", menu fixo, conteúdo e rodapé.
 * Também controla a rolagem: volta ao topo ao trocar de página, rola até a
 * âncora (#sobre) e move o foco para o conteúdo principal (acessibilidade em SPA).
 */
export function Layout() {
  const { pathname, hash } = useLocation();
  const rotaAnterior = useRef(pathname);

  useEffect(() => {
    // No carregamento inicial (e se só o hash mudou) o foco não é movido, para que o
    // primeiro Tab alcance o link "Pular para o conteúdo".
    const mudouDePagina = rotaAnterior.current !== pathname;
    rotaAnterior.current = pathname;
    if (hash) {
      // Aguarda a renderização da página antes de rolar até a âncora.
      const timer = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 50);
      return () => clearTimeout(timer);
    }
    if (!mudouDePagina) return;
    window.scrollTo({ top: 0 });
    document.getElementById('conteudo')?.focus({ preventScroll: true });
  }, [pathname, hash]);

  return (
    <>
      <a href="#conteudo" className="pular-conteudo">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" tabIndex={-1} style={{ outline: 'none' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
