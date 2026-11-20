jest.mock('@/lib/prisma', () => ({ prisma: {} }))

import { lockedModuleIds } from './week-locks'

const weeks = [
  { id: 'w1', quizIds: ['q1'] },
  { id: 'w2', quizIds: ['q2'] },
  { id: 'w3', quizIds: [] },
  { id: 'w4', quizIds: ['q4'] },
]

describe('lockedModuleIds', () => {
  it('locks everything after week 1 until its quiz is passed', () => {
    expect(lockedModuleIds(weeks, new Set())).toEqual(['w2', 'w3', 'w4'])
  })

  it('unlocks the next week when the previous quiz is passed', () => {
    expect(lockedModuleIds(weeks, new Set(['q1']))).toEqual(['w3', 'w4'])
  })

  it('lets a week without a quiz pass straight through', () => {
    expect(lockedModuleIds(weeks, new Set(['q1', 'q2']))).toEqual([])
  })

  it('locks nothing when every quiz is passed', () => {
    expect(lockedModuleIds(weeks, new Set(['q1', 'q2', 'q4']))).toEqual([])
  })

  it('keeps later weeks locked if an earlier quiz is still outstanding', () => {
    expect(lockedModuleIds(weeks, new Set(['q2', 'q4']))).toEqual(['w2', 'w3', 'w4'])
  })
})
