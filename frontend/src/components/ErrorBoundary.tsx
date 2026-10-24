import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Estado {
  erro: boolean;
}

/** Captura erros inesperados de renderização e exibe uma mensagem amigável. */
export class ErrorBoundary extends Component<{ children: ReactNode }, Estado> {
  state: Estado = { erro: false };

  static getDerivedStateFromError(): Estado {
    return { erro: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Erro inesperado na interface:', error, info.componentStack);
  }

  render() {
    if (!this.state.erro) return this.props.children;
    return (
      <div role="alert" style={{ padding: '4rem 1.5rem', textAlign: 'center', fontFamily: 'var(--fonte)' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Algo deu errado</h1>
        <p style={{ marginBottom: '1.5rem' }}>Ocorreu um erro inesperado. Recarregue a página para tentar novamente.</p>
        <button type="button" className="botao botao--escuro" onClick={() => window.location.reload()}>
          Recarregar página
        </button>
      </div>
    );
  }
}
