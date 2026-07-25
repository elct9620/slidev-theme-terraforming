import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useSteps } from '../composables/steps'
import { withSetup } from './support/composable'
import { clicks, declaredLengths, resetSlide } from './support/slide'

vi.mock('@slidev/client', () => import('./support/slidev-client'))

beforeEach(resetSlide)

describe('useSteps', () => {
  it('declares a length one short of its entries, so the last one has a click to sit on', () => {
    withSetup(() => useSteps(() => ['a', 'b', 'c']))

    expect(declaredLengths()).toEqual([{ max: 2, delta: 0 }])
  })

  it('declares its entries as absolute click numbers', () => {
    withSetup(() => useSteps(() => ['a', 'b']))

    // A relative delta would leave the slide's own offset NaN and take every v-click
    // on the page down with it, so this is the one field that cannot be omitted.
    expect(declaredLengths()[0]?.delta).toBe(0)
  })

  it('declares nothing when a component was given no steps to walk through', () => {
    withSetup(() => useSteps(() => undefined))
    withSetup(() => useSteps(() => []))

    expect(declaredLengths()).toEqual([])
  })

  it('reports the entry the current click has reached', () => {
    const { result: step } = withSetup(() => useSteps(() => ['a', 'b', 'c']))

    expect(step.value).toBe('a')

    clicks.value = 1

    expect(step.value).toBe('b')
  })

  it('holds the entry it ended on once the clicks run out', () => {
    const { result: step } = withSetup(() => useSteps(() => ['a', 'b']))

    clicks.value = 7

    expect(step.value).toBe('b')
  })

  it('reads a click before the slide as the first entry', () => {
    const { result: step } = withSetup(() => useSteps(() => ['a', 'b']))

    clicks.value = -1

    expect(step.value).toBe('a')
  })

  it('reports nothing when there is nothing to walk through', () => {
    const { result: step } = withSetup(() => useSteps(() => []))

    expect(step.value).toBeUndefined()
  })

  it('settles its length as it mounts, so a later entry moves what is shown but not how long the slide is', () => {
    const entries = ref(['a', 'b'])
    const { result: step } = withSetup(() => useSteps(() => entries.value))

    entries.value = ['a', 'b', 'c', 'd']
    clicks.value = 3

    expect(declaredLengths()).toEqual([{ max: 1, delta: 0 }])
    expect(step.value).toBe('d')
  })

  it('takes its declaration back when the component goes away', () => {
    const { wrapper } = withSetup(() => useSteps(() => ['a', 'b']))

    wrapper.unmount()

    expect(declaredLengths()).toEqual([])
  })
})
