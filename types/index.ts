export type SkillProfile = {
  title: string
  seniority: 'junior' | 'mid' | 'senior' | 'lead'
  skills: string[]
  yearsOfExperience: number
  summary: string
}

export type JobListing = {
  id: string
  title: string
  company: string
  location: string
  salary?: string
  description: string
  applyUrl: string
  source: string
  matchScore?: number
  matchedSkills?: string[]
  matchReason?: string
}

export type SearchFilters = {
  location: string
  keywords: string[]
  minMatchScore?: number
}
