import { onBeforeUnmount, onMounted } from 'vue'

/**
 * Takes a measurement, and takes it again whenever what was measured could have moved.
 *
 * Three things call for a second reading. Something the measurement depends on changes
 * size, which is what the observer is for. The display face finishes loading, since a
 * label only settles at its real width then. And the component itself decides the answer
 * is stale — a frame told to point at a different piece, a stage told to start fitting —
 * which is what `remeasure` is for.
 *
 * `targets` says what to watch, and is asked again on every reading, so a set that changes
 * as the slide does keeps up. Whatever it names is handed to the measurement as well —
 * what is watched and what is measured are one answer, not two that can disagree.
 * Anything already watched is left alone: observing an element a second time would report
 * it again and call this straight back.
 *
 * Watching what is measured rather than only the container it sits in is the point. A
 * container whose own size never changed is never reported, and no later resize can rescue
 * a reading taken before its contents settled.
 */
export function useMeasured(
  targets: () => Iterable<HTMLElement | null | undefined>,
  measure: (watching: HTMLElement[]) => void,
) {
  const watched = new Set<HTMLElement>()
  let observer: ResizeObserver | undefined

  function remeasure() {
    const watching: HTMLElement[] = []

    for (const target of targets()) {
      if (!target)
        continue

      watching.push(target)

      if (!watched.has(target)) {
        watched.add(target)
        observer?.observe(target)
      }
    }

    measure(watching)
  }

  onMounted(() => {
    observer = new ResizeObserver(remeasure)
    remeasure()
    document.fonts?.ready.then(remeasure)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    watched.clear()
  })

  return remeasure
}
