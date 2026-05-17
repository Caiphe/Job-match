import Anthropic from '@anthropic-ai/sdk'
import { env } from './env'
import type { SkillProfile, JobListing } from '@/types'

const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY })

export async function extractSkillProfile(resumeText: string): Promise<SkillProfile> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Analyze this resume and return ONLY valid JSON with no markdown or explanation:
{
  "title": "job title",
  "seniority": "junior" or "mid" or "senior" or "lead",
  "skills": ["skill1", "skill2"],
  "yearsOfExperience": 5,
  "summary": "2-3 sentence professional summary"
}

Resume:
${resumeText}`,
      },
    ],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  const json = text.match(/\{[\s\S]*\}/)?.[0]
  if (!json) throw new Error('Claude returned no valid JSON for skill profile')
  return JSON.parse(json) as SkillProfile
}

export async function matchJobsToProfile(
  profile: SkillProfile,
  jobs: JobListing[],
): Promise<JobListing[]> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `You are a job matching expert. Score each job for this candidate and return ONLY a JSON array — no markdown, no explanation.

Candidate:
${JSON.stringify(profile, null, 2)}

Jobs:
${JSON.stringify(jobs, null, 2)}

Add to each job:
- matchScore: 0-100
- matchedSkills: string[] (candidate skills that match)
- matchReason: string (one sentence)

Sort by matchScore descending.`,
      },
    ],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  const json = text.match(/\[[\s\S]*\]/)?.[0]
  if (!json) throw new Error('Claude returned no valid JSON for job matches')
  return JSON.parse(json) as JobListing[]
}
