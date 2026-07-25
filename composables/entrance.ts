import { onMounted, onUnmounted } from 'vue'
import { useIsSlideActive, useSlideContext } from '@slidev/client'

let sequence = 0

/**
 * True once the slide is the one on screen — the moment a figure's pieces should
 * start arriving.
 *
 * Slides stay mounted whether or not they are being shown, so mounting is no signal
 * that anyone has seen a figure yet: an arrival keyed to it would have finished
 * playing several slides before its own.
 */
export function useArriving() {
  return useIsSlideActive()
}

/**
 * Hands the pacing of a figure to the speaker: one piece per click.
 *
 * The pieces are addressed by absolute click number, the same way `steps` addresses
 * its entries, so a chart that reveals its rows and then walks a frame across them
 * counts in one scheme rather than two.
 *
 * This is for a component that owns its pieces, where a deck has no element of its
 * own to put `v-click` on. Where the deck writes the pieces, it paces them itself.
 */
export function useReveal(count: () => number, enabled: () => boolean | undefined) {
  const { $clicks, $clicksContext } = useSlideContext()
  const key = `tf-reveal-${sequence++}`

  onMounted(() => {
    const pieces = count()
    if (enabled() && pieces)
      $clicksContext.register(key, { max: pieces, delta: 0 })
  })

  onUnmounted(() => $clicksContext.unregister(key))

  // Printing needs no exception here: Slidev winds the clicks past the end of a slide
  // when it renders one, so every piece reads as already called for.
  return (place: number) => !!enabled() && $clicks.value <= place
}
