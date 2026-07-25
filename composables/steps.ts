import { useSlideContext } from '@slidev/client'
import { computed } from 'vue'
import { useDeclaredClicks } from './clicks'

/**
 * States what a component shows at each click, and reports the entry the current click
 * has reached.
 *
 * The entries are addressed by absolute click number and their count is what the slide
 * takes its length from — see `useDeclaredClicks`. Declaring it from the steps rather
 * than in the slide's frontmatter keeps the number of steps and the steps themselves in
 * one place, so neither can drift from the other.
 *
 * The last entry stays in effect once the clicks run out, so a diagram holds the state it
 * ended on rather than springing back to its first.
 */
export function useSteps<T>(steps: () => readonly T[] | undefined) {
  const { $clicks } = useSlideContext()

  // One click fewer than there are entries: the first is what the slide opens on.
  useDeclaredClicks(() => {
    const length = steps()?.length
    return length ? length - 1 : undefined
  })

  return computed(() => {
    const entries = steps()
    if (!entries?.length)
      return undefined
    return entries[Math.min(Math.max($clicks.value, 0), entries.length - 1)]
  })
}
