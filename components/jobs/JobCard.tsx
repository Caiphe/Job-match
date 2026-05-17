import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import type { JobListing } from '@/types'

function scoreColor(score?: number) {
  if (!score) return 'default'
  if (score >= 75) return 'green'
  if (score >= 50) return 'yellow'
  return 'red'
}

type Props = {
  job: JobListing
}

export default function JobCard({ job }: Props) {
  return (
    <Card className="p-5">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-gray-900">{job.title}</h3>
          <p className="text-sm text-gray-500">
            {job.company} &middot; {job.location}
          </p>
          {job.salary && (
            <p className="mt-0.5 text-sm font-medium text-green-700">{job.salary}</p>
          )}
        </div>
        {job.matchScore !== undefined && (
          <Badge variant={scoreColor(job.matchScore)} className="shrink-0">
            {job.matchScore}% match
          </Badge>
        )}
      </div>

      {job.matchReason && (
        <p className="mb-3 text-sm italic text-gray-500">{job.matchReason}</p>
      )}

      {job.matchedSkills && job.matchedSkills.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {job.matchedSkills.map((skill) => (
            <Badge key={skill} variant="blue">
              {skill}
            </Badge>
          ))}
        </div>
      )}

      <p className="mb-4 line-clamp-3 text-sm text-gray-600">{job.description}</p>

      <a
        href={job.applyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        Apply Now
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </Card>
  )
}
