import { db } from '@/lib/db'
import { searchJobs } from '@/lib/adzuna'

export async function POST(request: Request) {
  try {
    const { resumeId, location, keywords } = (await request.json()) as {
      resumeId: string
      location: string
      keywords: string[]
    }

    if (!resumeId || !location || !keywords?.length) {
      return Response.json(
        { error: 'resumeId, location, and keywords are required' },
        { status: 400 },
      )
    }

    const resume = await db.resume.findUnique({ where: { id: resumeId } })
    if (!resume) {
      return Response.json({ error: 'Resume not found' }, { status: 404 })
    }

    const jobs = await searchJobs({ keywords, location })

    const jobSearch = await db.jobSearch.create({
      data: {
        userId: resume.userId,
        resumeId,
        location,
        keywords,
      },
    })

    return Response.json({ jobSearchId: jobSearch.id, jobs })
  } catch (err) {
    console.error('[search-jobs]', err)
    return Response.json({ error: 'Job search failed' }, { status: 500 })
  }
}
