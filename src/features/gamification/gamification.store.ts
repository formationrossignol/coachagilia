// src/features/gamification/gamification.store.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  GamificationEvent, GamificationToastPayload, Artifact,
  SkillArea, MasteryLevel, PathProgress, WeeklyChallenge, RecordEventInput,
} from './types'
import { XP_RULES, XP_BONUSES } from './rules'
import { computeSkillImpacts, computeSkillXp, getMasteryLevel } from './mastery'
import { BADGES, checkBadgeCriteria } from './badges'
import { LEARNING_PATHS, computePathProgress } from './paths'
import { getActiveChallenge as getActiveChallengeData, isChallengeCompletedBy } from './challenges'

interface GamificationState {
  events: GamificationEvent[]
  artifacts: Artifact[]
  toastQueue: GamificationToastPayload[]
}

interface GamificationActions {
  recordEvent(input: RecordEventInput): void
  saveArtifact(input: Omit<Artifact, 'id' | 'createdAt' | 'updatedAt'>): void
  deleteArtifact(id: string): void
  markArtifactExported(id: string): void
  dismissToast(): void

  getTotalXp(): number
  getSkillXp(skill: SkillArea): number
  getMasteryLevelForSkill(skill: SkillArea): MasteryLevel
  getAllSkillXp(): Partial<Record<SkillArea, number>>
  getUnlockedBadgeIds(): string[]
  getPathProgress(slug: string): PathProgress | null
  getCompletedContentSlugs(): string[]
  getActiveChallenge(): WeeklyChallenge | null
  isChallengeCompleted(id: string): boolean
}

type GamificationStore = GamificationState & GamificationActions

const _store = create<GamificationStore>()(
  persist(
    (set, get) => ({
      events: [],
      artifacts: [],
      toastQueue: [],

      recordEvent(input: RecordEventInput) {
        const state = get()
        const baseXp = XP_RULES[input.type] ?? 0

        let bonusXp = 0
        if (input.score !== undefined) {
          if (input.score === 100) bonusXp += XP_BONUSES.PERFECT_SCORE
          else if (input.score >= 90) bonusXp += XP_BONUSES.HIGH_SCORE_90
          else if (input.score >= 80) bonusXp += XP_BONUSES.HIGH_SCORE_80
        }
        if (input.type === 'ARTIFACT_CREATED' && state.artifacts.length === 1) {
          bonusXp += XP_BONUSES.FIRST_ARTIFACT
        }

        const xpAwarded = baseXp + bonusXp
        const skillImpacts = input.contentSlug ? computeSkillImpacts(input.contentSlug, xpAwarded) : undefined

        const event: GamificationEvent = {
          id: crypto.randomUUID(),
          type: input.type,
          contentSlug: input.contentSlug,
          contentType: input.contentType,
          xpAwarded,
          skillImpacts: skillImpacts && Object.keys(skillImpacts).length > 0 ? skillImpacts : undefined,
          score: input.score,
          metadata: input.metadata,
          createdAt: new Date().toISOString(),
        }

        const toastQueue = [...state.toastQueue]
        if (xpAwarded > 0) {
          toastQueue.push({ type: 'xp', message: `+${xpAwarded} XP`, xp: xpAwarded })
        }

        const newEvents = [...state.events, event]
        const derivedEvents: GamificationEvent[] = []

        // mastery level-ups
        const oldSkillXp = computeSkillXp(state.events)
        const newSkillXp = computeSkillXp(newEvents)
        for (const [skill, newXp] of Object.entries(newSkillXp) as [SkillArea, number][]) {
          const oldXp = oldSkillXp[skill] ?? 0
          if (getMasteryLevel(oldXp) !== getMasteryLevel(newXp)) {
            const newLevel = getMasteryLevel(newXp)
            derivedEvents.push({
              id: crypto.randomUUID(),
              type: 'SKILL_LEVEL_UP',
              xpAwarded: XP_RULES.SKILL_LEVEL_UP,
              metadata: { skill, newLevel },
              createdAt: new Date().toISOString(),
            })
            toastQueue.push({ type: 'level_up', message: `Niveau atteint : ${newLevel}`, detail: skill })
          }
        }

        // badge unlocks
        const alreadyUnlockedIds = new Set(
          state.events
            .filter(e => e.type === 'BADGE_UNLOCKED')
            .map(e => e.metadata?.badgeId as string)
        )
        const allEventsForBadge = [...newEvents, ...derivedEvents]
        for (const badge of BADGES) {
          if (alreadyUnlockedIds.has(badge.id)) continue
          if (checkBadgeCriteria(badge, allEventsForBadge, state.artifacts)) {
            derivedEvents.push({
              id: crypto.randomUUID(),
              type: 'BADGE_UNLOCKED',
              xpAwarded: XP_RULES.BADGE_UNLOCKED,
              metadata: { badgeId: badge.id },
              createdAt: new Date().toISOString(),
            })
            toastQueue.push({ type: 'badge', message: `Badge débloqué : ${badge.name}`, detail: badge.description })
          }
        }

        // challenge completion
        const activeChallenge = getActiveChallengeData()
        const allEvents = [...newEvents, ...derivedEvents]
        const alreadyChallengeCompleted = state.events.some(
          e => e.type === 'CHALLENGE_COMPLETED' && e.metadata?.challengeId === activeChallenge.id
        )
        if (!alreadyChallengeCompleted && isChallengeCompletedBy(activeChallenge, allEvents, state.artifacts)) {
          derivedEvents.push({
            id: crypto.randomUUID(),
            type: 'CHALLENGE_COMPLETED',
            xpAwarded: activeChallenge.xpReward,
            metadata: { challengeId: activeChallenge.id },
            createdAt: new Date().toISOString(),
          })
          toastQueue.push({ type: 'challenge_complete', message: `Défi complété : ${activeChallenge.title}`, xp: activeChallenge.xpReward })
        }

        // path completion
        const finalEvents = [...newEvents, ...derivedEvents]
        const completedSlugs = finalEvents
          .filter(e => e.type === 'WORKSHOP_COMPLETED' || e.type === 'QUIZ_COMPLETED')
          .map(e => e.contentSlug)
          .filter((s): s is string => Boolean(s))
        for (const path of LEARNING_PATHS) {
          const already = state.events.some(e => e.type === 'PATH_COMPLETED' && e.metadata?.pathSlug === path.slug)
          if (already) continue
          if (computePathProgress(path, completedSlugs).isComplete) {
            derivedEvents.push({
              id: crypto.randomUUID(),
              type: 'PATH_COMPLETED',
              xpAwarded: XP_RULES.PATH_COMPLETED,
              metadata: { pathSlug: path.slug },
              createdAt: new Date().toISOString(),
            })
            toastQueue.push({ type: 'path_complete', message: `Parcours terminé : ${path.title}`, xp: XP_RULES.PATH_COMPLETED })
          }
        }

        set({ events: [...newEvents, ...derivedEvents], toastQueue })
      },

      saveArtifact(input) {
        const artifact: Artifact = {
          ...input,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set(state => ({ artifacts: [...state.artifacts, artifact] }))
        get().recordEvent({
          type: 'ARTIFACT_CREATED',
          contentSlug: input.sourceContentSlug,
          metadata: { artifactId: artifact.id },
        })
      },

      deleteArtifact(id: string) {
        set(state => ({ artifacts: state.artifacts.filter(a => a.id !== id) }))
      },

      markArtifactExported(id: string) {
        const now = new Date().toISOString()
        set(state => ({
          artifacts: state.artifacts.map(a => a.id === id ? { ...a, exportedAt: now } : a),
        }))
        get().recordEvent({ type: 'ARTIFACT_EXPORTED' })
      },

      dismissToast() {
        set(state => ({ toastQueue: state.toastQueue.slice(1) }))
      },

      getTotalXp() {
        return get().events.reduce((sum, e) => sum + e.xpAwarded, 0)
      },

      getSkillXp(skill: SkillArea) {
        return computeSkillXp(get().events)[skill] ?? 0
      },

      getMasteryLevelForSkill(skill: SkillArea) {
        return getMasteryLevel(get().getSkillXp(skill))
      },

      getAllSkillXp() {
        return computeSkillXp(get().events)
      },

      getUnlockedBadgeIds() {
        return get().events
          .filter(e => e.type === 'BADGE_UNLOCKED')
          .map(e => e.metadata?.badgeId as string)
          .filter(Boolean)
      },

      getPathProgress(slug: string) {
        const path = LEARNING_PATHS.find(p => p.slug === slug)
        if (!path) return null
        return computePathProgress(path, get().getCompletedContentSlugs())
      },

      getCompletedContentSlugs() {
        return get().events
          .filter(e => e.type === 'WORKSHOP_COMPLETED' || e.type === 'QUIZ_COMPLETED')
          .map(e => e.contentSlug)
          .filter((s): s is string => Boolean(s))
      },

      getActiveChallenge() {
        return getActiveChallengeData()
      },

      isChallengeCompleted(id: string) {
        return get().events.some(
          e => e.type === 'CHALLENGE_COMPLETED' && e.metadata?.challengeId === id
        )
      },
    }),
    {
      name: 'scrum-master-gamification',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// Capture the initial actions once, so that setState(..., true) in tests can be recovered from.
// When Zustand's setState is called with replace=true and only data fields, it strips the action
// functions from state. We patch setState to always merge the stable action references back in.
const _initialActions: GamificationActions = (() => {
  const s = _store.getState()
  return {
    recordEvent: s.recordEvent.bind(s),
    saveArtifact: s.saveArtifact.bind(s),
    deleteArtifact: s.deleteArtifact.bind(s),
    markArtifactExported: s.markArtifactExported.bind(s),
    dismissToast: s.dismissToast.bind(s),
    getTotalXp: s.getTotalXp.bind(s),
    getSkillXp: s.getSkillXp.bind(s),
    getMasteryLevelForSkill: s.getMasteryLevelForSkill.bind(s),
    getAllSkillXp: s.getAllSkillXp.bind(s),
    getUnlockedBadgeIds: s.getUnlockedBadgeIds.bind(s),
    getPathProgress: s.getPathProgress.bind(s),
    getCompletedContentSlugs: s.getCompletedContentSlugs.bind(s),
    getActiveChallenge: s.getActiveChallenge.bind(s),
    isChallengeCompleted: s.isChallengeCompleted.bind(s),
  }
})()

const _originalSetState = _store.setState.bind(_store)

// Wrap setState: when replace=true and incoming state lacks action functions, re-inject them.
// This makes `useGamificationStore.setState({ events: [], artifacts: [], toastQueue: [] }, true)`
// safe to call in beforeEach without losing action functions.
;(_store as typeof _store & { setState: typeof _store.setState }).setState = (
  partial: Parameters<typeof _store.setState>[0],
  replace?: Parameters<typeof _store.setState>[1],
) => {
  if (replace) {
    const incoming = typeof partial === 'function' ? partial(_store.getState()) : partial
    // Merge incoming data with stable action references
    _originalSetState({ ..._initialActions, ...incoming } as GamificationStore, true)
  } else {
    _originalSetState(partial as Parameters<typeof _store.setState>[0])
  }
}

export const useGamificationStore = _store
