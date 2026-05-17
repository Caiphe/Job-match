import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-primary">
          JobMatch
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-muted">
          <Link href="/upload" className="transition-colors hover:text-text">
            Upload CV
          </Link>
          <Link href="/dashboard" className="transition-colors hover:text-text">
            Dashboard
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
