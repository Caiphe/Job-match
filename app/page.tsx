import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="mb-4 text-5xl font-bold tracking-tight text-gray-900">
        Find jobs that <span className="text-blue-600">actually fit you</span>
      </h1>
      <p className="mb-10 max-w-xl text-lg text-gray-500">
        Upload your CV and let Claude AI extract your skills, search thousands of listings, and rank
        them by how well they match your profile.
      </p>
      <div className="flex gap-4">
        <Link href="/upload">
          <Button size="lg">Upload Your CV</Button>
        </Link>
        <Link href="/dashboard">
          <Button size="lg" variant="secondary">View Dashboard</Button>
        </Link>
      </div>
      <div className="mt-20 grid max-w-3xl gap-8 text-left sm:grid-cols-3">
        {[
          {
            icon: '📄',
            title: 'Upload CV',
            desc: 'Drop your PDF resume and we extract your skills automatically.',
          },
          {
            icon: '🤖',
            title: 'AI Analysis',
            desc: 'Claude reads your experience and builds a detailed skill profile.',
          },
          {
            icon: '🎯',
            title: 'Matched Jobs',
            desc: 'We search Adzuna and score every job against your profile.',
          },
        ].map((item) => (
          <div key={item.title} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-2 text-3xl">{item.icon}</div>
            <h3 className="mb-1 font-semibold text-gray-900">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
