import { db } from '@/lib/db'
import { extractSkillProfile } from '@/lib/claude'

export async function POST(request: Request) {
  try {
    const { resumeId } = (await request.json()) as { resumeId: string }

    if (!resumeId) {
      return Response.json({ error: 'resumeId is required' }, { status: 400 })
    }

    const resume = await db.resume.findUnique({ where: { id: resumeId } })
    if (!resume) {
      return Response.json({ error: 'Resume not found' }, { status: 404 })
    }

    const skillProfile = await extractSkillProfile(resume.rawText)

    await db.resume.update({
      where: { id: resumeId },
      data: { skillProfile: skillProfile as object },
    })

    return Response.json({ skillProfile })
  } catch (err) {
    console.error('[analyse-cv]', err)
    return Response.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
