/**
 * What gets watched, and what a reading does once it is taken again.
 *
 * happy-dom lays nothing out and its ResizeObserver has nothing to report, so both are
 * stated here instead: the sizes are defined on the elements, and the observer is a
 * stand-in whose callback a test can fire. That is enough for the two questions that
 * matter — whether the right things are being watched, and whether a second reading
 * reaches the element.
 */
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import Block from '../components/Block.vue'
import Focus from '../components/Focus.vue'
import Stage from '../components/Stage.vue'
import { resetSlide } from './support/slide'

vi.mock('@slidev/client', () => import('./support/slidev-client'))

class StandInObserver {
  static made: StandInObserver[] = []

  watching: Element[] = []
  disconnected = false

  constructor(private callback: () => void) {
    StandInObserver.made.push(this)
  }

  observe(el: Element) {
    this.watching.push(el)
  }

  unobserve() {}

  disconnect() {
    this.disconnected = true
  }

  report() {
    this.callback()
  }
}

/** The observer that ended up watching this element. */
function watcherOf(el: Element) {
  return StandInObserver.made.find(observer => observer.watching.includes(el))
}

function sized(el: Element, sizes: Record<string, number>) {
  for (const [name, value] of Object.entries(sizes))
    Object.defineProperty(el, name, { value, configurable: true })
}

beforeEach(() => {
  resetSlide()
  StandInObserver.made = []
  vi.stubGlobal('ResizeObserver', StandInObserver)
})

afterEach(() => vi.unstubAllGlobals())

describe('a focus', () => {
  function framing() {
    const stage = mount(Stage, {
      slots: { default: () => [h(Block, { name: 'proxy' }, () => 'Proxy'), h(Focus, { of: 'proxy' })] },
    })

    return {
      stage,
      piece: stage.find('[data-tf-name="proxy"]').element,
      frame: () => stage.find('.tf-focus').attributes('style') ?? '',
    }
  }

  it('watches the piece it frames, not only the stage it sits on', () => {
    const { piece } = framing()

    expect(watcherOf(piece)).toBeDefined()
  })

  it('takes the piece\'s new size even when the stage never changed size', async () => {
    const { stage, piece, frame } = framing()

    sized(piece, { offsetWidth: 270, offsetHeight: 162 })
    watcherOf(piece)!.report()
    await stage.vm.$nextTick()

    expect(frame()).toContain('width: 270px')
    expect(frame()).toContain('height: 162px')
  })

  it('lets go of what it was watching when the slide it is on is torn down', () => {
    const { stage, piece } = framing()
    const observer = watcherOf(piece)!

    stage.unmount()

    expect(observer.disconnected).toBe(true)
  })
})

describe('a stage told to fit', () => {
  function fitting(fit: boolean) {
    const stage = mount(Stage, {
      props: { fit },
      slots: { default: () => h(Block, null, () => 'wide') },
    })
    const frame = stage.element
    const row = stage.find('.tf-stage').element

    // A row half again as wide as the space it has to sit in.
    sized(frame, { clientWidth: 1000 })
    sized(row, { offsetWidth: 2000 })

    return { stage, row, scale: () => stage.find('.tf-stage').attributes('style') ?? '' }
  }

  it('scales the row down to what it has room for', async () => {
    const { stage, row, scale } = fitting(true)

    watcherOf(row)!.report()
    await stage.vm.$nextTick()

    expect(scale()).toContain('scale(0.5)')
  })

  it('leaves a row that is told nothing at the size the design file gave it', async () => {
    const { stage, row, scale } = fitting(false)

    watcherOf(row)!.report()
    await stage.vm.$nextTick()

    expect(scale()).not.toContain('scale')
  })

  // Being told to fit is not a measurement that is taken once: a stage that starts
  // fitting has to be followed from then on, which it cannot be if nothing was ever
  // watching it.
  it('follows a stage told to fit after it was mounted', async () => {
    const { stage, row, scale } = fitting(false)

    await stage.setProps({ fit: true })
    expect(scale()).toContain('scale(0.5)')

    sized(row, { offsetWidth: 4000 })
    watcherOf(row)!.report()
    await stage.vm.$nextTick()

    expect(scale()).toContain('scale(0.25)')
  })
})
