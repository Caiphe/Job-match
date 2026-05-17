import { env } from './env'
import type { JobListing } from '@/types'

type AdzunaJob = {
  id: string
  title: string
  company: { display_name: string }
  location: { display_name: string }
  salary_min?: number
  salary_max?: number
  description: string
  redirect_url: string
}

export async function searchJobs({
  keywords,
  location,
  results = 20,
}: {
  keywords: string[]
  location: string
  results?: number
}): Promise<JobListing[]> {
  const url = new URL('https://api.adzuna.com/v1/api/jobs/us/search/1')
  url.searchParams.set('app_id', env.ADZUNA_APP_ID)
  url.searchParams.set('app_key', env.ADZUNA_API_KEY)
  url.searchParams.set('what', keywords.join(' '))
  url.searchParams.set('where', location)
  url.searchParams.set('results_per_page', String(results))
  url.searchParams.set('content-type', 'application/json')

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`Adzuna API error: ${res.status}`)

  const data = (await res.json()) as { results: AdzunaJob[] }

  return data.results.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.company.display_name,
    location: job.location.display_name,
    salary:
      job.salary_min && job.salary_max
        ? `$${Math.round(job.salary_min).toLocaleString()} – $${Math.round(job.salary_max).toLocaleString()}`
        : undefined,
    description: job.description,
    applyUrl: job.redirect_url,
    source: 'adzuna',
  }))
}
