import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useIsSlideActive, useNav, useSlideContext } from '@slidev/client'

let sequence = 0

/**
 * True once the slide is the one on screen — the moment a figure's pieces should
 * start arriving.
 *
 * Slides stay mounted whether or not they are being shown, so mounting is no signal
 * that anyone has seen a figure yet: an arrival keyed to it would have finished
 * playing several slides before its own.
 *
 * Printing reports every slide it renders as the one on screen, and a page is
 * captured on a timer rather than after the motion on it has run its course — so an
 * arrival left to play there is caught halfway and printed halfway. Nothing arrives
 * on a page that is being printed; it is already where it was going.
 *
 * The first click ends it. An arrival is the audience being shown the slide, and the
 * speaker asking for the next step says they are past that — a figure still holding
 * pieces back at that point is withholding them from someone who has moved on. It
 * begins again when the slide is next arrived at rather than when the clicks are
 * wound back, since going back a step is still the same visit.
 */
export function useArriving() {
  const isActive = useIsSlideActive()
  const { isPrintMode } = useNav()
  const { $clicks } = useSlideContext()
  const spoken = ref($clicks.value > 0)

  watch(isActive, active => active && (spoken.value = $clicks.value > 0))
  watch($clicks, clicks => clicks > 0 && (spoken.value = true))

  return computed(() => isActive.value && !isPrintMode.value && !spoken.value)
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
