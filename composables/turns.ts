import type { InjectionKey } from 'vue'
import { useSlideContext } from '@slidev/client'
import { computed, inject, onUnmounted, provide, ref, useId } from 'vue'
import { useDeclaredClicks } from './clicks'

/**
 * Several children that occupy one place and take it in turn, a click apart — the roles
 * an introduction states, the lines a caption speaks.
 *
 * They are written as siblings rather than handed over as a list, because what they hold
 * is what the audience reads, and reading order is the order they are written in. Each
 * takes its turn from where it sits, so inserting one renumbers nothing.
 *
 * All of them stay on the page throughout. The one leaving has to be there to fade out,
 * and laying them out at once is what fixes the size of the place they share: a place
 * that resized as its occupant changed would move whatever sits beside it.
 *
 * The last turn holds once the clicks run out, the way `useSteps` does, so a page ends on
 * what it ended on rather than springing back to its first.
 *
 * Turns are counted per kind, so each thing a deck can change carries its own sequence.
 * An introduction whose role changes on the first click and whose portrait changes on the
 * second is two sequences, not one interleaved: no kind can be added to a component
 * without the ones already there continuing to mean what they meant.
 */

type Turns = Record<string, string[]>

const TurnsKey: InjectionKey<{
  take: (kind: string, id: string) => number
  release: (kind: string, id: string) => void
  taken: (kind: string) => number
}> = Symbol('tf-turns')

/**
 * Holds the sequences for whatever a deck writes inside, and declares the clicks they
 * come to.
 *
 * Membership is kept rather than counted, so a child that unmounts gives its turn back
 * instead of leaving its sequence permanently one longer.
 *
 * The length is read as the parent mounts, which is after every child has taken a turn.
 * It is the longest sequence rather than the sum: kinds run alongside each other, so an
 * introduction that changes both its role and its portrait is as long as whichever of
 * them changes more often.
 */
export function provideTurns() {
  const turns = ref<Turns>({})

  const members = (kind: string) => (turns.value[kind] ??= [])

  provide(TurnsKey, {
    take(kind, id) {
      const sequence = members(kind)
      const taken = sequence.indexOf(id)
      if (taken !== -1)
        return taken

      sequence.push(id)
      return sequence.length - 1
    },
    release(kind, id) {
      const sequence = members(kind)
      const taken = sequence.indexOf(id)
      if (taken !== -1)
        sequence.splice(taken, 1)
    },
    taken: kind => turns.value[kind]?.length ?? 0,
  })

  const longest = computed(() => Math.max(0, ...Object.values(turns.value).map(kind => kind.length)))

  useDeclaredClicks(() => (longest.value > 1 ? longest.value - 1 : undefined))

  return longest
}

/**
 * Where this child sits among the siblings of its own kind, and whether it is the one
 * being read.
 *
 * A child written outside any group has no turn to take and is always the one being read,
 * which is what a lone role or a caption of one line is.
 */
export function useTurn(kind: string) {
  const turns = inject(TurnsKey, null)
  const id = useId()!
  const place = turns?.take(kind, id)
  const { $clicks } = useSlideContext()

  onUnmounted(() => turns?.release(kind, id))

  return {
    place,
    isCurrent: computed(() => {
      if (!turns || place === undefined)
        return true

      const last = turns.taken(kind) - 1
      return Math.min(Math.max($clicks.value, 0), last) === place
    }),
  }
}
