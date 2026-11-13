/**
 * Which lesson "Resume" should open, given lessons in course order:
 * - the lesson the learner last had open, if they haven't completed it yet;
 * - otherwise the next unfinished lesson after it (wrapping to any earlier unfinished one);
 * - otherwise (nothing opened yet) the first unfinished lesson;
 * - when everything is complete, the last lesson they had open (or the first lesson).
 */
export function resumeLessonId(
  orderedLessonIds: string[],
  completed: ReadonlySet<string>,
  lastLessonId?: string | null,
): string | undefined {
  if (orderedLessonIds.length === 0) return undefined
  const lastIndex = lastLessonId ? orderedLessonIds.indexOf(lastLessonId) : -1

  if (lastIndex >= 0) {
    if (!completed.has(orderedLessonIds[lastIndex])) return orderedLessonIds[lastIndex]
    const after = orderedLessonIds.slice(lastIndex + 1).find((id) => !completed.has(id))
    const before = orderedLessonIds.slice(0, lastIndex).find((id) => !completed.has(id))
    return after ?? before ?? orderedLessonIds[lastIndex]
  }

  return orderedLessonIds.find((id) => !completed.has(id)) ?? orderedLessonIds[0]
}
