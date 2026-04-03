import { HashRouter, Route, Routes } from 'react-router-dom'

function PlaceholderPage({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh gap-4">
      <h1 className="text-2xl font-bold text-white">{name}</h1>
      <p className="text-[var(--color-text-muted)]">MangaHub Pro — Brique 0 scaffold</p>
    </div>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<PlaceholderPage name="Library" />} />
        <Route path="/reader/:id" element={<PlaceholderPage name="Reader" />} />
        <Route path="/settings" element={<PlaceholderPage name="Settings" />} />
      </Routes>
    </HashRouter>
  )
}
