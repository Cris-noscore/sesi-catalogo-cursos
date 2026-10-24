import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import { Ava } from './pages/Ava';
import { Catalogo } from './pages/Catalogo';
import { CursoDetalhe } from './pages/CursoDetalhe';
import { Home } from './pages/Home';
import { AreaDoAluno, NaoEncontrado } from './pages/PaginaInformativa';

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="cursos" element={<Catalogo />} />
            <Route path="cursos/:id" element={<CursoDetalhe />} />
            <Route path="area-do-aluno" element={<AreaDoAluno />} />
            <Route path="*" element={<NaoEncontrado />} />
          </Route>
          {/* O AVA tem layout próprio (sem o menu do site), como no protótipo. */}
          <Route path="cursos/:id/aula" element={<Ava />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
