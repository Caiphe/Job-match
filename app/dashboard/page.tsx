import Link from 'next/link'
import { db } from '@/lib/db'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import type { Resume, JobSearch, JobResult } from '@/lib/generated/prisma/client'

type SearchWithResults = JobSearch & { results: JobResult[] }
type ResumeWithSearches = Resume & { jobSearches: SearchWithResults[] }

export default async function DashboardPage() {
  let resumes: ResumeWithSearches[] = []

  try {
    const user = await db.user.findUnique({
      where: { email: 'demo@jobmatch.local' },
      include: {
        resumes: {
          orderBy: { uploadedAt: 'desc' },
          include: { jobSearches: { include: { results: true } } },
        },
      },
    })
    resumes = (user?.resumes ?? []) as ResumeWithSearches[]
  } catch {
    // DB not available — show empty state
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Link
          href="/upload"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          New Search
        </Link>
      </div>

      {resumes.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="mb-4 text-gray-500">No CVs uploaded yet.</p>
          <Link href="/upload" className="text-blue-600 hover:underline">
            Upload your first CV →
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {resumes.map((resume) => (
            <Card key={resume.id} className="p-5">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900">{resume.fileName}</h2>
                  <p className="text-sm text-gray-500">
                    Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge>{resume.jobSearches.length} searches</Badge>
              </div>
              {resume.jobSearches.length > 0 && (
                <ul className="space-y-2">
                  {resume.jobSearches.map((search) => (
                    <li
                      key={search.id}
                      className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2 text-sm"
                    >
                      <span className="text-gray-700">
                        {search.location} &middot; {search.keywords.join(', ')}
                      </span>
                      <Link
                        href={`/results?jobSearchId=${search.id}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {search.results.length} results →
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
