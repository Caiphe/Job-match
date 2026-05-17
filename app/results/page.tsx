import { db } from '@/lib/db'
import JobList from '@/components/jobs/JobList'
import type { JobListing } from '@/types'

type Props = {
  searchParams: Promise<{ jobSearchId?: string }>
}

export default async function ResultsPage({ searchParams }: Props) {
  const { jobSearchId } = await searchParams

  if (!jobSearchId) {
    return (
      <div className="py-24 text-center text-gray-500">
        No search selected.{' '}
        <a href="/upload" className="text-blue-600 hover:underline">
          Upload a CV
        </a>{' '}
        to get started.
      </div>
    )
  }

  const results = await db.jobResult.findMany({
    where: { jobSearchId },
    orderBy: { matchScore: 'desc' },
  })

  const jobs: JobListing[] = results.map((r) => ({
    id: r.externalId,
    title: r.title,
    company: r.company,
    location: r.location,
    salary: r.salary ?? undefined,
    description: r.description,
    applyUrl: r.applyUrl,
    source: r.source,
    matchScore: r.matchScore ?? undefined,
    matchedSkills: r.matchedSkills,
    matchReason: r.matchReason ?? undefined,
  }))

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Your Matched Jobs</h1>
      <p className="mb-8 text-gray-500">{jobs.length} jobs found and scored against your profile.</p>
      <JobList jobs={jobs} />
    </div>
  )
}
