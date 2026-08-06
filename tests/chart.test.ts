import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Bars from '../components/Bars.vue'
import Map2D from '../components/Map2D.vue'
import Point from '../components/Point.vue'
import { barScale, pointAnchor, useHighlight } from '../composables/chart'
import { withSetup } from './support/composable'
import { clicks, declaredLengths, resetSlide } from './support/slide'

vi.mock('@slidev/client', () => import('./support/slidev-client'))

beforeEach(resetSlide)

describe('barScale', () => {
  it('measures a bar against the longest of them', () => {
    const width = barScale([220, 12], {})

    expect(width(220)).toBe('100%')
    expect(width(110)).toBe('50%')
  })

  it('measures against a ceiling the deck states, so two charts can be compared', () => {
    const width = barScale([220, 12], { max: 440 })

    expect(width(220)).toBe('50%')
  })

  it('spreads a log axis over whole decades, one below the smallest value', () => {
    // 12 to 220 rounds out to 1 … 1000: three decades, and 12 sits a shade over one of
    // them from the bottom.
    const width = barScale([12, 220], { log: true })

    expect(width(1)).toBe('0%')
    expect(width(1000)).toBe('100%')
    expect(width(10)).toBe(`${(1 / 3) * 100}%`)
  })

  it('clamps a value below the log range rather than reaching back past the axis', () => {
    const width = barScale([12, 220], { log: true })

    expect(width(0.1)).toBe('0%')
  })
})

describe('pointAnchor', () => {
  it('anchors a point near either end by its near edge, keeping the label on the chart', () => {
    expect(pointAnchor(0)).toBe('tf-map-point--start')
    expect(pointAnchor(12)).toBe('tf-map-point--start')
    expect(pointAnchor(88)).toBe('tf-map-point--end')
    expect(pointAnchor(100)).toBe('tf-map-point--end')
  })

  it('centres everything in between on its position', () => {
    expect(pointAnchor(13)).toBe('')
    expect(pointAnchor(50)).toBe('')
    expect(pointAnchor(87)).toBe('')
  })
})

describe('useHighlight', () => {
  const rows = () => ['Container', 'WebAssembly']

  it('frames the row a step names, and declares the walk as the slide\'s length', () => {
    const { result: current } = withSetup(() =>
      useHighlight(rows, () => [null, 'WebAssembly'], () => undefined))

    expect(current.value).toBe(-1)
    expect(declaredLengths()).toEqual([{ max: 1, delta: 0 }])

    clicks.value = 1

    expect(current.value).toBe(1)
  })

  it('leaves the chart unframed when a step names a row that is not there', () => {
    const { result: current } = withSetup(() =>
      useHighlight(rows, () => ['Sandbox'], () => undefined))

    expect(current.value).toBe(-1)
  })

  it('takes an index from a deck driving the chart itself, declaring nothing', () => {
    const { result: current } = withSetup(() =>
      useHighlight(rows, () => undefined, () => 1))

    expect(current.value).toBe(1)
    expect(declaredLengths()).toEqual([])
  })

  it('frames nothing when a deck driving the chart itself says so', () => {
    const { result: current } = withSetup(() =>
      useHighlight(rows, () => undefined, () => undefined))

    expect(current.value).toBe(-1)
  })

  it('lets steps win when a chart was given both', () => {
    const { result: current } = withSetup(() =>
      useHighlight(rows, () => ['Container'], () => 1))

    expect(current.value).toBe(0)
  })
})

describe('a map of two measures', () => {
  /** A chart as a deck writes it, in the order the marks are read. */
  function plot(props: Record<string, unknown> = {}) {
    return mount(Map2D, {
      props: { xStart: 'Hard', xEnd: 'Easy', yStart: 'Weak', yEnd: 'Strong', ...props },
      global: { components: { Point } },
      slots: {
        default: [
          '<Point name="container" :x="30" :y="62">Container</Point>',
          '<Point name="wasm" :x="66" :y="80" tone="gunJyo">WebAssembly</Point>',
        ].join(''),
      },
    })
  }

  it('places each mark where it says, and tones the one set apart', () => {
    const marks = plot().findAll('.tf-map-point')

    expect(marks.map(mark => mark.text())).toEqual(['Container', 'WebAssembly'])
    expect(marks[0].attributes('style')).toContain('left: 30%')
    expect(marks[0].classes()).toContain('tf-map-point--gray')
    expect(marks[1].classes()).toContain('tf-map-point--gunJyo')
  })

  // The mark is named rather than matched on what it says, so renaming the label leaves
  // the walk through the chart alone.
  it('frames the mark a step names, and declares the walk as the slide\'s length', async () => {
    const chart = plot({ steps: [null, 'wasm'] })

    expect(chart.findAll('.is-active')).toHaveLength(0)
    expect(declaredLengths()).toEqual([{ max: 1, delta: 0 }])

    clicks.value = 1
    await chart.vm.$nextTick()

    expect(chart.findAll('.tf-map-point')[1].classes()).toContain('is-active')
  })

  it('takes a place from a deck driving the chart itself, declaring nothing', () => {
    const chart = plot({ active: 0 })

    expect(chart.findAll('.tf-map-point')[0].classes()).toContain('is-active')
    expect(declaredLengths()).toEqual([])
  })

  it('holds a mark back until the speaker calls it in', async () => {
    const chart = plot({ reveal: true })

    expect(chart.findAll('.tf-map-point')[0].attributes('data-tf-held')).toBe('true')

    clicks.value = 1
    await chart.vm.$nextTick()

    expect(chart.findAll('.tf-map-point')[0].attributes('data-tf-held')).toBeUndefined()
  })
})

describe('a bar chart', () => {
  const items = [
    { label: 'Container', value: 220, text: '220 μs' },
    { label: 'WebAssembly', value: 12, text: '12 μs' },
  ]

  it('gives each bar its share of the track', () => {
    const chart = mount(Bars, { props: { items } })

    const [longest, shortest] = chart.findAll('.tf-bar-fill')

    expect(longest.attributes('style')).toContain('width: 100%')
    expect(shortest.attributes('style')).toContain('width: 5.45')
  })

  it('walks the frame down the rows as the steps say', async () => {
    const chart = mount(Bars, { props: { items, steps: [null, 'WebAssembly'] } })

    expect(chart.findAll('.is-active')).toHaveLength(0)

    clicks.value = 1
    await chart.vm.$nextTick()

    expect(chart.findAll('.tf-bar-row')[1].classes()).toContain('is-active')
  })

  it('holds a row back until the speaker calls it in', async () => {
    const chart = mount(Bars, { props: { items, reveal: true } })

    expect(chart.findAll('.tf-bar-row')[0].attributes('data-tf-held')).toBe('true')

    clicks.value = 1
    await chart.vm.$nextTick()

    expect(chart.findAll('.tf-bar-row')[0].attributes('data-tf-held')).toBeUndefined()
  })
})
