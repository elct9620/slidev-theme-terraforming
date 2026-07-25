import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { useArriving, useReveal } from '../composables/entrance'
import { withSetup } from './support/composable'
import { clicks, declaredLengths, isActive, isPrintMode, resetSlide } from './support/slide'

vi.mock('@slidev/client', () => import('./support/slidev-client'))

beforeEach(resetSlide)

describe('useArriving', () => {
  it('has a figure arriving once the slide is the one on screen', () => {
    const { result: arriving } = withSetup(useArriving)

    expect(arriving.value).toBe(true)
  })

  it('holds a figure back on a slide nobody has been shown', async () => {
    isActive.value = false

    const { result: arriving } = withSetup(useArriving)
    await nextTick()

    expect(arriving.value).toBe(false)
  })

  it('never arrives on a page being printed, which is captured on a timer', () => {
    isPrintMode.value = true

    const { result: arriving } = withSetup(useArriving)

    expect(arriving.value).toBe(false)
  })

  it('is already over on a slide entered past its first click', () => {
    clicks.value = 2

    const { result: arriving } = withSetup(useArriving)

    expect(arriving.value).toBe(false)
  })

  it('ends at the first click, since the speaker asking for a step has moved on', async () => {
    const { result: arriving } = withSetup(useArriving)

    clicks.value = 1
    await nextTick()

    expect(arriving.value).toBe(false)
  })

  it('stays over when the clicks are wound back, because that is still the same visit', async () => {
    const { result: arriving } = withSetup(useArriving)

    clicks.value = 1
    await nextTick()
    clicks.value = 0
    await nextTick()

    expect(arriving.value).toBe(false)
  })

  it('begins again when the slide is next arrived at', async () => {
    const { result: arriving } = withSetup(useArriving)

    clicks.value = 1
    await nextTick()
    isActive.value = false
    await nextTick()
    clicks.value = 0
    isActive.value = true
    await nextTick()

    expect(arriving.value).toBe(true)
  })
})

describe('useReveal', () => {
  it('declares one click per piece, so the speaker calls each one in', () => {
    withSetup(() => useReveal(() => 3, () => true))

    expect(declaredLengths()).toEqual([{ max: 3, delta: 0 }])
  })

  it('declares nothing when the deck never asked for the pacing', () => {
    withSetup(() => useReveal(() => 3, () => undefined))

    expect(declaredLengths()).toEqual([])
  })

  it('declares nothing when there are no pieces to call in', () => {
    withSetup(() => useReveal(() => 0, () => true))

    expect(declaredLengths()).toEqual([])
  })

  it('holds a piece until the click that calls it in', () => {
    const { result: held } = withSetup(() => useReveal(() => 2, () => true))

    expect(held(0)).toBe(true)
    expect(held(1)).toBe(true)

    clicks.value = 1

    expect(held(0)).toBe(false)
    expect(held(1)).toBe(true)

    clicks.value = 2

    expect(held(1)).toBe(false)
  })

  it('reads every piece as called for once the clicks run past the end, which is what printing does', () => {
    const { result: held } = withSetup(() => useReveal(() => 2, () => true))

    clicks.value = 3

    expect(held(0)).toBe(false)
    expect(held(1)).toBe(false)
  })

  it('holds nothing back when the deck paces the figure itself', () => {
    const { result: held } = withSetup(() => useReveal(() => 2, () => false))

    expect(held(0)).toBe(false)
  })

  it('takes its declaration back when the figure goes away', () => {
    const { wrapper } = withSetup(() => useReveal(() => 2, () => true))

    wrapper.unmount()

    expect(declaredLengths()).toEqual([])
  })
})
