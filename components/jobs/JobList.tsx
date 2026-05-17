'use client'

import { useState } from 'react'
import JobCard from './JobCard'
import type { JobListing } from '@/types'

type Props = {
  jobs: JobListing[]
}

export default function JobList({ jobs }: Props) {
  const [minScore, setMinScore] = useState(0)

  const filtered = jobs
    .filter((j) => (j.matchScore ?? 0) >= minScore)
    .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">
          Min match score: <span className="font-bold text-blue-600">{minScore}%</span>
        </label>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={minScore}
          onChange={(e) => setMinScore(Number(e.target.value))}
          className="flex-1"
        />
        <span className="text-sm text-gray-500">{filtered.length} jobs</span>
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-gray-500">
          No jobs match your current filter. Try lowering the minimum score.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  )
}
