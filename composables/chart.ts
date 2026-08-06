import type { ComputedRef, InjectionKey } from 'vue'
import { computed, inject, onUnmounted, provide, ref, useId } from 'vue'
import { useArriving, useReveal } from './entrance'
import { useSteps } from './steps'

/**
 * Which entry the red frame sits on, from whichever side of the click system the deck
 * chose: `steps` names the row or point at each click and declares the slide's length
 * with it, while `active` takes an index from a `$clicks` expression the deck writes
 * itself. `steps` wins when both are given.
 *
 * Naming a row that is not there leaves the chart unframed rather than throwing, which is
 * the answer an out-of-range `active` already gave.
 */
export function useHighlight(
  labels: () => readonly string[],
  steps: () => readonly (string | null)[] | undefined,
  active: () => number | undefined,
) {
  const step = useSteps(steps)

  return computed(() => {
    if (!steps())
      return active() ?? -1

    const named = step.value
    return named ? labels().indexOf(named) : -1
  })
}

/**
 * How long a bar is, as a share of the track.
 *
 * `log` is for data spanning several orders of magnitude. On a linear axis the smallest
 * bars all bottom out at the same minimum width and appear to be the same size, which
 * reads as a claim the data does not make. The range is rounded out to powers of ten,
 * with one extra decade below the smallest value so that the shortest bar still has a
 * visible length, and a value under that range is clamped to nothing rather than reaching
 * back past the axis.
 */
export function barScale(values: readonly number[], options: { max?: number, log?: boolean }) {
  const ceiling = options.max ?? Math.max(...values)

  if (!options.log)
    return (value: number) => `${(value / ceiling) * 100}%`

  const floor = Math.floor(Math.log10(Math.min(...values))) - 1
  const decades = Math.ceil(Math.log10(ceiling)) - floor

  return (value: number) => `${Math.max((Math.log10(value) - floor) / decades, 0) * 100}%`
}

/**
 * Points near either end anchor by their near edge so the label stays on the chart;
 * everything in between reads better centred on its position.
 */
export function pointAnchor(x: number) {
  if (x <= 12)
    return 'tf-map-point--start'
  if (x >= 88)
    return 'tf-map-point--end'
  return ''
}

/**
 * What a chart tells the marks plotted on it.
 *
 * The marks are written as children, so the chart never holds a list of them: it holds
 * only what it decides for the whole — which one is being spoken about, how the reading
 * is paced, whether the figure is still arriving — and each mark asks about itself. A
 * mark inserted anywhere therefore renumbers nothing, the way a block on a stage does.
 */
interface Plot {
  join: (id: string, name: () => string | undefined) => number
  leave: (id: string) => void
  isCurrent: (place: number) => boolean
  isHeld: (place: number) => boolean
  arriving: ComputedRef<boolean>
}

const PlotKey: InjectionKey<Plot> = Symbol('tf-plot')

/**
 * The chart's side: it keeps who joined so that it can turn a name into a place, count
 * the marks for a paced reading, and say which of them the frame is on.
 *
 * `steps` names the mark at each click and declares the slide's length with it, while
 * `active` takes an index from a `$clicks` expression the deck writes itself — the same
 * two sides of the click system every other figure offers. Naming a mark that is not
 * there leaves the chart unframed rather than throwing.
 */
export function providePlot(
  steps: () => readonly (string | null)[] | undefined,
  active: () => number | undefined,
  reveal: () => boolean | undefined,
) {
  const members = ref<{ id: string, name: () => string | undefined }[]>([])
  const total = computed(() => members.value.length)

  const step = useSteps(steps)
  const arriving = useArriving()
  const held = useReveal(() => total.value, reveal)

  const current = computed(() => {
    if (!steps())
      return active() ?? -1

    const named = step.value
    return named ? members.value.findIndex(mark => mark.name() === named) : -1
  })

  provide(PlotKey, {
    join(id, name) {
      const joined = members.value.findIndex(mark => mark.id === id)
      if (joined !== -1)
        return joined

      members.value.push({ id, name })
      return members.value.length - 1
    },
    leave(id) {
      const joined = members.value.findIndex(mark => mark.id === id)
      if (joined !== -1)
        members.value.splice(joined, 1)
    },
    isCurrent: place => current.value === place,
    isHeld: place => held(place),
    arriving: computed(() => !reveal() && arriving.value),
  })

  return total
}

/**
 * A mark's side: where it sits in the reading order, and what the chart currently says
 * about it. A mark written outside any chart simply sits still and is never framed.
 */
export function usePlot(name: () => string | undefined) {
  const plot = inject(PlotKey, null)
  const id = useId()!
  const place = plot?.join(id, name) ?? 0

  onUnmounted(() => plot?.leave(id))

  return {
    place,
    isCurrent: computed(() => plot?.isCurrent(place) ?? false),
    isHeld: computed(() => plot?.isHeld(place) ?? false),
    arriving: computed(() => plot?.arriving.value ?? false),
  }
}
