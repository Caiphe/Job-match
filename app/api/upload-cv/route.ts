import { db } from '@/lib/db'
import { extractTextFromPdf } from '@/lib/pdf'

async function getDemoUser() {
  return db.user.upsert({
    where: { email: 'demo@jobmatch.local' },
    create: { email: 'demo@jobmatch.local', name: 'Demo User' },
    update: {},
  })
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 })
    }
    if (file.type !== 'application/pdf') {
      return Response.json({ error: 'File must be a PDF' }, { status: 400 })
    }
    if (file.size > 5 * 1024 * 1024) {
      return Response.json({ error: 'File must be under 5MB' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const rawText = await extractTextFromPdf(buffer)

    if (!rawText) {
      return Response.json({ error: 'Could not extract text from PDF' }, { status: 422 })
    }

    const user = await getDemoUser()

    const resume = await db.resume.create({
      data: {
        userId: user.id,
        fileName: file.name,
        rawText,
      },
    })

    return Response.json({ resumeId: resume.id, fileName: resume.fileName, rawText })
  } catch (err) {
    console.error('[upload-cv]', err)
    return Response.json({ error: 'Upload failed' }, { status: 500 })
  }
}
