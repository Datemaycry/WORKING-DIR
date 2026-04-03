import { useSettingsSync } from '../../hooks/useSettingsSync'
import Header from './Header'
import NavBar from './NavBar'

interface ShellProps {
  children: React.ReactNode
  headerTitle?: string
  headerLeft?: React.ReactNode
  headerRight?: React.ReactNode
  hideHeader?: boolean
  hideNav?: boolean
}

export default function Shell({
  children,
  headerTitle,
  headerLeft,
  headerRight,
  hideHeader = false,
  hideNav = false,
}: ShellProps) {
  useSettingsSync()

  return (
    <div className="flex flex-col min-h-dvh bg-[var(--color-bg)] text-[var(--color-text)]">
      {!hideHeader && (
        <Header title={headerTitle} left={headerLeft} right={headerRight} />
      )}

      <main className="flex-1 overflow-hidden relative">
        {children}
      </main>

      {!hideNav && <NavBar />}
    </div>
  )
}
