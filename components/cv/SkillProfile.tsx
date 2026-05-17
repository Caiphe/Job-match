import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import type { SkillProfile as SkillProfileType } from '@/types'

const seniorityColor = {
  junior: 'blue',
  mid: 'green',
  senior: 'yellow',
  lead: 'red',
} as const

type Props = {
  profile: SkillProfileType
}

export default function SkillProfile({ profile }: Props) {
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{profile.title}</h2>
          <p className="text-sm text-gray-500">{profile.yearsOfExperience} years of experience</p>
        </div>
        <Badge variant={seniorityColor[profile.seniority]} className="capitalize">
          {profile.seniority}
        </Badge>
      </div>
      <p className="mb-4 text-sm text-gray-600">{profile.summary}</p>
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">Skills</p>
        <div className="flex flex-wrap gap-2">
          {profile.skills.map((skill) => (
            <Badge key={skill}>{skill}</Badge>
          ))}
        </div>
      </div>
    </Card>
  )
}
