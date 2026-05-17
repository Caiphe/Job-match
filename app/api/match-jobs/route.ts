import { db } from '@/lib/db'
import { matchJobsToProfile } from '@/lib/claude'
import type { JobListing, SkillProfile } from '@/types'

export async function POST(request: Request) {
  try {
    const { jobSearchId, profile, jobs } = (await request.json()) as {
      jobSearchId: string
      profile: SkillProfile
      jobs: JobListing[]
    }

    if (!jobSearchId || !profile || !jobs?.length) {
      return Response.json(
        { error: 'jobSearchId, profile, and jobs are required' },
        { status: 400 },
      )
    }

    const matched = await matchJobsToProfile(profile, jobs)

    await db.jobResult.createMany({
      data: matched.map((job) => ({
        jobSearchId,
        externalId: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary ?? null,
        description: job.description,
        applyUrl: job.applyUrl,
        source: job.source,
        matchScore: job.matchScore ?? null,
        matchedSkills: job.matchedSkills ?? [],
        matchReason: job.matchReason ?? null,
      })),
      skipDuplicates: true,
    })

    return Response.json({ jobs: matched })
  } catch (err) {
    console.error('[match-jobs]', err)
    return Response.json({ error: 'Job matching failed' }, { status: 500 })
  }
}
