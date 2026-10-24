import { Link } from 'react-router-dom';
import { EstadoVazio } from '../components/Estados';
import { useTituloPagina } from '../hooks/useTituloPagina';

export function NaoEncontrado() {
  useTituloPagina('Página não encontrada');
  return (
    <div className="container" style={{ paddingTop: 'calc(var(--altura-header) + 3rem)', minHeight: '70vh' }}>
      <EstadoVazio
        titulo="Página não encontrada"
        texto="O endereço acessado não existe. Que tal explorar o nosso catálogo de cursos?"
        acao={
          <Link to="/cursos" className="botao botao--escuro">
            Ver todos os cursos
          </Link>
        }
      />
    </div>
  );
}

export function AreaDoAluno() {
  useTituloPagina('Área do aluno');
  return (
    <div className="container" style={{ paddingTop: 'calc(var(--altura-header) + 3rem)', minHeight: '70vh' }}>
      <EstadoVazio
        titulo="Área do aluno"
        texto="Nesta demonstração, o acesso ao Ambiente Virtual de Aprendizagem (Moodle) é simulado: escolha um curso com inscrições abertas e clique em “Matricule-se” para abrir a tela de aulas."
        acao={
          <Link to="/cursos?status=inscricoes-abertas" className="botao botao--escuro">
            Ver cursos com inscrições abertas
          </Link>
        }
      />
    </div>
  );
}
