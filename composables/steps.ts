import { computed, onMounted, onUnmounted } from 'vue'
import { useSlideContext } from '@slidev/client'

let sequence = 0

/**
 * States what a component shows at each click, and reports the entry the current
 * click has reached.
 *
 * Slidev works out how long a slide is from what registers with it — `v-click` and
 * its relatives — while reading `$clicks` in an expression registers nothing. A
 * component whose state moves with the clicks therefore has to declare its own
 * length, or a page holding nothing else clickable sits at click 0 forever with
 * nothing to say it should have advanced. Declaring it here rather than in the
 * slide's frontmatter keeps the number of steps and the steps themselves in one
 * place, so neither can drift from the other.
 *
 * Entries are addressed by absolute click number, matching how Slidev's own
 * `v-motion` reads its `click-N` variants, so a diagram and the narration beside it
 * count from the same place. That is what `delta: 0` says; it also has to be said,
 * because omitting it leaves the slide's relative offset NaN and takes every
 * `v-click` on the page down with it.
 *
 * The last entry stays in effect once the clicks run out, so a diagram holds the
 * state it ended on rather than springing back to its first.
 */
export function useSteps<T>(steps: () => readonly T[] | undefined) {
  const { $clicks, $clicksContext } = useSlideContext()
  const key = `tf-steps-${sequence++}`

  // A slide settles its length as it mounts, so the count is read once here and an
  // array that changes afterwards moves what is shown without moving the length.
  onMounted(() => {
    const length = steps()?.length
    if (length)
      $clicksContext.register(key, { max: length - 1, delta: 0 })
  })

  onUnmounted(() => $clicksContext.unregister(key))

  return computed(() => {
    const entries = steps()
    if (!entries?.length)
      return undefined
    return entries[Math.min(Math.max($clicks.value, 0), entries.length - 1)]
  })
}
