import { HashRouter, Route, Routes } from 'react-router-dom'
import ErrorBoundary from './components/ui/ErrorBoundary'
import Shell from './components/layout/Shell'
import ToastContainer from './components/ui/Toast'
import EmptyState from './components/ui/EmptyState'
import Button from './components/ui/Button'

function PlaceholderPage({ name }: { name: string }) {
  return (
    <EmptyState
      icon="🚧"
      title={name}
      description="Cette section sera disponible dans une prochaine brique."
    />
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <Shell>
          <Routes>
            <Route path="/" element={<PlaceholderPage name="Bibliothèque" />} />
            <Route path="/reader/:id" element={<PlaceholderPage name="Reader" />} />
            <Route
              path="/settings"
              element={
                <div className="p-6 flex flex-col gap-4">
                  <PlaceholderPage name="Paramètres" />
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
          </Routes>
          <ToastContainer />
        </Shell>
      </HashRouter>
    </ErrorBoundary>
  )
}
