import { computed } from 'vue'
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
