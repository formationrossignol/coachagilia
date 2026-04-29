import { useShallow } from 'zustand/react/shallow'
import { useGamificationStore } from '../../features/gamification'
import { getRecommendations } from '../../features/gamification/recommendations'
import { SkillProgressCard } from '../../components/gamification/SkillProgressCard'
import { SKILL_AREAS } from '../../components/gamification/constants'

export function SkillsPage() {
  const allSkillXp = useGamificationStore(useShallow(s => s.getAllSkillXp()))
  const getMasteryLevelForSkill = useGamificationStore(s => s.getMasteryLevelForSkill)
  const completedSlugs = useGamificationStore(useShallow(s => s.getCompletedContentSlugs()))

  const skillData = SKILL_AREAS
    .map(skill => ({
      skill,
      xp: allSkillXp[skill] ?? 0,
      level: getMasteryLevelForSkill(skill),
      recommendations: getRecommendations(skill, completedSlugs),
    }))
    .sort((a, b) => b.xp - a.xp)

  return (
    <div className="gamification-page">
      <h1 className="gamification-page__title">Compétences</h1>
      <div className="skills-grid">
        {skillData.map(({ skill, xp, level, recommendations }) => (
          <SkillProgressCard
            key={skill}
            skill={skill}
            xp={xp}
            level={level}
            recommendations={recommendations}
          />
        ))}
      </div>
    </div>
  )
}
