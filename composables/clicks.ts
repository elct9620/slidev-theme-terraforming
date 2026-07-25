import { useSlideContext } from '@slidev/client'
import { onMounted, onUnmounted } from 'vue'

let sequence = 0

/**
 * States how far a component carries its slide, in absolute click numbers.
 *
 * Slidev works out how long a slide is from what registers with it — `v-click` and its
 * relatives — while reading `$clicks` in an expression registers nothing. A component
 * whose state moves with the clicks therefore has to declare its own length, or a page
 * holding nothing else clickable sits at click 0 forever with nothing to say it should
 * have advanced.
 *
 * `delta: 0` is what says the number is absolute, matching how Slidev's own `v-motion`
 * reads its `click-N` variants — so a diagram and the narration beside it count from the
 * same place. It also has to be said at all: omitting it leaves the slide's relative
 * offset NaN and takes every `v-click` on the page down with it. That is the reason this
 * lives in one place rather than in each component that needs it.
 *
 * A slide settles its length as it mounts, so the number is read once here; whatever
 * changes afterwards moves what is shown without moving the length. Returning nothing
 * declares nothing, which is how a component that was given no work to pace stays out of
 * the count.
 */
export function useDeclaredClicks(max: () => number | undefined) {
  const { $clicksContext } = useSlideContext()
  const key = `tf-clicks-${sequence++}`

  onMounted(() => {
    const last = max()
    if (last !== undefined)
      $clicksContext.register(key, { max: last, delta: 0 })
  })

  onUnmounted(() => $clicksContext.unregister(key))
}
