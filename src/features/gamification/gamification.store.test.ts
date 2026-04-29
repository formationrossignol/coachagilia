// src/features/gamification/gamification.store.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useGamificationStore } from './gamification.store'

beforeEach(() => {
  localStorage.clear()
  useGamificationStore.setState({ events: [], artifacts: [], toastQueue: [] }, true)
})

describe('recordEvent', () => {
  it('adds an event to the events array', () => {
    useGamificationStore.getState().recordEvent({ type: 'WORKSHOP_COMPLETED', contentSlug: 'scrum-guide' })
    const { events } = useGamificationStore.getState()
    expect(events).toHaveLength(1)
    expect(events[0].type).toBe('WORKSHOP_COMPLETED')
  })

  it('awards correct base XP for WORKSHOP_COMPLETED', () => {
    useGamificationStore.getState().recordEvent({ type: 'WORKSHOP_COMPLETED', contentSlug: 'scrum-guide' })
    const { events } = useGamificationStore.getState()
    const main = events.find(e => e.type === 'WORKSHOP_COMPLETED')!
    expect(main.xpAwarded).toBe(100)
  })

  it('awards HIGH_SCORE_80 bonus when score is 80', () => {
    useGamificationStore.getState().recordEvent({ type: 'WORKSHOP_COMPLETED', contentSlug: 'scrum-guide', score: 80 })
    const { events } = useGamificationStore.getState()
    const main = events.find(e => e.type === 'WORKSHOP_COMPLETED')!
    expect(main.xpAwarded).toBe(125) // 100 + 25
  })

  it('awards PERFECT_SCORE bonus when score is 100', () => {
    useGamificationStore.getState().recordEvent({ type: 'WORKSHOP_COMPLETED', contentSlug: 'scrum-guide', score: 100 })
    const { events } = useGamificationStore.getState()
    const main = events.find(e => e.type === 'WORKSHOP_COMPLETED')!
    expect(main.xpAwarded).toBe(200) // 100 + 100
  })

  it('computes skillImpacts from CONTENT_SKILL_MAP', () => {
    useGamificationStore.getState().recordEvent({ type: 'WORKSHOP_COMPLETED', contentSlug: 'thomas-kilmann', score: 80 })
    const { events } = useGamificationStore.getState()
    const main = events.find(e => e.type === 'WORKSHOP_COMPLETED')!
    // xpAwarded = 125, conflict weight = 0.7 → Math.round(125 * 0.7) = 88
    expect(main.skillImpacts?.conflict).toBe(88)
  })

  it('emits SKILL_LEVEL_UP when mastery level increases', () => {
    // practice threshold is 300 XP in conflict skill
    // thomas-kilmann 100% score = 200 XP * 0.7 conflict = 140 skill XP per event
    // 3 events = 420 skill XP → crosses practice (300)
    for (let i = 0; i < 3; i++) {
      useGamificationStore.getState().recordEvent({ type: 'WORKSHOP_COMPLETED', contentSlug: 'thomas-kilmann', score: 100 })
    }
    const { events } = useGamificationStore.getState()
    const levelUp = events.find(e => e.type === 'SKILL_LEVEL_UP')
    expect(levelUp).toBeDefined()
    expect(levelUp?.metadata?.skill).toBe('conflict')
  })

  it('does not duplicate SKILL_LEVEL_UP for same level', () => {
    for (let i = 0; i < 6; i++) {
      useGamificationStore.getState().recordEvent({ type: 'WORKSHOP_COMPLETED', contentSlug: 'thomas-kilmann', score: 100 })
    }
    const { events } = useGamificationStore.getState()
    const levelUps = events.filter(e => e.type === 'SKILL_LEVEL_UP' && e.metadata?.skill === 'conflict' && e.metadata?.newLevel === 'practice')
    expect(levelUps).toHaveLength(1)
  })
})

describe('getTotalXp', () => {
  it('returns 0 with no events', () => {
    expect(useGamificationStore.getState().getTotalXp()).toBe(0)
  })

  it('sums all xpAwarded across all events including derived events', () => {
    useGamificationStore.getState().recordEvent({ type: 'WORKSHOP_COMPLETED', contentSlug: 'scrum-guide' })
    const total = useGamificationStore.getState().getTotalXp()
    expect(total).toBeGreaterThanOrEqual(100)
  })
})

describe('getSkillXp', () => {
  it('returns 0 for a skill with no events', () => {
    expect(useGamificationStore.getState().getSkillXp('conflict')).toBe(0)
  })

  it('returns accumulated skill XP', () => {
    useGamificationStore.getState().recordEvent({ type: 'WORKSHOP_COMPLETED', contentSlug: 'thomas-kilmann' })
    // xp = 100, conflict weight = 0.7 → 70
    expect(useGamificationStore.getState().getSkillXp('conflict')).toBe(70)
  })
})

describe('getCompletedContentSlugs', () => {
  it('returns empty array initially', () => {
    expect(useGamificationStore.getState().getCompletedContentSlugs()).toEqual([])
  })

  it('returns completed workshop slugs', () => {
    useGamificationStore.getState().recordEvent({ type: 'WORKSHOP_COMPLETED', contentSlug: 'sbi' })
    useGamificationStore.getState().recordEvent({ type: 'QUIZ_COMPLETED', contentSlug: 'exam-1' })
    const slugs = useGamificationStore.getState().getCompletedContentSlugs()
    expect(slugs).toContain('sbi')
    expect(slugs).toContain('exam-1')
  })
})

describe('saveArtifact', () => {
  it('adds artifact to artifacts array', () => {
    useGamificationStore.getState().saveArtifact({
      title: 'Test SBI',
      type: 'feedback_sbi',
      sourceContentSlug: 'sbi',
      data: { situation: 'test', behavior: 'test', impact: 'test' },
    })
    const { artifacts } = useGamificationStore.getState()
    expect(artifacts).toHaveLength(1)
    expect(artifacts[0].type).toBe('feedback_sbi')
  })

  it('records an ARTIFACT_CREATED event', () => {
    useGamificationStore.getState().saveArtifact({
      title: 'Test',
      type: 'grow_plan',
      sourceContentSlug: 'grow-model',
      data: {},
    })
    const { events } = useGamificationStore.getState()
    expect(events.some(e => e.type === 'ARTIFACT_CREATED')).toBe(true)
  })

  it('assigns a unique id to each artifact', () => {
    useGamificationStore.getState().saveArtifact({ title: 'A', type: 'feedback_sbi', sourceContentSlug: 'sbi', data: {} })
    useGamificationStore.getState().saveArtifact({ title: 'B', type: 'grow_plan', sourceContentSlug: 'grow-model', data: {} })
    const { artifacts } = useGamificationStore.getState()
    expect(artifacts[0].id).not.toBe(artifacts[1].id)
  })
})

describe('deleteArtifact', () => {
  it('removes artifact from artifacts array', () => {
    useGamificationStore.getState().saveArtifact({ title: 'Del', type: 'feedback_sbi', sourceContentSlug: 'sbi', data: {} })
    const id = useGamificationStore.getState().artifacts[0].id
    useGamificationStore.getState().deleteArtifact(id)
    expect(useGamificationStore.getState().artifacts).toHaveLength(0)
  })
})

describe('markArtifactExported', () => {
  it('sets exportedAt on the artifact', () => {
    useGamificationStore.getState().saveArtifact({ title: 'Exp', type: 'fishbone_diagram', sourceContentSlug: 'ishikawa', data: {} })
    const id = useGamificationStore.getState().artifacts[0].id
    useGamificationStore.getState().markArtifactExported(id)
    const artifact = useGamificationStore.getState().artifacts[0]
    expect(artifact.exportedAt).toBeDefined()
  })
})

describe('getPathProgress', () => {
  it('returns null for unknown path slug', () => {
    expect(useGamificationStore.getState().getPathProgress('nonexistent')).toBeNull()
  })

  it('returns correct progress after completing path steps', () => {
    useGamificationStore.getState().recordEvent({ type: 'WORKSHOP_COMPLETED', contentSlug: '5-whys' })
    useGamificationStore.getState().recordEvent({ type: 'WORKSHOP_COMPLETED', contentSlug: 'ishikawa' })
    const progress = useGamificationStore.getState().getPathProgress('resolution-de-problemes')
    expect(progress?.requiredCompleted).toBe(2)
    expect(progress?.isComplete).toBe(false)
  })
})

describe('toastQueue', () => {
  it('adds a toast when XP is awarded', () => {
    useGamificationStore.getState().recordEvent({ type: 'WORKSHOP_COMPLETED', contentSlug: 'scrum-guide' })
    const { toastQueue } = useGamificationStore.getState()
    expect(toastQueue.length).toBeGreaterThan(0)
    expect(toastQueue[0].type).toBe('xp')
  })

  it('dismissToast removes the first toast', () => {
    useGamificationStore.getState().recordEvent({ type: 'WORKSHOP_COMPLETED', contentSlug: 'scrum-guide' })
    const before = useGamificationStore.getState().toastQueue.length
    useGamificationStore.getState().dismissToast()
    const after = useGamificationStore.getState().toastQueue.length
    expect(after).toBe(before - 1)
  })
})
