import Link from 'next/link'
import Card from '@/components/ui/Card'

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <Card className="w-full max-w-sm p-8 text-center">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Welcome to JobMatch</h1>
        <p className="mb-8 text-sm text-gray-500">Sign in to save your searches and track applications.</p>
        <p className="mb-4 text-sm text-gray-400">Auth coming soon.</p>
        <Link
          href="/upload"
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Continue as Guest →
        </Link>
      </Card>
    </div>
  )
}
