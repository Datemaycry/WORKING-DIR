import { HashRouter, Outlet, Route, Routes } from 'react-router-dom'
import ErrorBoundary from './components/ui/ErrorBoundary'
import Shell from './components/layout/Shell'
import ToastContainer from './components/ui/Toast'
import EmptyState from './components/ui/EmptyState'
import Button from './components/ui/Button'
import LibraryView from './components/library/LibraryView'
import MangaInspector from './components/inspector/MangaInspector'
import ReaderView from './components/reader/ReaderView'

// ── Layout: library + settings (header + navbar) ──────────────
function MainLayout() {
  return (
    <Shell>
      <Outlet />
      <ToastContainer />
      <MangaInspector />
    </Shell>
  )
}

// ── Layout: reader (full-screen, no chrome) ───────────────────
function ReaderLayout() {
  return (
    <Shell hideHeader hideNav>
      <Outlet />
      <ToastContainer />
    </Shell>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<LibraryView />} />
            <Route
              path="/settings"
              element={
                <div className="p-6 flex flex-col gap-4">
                  <EmptyState
                    icon="🚧"
                    title="Paramètres"
                    description="Cette section sera disponible dans une prochaine brique."
                  />
                  <Button variant="primary" onClick={() => alert('Brique 7')}>
                    Test Button primary
                  </Button>
                  <Button variant="secondary">Test Button secondary</Button>
                  <Button variant="ghost">Test Button ghost</Button>
                  <Button variant="danger">Test Button danger</Button>
                  <Button loading>Chargement…</Button>
                </div>
              }
            />
          </Route>
          <Route element={<ReaderLayout />}>
            <Route path="/reader/:id" element={<ReaderView />} />
          </Route>
        </Routes>
      </HashRouter>
    </ErrorBoundary>
  )
}
